#!/usr/bin/env python3
import json
import os
import time
import random
import logging
import threading
from datetime import datetime
import paho.mqtt.client as mqtt
from flask import Flask, jsonify, request

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('log-agent')

# MQTT Configuration
MQTT_BROKER = os.environ.get('MQTT_BROKER', 'localhost')
MQTT_PORT = 1883
MQTT_TOPIC = 'portfall/logs'

# Path to scenario state file
SCENARIO_STATE_PATH = '/app/injects/scenario_state.json'

# Store recent logs in memory for API access
recent_logs = []
MAX_LOGS = 100

# Create Flask app
app = Flask(__name__)

def load_scenario_state():
    """Load the current scenario state from the JSON file."""
    try:
        if os.path.exists(SCENARIO_STATE_PATH) and os.path.getsize(SCENARIO_STATE_PATH) > 0:
            with open(SCENARIO_STATE_PATH, 'r') as f:
                return json.load(f)
        else:
            # Initialize with default state if file is empty
            default_state = {
                "scenario_active": True,
                "log_frequency": 5,
                "event_types": ["access", "auth", "system", "error"],
                "scenario_name": "Network Security Monitoring Exercise"
            }
            with open(SCENARIO_STATE_PATH, 'w') as f:
                json.dump(default_state, f, indent=2)
            return default_state
    except Exception as e:
        logger.error(f"Error loading scenario state: {e}")
        return {
            "scenario_active": True,
            "log_frequency": 5,
            "event_types": ["access", "auth", "system", "error"],
            "scenario_name": "Network Security Monitoring Exercise"
        }

def on_connect(client, userdata, flags, rc):
    """Callback when connected to MQTT broker."""
    if rc == 0:
        logger.info(f"Connected to MQTT broker at {MQTT_BROKER}")
        client.subscribe('portfall/control')
    else:
        logger.error(f"Failed to connect to MQTT broker, return code: {rc}")

def on_message(client, userdata, msg):
    """Callback when message is received."""
    try:
        payload = json.loads(msg.payload.decode())
        logger.info(f"Received control message: {payload}")
        
        # Update scenario state
        state = load_scenario_state()
        state.update(payload)
        
        with open(SCENARIO_STATE_PATH, 'w') as f:
            json.dump(state, f, indent=2)
            
        logger.info(f"Updated scenario state: {state}")
    except Exception as e:
        logger.error(f"Error processing message: {e}")

def generate_log_entry(event_type):
    """Generate a mock log entry based on event type."""
    timestamp = datetime.now().isoformat()
    
    log_entries = {
        "access": {
            "message": f"User accessed resource {random.choice(['file', 'database', 'api'])}",
            "user": f"user{random.randint(1, 100)}",
            "ip": f"192.168.1.{random.randint(1, 255)}",
            "resource": f"/resource/{random.randint(1, 50)}"
        },
        "auth": {
            "message": f"{random.choice(['Successful', 'Failed'])} login attempt",
            "user": f"user{random.randint(1, 100)}",
            "ip": f"192.168.1.{random.randint(1, 255)}"
        },
        "system": {
            "message": f"System {random.choice(['starting', 'stopping', 'restarting', 'updating'])}",
            "component": f"service-{random.randint(1, 10)}",
            "status": random.choice(["success", "pending", "in-progress"])
        },
        "error": {
            "message": f"Error: {random.choice(['Connection refused', 'Timeout', 'Permission denied', 'Resource not found'])}",
            "component": f"service-{random.randint(1, 10)}",
            "error_code": random.randint(400, 599)
        }
    }
    
    entry = log_entries.get(event_type, log_entries["system"])
    entry["timestamp"] = timestamp
    entry["type"] = event_type
    entry["id"] = f"{int(time.time())}-{random.randint(1000, 9999)}"
    
    return entry

def mqtt_client_thread():
    """Run the MQTT client in a separate thread."""
    # Set up MQTT client
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    
    # Connect to MQTT broker
    max_retries = 10
    connected = False
    
    for i in range(max_retries):
        try:
            logger.info(f"Connecting to MQTT broker at {MQTT_BROKER}:{MQTT_PORT} (attempt {i+1}/{max_retries})")
            client.connect(MQTT_BROKER, MQTT_PORT, 60)
            connected = True
            break
        except Exception as e:
            logger.warning(f"Could not connect to MQTT broker: {e}")
            time.sleep(5)
    
    if not connected:
        logger.error("Failed to connect to MQTT broker after multiple attempts")
        return
    
    # Start MQTT client in a background thread
    client.loop_start()
    
    try:
        while True:
            # Load current scenario state
            state = load_scenario_state()
            
            if state.get("scenario_active", True):
                # Generate and publish logs based on configuration
                event_types = state.get("event_types", ["access", "auth", "system", "error"])
                log_entry = generate_log_entry(random.choice(event_types))
                
                # Add to recent logs
                global recent_logs
                recent_logs.append(log_entry)
                # Keep only the last MAX_LOGS entries
                if len(recent_logs) > MAX_LOGS:
                    recent_logs = recent_logs[-MAX_LOGS:]
                
                logger.info(f"Publishing log: {log_entry}")
                client.publish(MQTT_TOPIC, json.dumps(log_entry))
            
            # Wait based on configured frequency
            time.sleep(state.get("log_frequency", 5))
    except Exception as e:
        logger.error(f"Error in MQTT thread: {e}")
    finally:
        client.loop_stop()
        client.disconnect()

# API Routes
@app.route('/healthz', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

@app.route('/logs', methods=['GET'])
def get_logs():
    """Get recent logs API endpoint."""
    # Optional query parameters
    log_type = request.args.get('type')
    limit = request.args.get('limit', default=50, type=int)
    
    filtered_logs = recent_logs
    
    # Filter by type if specified
    if log_type:
        filtered_logs = [log for log in filtered_logs if log.get('type') == log_type]
    
    # Return the most recent logs up to the limit
    return jsonify(filtered_logs[-limit:])

@app.route('/scenario', methods=['GET'])
def get_scenario():
    """Get current scenario state."""
    return jsonify(load_scenario_state())

@app.route('/scenario', methods=['POST'])
def update_scenario():
    """Update scenario state."""
    try:
        new_state = request.json
        if not new_state:
            return jsonify({"error": "Invalid request body"}), 400
        
        # Load current state and update
        state = load_scenario_state()
        state.update(new_state)
        
        # Save updated state
        with open(SCENARIO_STATE_PATH, 'w') as f:
            json.dump(state, f, indent=2)
        
        # Publish update via MQTT
        mqtt_client = mqtt.Client()
        try:
            mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 5)
            mqtt_client.publish('portfall/control', json.dumps(new_state))
            mqtt_client.disconnect()
        except Exception as e:
            logger.warning(f"Failed to publish MQTT update: {e}")
            
        return jsonify(state)
    except Exception as e:
        logger.error(f"Error updating scenario: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Start the MQTT client thread
    mqtt_thread = threading.Thread(target=mqtt_client_thread, daemon=True)
    mqtt_thread.start()
    
    # Start the Flask app
    logger.info("Starting Flask API server on port 8000")
    app.run(host='0.0.0.0', port=8000)