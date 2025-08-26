# Portfall Demo - Startup Guide

## Quick Start Commands

### 1. Start All Services
```bash
# Navigate to project directory
cd /path/to/portfall-demo

# Start all services with Docker Compose
docker-compose up -d

# Wait 30-60 seconds for all services to initialize
# Check service status
docker-compose ps
```

### 2. Verify Services Running
**Expected services:**
- `portfall-demo-ui-portfall-1` (React UI)
- `portfall-demo-nginx-ui-proxy-1` (UI Proxy)
- `portfall-demo-mqtt-broker-1` (MQTT Broker)
- `portfall-demo-log-agent-1` (Log Generator)
- `portfall-demo-redis-1` (Redis Cache)
- `portfall-demo-backend-1` (WebSocket/Email)
- `portfall-demo-mailhog-1` (Email Testing)
- `portfall-demo-smtp-server-1` (SMTP Server)
- `portfall-demo-agent-1` (Scenario Engine)

### 3. Access Application
**Main Dashboard:** http://localhost:3000
- **Login:** Use any credentials (demo mode)
- **Default PIN:** Any 4-digit number

### 4. Launch Scenario
**Method 1: Via UI (Recommended)**
1. Go to http://localhost:3000
2. Login with any credentials  
3. Navigate to http://localhost:3000/injects
4. Click "Start Scenario" button

**Method 2: Via MQTT Command (Backup)**
```bash
# Start scenario via MQTT (primary method)
mosquitto_pub -h localhost -t "scenario/control" -m '{"command":"start"}'

# Stop scenario
mosquitto_pub -h localhost -t "scenario/control" -m '{"command":"stop"}'

# Reset scenario
mosquitto_pub -h localhost -t "scenario/control" -m '{"command":"reset"}'
```

**Method 3: Via API (Alternative)**
```bash
# Start scenario via API
curl -X POST http://localhost:8000/scenario \
  -H "Content-Type: application/json" \
  -d '{"scenario_active": true}'
```

---

## Demo Navigation Guide

### Essential URLs (Bookmark These)
- **Main Dashboard:** http://localhost:3000
- **AIS Tracking:** http://localhost:3000/ais
- **CCTV Surveillance:** http://localhost:3000/cctv
- **Container Operations:** http://localhost:3000/containers
- **Email Communications:** http://localhost:3000/email
- **Executive View:** http://localhost:3000/executive
- **Technical Team:** http://localhost:3000/technical
- **Legal Team:** http://localhost:3000/legal
- **Media Dashboard:** http://localhost:3000/media
- **Operations Team:** http://localhost:3000/operations
- **Incident Coordinator:** http://localhost:3000/incident-coordinator

### Supporting Services (Reference Only)
- **Email Testing:** http://localhost:8025 (MailHog)
- **API Endpoints:** http://localhost:8000
- **NGINX Proxy:** http://localhost:8080

---

## Demo Execution Steps

### Pre-Demo Setup (5 minutes before)
1. **Start Services:**
   ```bash
   docker-compose up -d
   sleep 60  # Wait for initialization
   ```

2. **Verify All Working:**
   ```bash
   # Check all containers running
   docker-compose ps
   
   # Test main dashboard
   curl -s http://localhost:3000 | head -n 5
   
   # Test API
   curl -s http://localhost:8000/scenario
   ```

3. **Reset Scenario State (if needed):**
   ```bash
   # Reset to clean state
   curl -X POST http://localhost:8000/scenario \
     -H "Content-Type: application/json" \
     -d '{"scenario_active": false}'
   
   # Or restart the agent container
   docker-compose restart agent
   ```

### During Demo
1. **Launch Scenario:**
   - Go to http://localhost:3000/injects
   - Login with any credentials
   - Click "Start Scenario" button (or use MQTT command as backup)

2. **Navigate Between Views:**
   - Use browser bookmarks for quick switching
   - Each team view shows different aspects of same crisis
   - Events will appear in real-time as scenario progresses

3. **Key Demo Points:**
   - **T+2-5:** Initial emails and AIS issues
   - **T+20-30:** CCTV failures and vendor leaks
   - **T+50-60:** Container misrouting and media attention
   - **T+80-90:** Crisis escalation with regulatory involvement

---

## Troubleshooting

### Common Issues

**Services won't start:**
```bash
# Check Docker is running
docker --version

# Clean restart
docker-compose down
docker-compose up -d --build
```

**UI not loading:**
```bash
# Check UI container
docker-compose logs ui-portfall

# Restart UI only
docker-compose restart ui-portfall
```

**Scenario not starting:**
```bash
# Check agent logs
docker-compose logs agent

# Restart agent
docker-compose restart agent

# Manual scenario trigger
curl -X POST http://localhost:8000/scenario -d '{"scenario_active": true}'
```

**MQTT issues:**
```bash
# Check MQTT broker
docker-compose logs mqtt-broker

# Test MQTT connectivity
mosquitto_sub -h localhost -t "#" -v
```

### Emergency Demo Backup
If live demo fails, use these backup options:
1. **Screenshots:** Pre-captured images of key dashboards
2. **Video Recording:** Pre-recorded scenario walkthrough
3. **Simplified Demo:** PowerPoint with embedded screenshots

---

## Post-Demo Cleanup

### Stop Services
```bash
# Stop all services
docker-compose down

# Remove volumes (full cleanup)
docker-compose down -v

# Clean Docker system (optional)
docker system prune
```

### Reset for Next Demo
```bash
# Quick reset (keep containers)
docker-compose restart

# Full reset (rebuild containers)
docker-compose down
docker-compose up -d --build
```

---

## Demo Timing Reference

**Total Scenario Duration:** ~110 minutes (compressed to ~15 minutes for demo)

**Key Event Timings:**
- **T+2-5:** Initial anomalies (emails, AIS issues)
- **T+20-30:** System degradation (CCTV, vendor leaks) 
- **T+40-50:** Operational impact (containers, media)
- **T+80-90:** Crisis escalation (regulatory, forensics)

**Demo Pacing:**
- Let scenario run continuously once started
- Switch between views every 60-90 seconds
- Highlight real-time event progression
- Point out different team perspectives on same events