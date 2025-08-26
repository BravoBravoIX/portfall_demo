#!/usr/bin/env python3
"""Comprehensive analysis of noise email events for missing manual field."""

import json
import re

def analyze_noise_events():
    file_path = '/Users/brettburford/Development/CyberOps/portfall-sim/agent/scenario_schedule.json'
    
    # Read the JSON file
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Also read as text for line numbers
    with open(file_path, 'r') as f:
        text_content = f.read()
        lines = text_content.split('\n')
    
    noise_events = []
    
    # Parse through the JSON structure
    if isinstance(data, list):
        events = data
    else:
        events = data.get('events', [])
    
    for event in events:
        event_id = event.get('event_id', '')
        if event_id.startswith('N-INJ') or event_id.startswith('IC-INJ'):
            # Find line number
            line_num = None
            for i, line in enumerate(lines, 1):
                if f'"event_id": "{event_id}"' in line:
                    line_num = i
                    break
            
            has_manual = 'manual' in event
            manual_value = event.get('manual', None)
            
            noise_events.append({
                'event_id': event_id,
                'line_num': line_num,
                'has_manual': has_manual,
                'manual_value': manual_value,
                'time_offset': event.get('time_offset', 'N/A')
            })
    
    # Sort by line number
    noise_events.sort(key=lambda x: x['line_num'] or 0)
    
    # Print results
    missing_manual = [e for e in noise_events if not e['has_manual']]
    
    print(f"Total noise events (N-INJ/IC-INJ): {len(noise_events)}")
    print(f"Events missing 'manual' field: {len(missing_manual)}")
    
    if missing_manual:
        print("\n" + "="*80)
        print("EVENTS MISSING 'manual': false FIELD:")
        print("="*80)
        for event in missing_manual:
            print(f"\nLine {event['line_num']}: {event['event_id']}")
            print(f"  Time offset: {event['time_offset']}")
    
    print("\n" + "="*80)
    print("ALL NOISE EVENTS SUMMARY:")
    print("="*80)
    for event in noise_events:
        status = f"✓ has manual={event['manual_value']}" if event['has_manual'] else "✗ MISSING manual field"
        print(f"\nLine {event['line_num']}: {event['event_id']}")
        print(f"  Time offset: {event['time_offset']}")
        print(f"  Status: {status}")

if __name__ == "__main__":
    analyze_noise_events()