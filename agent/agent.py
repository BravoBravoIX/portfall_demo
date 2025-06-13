# agent.py
import time
import threading
from mqtt_handler import MQTTHandler
from inject_executor import InjectExecutor
from state_tracker import StateTracker
from utils import load_yaml_config, load_json_file

class ScenarioAgent:
    def __init__(self, config_path='config.yaml'):
        self.config = load_yaml_config(config_path)
        self.schedule = load_json_file('scenario_schedule.json')
        self.mqtt = MQTTHandler(self.config)
        self.executor = InjectExecutor(self.config, self.mqtt)
        self.state_tracker = StateTracker(self.config)
        self.running = False

    def start(self):
        self.mqtt.connect()
        self.mqtt.subscribe('scenario/control', self.control_callback)
        print("[Agent] Connected and waiting for start command...")  # Add this nice feedback
        while True:
            time.sleep(1)  # Just keep agent alive, but do nothing until 'start' received

    def control_callback(self, message):
        command = message.get('command', '').lower()
        if command == 'start':
            print("[Agent] Start command received. Beginning scenario.")
            self.running = True
            self.state_tracker.start_timer()
            threading.Thread(target=self.main_loop, daemon=True).start()

    def main_loop(self):
        while self.running:
            current_offset = self.state_tracker.get_current_offset()
            for inject in self.schedule:
                if inject['target'] == self.config['vm_name'] and not self.state_tracker.is_injected(inject['event_id']):
                    if inject['time_offset'] <= current_offset:
                        self.executor.execute(inject)
                        self.state_tracker.mark_injected(inject['event_id'])
            time.sleep(5)

if __name__ == '__main__':
    agent = ScenarioAgent()
    agent.start()