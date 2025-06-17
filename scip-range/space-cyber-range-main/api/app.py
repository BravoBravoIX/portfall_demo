import os
import json
import glob
import time
from typing import Dict, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import redis
from redis_manager import RedisManager

# --- Configure Redis ---
redis_client = redis.Redis(host='redis', port=6379, decode_responses=True)
redis_manager = RedisManager(redis_client)

# --- MQTT Setup (won't break if MQTT fails) ---
mqtt_enabled = False
portfall_mqtt_enabled = False

# Internal MQTT for SCIP operations
try:
    import paho.mqtt.client as mqtt
    mqtt_client = mqtt.Client()
    mqtt_client.connect('mqtt', 1883, 60)
    mqtt_client.loop_start()
    mqtt_enabled = True
    print("Internal MQTT connected successfully")
except Exception as e:
    print(f"Internal MQTT initialization failed (non-critical): {e}")

# External MQTT for Portfall communication
portfall_mqtt_client = None
try:
    portfall_broker_ip = os.environ.get('PORTFALL_MQTT_BROKER', '3.106.143.114')
    portfall_mqtt_client = mqtt.Client(client_id="scip_range_controller")
    portfall_mqtt_client.connect(portfall_broker_ip, 1883, 60)
    portfall_mqtt_client.loop_start()
    portfall_mqtt_enabled = True
    print(f"Portfall MQTT connected to {portfall_broker_ip}")
except Exception as e:
    print(f"Portfall MQTT initialization failed (non-critical): {e}")
    portfall_mqtt_client = None

# --- Constants ---
CACHE_TTL = 3600  # Cache time to live in seconds (1 hour)
SCENARIOS_DIR = "/app/scenarios/templates"

# --- FastAPI App ---
app = FastAPI()

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper Functions ---
def publish_mqtt(topic: str, payload: dict):
    """Helper function for internal SCIP MQTT publishing that won't break if MQTT fails."""
    if mqtt_enabled:
        try:
            mqtt_client.publish(topic, json.dumps(payload))
            print(f"Published to internal MQTT - Topic: {topic}")
        except Exception as exc:
            print(f"Internal MQTT publish failed (non-critical): {exc}")

def publish_portfall_mqtt(topic: str, payload: dict):
    """Helper function for Portfall MQTT publishing."""
    if portfall_mqtt_enabled and portfall_mqtt_client:
        try:
            portfall_mqtt_client.publish(topic, json.dumps(payload))
            print(f"Published to Portfall MQTT - Topic: {topic}")
        except Exception as exc:
            print(f"Portfall MQTT publish failed (non-critical): {exc}")
    else:
        print(f"Portfall MQTT not available - would publish to {topic}: {payload}")

# --- Startup Event ---
@app.on_event("startup")
async def cleanup_on_startup():
    """Clean up any stale scenario data when the API starts"""
    try:
        print("Performing startup cleanup...")
        # Clear active scenario data
        pattern_keys = [
            "active_scenario:*",
            "scenarios:*:status",
            "scenarios:*:instances"
        ]
        
        for pattern in pattern_keys:
            for key in redis_client.scan_iter(pattern):
                print(f"Cleaning up Redis key: {key}")
                redis_client.delete(key)
        
        # Publish MQTT message to notify all components
        if mqtt_enabled:
            publish_mqtt("range/scenarios/active", {
                "status": "inactive",
                "timestamp": time.time(),
                "cleanup": True
            })
        
        print("Startup cleanup completed")
    except Exception as e:
        print(f"Error during startup cleanup: {e}")

# --- Endpoints ---
@app.get("/api/scenarios")
async def list_scenarios():
    """Returns a list of all scenario files with caching."""
    cache_key = "scenarios:list"

    try:
        # Try to get from cache first
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)

        # If not in cache, read from files
        scenario_files = glob.glob(os.path.join(SCENARIOS_DIR, "*.json"))
        scenarios = []

        for file_path in scenario_files:
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    scenario_def = data.get("scenario_definition", {})
                    scenarios.append({
                        "id": scenario_def.get("id"),
                        "name": scenario_def.get("name"),
                        "category": scenario_def.get("category"),
                        "description": scenario_def.get("metadata", {}).get("description"),
                    })
            except Exception as e:
                print(f"Failed to read {file_path}: {e}")
                continue

        # Store in cache
        response_data = {"scenarios": scenarios}
        redis_client.setex(cache_key, CACHE_TTL, json.dumps(response_data))
        return response_data

    except Exception as e:
        print(f"Cache operation failed: {e}")
        # Fallback to direct file reading if cache fails
        scenario_files = glob.glob(os.path.join(SCENARIOS_DIR, "*.json"))
        scenarios = []

        for file_path in scenario_files:
            try:
                with open(file_path, 'r') as f:
                    data = json.load(f)
                    scenario_def = data.get("scenario_definition", {})
                    scenarios.append({
                        "id": scenario_def.get("id"),
                        "name": scenario_def.get("name"),
                        "category": scenario_def.get("category"),
                        "description": scenario_def.get("metadata", {}).get("description"),
                    })
            except Exception as e2:
                print(f"Failed to read {file_path}: {e2}")
                continue

        return {"scenarios": scenarios}

@app.get("/api/scenarios/active")
async def get_active_scenario():
    """Get currently active scenario."""
    try:
        print("\nChecking active scenario in Redis...")
        
        # List all relevant Redis keys
        active_keys = list(redis_client.scan_iter("active_scenario:*"))
        print(f"Found Redis keys: {active_keys}")
        
        # Get active scenario from Redis manager
        active_scenario = await redis_manager.get_active_scenario()
        print(f"Redis manager returned: {active_scenario}")
        
        # If no active scenario, return inactive state
        if not active_scenario:
            return {"active": False}
            
        # Return the active scenario data
        return active_scenario
        
    except Exception as e:
        print(f"Error getting active scenario: {str(e)}")
        return {"active": False}

@app.post("/api/scenarios/cache/clear")
async def clear_cache():
    """Clear all scenario caches."""
    try:
        for key in redis_client.scan_iter("scenarios:*"):
            redis_client.delete(key)
        return {"status": "Cache cleared successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to clear cache: {str(e)}")

@app.post("/api/scenarios/force-cleanup")
async def force_cleanup():
    """Force cleanup of all scenario data"""
    try:
        await cleanup_on_startup()
        return {"status": "Cleanup completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cleanup failed: {str(e)}")

@app.get("/api/scenarios/{scenario_id}")
async def get_scenario(scenario_id: str):
    """Returns the full content of a single scenario with caching."""
    # Prevent conflict with /active endpoint
    if scenario_id == "active":
        raise HTTPException(status_code=400, detail="Invalid scenario ID")
        
    cache_key = f"scenarios:detail:{scenario_id}"

    try:
        # Try to get from cache first
        cached_data = redis_client.get(cache_key)
        if cached_data:
            return json.loads(cached_data)

        # If not in cache, read from file
        scenario_path = os.path.join(SCENARIOS_DIR, f"{scenario_id}.json")
        if not os.path.isfile(scenario_path):
            raise HTTPException(status_code=404, detail="Scenario file not found")

        with open(scenario_path, 'r') as f:
            data = json.load(f)
            redis_client.setex(cache_key, CACHE_TTL, json.dumps(data))
            return data

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error reading scenario {scenario_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scenarios/{scenario_id}/activate")
async def activate_scenario(scenario_id: str):
    """Activate a scenario."""
    try:
        # Reuse the existing endpoint logic to get scenario data
        scenario_data = await get_scenario(scenario_id)
        if not scenario_data:
            raise HTTPException(status_code=404, detail="Scenario not found")

        # Check if there's already an active scenario
        current_active = await redis_manager.get_active_scenario()
        if current_active:
            raise HTTPException(
                status_code=400,
                detail="Another scenario is already active. Please deactivate it first.",
            )

        # Activate the new scenario
        success = await redis_manager.set_active_scenario(scenario_id, scenario_data)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to activate scenario")

        # Publish to internal SCIP MQTT for tracking
        publish_mqtt("range/scenarios/active", {
            "scenario_id": scenario_id,
            "status": "active",
            "timestamp": time.time(),
            "name": scenario_data.get("scenario_definition", {}).get("name", "Unknown"),
        })

        return {"status": "Scenario activated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scenarios/{scenario_id}/control")
async def control_scenario(scenario_id: str, action: Dict[str, str]):
    """Control an active scenario (e.g. start/pause)."""
    try:
        # Check if this scenario is currently active
        active_scenario = await redis_manager.get_active_scenario()
        if not active_scenario or active_scenario["scenario_id"] != scenario_id:
            raise HTTPException(status_code=400, detail="Scenario is not active")

        if action["action"] not in ["start", "pause"]:
            raise HTTPException(status_code=400, detail="Invalid action")

        # Special handling for Portfall scenarios
        if scenario_id == "portfall-maritime-incident-001" and action["action"] == "start":
            # Send start command to Portfall simulation
            publish_portfall_mqtt("scenario/control", {"command": "start"})
            print(f"Sent start command to Portfall simulation")
            
            # Store start time for progress tracking
            start_time = time.time()
            await redis_manager.update_scenario_status(scenario_id, {
                "status": "Running",
                "start_time": start_time,
                "last_update": start_time
            })
            
            # Publish internal status update
            publish_mqtt(f"range/scenarios/{scenario_id}/status", {
                "status": "Running",
                "start_time": start_time,
                "timestamp": start_time
            })
            
            return {"status": "Portfall scenario started successfully", "start_time": start_time}

        # Standard scenario control for other scenarios
        status = "Running" if action["action"] == "start" else "Paused"
        status_update = {
            "status": status,
            "last_update": time.time()
        }

        success = await redis_manager.update_scenario_status(scenario_id, status_update)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update scenario status")

        # Publish status update to MQTT
        publish_mqtt(f"range/scenarios/{scenario_id}/status", {
            "status": status,
            "timestamp": time.time()
        })

        return {"status": f"Scenario {action['action']}ed successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/scenarios/active/deactivate")
async def deactivate_active_scenario():
    """Deactivate the currently active scenario."""
    try:
        active_scenario = await redis_manager.get_active_scenario()
        if not active_scenario:
            raise HTTPException(status_code=404, detail="No active scenario found")

        success = await redis_manager.deactivate_scenario(active_scenario["scenario_id"])
        if not success:
            raise HTTPException(status_code=500, detail="Failed to deactivate scenario")

        # Publish deactivation to MQTT
        publish_mqtt("range/scenarios/active", {
            "scenario_id": None,
            "status": "inactive",
            "timestamp": time.time()
        })

        return {"status": "Scenario deactivated successfully"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scenarios/{scenario_id}/progress")
async def get_scenario_progress(scenario_id: str):
    """Get time-based progress for Portfall scenarios."""
    try:
        # Check if this scenario is currently active
        active_scenario = await redis_manager.get_active_scenario()
        if not active_scenario or active_scenario["scenario_id"] != scenario_id:
            raise HTTPException(status_code=400, detail="Scenario is not active")

        # Get scenario status to find start time
        scenario_status = await redis_manager.get_scenario_status(scenario_id)
        if not scenario_status or "start_time" not in scenario_status:
            return {"status": "Not started", "progress": 0, "elapsed_time": 0}

        # Calculate elapsed time
        start_time = scenario_status["start_time"]
        elapsed_time = time.time() - start_time
        
        # Portfall scenario duration is 300 seconds (5 minutes)
        total_duration = 300
        progress_percentage = min(100, (elapsed_time / total_duration) * 100)
        
        # Determine current stage based on elapsed time
        current_stage = "Initial Response"
        stage_progress = 0
        
        if elapsed_time <= 60:
            current_stage = "Initial Response and Assessment"
            stage_progress = (elapsed_time / 60) * 100
        elif elapsed_time <= 120:
            current_stage = "System Failures and CCTV Interference"  
            stage_progress = ((elapsed_time - 60) / 60) * 100
        elif elapsed_time <= 240:
            current_stage = "Escalation and External Pressure"
            stage_progress = ((elapsed_time - 120) / 120) * 100
        elif elapsed_time <= 300:
            current_stage = "Crisis Resolution and Recovery Planning"
            stage_progress = ((elapsed_time - 240) / 60) * 100
        else:
            current_stage = "Scenario Complete"
            stage_progress = 100

        # Get completed events based on elapsed time
        completed_events = []
        total_events = 82  # Total events in portfall scenario
        
        # Events occur mostly in first 3 time units (3 seconds real time = 3 hours scenario time)
        if elapsed_time >= 1:
            completed_events.extend(["INJ_START", "INJ001A", "INJ001B", "INJ001C", "INJ001E", "INJ001F", "INJ002A", "INJ002B", "INJ002C", "INJ002D", "INJ003A", "INJ003B", "INJ003C", "INJ003D", "INJ003E", "INJ003F", "INJ003G"])
        if elapsed_time >= 2:
            completed_events.extend(["INJ004A", "INJ004B", "INJ004C", "INJ004D", "INJ004E", "INJ004F", "INJ005A", "INJ005B", "INJ005C", "INJ005D", "INJ005E", "INJ005F", "INJ005G", "INJ006A", "INJ006C", "INJ006D", "INJ006E", "INJ006F"])
        if elapsed_time >= 3:
            completed_events.extend(["INJ007B", "INJ007C", "INJ007D", "INJ008A", "INJ008B", "INJ008C", "INJ009A", "INJ009B", "INJ009C", "INJ009D", "INJ010A", "INJ010B", "INJ010C", "INJ010D", "INJ010E", "INJ010F", "INJ010G", "INJ011A", "INJ011B", "INJ011C", "INJ011D", "INJ011E", "INJ011F", "INJ012A", "INJ012B", "INJ012C", "INJ012D", "INJ012E", "INJ012F"])
        if elapsed_time >= 4:
            completed_events.extend(["INJ013", "INJ014", "INJ015", "INJ016A", "INJ016B", "INJ016C", "INJ017A", "INJ017B", "INJ017C", "INJ019A", "INJ019B", "INJ019C", "INJ020A", "INJ020B", "INJ021A", "INJ021B", "INJ021C", "INJ021D"])

        return {
            "scenario_id": scenario_id,
            "status": "Running" if elapsed_time < total_duration else "Complete",
            "progress": round(progress_percentage, 1),
            "elapsed_time": round(elapsed_time, 1),
            "total_duration": total_duration,
            "current_stage": current_stage,
            "stage_progress": round(stage_progress, 1),
            "completed_events": len(completed_events),
            "total_events": total_events,
            "events": completed_events[-5:] if completed_events else [],  # Last 5 events
            "timestamp": time.time()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------------------------------------------------------
#                        INSTANCE MANAGEMENT ENDPOINTS
# -----------------------------------------------------------------------------

@app.post("/api/scenarios/{scenario_id}/instances")
async def register_instance(scenario_id: str, team_id: str):
    """Register a new instance for a scenario"""
    try:
        # Verify active scenario
        active_scenario = await redis_manager.get_active_scenario()
        if not active_scenario or active_scenario["scenario_id"] != scenario_id:
            raise HTTPException(status_code=400, detail="Scenario is not active")

        # Basic instance data structure
        instance_data = {
            "team_id": team_id,
            "team_name": f"Team {team_id.capitalize()}",
            "status": "initializing",
            "progress": 0,
            "current_stage": "Ground Station Setup",
            "stage_progress": 0,
            "assets": {
                "ground_station": {"status": "initializing"},
                "satellite": {"status": "initializing"},
                "rf_simulator": {"status": "initializing"}
            }
        }

        # Register instance
        success = await redis_manager.register_instance(scenario_id, team_id, instance_data)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to register instance")

        # Publish to MQTT
        publish_mqtt(f"range/instance/{team_id}/status", {
            "status": "initializing",
            "team_id": team_id,
            "scenario_id": scenario_id,
            "timestamp": time.time()
        })

        # Return consistent format
        return {
            "status": "success",
            "instance_id": team_id,
            "data": instance_data
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/scenarios/{scenario_id}/instances")
async def list_instances(scenario_id: str):
    """List all instances for a scenario"""
    try:
        # Verify active scenario
        active_scenario = await redis_manager.get_active_scenario()
        if not active_scenario or active_scenario["scenario_id"] != scenario_id:
            return {
                "scenario_id": scenario_id,
                "instances": [],
                "count": 0
            }

        # Get all instances and ensure proper formatting
        try:
            instances = await redis_manager.get_all_instances(scenario_id)
            if not isinstance(instances, list):
                instances = []
        except Exception:
            instances = []

        # Transform instances to ensure consistent format
        formatted_instances = []
        for instance in instances:
            if isinstance(instance, dict):
                formatted_instances.append({
                    "instance_id": instance.get("instance_id", "unknown"),
                    "team_id": instance.get("team_id", "unknown"),
                    "team_name": instance.get("team_name", "Unknown Team"),
                    "status": instance.get("status", "unknown"),
                    "progress": instance.get("progress", 0),
                    "current_stage": instance.get("current_stage", ""),
                    "stage_progress": instance.get("stage_progress", 0),
                    "assets": instance.get("assets", {
                        "ground_station": {"status": "unknown"},
                        "satellite": {"status": "unknown"},
                        "rf_simulator": {"status": "unknown"}
                    })
                })

        return {
            "scenario_id": scenario_id,
            "instances": formatted_instances,
            "count": len(formatted_instances)
        }

    except HTTPException:
        raise
    except Exception as e:
        # Return empty list instead of error for general failures
        return {
            "scenario_id": scenario_id,
            "instances": [],
            "count": 0
        }

@app.get("/api/scenarios/{scenario_id}/instances/{team_id}")
async def get_instance(scenario_id: str, team_id: str):
    """Get specific instance details"""
    try:
        # Verify active scenario
        active_scenario = await redis_manager.get_active_scenario()
        if not active_scenario or active_scenario["scenario_id"] != scenario_id:
            raise HTTPException(status_code=400, detail="Scenario is not active")

        # Get instance status with fallback values
        instance = await redis_manager.get_instance_status(scenario_id, team_id)
        if not instance:
            raise HTTPException(status_code=404, detail="Instance not found")

        # Get instance progress
        try:
            progress = await redis_manager.get_progress(scenario_id, team_id)
        except Exception:
            progress = {}

        # Ensure consistent return format
        return {
            "instance_id": team_id,
            "status": instance,
            "progress": progress or {},  # Ensure we never return None
            "team_name": instance.get("team_name", f"Team {team_id.capitalize()}"),
            "current_stage": instance.get("current_stage", ""),
            "stage_progress": instance.get("stage_progress", 0),
            "assets": instance.get("assets", {
                "ground_station": {"status": "unknown"},
                "satellite": {"status": "unknown"},
                "rf_simulator": {"status": "unknown"}
            })
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))