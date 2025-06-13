# Portfall Simulation System Documentation

## System Overview
Portfall is a maritime cyber operations simulation environment designed to simulate vessel systems and cyber events. The system consists of multiple containerized services that work together to provide a realistic training environment.

## Architecture
The system uses a microservices architecture with the following components:

1. **UI Frontend (React)**: A web interface built with React and Tailwind CSS
2. **NGINX Proxy**: Handles routing and acts as a reverse proxy
3. **MQTT Broker**: Provides real-time messaging between components
4. **Log Agent**: Generates synthetic log data and exposes an API
5. **MailHog**: Provides email testing capabilities

## Services

### UI Frontend (ui-portfall)
- **Technology**: React, Tailwind CSS
- **Port**: 3000
- **Description**: Main user interface with multiple modules including system info, AIS tracking, CCTV, communications, email, container management, RF monitoring, and vendor access.
- **Routes**:
  - `/system-info` - Dashboard with system status
  - `/ais` - Vessel tracking
  - `/cctv` - Security camera feeds
  - `/comms` - Communications
  - `/email` - Email system with MailHog integration
  - `/containers` - Container tracking
  - `/rf` - Radio frequency monitoring
  - `/vendor` - Vendor access portal

### NGINX Proxy (nginx-ui-proxy)
- **Technology**: NGINX
- **Port**: 8080
- **Description**: Serves as a reverse proxy for the UI and API services
- **Configuration**:
  - Routes `/api/` requests to the Log Agent service
  - Routes `/mqtt/` requests to the MQTT broker's WebSocket interface
  - Handles SPA routing for React application

### MQTT Broker (mqtt-broker)
- **Technology**: Eclipse Mosquitto
- **Ports**: 
  - 1883 (MQTT TCP)
  - 9001 (MQTT WebSockets)
- **Description**: Messaging broker that facilitates publish/subscribe pattern communication
- **Topics**:
  - `portfall/logs` - Stream of generated log events
  - `portfall/control` - Control messages to adjust simulation parameters

### Log Agent (log-agent)
- **Technology**: Python, Flask
- **Port**: 8000
- **Description**: Generates synthetic log data and provides REST API endpoints
- **API Endpoints**:
  - `GET /logs` - Returns recent logs
  - `GET /scenario` - Returns current scenario state
  - `POST /scenario` - Updates scenario state
  - `GET /healthz` - Health check endpoint
- **Features**:
  - Generates different log types (access, auth, system, error)
  - Configurable log frequency
  - Real-time log publishing via MQTT

### MailHog (mailhog)
- **Technology**: MailHog
- **Port**: 8025
- **Description**: Email testing tool that captures outgoing emails
- **Features**:
  - Web UI for viewing captured emails
  - REST API for email management
  - SMTP server to capture emails (port 1025 internally)

## Docker Configuration

### Docker Compose Services
```yaml
services:
  ui-portfall:
    build: ./ui-portfall
    ports:
      - "3000:80"

  nginx-ui-proxy:
    image: nginx:latest
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    ports:
      - "8080:80"

  mqtt-broker:
    image: eclipse-mosquitto:2
    volumes:
      - ./mqtt/mosquitto.conf:/mosquitto/config/mosquitto.conf
    ports:
      - "1883:1883"
      - "9001:9001"

  mailhog:
    image: jcalonso/mailhog:latest
    ports:
      - "8025:8025"

  log-agent:
    build: ./log-agent
    volumes:
      - ./injects:/app/injects
    ports:
      - "8000:8000"
    environment:
      - MQTT_BROKER=mqtt-broker
```

## Running the System
- **Build and Start**: `docker-compose up -d --build`
- **Stop**: `docker-compose down`
- **View Logs**: `docker-compose logs -f [service-name]`
- **Restart**: `docker-compose restart`

## Accessing Services
- React UI: http://localhost:3000
- NGINX Proxy: http://localhost:8080
- Log API: http://localhost:8000/logs
- Scenario API: http://localhost:8000/scenario
- MailHog: http://localhost:8025
- MQTT WebSockets: ws://localhost:9001
- MQTT TCP: localhost:1883

## Development Notes

### Frontend (React)
The UI is built with React and Tailwind CSS. The main components are:
- `MainLayout.js` - Common layout with navigation
- Page components for each module (SystemInfoPage, AISPage, etc.)
- React Router for navigation

### Python Log Agent
The log agent is built with Python and includes:
- Flask for API endpoints
- Paho MQTT client for messaging
- Thread-based architecture for simultaneously handling API requests and log generation

### MQTT Configuration
```
# MQTT Broker Configuration
listener 1883
protocol mqtt

listener 9001
protocol websockets

# Allow anonymous connections (no authentication)
allow_anonymous true

# Enable logging
log_dest stdout
log_type all
```

### NGINX Configuration
```
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to the backend
    location /api/ {
        proxy_pass http://log-agent:8000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy WebSocket connections for MQTT
    location /mqtt/ {
        proxy_pass http://mqtt-broker:9001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Architecture Notes
- The system uses Docker for containerization and isolation
- Inter-service communication happens via HTTP REST APIs and MQTT messaging
- The React UI uses client-side routing for a single-page application experience
- Synthetic data generation happens in the log-agent service
- Configuration for the simulation is stored in the `injects/scenario_state.json` file

## M1/M2/M3/M4 Mac Compatibility
- Using jcalonso/mailhog image for M-series Mac compatibility instead of the official image

## Future Enhancements
- Add authentication and user management
- Implement more realistic maritime simulation data
- Add AI-driven scenario generation
- Create more advanced CCTV simulation with video feeds
- Implement network topology mapping and visualization