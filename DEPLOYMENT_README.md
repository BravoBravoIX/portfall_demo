# Southgate Cybersecurity Simulation Platform - Deployment Guide

## Quick Deployment on AWS t3.medium

### Prerequisites
- Fresh Ubuntu Server (22.04 LTS recommended)
- Docker and Docker Compose installed
- Git installed
- 8GB+ RAM, 20GB+ storage

### 1. System Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo apt install docker-compose-plugin -y

# Install Git
sudo apt install git -y
```

### 2. Clone Repository

```bash
git clone https://github.com/BravoBravoIX/portfall_scenario.git
cd portfall_scenario
```

### 3. Deploy (One Command!)

```bash
# Start all services - everything is pre-configured!
docker-compose up -d --build

# Check status
docker-compose ps

# View logs if needed
docker-compose logs -f
```

**That's it! No configuration needed - all credentials and settings are included.**

### 4. Access URLs

- **Main Dashboard**: http://localhost:3000 (or your-server-ip:3000)
- **Public Media Display**: http://localhost:3000/public-media
- **NGINX Proxy**: http://localhost:8080
- **MailHog (Email Testing)**: http://localhost:8025
- **API Logs**: http://localhost:8000/logs

### 6. Login Credentials

Default team PINs:
- **Admin**: admin2024
- **Executive**: exec2024
- **Legal**: legal2024
- **Operations**: ops2024
- **Technical**: tech2024
- **Media Communications**: media2024
- **Incident Coordinator**: coord2024

### 7. AWS Security Group Configuration

Open these ports in your AWS Security Group:
- **3000** - Main application
- **8000** - API endpoints
- **8025** - MailHog UI
- **8080** - NGINX proxy
- **22** - SSH access

### 8. Troubleshooting

```bash
# Check container status
docker-compose ps

# View logs for specific service
docker-compose logs ui-portfall
docker-compose logs log-agent

# Restart services
docker-compose restart

# Rebuild if needed
docker-compose down
docker-compose up -d --build
```

### 9. Architecture

The platform includes:
- **React UI** (port 3000) - Team dashboards and public display
- **Python Log Agent** (port 8000) - Scenario management and API
- **MQTT Broker** (ports 1883, 9001) - Real-time messaging
- **Redis** (port 6379) - Data storage
- **MailHog** (port 8025) - Email testing
- **NGINX** (port 8080) - Reverse proxy

### 10. Scenario Management

- Start scenario from admin dashboard (Injects page)
- Public media display shows real-time updates
- Each team has role-specific access to systems
- Facilitator guides available in `documents/` folder

## Support

For issues or questions, check the main README.md or repository documentation.