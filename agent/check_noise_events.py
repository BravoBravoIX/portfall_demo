#!/usr/bin/env python3
"""Check noise email events for missing manual field."""

import json
import os

def check_noise_events():
    file_path = '/Users/brettburford/Development/CyberOps/portfall-sim/agent/scenario_schedule.json'
    
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return
    
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    noise_events_missing_manual = []
    all_noise_events = []
    
    # Get line numbers by reading file as text
    with open(file_path, 'r') as f:
        lines = f.readlines()
    
    current_line = 0
    for i, line in enumerate(lines, 1):
        if '"event_id"' in line and ('N-INJ' in line or 'IC-INJ' in line):
            # Extract event_id from line
            try:
                event_id = line.split('"event_id"')[1].split('"')[1]
            except:
                continue
            
            # Check next ~20 lines for manual field
            has_manual = False
            for j in range(i, min(i + 20, len(lines))):
                if '"manual"' in lines[j]:
                    has_manual = True
                    break
                if '"event_id"' in lines[j] and j != i - 1:
                    # Found next event, stop searching
                    break
            
            all_noise_events.append((event_id, i, has_manual))
            if not has_manual:
                noise_events_missing_manual.append((event_id, i))
    
    print(f"Total noise events (N-INJ/IC-INJ): {len(all_noise_events)}")
    print(f"Events missing 'manual' field: {len(noise_events_missing_manual)}")
    print("\nEvents missing 'manual' field:")
    for event_id, line_num in noise_events_missing_manual:
        print(f"  Line {line_num}: {event_id}")
    
    if len(all_noise_events) > 0:
        print("\nAll noise events summary:")
        for event_id, line_num, has_manual in sorted(all_noise_events, key=lambda x: x[1]):
            status = "✓ has manual" if has_manual else "✗ MISSING manual"
            print(f"  Line {line_num}: {event_id} - {status}")

if __name__ == "__main__":
    check_noise_events()