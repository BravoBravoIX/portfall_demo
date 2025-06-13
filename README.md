# Portfall-Sim

A cybersecurity incident simulation platform for port facility operations.

## MQTT Commands

```bash
# Subscribe to UI updates
mosquitto_sub -h localhost -p 1883 -t "ui_update/vm-ui"

# Publish a command to start the scenario
mosquitto_pub -h localhost -t "scenario/control" -m '{"command":"start"}'
```

## Role-Based Navigation

The application now supports role-based navigation, allowing different teams to see only the pages relevant to their role:

### Available Roles

- **Executive Team**: Access to Email, Policies, and Media
- **Legal Team**: Access to Email, Policies, and Media
- **Operations Team**: Access to AIS, CCTV, Containers, Email, Policies, and Media
- **Technical Team**: Access to Comms, Email, Policies, Media, and Vendor
- **Media & Communications Team**: Access to Email, Policies, and Media
- **Incident Coordinator**: Access to Email, Policies, and Media

### How to Test Different Roles

1. The System Info page at `/system-info` is only accessible in admin mode (for development)
2. From there, you can navigate to any team page:
   - `/executive`
   - `/legal`
   - `/operations`
   - `/technical`
   - `/media-comms`
   - `/incident-coordinator`

3. Each team page will automatically set the appropriate role and filter navigation links

### Implementation Details

The role-based navigation system consists of:

1. A menu configuration file at `src/config/menu.js` defining which roles can access each page
2. An AuthContext provider at `src/auth/AuthContext.js` that manages the current user role
3. Role-specific pages that set the appropriate role when visited
4. A filtered navigation menu in `MainLayout.js` that shows only the pages accessible to the current role

The role is determined based on the current URL path. Each team page automatically sets the appropriate role and filters navigation items accordingly. The System Info page is now restricted to admin role only.