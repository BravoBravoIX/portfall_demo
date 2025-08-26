# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Run Commands
- Start all services: `docker-compose up -d`
- Rebuild services: `docker-compose up -d --build`
- View logs: `docker-compose logs -f [service-name]`
- Stop services: `docker-compose down`

## Important URLs
- Main UI (Dashboard): http://localhost:3010
- NGINX UI Proxy: http://localhost:8080
- MailHog UI: http://localhost:8025 
- API endpoints:
  - Logs: http://localhost:8000/logs
  - Scenario: http://localhost:8000/scenario
- MQTT Broker:
  - TCP: localhost:1883
  - WebSocket: ws://localhost:9001

## Code Style Guidelines
- **Frontend**: 
  - Simple HTML/CSS using Bootstrap for the UI
  - API and WebSocket communication for dynamic content
  
- **Python**:
  - Follow PEP 8 style guide (4 spaces indentation)
  - Group imports (stdlib, 3rd party, local) with a blank line between groups
  - Use snake_case for variables and functions
  - Add docstrings to functions and classes
  - Use type hints when possible
  - Use meaningful variable names
  - Always catch exceptions and handle errors appropriately

## Project Structure
- **UI**: Simple HTML interface served by nginx
- **Log Agent**: Python application with MQTT client and Flask API
  - Generates synthetic logs
  - Provides REST API for log access
  - Manages scenario state
- **MQTT**: Eclipse Mosquitto broker for real-time messaging
- **NGINX**: Reverse proxy for the UI 
- **MailHog**: SMTP testing service

## Architecture Note for M-series Mac
- Using jcalonso/mailhog image for M-series Mac compatibility