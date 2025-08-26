#!/usr/bin/env python3
import json
import sys
from collections import defaultdict, Counter

def validate_scenario_schedule(filename):
    """Comprehensive validation of scenario_schedule.json"""
    
    print(f"Validating {filename}...")
    print("=" * 80)
    
    # 1. Check JSON syntax
    try:
        with open(filename, 'r') as f:
            data = json.load(f)
        print("✓ JSON syntax is valid")
    except json.JSONDecodeError as e:
        print(f"✗ JSON syntax error: {e}")
        return False
    except FileNotFoundError:
        print(f"✗ File not found: {filename}")
        return False
    
    # 2. Check that data is a list
    if not isinstance(data, list):
        print("✗ Root element must be an array")
        return False
    
    print(f"✓ Found {len(data)} events")
    
    # Initialize counters and trackers
    event_ids = []
    noise_emails_without_manual_false = []
    non_simrange_emails = []
    time_offsets = []
    missing_fields = defaultdict(list)
    issues = []
    
    # Required fields for each event
    required_fields = ['event_id', 'type', 'time_offset', 'subject', 'from', 'to', 'body']
    
    # 3-7. Check each event
    for i, event in enumerate(data):
        event_id = event.get('event_id', f'<missing at index {i}>')
        
        # Track event IDs for duplicate check
        if 'event_id' in event:
            event_ids.append(event['event_id'])
        
        # Check required fields
        for field in required_fields:
            if field not in event:
                missing_fields[field].append(event_id)
        
        # Check noise emails have manual: false
        if event_id.startswith(('N-INJ', 'IC-INJ')):
            if 'manual' not in event:
                noise_emails_without_manual_false.append(event_id)
            elif event.get('manual') != False:
                noise_emails_without_manual_false.append(event_id)
        
        # Check email domain
        from_email = event.get('from', '')
        to_emails = event.get('to', [])
        if isinstance(to_emails, str):
            to_emails = [to_emails]
        
        all_emails = [from_email] + to_emails
        for email in all_emails:
            if email and '@' in email and not email.endswith('@simrange.local'):
                non_simrange_emails.append(f"{event_id}: {email}")
        
        # Track time offsets
        if 'time_offset' in event:
            time_offsets.append((event['time_offset'], event_id))
    
    # 3. Check for duplicate event IDs
    duplicates = [item for item, count in Counter(event_ids).items() if count > 1]
    if duplicates:
        print(f"✗ Found duplicate event IDs: {duplicates}")
        issues.append("duplicate event IDs")
    else:
        print("✓ No duplicate event IDs")
    
    # 4. Check noise emails have manual: false
    if noise_emails_without_manual_false:
        print(f"✗ Noise emails without 'manual': false - {len(noise_emails_without_manual_false)} found:")
        for email_id in noise_emails_without_manual_false[:10]:  # Show first 10
            print(f"  - {email_id}")
        if len(noise_emails_without_manual_false) > 10:
            print(f"  ... and {len(noise_emails_without_manual_false) - 10} more")
        issues.append("noise emails without manual: false")
    else:
        print("✓ All noise emails (N-INJ* and IC-INJ*) have 'manual': false")
    
    # 5. Check email domains
    if non_simrange_emails:
        print(f"✗ Found emails not using @simrange.local domain - {len(non_simrange_emails)} found:")
        for email in non_simrange_emails[:10]:  # Show first 10
            print(f"  - {email}")
        if len(non_simrange_emails) > 10:
            print(f"  ... and {len(non_simrange_emails) - 10} more")
        issues.append("non-simrange.local emails")
    else:
        print("✓ All email addresses use @simrange.local domain")
    
    # 6. Check chronological order
    time_offsets.sort(key=lambda x: x[0])
    is_chronological = True
    for i in range(1, len(time_offsets)):
        if time_offsets[i][0] < time_offsets[i-1][0]:
            is_chronological = False
            break
    
    if is_chronological:
        print("✓ Time offsets are in chronological order")
    else:
        print("✗ Time offsets are NOT in chronological order")
        issues.append("non-chronological time offsets")
    
    # 7. Check missing fields
    if any(missing_fields.values()):
        print("✗ Missing required fields:")
        for field, events in missing_fields.items():
            print(f"  - '{field}' missing in {len(events)} events")
        issues.append("missing required fields")
    else:
        print("✓ All events have required fields")
    
    # 8. Check last event
    if data:
        last_event = data[-1]
        if last_event.get('event_id') == 'IC-INJ001B':
            print("✓ Last event is IC-INJ001B")
        else:
            print(f"✗ Last event is {last_event.get('event_id', '<missing>')}, expected IC-INJ001B")
            issues.append("incorrect last event")
    
    # Summary
    print("\n" + "=" * 80)
    if not issues:
        print("✅ All validation checks passed!")
        return True
    else:
        print(f"❌ Validation failed with {len(issues)} issue(s):")
        for issue in issues:
            print(f"  - {issue}")
        return False

if __name__ == "__main__":
    filename = sys.argv[1] if len(sys.argv) > 1 else "/Users/brettburford/Development/CyberOps/portfall-sim/agent/scenario_schedule.json"
    validate_scenario_schedule(filename)