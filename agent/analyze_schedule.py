import json

# Load the JSON file
with open('scenario_schedule.json', 'r') as f:
    events = json.load(f)

# Group events by time_offset
time_distribution = {}
for event in events:
    time_offset = event['time_offset']
    if time_offset not in time_distribution:
        time_distribution[time_offset] = []
    time_distribution[time_offset].append(event['event_id'])

# Sort by time_offset
sorted_times = sorted(time_distribution.keys())

print('=== EVENT DISTRIBUTION BY TIME OFFSET ===')
print(f'Total events: {len(events)}')
print(f'Time range: {min(sorted_times)} - {max(sorted_times)} minutes')
print(f'Unique time offsets used: {len(sorted_times)}')
print()

# Show distribution
print('Time Offset | Event Count | Event IDs')
print('-' * 80)
for time in sorted_times:
    event_ids = ', '.join(time_distribution[time])
    print(f'{time:11d} | {len(time_distribution[time]):11d} | {event_ids}')

# Analyze clustering
print()
print('=== CLUSTERING ANALYSIS ===')

# Check for heavy clusters (more than 5 events at same time)
heavy_clusters = [(t, len(time_distribution[t])) for t in sorted_times if len(time_distribution[t]) > 5]
if heavy_clusters:
    print('Heavy clusters detected (>5 events):')
    for time, count in heavy_clusters:
        print(f'  - Time {time}: {count} events')
else:
    print('No heavy clusters detected (all time offsets have ≤5 events)')

# Check for gaps
print()
print('=== GAP ANALYSIS ===')
gaps = []
for i in range(len(sorted_times) - 1):
    gap = sorted_times[i+1] - sorted_times[i]
    if gap > 4:
        gaps.append((sorted_times[i], sorted_times[i+1], gap))

if gaps:
    print(f'Significant gaps found (>4 minutes):')
    for start, end, gap_size in gaps:
        print(f'  - Between {start} and {end}: {gap_size} minute gap')
else:
    print('No significant gaps found')

# Distribution visualization
print()
print('=== VISUAL DISTRIBUTION (0-38 minutes) ===')
print('Each * represents 1 event')
for minute in range(0, 39):
    if minute in time_distribution:
        count = len(time_distribution[minute])
        bar = '*' * count
        print(f'{minute:2d}: {bar} ({count})')
    else:
        print(f'{minute:2d}: -')