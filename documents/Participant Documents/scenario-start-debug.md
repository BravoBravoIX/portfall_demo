# Debugging Scenario Auto-Start Issue

## Problem Description
The scenario appears to be starting automatically when Docker containers start up, despite the start_scenario event being marked as `manual: true`.

## Key Findings

1. **start_scenario is properly marked as manual**
   - In `agent/scenario_schedule.json`, the INJ_START event has `"manual": true`
   - The agent code correctly skips manual events (agent.py lines 49-51)

2. **No auto-triggering in UI code**
   - No useEffect or onMount hooks that send start_scenario
   - InjectsPage has manual buttons that send 'start' (not 'start_scenario') to 'scenario/control'

3. **State shows scenario hasn't started**
   - `agent/scenario_state.json` shows `"start_time_utc": null`
   - No executed events in the state

## Potential Root Causes

### 1. State Persistence Issue
The agent mounts the entire `./agent` directory as a volume. Check if:
- The scenario_state.json is being corrupted
- File permissions are preventing proper state saving
- The state is being reset unexpectedly

### 2. Incorrect Offset Calculation
The `get_current_offset()` method returns 0 when scenario hasn't started:
```python
def get_current_offset(self):
    if self.start_time is None:
        return 0  # This could be problematic
```

However, all non-manual events have `time_offset >= 2`, so they shouldn't trigger.

### 3. Message Misinterpretation
You might be seeing other messages (emails, dashboard updates) and thinking the scenario has started.

## Debugging Steps

1. **Add debug logging to agent.py**:
   ```python
   # At the start of the run() method
   print(f"[Agent] Initial state - start_time: {self.state_tracker.start_time}")
   print(f"[Agent] Initial state - injected_events: {self.state_tracker.injected_events}")
   
   # In the main loop before checking events
   print(f"[Agent] Current offset: {current_offset}, Scenario started: {self.state_tracker.start_time is not None}")
   ```

2. **Monitor MQTT messages**:
   ```bash
   # Subscribe to all topics to see what's being published
   docker exec -it portfall-sim-mqtt-broker-1 mosquitto_sub -t '#' -v
   ```

3. **Check agent logs**:
   ```bash
   docker-compose logs -f agent | grep -E "start_scenario|INJ_START|Starting scenario"
   ```

4. **Verify state file**:
   ```bash
   # Check state before and after container start
   cat agent/scenario_state.json
   docker-compose up -d
   sleep 10
   cat agent/scenario_state.json
   ```

## Temporary Workaround

To prevent any events from being processed before explicit start, modify agent.py:

```python
# In the run() method, add this check before processing events:
if self.state_tracker.start_time is None:
    # Don't process any events until scenario is explicitly started
    time.sleep(5)
    continue
```

## Next Steps

1. Run the debugging steps above to identify exactly what's happening
2. Check if any other service might be sending MQTT messages on startup
3. Verify the agent's state persistence is working correctly
4. Consider adding a "scenario_enabled" flag that must be explicitly set before any events can be processed