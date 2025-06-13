# inject_executor.py
import os
import json

class InjectExecutor:
    def __init__(self, config, mqtt_handler=None):
        self.config = config
        self.mqtt_handler = mqtt_handler  # Allow publishing if needed

    def execute(self, inject):
        payload = inject.get('payload', {})
        command = payload.get('command')
        parameters = payload.get('parameters', {})

        if not command:
            print("[Warning] No command specified in payload.")
            return

        # Always print to console for testing
        print(f"[Inject] Command: {command} | Parameters: {json.dumps(parameters)}")

        # Always publish to MQTT topic for UIs (if mqtt_handler available)
        if self.mqtt_handler:
            self.mqtt_handler.publish(f"ui_update/{self.config['vm_name'].lower()}", {
                "command": command,
                "parameters": parameters
            })