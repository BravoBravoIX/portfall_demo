#!/usr/bin/env python3
import paho.mqtt.client as mqtt
import json
import sys

# Create client
client = mqtt.Client()

# Connect to broker
broker = sys.argv[1] if len(sys.argv) > 1 else "mqtt-broker"
command = sys.argv[2] if len(sys.argv) > 2 else "start"

print(f"Connecting to MQTT broker at {broker}:1883...")
try:
    client.connect(broker, 1883, 60)
    
    # Publish control message
    payload = {"command": command}
    topic = "scenario/control"
    
    print(f"Publishing to {topic}: {payload}")
    client.publish(topic, json.dumps(payload))
    
    # Give it time to send
    client.loop()
    import time
    time.sleep(1)
    
    print("Message sent!")
    client.disconnect()
except Exception as e:
    print(f"Failed: {e}")