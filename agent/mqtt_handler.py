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
        print(f"[MQTT] Subscribing to topic '{topic}'")
        result = self.client.subscribe(topic)
        if result[0] == 0:
            print(f"[MQTT] Successfully subscribed to '{topic}'")
        else:
            print(f"[MQTT] Failed to subscribe to '{topic}', result code: {result[0]}")
        self.subscriptions[topic] = callback
        print(f"[MQTT] Registered handler for topic '{topic}'")

    def publish(self, topic, payload):
        self.client.publish(topic, json.dumps(payload))

    def _on_message(self, client, userdata, msg):
        topic = msg.topic
        try:
            payload = json.loads(msg.payload.decode('utf-8'))
            print(f"[MQTT] Received message on topic '{topic}': {payload}")
            if topic in self.subscriptions:
                print(f"[MQTT] Calling handler for topic '{topic}'")
                self.subscriptions[topic](payload)
            else:
                print(f"[MQTT] No handler registered for topic '{topic}'")
        except Exception as e:
            print(f"[MQTT] Error processing message: {e}")
    
    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()
        print(f"Disconnected from MQTT broker")