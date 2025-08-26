#!/usr/bin/env python3
import json
import re

# Read the JSON file
with open('agent/scenario_schedule.json', 'r') as f:
    data = json.load(f)

# Process each event
for event in data:
    # Check if this is a noise email or IC email
    if 'event_id' in event and (event['event_id'].startswith('N-INJ') or event['event_id'].startswith('IC-INJ')):
        # Add manual: false if it's missing
        if 'manual' not in event:
            event['manual'] = False
            print(f"Added 'manual': false to {event['event_id']}")

# Write the fixed JSON back
with open('agent/scenario_schedule.json', 'w') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("\nFixed all noise emails!")
print("Running validation...")

# Validate the JSON
try:
    with open('agent/scenario_schedule.json', 'r') as f:
        json.load(f)
    print("✅ JSON is valid!")
except json.JSONDecodeError as e:
    print(f"❌ JSON validation failed: {e}")