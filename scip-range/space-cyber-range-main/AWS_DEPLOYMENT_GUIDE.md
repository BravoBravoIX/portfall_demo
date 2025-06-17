# AWS Deployment Guide for SCIP-Range with Portfall Integration

## Overview
This guide explains how to deploy SCIP-range on AWS to control the Portfall simulation running on a separate AWS instance.

## Infrastructure Setup

### IP Addresses
- **SCIP-Range**: 54.253.139.223
- **Portfall-Sim**: 3.106.143.114

### Network Requirements
Ensure the following ports are open between instances:

#### Portfall-Sim (3.106.143.114)
- **Port 1883**: MQTT broker (inbound from SCIP-range)
- **Port 8000**: Portfall API (optional, for monitoring)

#### SCIP-Range (54.253.139.223)
- **Port 80**: NGINX web interface
- **Port 4000**: API server
- **Port 1883**: Internal MQTT broker
- **Port 9001**: MQTT WebSocket (for frontend)

## Pre-Deployment Steps

### 1. Set Environment Variables
Copy the AWS environment file:
```bash
cp .env.aws .env
```

### 2. Verify Portfall-Sim Configuration
Ensure Portfall-sim is running and accessible:
```bash
# Test MQTT connectivity from SCIP-range instance
telnet 3.106.143.114 1883
```

### 3. Update Docker Compose
The docker-compose.yml is already configured with:
- `PORTFALL_MQTT_BROKER` environment variable
- Proper internal networking
- Volume mounts for scenarios

## Deployment Commands

### 1. Build and Start Services
```bash
# Set environment variables
export PORTFALL_MQTT_BROKER=3.106.143.114
export HOST_IP=54.253.139.223

# Start all services
docker-compose up -d --build
```

### 2. Verify Services
```bash
# Check all containers are running
docker-compose ps

# Check API logs for MQTT connections
docker-compose logs -f api
```

Look for these log messages:
```
Internal MQTT connected successfully
Portfall MQTT connected to 3.106.143.114
```

### 3. Access SCIP-Range
Navigate to: http://54.253.139.223

## Testing the Integration

### 1. Verify Scenario Availability
1. Go to **Scenario Management** → **Scenario Catalog**
2. Look for "Portfall Maritime Cyber Incident Response"
3. Click to view scenario details

### 2. Test Scenario Activation
1. Click **"Activate Scenario"** button
2. Verify activation success message
3. Go to **Scenario Operations** page

### 3. Test Portfall Control
1. In Scenario Operations, click **"Start"** button
2. Check API logs for: `"Sent start command to Portfall simulation"`
3. Verify Portfall-sim receives the start command

### 4. Monitor Progress
1. Watch the **Scenario Overview** panel for progress updates
2. Verify team progress shows increasing percentages
3. Check current stage updates every few seconds

## Troubleshooting

### MQTT Connection Issues
```bash
# Check if Portfall MQTT is accessible
telnet 3.106.143.114 1883

# Check API container logs
docker-compose logs api | grep -i mqtt

# Test MQTT publish manually
docker exec -it scip-range-api-1 mosquitto_pub -h 3.106.143.114 -t "scenario/control" -m '{"command":"start"}'
```

### Service Issues
```bash
# Restart specific service
docker-compose restart api

# Rebuild if needed
docker-compose up -d --build api

# Check service health
curl http://localhost:4000/api/scenarios
```

### Frontend Issues
```bash
# Check frontend build
docker-compose logs frontend

# Restart frontend
docker-compose restart frontend nginx
```

## Environment Variables Reference

| Variable | Purpose | AWS Value | Local Value |
|----------|---------|-----------|-------------|
| `PORTFALL_MQTT_BROKER` | Portfall MQTT broker IP | `3.106.143.114` | `localhost` |
| `HOST_IP` | SCIP-range public IP | `54.253.139.223` | `localhost` |

## Architecture Diagram

```
┌─────────────────┐    MQTT Port 1883    ┌─────────────────┐
│   SCIP-Range    │ ────────────────────► │  Portfall-Sim   │
│ 54.253.139.223  │                       │ 3.106.143.114   │
│                 │                       │                 │
│ ┌─────────────┐ │                       │ ┌─────────────┐ │
│ │ Web UI :80  │ │                       │ │ Agent.py    │ │
│ └─────────────┘ │                       │ └─────────────┘ │
│ ┌─────────────┐ │  scenario/control     │ ┌─────────────┐ │
│ │ API :4000   │ │ ──{"command":"start"}─► │ MQTT Broker │ │
│ └─────────────┘ │                       │ └─────────────┘ │
│ ┌─────────────┐ │                       │                 │
│ │ MQTT :1883  │ │                       │                 │
│ └─────────────┘ │                       │                 │
└─────────────────┘                       └─────────────────┘
```

## Success Indicators

✅ **SCIP-Range UI accessible** at http://54.253.139.223  
✅ **Portfall scenario visible** in catalog  
✅ **MQTT logs show connection** to 3.106.143.114  
✅ **Scenario activation works** without errors  
✅ **Progress tracking updates** in real-time  
✅ **Portfall-sim receives** start commands  

## Post-Deployment Checklist

- [ ] All Docker containers running
- [ ] MQTT connections established
- [ ] Scenario catalog loads Portfall scenario
- [ ] Scenario activation successful
- [ ] Progress tracking functional
- [ ] Portfall-sim integration confirmed
- [ ] Team progress dashboard updating
- [ ] No error messages in logs