# MQTT Control Mechanism - Start Button Fix

## The Working Mechanism (from backup)

The start button works through this flow:

### 1. UI Sends Command
- File: `ui-portfall/src/pages/InjectsPage.js`
- When clicked, publishes to MQTT: `mqttClient.publish('scenario/control', { command: 'start' })`
- Topic: `scenario/control`
- Payload: `{"command": "start"}`

### 2. Agent Receives Command
- File: `agent/agent.py`
- Subscribes to topic: `self.mqtt.subscribe('scenario/control', self.control_callback)`
- In callback:
  ```python
  if command == 'start':
      self.running = True
      self.state_tracker.reset()
      self.state_tracker.start_timer()
      threading.Thread(target=self.main_loop, daemon=True).start()
  ```

### 3. Key Implementation Details

**Backup Version (Working)**:
- Agent waits idle until 'start' command received
- Main loop only runs when `self.running = True`
- Clean separation between control and execution

**Current Version Issues**:
1. Agent already has the same subscription logic
2. The handler is properly implemented
3. **The issue is likely Docker networking or MQTT configuration**

## Testing the Connection

1. Check if agent is receiving messages:
```bash
docker-compose logs -f agent
```

2. Test MQTT directly:
```bash
# In one terminal:
docker-compose exec agent python test_mqtt_control.py

# In another terminal:
docker-compose exec agent python test_mqtt_publish.py localhost start
```

## The Fix

The current agent.py already has the correct implementation. The issue is likely:

1. **Timing**: Agent might subscribe before MQTT is fully connected
2. **Docker Networking**: Use `mqtt-broker` as hostname, not `localhost`
3. **Message Format**: Ensure UI sends exactly `{"command": "start"}`

## Quick Fix to Try

Replace the current agent.py with agent_fixed.py which:
- Ensures MQTT is connected before subscribing
- Adds better logging
- Uses a cleaner thread management approach
- Waits properly for commands before starting the scenario loop

```bash
cp agent/agent_fixed.py agent/agent.py
docker-compose restart agent
```