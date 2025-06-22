# SOUTHGATE TERMINAL
## Technical Quick Reference Card
---

## Purpose
This card provides rapid command reference for technical investigations during operational incidents. Use when investigating system anomalies, service failures, or security concerns.

---

## VM-CORETECH Commands

### When to Use
- AIS tracking system issues or vessel position anomalies
- Container routing problems or misallocated cargo
- Service authentication failures affecting operational systems
- GPS/positioning data inconsistencies

### Essential Investigation Commands

**Evidence Preservation (ALWAYS DO FIRST):**
```bash
cd /var/log/sim/ && sha256sum ais_feed.log > /tmp/ais_feed_hash_$(date +%Y%m%d_%H%M%S).txt
cp ais_feed.log /tmp/ais_feed_backup_$(date +%Y%m%d_%H%M%S).log
```

**AIS System Investigation:**
```bash
# Check recent AIS feed activity
tail -n 100 /var/log/sim/ais_feed.log
grep -i "signal\|lost\|degraded\|restart" /var/log/sim/ais_feed.log
grep -i "Ship_Alpha\|Ship_Bravo" /var/log/sim/ais_feed.log

# Verify AIS configuration
cat /etc/ais-tracker/config.conf
diff /etc/ais-tracker/config.conf /etc/ais-tracker/config.conf.bak

# Check AIS service status
systemctl status ais-tracker.service
ps aux | grep -i ais
```

**Container Routing Investigation:**
```bash
# Check routing configuration
cat /etc/container-scheduler/routes.conf

# Search for specific containers
grep "CON44891\|CON44902" /var/log/container/scheduler.log
tail -50 /var/log/container/scheduler.log

# Container service status
systemctl status container-scheduler.service
```

**Authentication System Check:**
```bash
# Recent authentication failures
grep -i "failed\|svc_" /var/log/auth.log | tail -20
grep "svc_scheduler\|svc_ais" /var/log/auth.log

# Service account issues
grep "systemd.*ais-tracker.*Failed" /var/log/auth.log
journalctl -u ais-tracker.service --since "1 hour ago"
```

**System Integrity Checks:**
```bash
# Check for scheduled tasks
ls -la /etc/cron.d/
crontab -l

# Look for recovery scripts
ls -la /home/ubuntu/
ls -la /opt/security/

# MySQL operation history
cat /root/.mysql_history
```

### Advanced Investigation Commands

**Network Connections:**
```bash
netstat -tlpn | grep -E "1883|3306"
ss -tulpn | grep LISTEN
```

**Process Investigation:**
```bash
ps aux | grep -E "python|scheduler|tracker"
pstree -p | grep -E "ais|container"
```

**File System Analysis:**
```bash
find /tmp -type f -name "*.py" 2>/dev/null
find /opt -type f -mtime -1 2>/dev/null
ls -la /tmp/.* 2>/dev/null
```

**Log Correlation:**
```bash
# Correlate timestamps across logs
for log in /var/log/sim/*.log /var/log/container/*.log; do
    echo "=== $log ==="
    tail -5 "$log" 2>/dev/null
done
```

---

## VM-GATEWAY Commands

### When to Use
- External vendor connection issues
- Gateway authentication anomalies
- Suspicious external access patterns
- Evidence of unauthorized vendor sessions

### Essential Investigation Commands

**Evidence Preservation:**
```bash
cd /var/log/gateway/
sha256sum vendor.log auth.log > /tmp/gateway_hashes_$(date +%Y%m%d_%H%M%S).txt
cp vendor.log auth.log /tmp/
```

**Vendor Session Analysis:**
```bash
cat /var/log/gateway/vendor.log
grep -i "payload\|inject\|admin\|temp_session" /var/log/gateway/vendor.log
grep -i "checksum\|failure\|error" /var/log/gateway/vendor.log
```

**Gateway Authentication:**
```bash
cat /var/log/gateway/auth.log
grep -i "failed\|root\|sudo\|ghost" /var/log/gateway/auth.log
grep -c "failed" /var/log/gateway/auth.log
```

**Security Scripts Investigation:**
```bash
ls -la /opt/security/
cat /opt/security/*.sh
```

---

## VM-OPSNODE Commands

### When to Use
- CCTV system failures or camera dropouts
- Visual monitoring degradation
- Media file corruption issues
- Operational visibility problems

### Essential Investigation Commands

**Evidence Preservation:**
```bash
cd /var/log/cctv/
sha256sum stream.log > /tmp/cctv_hash_$(date +%Y%m%d_%H%M%S).txt
cp stream.log /tmp/cctv_backup_$(date +%Y%m%d_%H%M%S).log
```

**CCTV Stream Analysis:**
```bash
tail -n 100 /var/log/cctv/stream.log
grep -i "dropout\|jitter\|lost\|scrambling\|offline" /var/log/cctv/stream.log
grep -i "encoder\|restart\|daemon" /var/log/cctv/stream.log
```

**Media File Investigation:**
```bash
ls -la /var/cctv/archive/
file /var/cctv/archive/*.ts
for file in /var/cctv/archive/*.ts; do
    echo "=== $file ==="
    head -c 100 "$file" | hexdump -C | head -5
done
```

---

## VM-AUDIT Commands

### When to Use
- Evidence collection and verification
- Chain of custody documentation
- Hash verification of transferred evidence
- Forensic data consolidation

### Essential Commands

**Evidence Reception:**
```bash
ls -la /incident/archive/*/
df -h /incident/
```

**Hash Generation:**
```bash
cd /incident/archive/coretech/
for file in *; do
    sha256sum "$file" >> /incident/hash_records/$(date +%Y%m%d_%H%M%S)_hashes.txt
done
```

---

## General Investigation Tips

1. **Always preserve evidence first** - Hash and backup before analysis
2. **Document your findings** - Create investigation notes as you go
3. **Check system status** - Use systemctl, ps, and journalctl liberally
4. **Follow the data flow** - Trace from service configs to logs to processes
5. **Correlate timestamps** - Many issues manifest across multiple systems
6. **Verify file integrity** - Compare current files with backups when available

---

## Evidence Transfer

**Secure copy to audit system:**
```bash
scp /tmp/evidence_* user@vm-audit:/incident/archive/$(hostname)/
```

**Generate transfer record:**
```bash
echo "$(date): Transferred evidence from $(hostname) to vm-audit" >> /tmp/transfer_log.txt
```

---

**Reference:** TECH-QRC-01  
**Version:** 1.0  
**For:** Technical Team Rapid Response