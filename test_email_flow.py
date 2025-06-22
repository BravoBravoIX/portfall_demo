#!/usr/bin/env python3
import paho.mqtt.client as mqtt
import json
import time

# MQTT connection settings
mqtt_broker = "localhost"
mqtt_port = 1883

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with result code {rc}")

def test_email_send():
    client = mqtt.Client()
    client.on_connect = on_connect
    
    try:
        client.connect(mqtt_broker, mqtt_port, 60)
        client.loop_start()
        time.sleep(2)  # Give time to connect
        
        # Test email payload
        test_payload = {
            "command": "send_email",
            "parameters": {
                "from_name": "Test Sender",
                "subject": "Test Email from MQTT",
                "to": ["tech@simrange.local"],
                "body": "This is a test email to verify the email flow from agent -> MQTT -> backend -> Gmail"
            }
        }
        
        topic = "ui_update/vm-ui"
        print(f"\nPublishing to topic: {topic}")
        print(f"Payload: {json.dumps(test_payload, indent=2)}")
        
        result = client.publish(topic, json.dumps(test_payload))
        if result.rc == 0:
            print("✅ Message published successfully")
        else:
            print(f"❌ Failed to publish message: {result.rc}")
        
        # Wait a bit to see if we get any response
        time.sleep(5)
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.loop_stop()
        client.disconnect()

if __name__ == "__main__":
    print("Testing email flow through MQTT...")
    test_email_send()