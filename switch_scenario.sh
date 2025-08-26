#!/bin/bash

# Script to switch between full scenario and demo scenario

if [ "$1" = "demo" ]; then
    echo "Switching to DEMO scenario (15 minutes, 28 events)..."
    cp agent/scenario_schedule_demo.json agent/scenario_schedule.json
    echo "✅ Demo scenario active"
    echo "Key timing:"
    echo "  T+0-3:  Crisis initiation (emails start, AIS issues)"
    echo "  T+3-7:  System failures (CCTV, vendor breach, auth errors)" 
    echo "  T+7-11: Operational impact (containers, social media, forensics)"
    echo "  T+11-15: Decision time (CEO, regulators, insurance, containment)"
elif [ "$1" = "full" ]; then
    echo "Switching to FULL scenario (110 minutes, 100+ events)..."
    cp agent/scenario_schedule_full.json agent/scenario_schedule.json 2>/dev/null || {
        echo "❌ Full scenario backup not found. Current scenario_schedule.json is already full version."
        exit 1
    }
    echo "✅ Full scenario active"
elif [ "$1" = "backup" ]; then
    echo "Creating backup of current scenario..."
    cp agent/scenario_schedule.json agent/scenario_schedule_full.json
    echo "✅ Current scenario backed up as scenario_schedule_full.json"
else
    echo "Usage: $0 [demo|full|backup]"
    echo ""
    echo "Commands:"
    echo "  demo   - Switch to 15-minute demo scenario"
    echo "  full   - Switch to full 110-minute scenario"  
    echo "  backup - Backup current scenario as 'full' version"
    echo ""
    echo "Current scenario events:"
    grep -c "event_id" agent/scenario_schedule.json | head -1
fi