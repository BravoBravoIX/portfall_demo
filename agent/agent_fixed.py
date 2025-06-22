#!/usr/bin/env python3
# agent.py - Fixed version combining best of both approaches
import json
import time
import yaml
import threading
from state_tracker import StateTracker
from inject_executor import InjectExecutor
from mqtt_handler import MQTTHandler

class Agent:
    def __init__(self):
        # Load configuration
        with open('config.yaml', 'r') as f:
            self.config = yaml.safe_load(f)
        
        # Load scenario schedule
        with open('scenario_schedule.json', 'r') as f:
            self.schedule = json.load(f)
        
        # Remove comments from schedule
        self.schedule = [s for s in self.schedule if '_comment' not in s]
        
        # Initialize components
        self.state_tracker = StateTracker(self.config)
        self.mqtt_handler = MQTTHandler(self.config)
        self.inject_executor = InjectExecutor(self.config, self.mqtt_handler)
        self.running = False
        self.scenario_thread = None
        
    def start(self):
        """Start the agent and wait for control commands"""
        print(f"[Agent] Starting scenario agent for {self.config['vm_name']}")
        
        # Connect to MQTT
        self.mqtt_handler.connect()
        time.sleep(2)  # Give MQTT time to connect
        
        # Subscribe to control messages
        self.mqtt_handler.subscribe('scenario/control', self._handle_control_message)
        print("[Agent] Subscribed to scenario/control topic")
        print("[Agent] Connected and waiting for start command...")
        
        # Keep the agent running
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("[Agent] Shutting down...")
            self.cleanup()
    
    def _handle_control_message(self, payload):
        """Handle control messages from the UI"""
        command = payload.get('command', '').lower()
        print(f"[Agent] Received control command: {command}")
        
        if command == 'start':
            print("[Agent] Start command received. Resetting state and beginning scenario.")
            self.running = True
            self.state_tracker.reset()  # Clear previous state first
            self.state_tracker.start_timer()  # Then start fresh
            
            # Start the scenario loop in a separate thread
            if self.scenario_thread is None or not self.scenario_thread.is_alive():
                self.scenario_thread = threading.Thread(target=self._scenario_loop, daemon=True)
                self.scenario_thread.start()
            
        elif command == 'stop':
            print("[Agent] Stop command received. Pausing scenario.")
            self.running = False
            self.state_tracker.pause_timer()
            
        elif command == 'reset':
            print("[Agent] Reset command received. Stopping scenario and clearing state.")
            self.running = False
            self.state_tracker.reset()
        else:
            print(f"[Agent] Unknown control command: {command}")
    
    def _scenario_loop(self):
        """Main scenario execution loop"""
        print("[Agent] Scenario loop started")
        
        while self.running:
            try:
                current_offset = self.state_tracker.get_current_offset()
                
                # Check for events to inject
                for event in self.schedule:
                    # Only process events for this VM
                    if event.get('target') != self.config['vm_name']:
                        continue
                        
                    event_offset = event.get('time_offset', 0)
                    event_id = event.get('event_id', 'UNKNOWN')
                    is_manual = event.get('manual', False)
                    
                    # Skip if already injected
                    if self.state_tracker.is_injected(event_id):
                        continue
                    
                    # Skip manual events - they need explicit triggering
                    if is_manual:
                        continue
                    
                    # Check if it's time to inject this event
                    if current_offset >= event_offset:
                        print(f"[Agent] Injecting event {event_id} at offset {current_offset} minutes")
                        
                        # Execute the inject
                        self.inject_executor.execute(event)
                        
                        # Mark as injected
                        self.state_tracker.mark_injected(event_id)
                        
                        # Save state
                        self.state_tracker._save_state()
                
                # Sleep before next check
                time.sleep(5)
                
            except Exception as e:
                print(f"[Agent] Error in scenario loop: {e}")
                time.sleep(5)
        
        print("[Agent] Scenario loop stopped")
    
    def cleanup(self):
        """Clean up resources"""
        self.running = False
        if self.mqtt_handler:
            self.mqtt_handler.disconnect()

if __name__ == "__main__":
    agent = Agent()
    agent.start()