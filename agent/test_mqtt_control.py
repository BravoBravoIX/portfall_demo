#!/usr/bin/env python3
import paho.mqtt.client as mqtt
import json
import time
import sys

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")
    client.subscribe("scenario/control")
    print("Subscribed to scenario/control")

def on_message(client, userdata, msg):
    print(f"Received message on {msg.topic}: {msg.payload.decode()}")
    try:
        payload = json.loads(msg.payload.decode())
        print(f"Parsed payload: {payload}")
    except Exception as e:
        print(f"Error parsing payload: {e}")

# Create client
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Connect to broker
broker = sys.argv[1] if len(sys.argv) > 1 else "mqtt-broker"
print(f"Connecting to MQTT broker at {broker}:1883...")
try:
    client.connect(broker, 1883, 60)
    client.loop_forever()
except Exception as e:
    print(f"Failed to connect: {e}")