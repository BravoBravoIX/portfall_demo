#!/usr/bin/env python3
import json

with open('scenario_schedule.json', 'r') as f:
    events = json.load(f)
    
# Sort by time_offset
sorted_events = sorted(events, key=lambda x: x['time_offset'])

print("CHRONOLOGICAL EVENT ORDER")
print("=" * 100)
print(f"{'Time':>4} | {'Event ID':>8} | {'Command':>20} | {'Subject/Content'}")
print("-" * 100)

for event in sorted_events:
    time = event['time_offset']
    event_id = event['event_id']
    cmd = event['payload']['command']
    params = event['payload'].get('parameters', {})
    
    # Extract subject/content based on command type
    if cmd == 'send_email':
        subject = params.get('subject', 'N/A')
    elif cmd == 'update_dashboard':
        subject = f"{params.get('dashboard', 'N/A')} - {params.get('change', params.get('content', 'N/A'))}"
    else:
        subject = 'N/A'
    
    # Truncate long subjects
    if len(subject) > 60:
        subject = subject[:57] + "..."
    
    print(f"{time:4d} | {event_id:>8} | {cmd:>20} | {subject}")

# Now analyze specific timing issues
print("\n\nTIMING LOGIC ISSUES IDENTIFIED:")
print("=" * 100)

# Find the problematic events
for event in sorted_events:
    if event['event_id'] == 'INJ001E':
        marine_tracker_time = event['time_offset']
        marine_tracker_subject = event['payload']['parameters']['subject']
    elif event['event_id'] == 'INJ001F':
        insurance_time = event['time_offset']
        insurance_subject = event['payload']['parameters']['subject']
        insurance_body = event['payload']['parameters']['body']

print(f"\n1. ISSUE: Insurance email references visibility anomalies before they happen")
print(f"   - INJ001F (Insurance Concern) at time_offset {insurance_time}")
print(f"   - INJ001E (MarineTracker Spike) at time_offset {marine_tracker_time}")
print(f"   - The insurance email at time {insurance_time} references 'AIS-based visibility anomalies' but the MarineTracker spike doesn't happen until time {marine_tracker_time}")

# Check for other timing issues
print(f"\n2. OTHER POTENTIAL TIMING ISSUES:")

# Check if any emails reference events that haven't happened yet
for i, event in enumerate(sorted_events):
    if event['payload']['command'] == 'send_email':
        body = event['payload']['parameters'].get('body', '')
        subject = event['payload']['parameters'].get('subject', '')
        
        # Check for references to AIS anomalies
        if 'AIS' in body or 'visibility' in body.lower():
            if event['time_offset'] < 5:  # Before AIS issues start
                print(f"   - {event['event_id']} at time {event['time_offset']}: References AIS/visibility issues early")
        
        # Check for references to CCTV issues before they occur
        if 'CCTV' in body and event['time_offset'] < 18:
            print(f"   - {event['event_id']} at time {event['time_offset']}: References CCTV issues before INJ003A triggers blackout at time 18")