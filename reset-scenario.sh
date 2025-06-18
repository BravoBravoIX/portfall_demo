#!/bin/bash

# Portfall Scenario Reset Script
# This script ensures a clean startup for workshop environments

echo "🔄 Resetting Portfall scenario for clean startup..."

# Stop all services
echo "📦 Stopping Docker services..."
docker compose down

# Clean up agent state
echo "🧹 Cleaning agent state..."
cp agent/scenario_state_template.json agent/scenario_state.json

# Ensure proper file permissions
chmod 666 agent/scenario_state.json

# Start services with build
echo "🚀 Starting services..."
docker compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check service health
echo "🔍 Checking service status..."
docker compose ps

echo "✅ Scenario reset complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to http://localhost:3000/injects"
echo "2. Click 'Start Scenario' button"
echo "3. Watch injects flow in real-time"
echo ""
echo "🌐 Access points:"
echo "- Main UI: http://localhost:3000"
echo "- NGINX Proxy: http://localhost:8080" 
echo "- MailHog: http://localhost:8025"