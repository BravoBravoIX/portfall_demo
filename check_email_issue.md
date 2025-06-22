# Email Issue Analysis

## Issue Summary
Emails are not being sent from the simulation. The primary issue is:

**GMAIL_ENABLED=false in docker-compose.yml**

## Email Flow Architecture
1. **Agent** (agent.py) → Publishes email events to MQTT
2. **MQTT Broker** → Receives messages on topic `ui_update/vm-ui`
3. **Backend** (mqttBridge.js) → Subscribes to MQTT, receives email commands
4. **Email Service** (emailService.js) → Sends emails via Gmail SMTP

## Identified Issues

### 1. Primary Issue: Gmail Service Disabled
- In `docker-compose.yml` line 65: `GMAIL_ENABLED=false`
- This causes emailService.js to skip sending emails (line 33-36)

### 2. Email Event Structure
Email events in scenario_schedule.json have proper structure:
```json
{
  "command": "send_email",
  "parameters": {
    "from_name": "Sender Name",
    "subject": "Subject",
    "to": ["recipient@simrange.local"],
    "body": "Email body"
  }
}
```

### 3. Email Mapping
The emailService.js has proper mapping from simulation addresses to real Gmail:
- `media@simrange.local` → `portfall.mediacomms@gmail.com`
- `legal@simrange.local` → `portfall.legal@gmail.com`
- `tech@simrange.local` → `portfall.technical@gmail.com`
- `executive@simrange.local` → `portfall.executive@gmail.com`
- `ops@simrange.local` → `portfall.operations@gmail.com`
- `incident@simrange.local` → `portfall.incident@gmail.com`

### 4. MQTT Flow
- Agent publishes to topic: `ui_update/vm-ui`
- Backend subscribes to this topic correctly
- mqttBridge.js handles `send_email` commands (lines 43-54)

## Solution
To enable emails, change in docker-compose.yml:
```yaml
GMAIL_ENABLED=true
```

## Additional Checks Needed
1. Verify containers are running: `docker-compose ps`
2. Check backend logs: `docker-compose logs -f backend`
3. Verify MQTT messages: `docker-compose logs -f mqtt-broker`
4. Check agent logs: `docker-compose logs -f agent`

## Testing
After enabling Gmail:
1. Restart backend: `docker-compose restart backend`
2. Monitor logs to see email sending attempts
3. Check Gmail credentials are valid (they appear to be set in docker-compose.yml)