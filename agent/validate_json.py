#!/usr/bin/env python3
import json
import sys

def validate_json():
    try:
        with open('scenario_schedule.json', 'r') as f:
            data = json.load(f)
        
        print('✅ JSON is valid!')
        print(f'\nTotal items in file: {len(data)}')
        
        # Count actual events (exclude comments)
        events = [item for item in data if 'event_id' in item]
        print(f'Total events (excluding comments): {len(events)}')
        
        # Check for specific events
        target_events = ['TECH-P2-CCTV2', 'TECH-P2-CCTV3', 'TECH-P3-AIS4', 'TECH-P4-CCTV4', 'TECH-P4-CCTV5', 'TECH-P4-VENDOR3']
        print(f'\nChecking for new events:')
        for event in target_events:
            found = any(e.get('event_id') == event for e in events)
            print(f'  {event}: {"✅ Found" if found else "❌ Not found"}')
        
        # Count events by phase
        phase_counts = {}
        for event in events:
            event_id = event.get('event_id', '')
            if '-P1-' in event_id:
                phase_counts['Phase 1'] = phase_counts.get('Phase 1', 0) + 1
            elif '-P2-' in event_id:
                phase_counts['Phase 2'] = phase_counts.get('Phase 2', 0) + 1
            elif '-P3-' in event_id:
                phase_counts['Phase 3'] = phase_counts.get('Phase 3', 0) + 1
            elif '-P4-' in event_id:
                phase_counts['Phase 4'] = phase_counts.get('Phase 4', 0) + 1
            elif event_id.startswith('TECH-'):
                phase_counts['Technical'] = phase_counts.get('Technical', 0) + 1
            else:
                phase_counts['Other'] = phase_counts.get('Other', 0) + 1
        
        print('\nEvents by phase:')
        for phase, count in sorted(phase_counts.items()):
            print(f'  {phase}: {count}')
        
        # Check structure integrity
        print(f'\nFirst event ID: {events[0].get("event_id") if events else "None"}')
        print(f'Last event ID: {events[-1].get("event_id") if events else "None"}')
        
        return True
        
    except json.JSONDecodeError as e:
        print(f'❌ JSON is invalid!')
        print(f'Error: {e}')
        print(f'Line: {e.lineno}, Column: {e.colno}')
        return False
    except Exception as e:
        print(f'❌ Error reading file: {e}')
        return False

if __name__ == '__main__':
    sys.exit(0 if validate_json() else 1)