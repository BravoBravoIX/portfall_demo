#!/usr/bin/env python3
import json
import re
from collections import Counter, defaultdict

# Read and parse the JSON file
filename = "/Users/brettburford/Development/CyberOps/portfall-sim/agent/scenario_schedule.json"

try:
    with open(filename, 'r') as f:
        content = f.read()
        data = json.loads(content)
    
    print("JSON VALIDATION REPORT")
    print("=" * 80)
    print(f"✓ JSON syntax is valid")
    print(f"✓ Total events: {len(data)}")
    
    # Check for duplicate IDs
    event_ids = [e.get('event_id', '') for e in data if 'event_id' in e]
    duplicates = [item for item, count in Counter(event_ids).items() if count > 1]
    
    if duplicates:
        print(f"\n✗ DUPLICATE EVENT IDs FOUND:")
        for dup in duplicates:
            print(f"  - {dup}")
    else:
        print(f"\n✓ No duplicate event IDs")
    
    # Check noise emails
    noise_emails_issues = []
    for event in data:
        event_id = event.get('event_id', '')
        if event_id.startswith(('N-INJ', 'IC-INJ')):
            if 'manual' not in event or event.get('manual') != False:
                noise_emails_issues.append(event_id)
    
    if noise_emails_issues:
        print(f"\n✗ NOISE EMAILS WITHOUT 'manual': false ({len(noise_emails_issues)} found):")
        for i, email_id in enumerate(noise_emails_issues[:10]):
            print(f"  - {email_id}")
        if len(noise_emails_issues) > 10:
            print(f"  ... and {len(noise_emails_issues) - 10} more")
    else:
        print(f"\n✓ All noise emails (N-INJ* and IC-INJ*) have 'manual': false")
    
    # Check email domains
    non_simrange_emails = []
    for event in data:
        if 'type' in event and event['type'] == 'email':
            from_email = event.get('from', '')
            to_emails = event.get('to', [])
            if isinstance(to_emails, str):
                to_emails = [to_emails]
            
            for email in [from_email] + to_emails:
                if email and '@' in email and not email.endswith('@simrange.local'):
                    non_simrange_emails.append(f"{event.get('event_id', 'unknown')}: {email}")
        
        # Also check payload emails
        if 'payload' in event and 'parameters' in event.get('payload', {}):
            params = event['payload']['parameters']
            if 'to' in params:
                to_emails = params['to']
                if isinstance(to_emails, str):
                    to_emails = [to_emails]
                for email in to_emails:
                    if email and '@' in email and not email.endswith('@simrange.local'):
                        non_simrange_emails.append(f"{event.get('event_id', 'unknown')}: {email}")
    
    if non_simrange_emails:
        print(f"\n✗ NON-SIMRANGE.LOCAL EMAILS ({len(non_simrange_emails)} found):")
        for i, email in enumerate(non_simrange_emails[:10]):
            print(f"  - {email}")
        if len(non_simrange_emails) > 10:
            print(f"  ... and {len(non_simrange_emails) - 10} more")
    else:
        print(f"\n✓ All email addresses use @simrange.local domain")
    
    # Check chronological order
    time_offsets = [(e.get('time_offset', -1), e.get('event_id', '')) for e in data if 'time_offset' in e]
    time_offsets_sorted = sorted(time_offsets, key=lambda x: x[0])
    
    is_chronological = time_offsets == time_offsets_sorted
    if is_chronological:
        print(f"\n✓ Time offsets are in chronological order")
    else:
        print(f"\n✗ TIME OFFSETS NOT IN CHRONOLOGICAL ORDER")
        # Find first out-of-order event
        for i in range(len(time_offsets) - 1):
            if time_offsets[i][0] > time_offsets[i+1][0]:
                print(f"  First issue at: {time_offsets[i][1]} (offset {time_offsets[i][0]}) followed by {time_offsets[i+1][1]} (offset {time_offsets[i+1][0]})")
                break
    
    # Check required fields
    required_fields = ['event_id', 'time_offset']
    missing_fields = defaultdict(list)
    
    for i, event in enumerate(data):
        if '_comment' not in event:  # Skip comment entries
            for field in required_fields:
                if field not in event:
                    missing_fields[field].append(event.get('event_id', f'index_{i}'))
    
    if missing_fields:
        print(f"\n✗ MISSING REQUIRED FIELDS:")
        for field, events in missing_fields.items():
            print(f"  - '{field}' missing in {len(events)} events")
    else:
        print(f"\n✓ All events have required fields")
    
    # Check last event
    if data:
        last_event = data[-1]
        last_id = last_event.get('event_id', 'unknown')
        if last_id == 'IC-INJ001B':
            print(f"\n✓ Last event is IC-INJ001B")
        else:
            print(f"\n✗ Last event is '{last_id}', expected IC-INJ001B")
    
    # Summary statistics
    print(f"\n\nSUMMARY STATISTICS:")
    print(f"- Total events: {len(data)}")
    print(f"- Events with IDs: {len(event_ids)}")
    print(f"- Comment entries: {len([e for e in data if '_comment' in e])}")
    print(f"- Time range: {min(t[0] for t in time_offsets if t[0] >= 0)} to {max(t[0] for t in time_offsets)}")
    
    # Count event types
    event_types = Counter()
    for event in data:
        if event.get('event_id', '').startswith('N-INJ'):
            event_types['Noise emails'] += 1
        elif event.get('event_id', '').startswith('IC-INJ'):
            event_types['IC emails'] += 1
        elif 'payload' in event and event.get('payload', {}).get('command') == 'send_email':
            event_types['Regular emails'] += 1
        elif '_comment' not in event:
            event_types['Other'] += 1
    
    print(f"\nEvent types:")
    for etype, count in event_types.items():
        print(f"  - {etype}: {count}")

except json.JSONDecodeError as e:
    print(f"✗ JSON SYNTAX ERROR: {e}")
except FileNotFoundError:
    print(f"✗ File not found: {filename}")
except Exception as e:
    print(f"✗ Unexpected error: {e}")

print("\n" + "=" * 80)