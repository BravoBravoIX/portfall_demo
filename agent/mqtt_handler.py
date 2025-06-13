# mqtt_handler.py
import paho.mqtt.client as mqtt
import json
import time

class MQTTHandler:
    def __init__(self, config):
        self.broker = config['mqtt_broker']
        self.port = config.get('mqtt_port', 1883)
        self.vm_name = config['vm_name']
        self.client = mqtt.Client()
        self.subscriptions = {}

    # mqtt_handler.py (improved connect method)
    def connect(self):
        self.client.on_message = self._on_message
        while True:
            try:
                self.client.connect(self.broker, self.port, 60)
                self.client.loop_start()
                print(f"Connected to MQTT broker at {self.broker}:{self.port}")
                break
            except Exception as e:
                print(f"Failed to connect to MQTT broker ({self.broker}:{self.port}): {e}")
                print("Retrying in 5 seconds...")
                time.sleep(5)

    def subscribe(self, topic, callback):
        self.client.subscribe(topic)
        self.subscriptions[topic] = callback

    def publish(self, topic, payload):
        self.client.publish(topic, json.dumps(payload))

    def _on_message(self, client, userdata, msg):
        topic = msg.topic
        payload = json.loads(msg.payload.decode('utf-8'))
        if topic in self.subscriptions:
            self.subscriptions[topic](payload)