import json

# Load the scenario schedule
with open('scenario_schedule.json', 'r') as f:
    events = json.load(f)

# Define teams and phases
teams = {
    'Technical': ['tech@simrange.local'],
    'Operations': ['ops@simrange.local'],
    'Legal': ['legal@simrange.local'],
    'Media': ['media@simrange.local'],
    'Executive': ['ceo@simrange.local'],
    'Incident Coordinator': ['incident@simrange.local']
}

phases = {
    'Phase 1': (0, 15),
    'Phase 2': (15, 35),
    'Phase 3': (35, 55),
    'Phase 4': (55, 75)
}

# Initialize counters
team_phase_counts = {team: {phase: 0 for phase in phases} for team in teams}
dashboard_events = {team: {phase: 0 for phase in phases} for team in teams}

# Count events per team per phase
for event in events:
    time = event['time_offset']
    
    # Determine phase
    current_phase = None
    for phase, (start, end) in phases.items():
        if start <= time < end:
            current_phase = phase
            break
    if not current_phase:
        continue
    
    # Check email events
    if event.get('action_type') == 'payload' and event['payload'].get('command') == 'send_email':
        recipients = event['payload']['parameters'].get('to', [])
        for team, emails in teams.items():
            if any(email in recipients for email in emails):
                team_phase_counts[team][current_phase] += 1
    
    # Check dashboard events
    elif event.get('action_type') == 'payload' and event['payload'].get('command') == 'update_dashboard':
        dashboard = event['payload']['parameters'].get('dashboard', '')
        # Map dashboards to teams
        dashboard_map = {
            'ais': 'Operations',
            'cctv': 'Operations',
            'logs': 'Technical',
            'container': 'Operations',
            'media': 'Media',
            'vendor': 'Technical'
        }
        if dashboard in dashboard_map:
            team = dashboard_map[dashboard]
            dashboard_events[team][current_phase] += 1

# Print results
print('EVENT COUNT PER TEAM PER PHASE (Email Events Only):')
print('=' * 60)
for team in teams:
    print(f'\n{team}:')
    for phase in phases:
        count = team_phase_counts[team][phase]
        print(f'  {phase}: {count} events')
    total = sum(team_phase_counts[team].values())
    print(f'  TOTAL: {total} events')

print('\n\nDASHBOARD EVENTS PER TEAM PER PHASE:')
print('=' * 60)
for team in teams:
    if any(dashboard_events[team].values()):
        print(f'\n{team}:')
        for phase in phases:
            count = dashboard_events[team][phase]
            if count > 0:
                print(f'  {phase}: {count} dashboard events')

print('\n\nCOMBINED TOTAL (Emails + Dashboard Events):')
print('=' * 60)
for team in teams:
    print(f'\n{team}:')
    for phase in phases:
        total = team_phase_counts[team][phase] + dashboard_events[team][phase]
        print(f'  {phase}: {total} total events')
    grand_total = sum(team_phase_counts[team].values()) + sum(dashboard_events[team].values())
    print(f'  GRAND TOTAL: {grand_total} events')

# Check for important events in TEAM-SUMMARY that might be missing
print('\n\nKEY EVENTS CHECK:')
print('=' * 60)

# Phase 1 key events
print('\nPhase 1 (0-15 min) - Key Events from TEAM-SUMMARY:')
print('- Time 5min: Ship_Alpha disappears from AIS (Operations)')
print('- Time 15min: Insurance clause 7.4 review CRITICAL (Legal)')

# Phase 2 key events  
print('\nPhase 2 (15-35 min) - Key Events from TEAM-SUMMARY:')
print('- Time 18min: CCTV blackout (Operations)')
print('- Time 25min: 10-minute ultimatum from Dockmaster (Operations)')
print('- Time 25min: Container configuration manipulation (Technical)')
print('- Time 30min: ABC interview request - 30 min notice (Media)')

# Phase 3 key events
print('\nPhase 3 (35-55 min) - Key Events from TEAM-SUMMARY:')
print('- Time 30min: Complete AIS failure - all ships (Operations/Technical)')
print('- Time 36min: Insurers deadline 1:00 PM (Legal)')
print('- Time 40min: "Sabotage suspected" headline (Media)')
print('- Time 41min: Two containers misrouted (Operations)')

# Phase 4 key events
print('\nPhase 4 (55-75 min) - Key Events from TEAM-SUMMARY:')
print('- Time 56min: Log deletion detected (Technical)')
print('- Time 56min: InsurePort demands logs (Legal)')
print('- Time 60min: Dock supervisor requests night shift halt (Operations)')
print('- Time 62min: TV crew at entrance (Media)')
print('- Time 64min: CFO blocks statements (Executive)')

# Analyze balance
print('\n\nWORKLOAD ANALYSIS:')
print('=' * 60)

for phase in phases:
    print(f'\n{phase}:')
    phase_events = []
    for team in teams:
        total = team_phase_counts[team][phase] + dashboard_events[team][phase]
        phase_events.append((team, total))
    
    # Sort by event count
    phase_events.sort(key=lambda x: x[1], reverse=True)
    
    for team, count in phase_events:
        if count == 0:
            print(f'  ⚠️  {team}: {count} events - IDLE')
        elif count >= 5:
            print(f'  🔴 {team}: {count} events - OVERLOADED')
        else:
            print(f'  ✓  {team}: {count} events')