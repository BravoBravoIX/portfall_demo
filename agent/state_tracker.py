# state_tracker.py
import time
import json
import os

class StateTracker:
    def __init__(self, config):
        self.start_time = None
        self.paused = False
        self.pause_time = None
        self.injected_events = []
        self.state_file = 'scenario_state.json'

    def start_timer(self):
        self.start_time = time.time()
        self._save_state()

    def pause_timer(self):
        if not self.paused:
            self.paused = True
            self.pause_time = time.time()
            self._save_state()

    def resume_timer(self):
        if self.paused:
            paused_duration = time.time() - self.pause_time
            self.start_time += paused_duration
            self.paused = False
            self._save_state()

    def get_current_offset(self):
        if self.start_time is None:
            return 0
        elapsed = time.time() - self.start_time
        return int(elapsed // 60)

    def mark_injected(self, event_id):
        self.injected_events.append(event_id)
        self._save_state()

    def is_injected(self, event_id):
        return event_id in self.injected_events

    def _save_state(self):
        state = {
            'start_time_utc': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(self.start_time)) if self.start_time else None,
            'current_time_offset': self.get_current_offset(),
            'executed_events': self.injected_events,
            'manual_events_ready': []  # Expand later if needed
        }
        with open(self.state_file, 'w') as f:
            json.dump(state, f, indent=2)