#!/usr/bin/env python3
import json

# Just try to load the JSON and count basic stats
filename = "/Users/brettburford/Development/CyberOps/portfall-sim/agent/scenario_schedule.json"
output_file = "/Users/brettburford/Development/CyberOps/portfall-sim/documents/Participant Documents/validation_results.txt"

results = []

try:
    with open(filename, 'r') as f:
        data = json.load(f)
    
    results.append("JSON is syntactically valid!")
    results.append(f"Total events: {len(data)}")
    
    # Count noise emails
    noise_count = 0
    noise_without_manual_false = []
    
    for event in data:
        event_id = event.get('event_id', '')
        if event_id.startswith(('N-INJ', 'IC-INJ')):
            noise_count += 1
            if event.get('manual', True) != False:
                noise_without_manual_false.append(event_id)
    
    results.append(f"Noise emails found: {noise_count}")
    results.append(f"Noise emails without manual=false: {len(noise_without_manual_false)}")
    
    # Check last event
    if data:
        last_event_id = data[-1].get('event_id', 'unknown')
        results.append(f"Last event ID: {last_event_id}")
    
    # Write results
    with open(output_file, 'w') as f:
        f.write('\n'.join(results))
    
    print(f"Results written to: {output_file}")
    
except Exception as e:
    with open(output_file, 'w') as f:
        f.write(f"Error: {str(e)}")
    print(f"Error written to: {output_file}")