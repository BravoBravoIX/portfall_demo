#!/bin/bash

# Verification script for vm-coretech setup
# Checks that all planted evidence exists and matches documentation

echo "========================================"
echo "VM-CORETECH SETUP VERIFICATION"
echo "========================================"
echo ""

# Color codes for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for issues
ISSUES=0

# Function to check if file/directory exists
check_exists() {
    if [ -e "$1" ]; then
        echo -e "${GREEN}✓${NC} $2 exists at $1"
        return 0
    else
        echo -e "${RED}✗${NC} $2 MISSING at $1"
        ((ISSUES++))
        return 1
    fi
}

# Function to check file content
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $3 found in $1"
        return 0
    else
        echo -e "${RED}✗${NC} $3 NOT FOUND in $1"
        ((ISSUES++))
        return 1
    fi
}

# Function to check if command would work
check_command() {
    if $1 2>/dev/null 1>&2; then
        echo -e "${GREEN}✓${NC} Command works: $2"
        return 0
    else
        echo -e "${YELLOW}!${NC} Command may have issues: $2"
        return 1
    fi
}

echo "1. CHECKING DOCUMENTED ITEMS FROM VM_Specific_Investigation_Procedures.md"
echo "========================================================================="

# Check for documented trap script
check_exists "/home/ubuntu/restore_feed.sh" "TRAP: restore_feed.sh"

# Check for documented log files
check_exists "/var/log/sim/" "Log directory /var/log/sim/"
if [ -d "/var/log/sim/" ]; then
    check_exists "/var/log/sim/ais_feed.log" "AIS feed log"
else
    # Create the directory and file if missing
    echo -e "${YELLOW}!${NC} Creating missing /var/log/sim/ directory and ais_feed.log"
    mkdir -p /var/log/sim/
    echo "2024-06-20 09:05:00 AIS: Ship_Alpha position anomaly detected" > /var/log/sim/ais_feed.log
fi

# Check for reference directory
check_exists "/opt/reference/" "Reference directory"
if [ ! -d "/opt/reference/" ]; then
    mkdir -p /opt/reference/
    echo "Reference hash: a1b2c3d4e5f6" > /opt/reference/ais_reference.log
fi

echo ""
echo "2. CHECKING INVESTIGATION COMMANDS FROM DOCUMENTATION"
echo "===================================================="

# Test commands from the documentation
echo "Testing documented investigation commands:"
check_command "systemctl status ais-feed.service 2>&1 | grep -q 'Unit.*not found'" "systemctl status ais-feed.service (expected to fail - fake service)"
check_command "ps aux | grep -i ais" "ps aux | grep -i ais"

echo ""
echo "3. CHECKING PLANTED EVIDENCE FROM ADVANCED SETUP"
echo "==============================================="

# Configuration files
check_exists "/etc/ais-tracker/config.conf" "AIS tracker config"
check_content "/etc/ais-tracker/config.conf" "position_offset_lat = 0.0001" "Position offset tampering"
check_exists "/etc/ais-tracker/config.conf.bak" "AIS tracker config backup"

# Container routing
check_exists "/etc/container-scheduler/routes.conf" "Container routing config"
check_content "/etc/container-scheduler/routes.conf" "override_CON44891 = 7" "Container CON44891 diversion"
check_content "/etc/container-scheduler/routes.conf" "override_CON44902 = 7" "Container CON44902 diversion"

# Service files
check_exists "/etc/systemd/system/ais-tracker.service" "AIS tracker service file"
check_exists "/etc/systemd/system/container-scheduler.service" "Container scheduler service"

# Evidence files
check_exists "/root/.mysql_history" "MySQL tampering history"
check_content "/root/.mysql_history" "update vessel_positions" "Vessel position updates"

# Log files
check_exists "/var/log/container/scheduler.log" "Container scheduler log"
if [ -f "/var/log/container/scheduler.log" ]; then
    check_content "/var/log/container/scheduler.log" "CON44891" "Container misrouting evidence"
fi

# Auth logs
check_content "/var/log/auth.log" "svc_scheduler" "Service account failures"
check_content "/var/log/auth.log" "Failed password" "Authentication failures"

# Cron jobs
check_exists "/etc/cron.d/ais-maintenance" "Malicious AIS cron job"

# Hidden files
check_exists "/tmp/.python_cache/updater.py" "Hidden backdoor script"

# SSH keys
check_exists "/home/svc_scheduler/.ssh/authorized_keys" "Compromised SSH keys (scheduler)"
check_exists "/home/svc_ais/.ssh/authorized_keys" "Compromised SSH keys (ais)"

# Service scripts
check_exists "/opt/ais-tracker/tracker.py" "AIS tracker script"
check_exists "/opt/container-scheduler/scheduler.py" "Container scheduler script"

echo ""
echo "4. CHECKING SCENARIO-SPECIFIC EVIDENCE"
echo "====================================="

# Check for evidence matching scenario timeline
echo "Checking for T+40 service authentication failures:"
check_content "/var/log/auth.log" "09:40.*svc_scheduler" "T+40 auth failures"

echo "Checking for T+50 container misrouting:"
if [ -f "/var/log/container/scheduler.log" ]; then
    check_content "/var/log/container/scheduler.log" "09:50:00.*CON44891.*Berth 7" "T+50 container misroute"
fi

echo ""
echo "5. TESTING TECHNICAL TEAM INVESTIGATION PATHS"
echo "============================================"

echo "Can technical team find the trap script?"
if [ -f "/home/ubuntu/restore_feed.sh" ]; then
    echo -e "${GREEN}✓${NC} ls -la /home/ubuntu/ would show restore_feed.sh"
fi

echo "Can they investigate cron jobs?"
if ls /etc/cron.d/* 2>/dev/null | grep -q ais-maintenance; then
    echo -e "${GREEN}✓${NC} ls /etc/cron.d/ would show ais-maintenance"
fi

echo "Can they check for unauthorized SSH keys?"
if [ -f "/home/svc_scheduler/.ssh/authorized_keys" ]; then
    echo -e "${GREEN}✓${NC} find /home -name authorized_keys would reveal compromised keys"
fi

echo ""
echo "6. CREATING MISSING DOCUMENTED ITEMS"
echo "===================================="

# Create any missing items that are documented but not in our setup
if [ ! -f "/var/log/sim/ais_feed.log" ]; then
    mkdir -p /var/log/sim/
    cat > /var/log/sim/ais_feed.log << 'EOF'
2024-06-20 08:45:00 INFO: AIS feed started
2024-06-20 09:05:00 WARNING: Ship_Alpha position drift detected
2024-06-20 09:05:01 ERROR: GPS data inconsistency for Ship_Alpha
2024-06-20 09:10:00 WARNING: Ship_Bravo intermittent signal
2024-06-20 09:40:00 ERROR: Multiple vessel positions corrupted
2024-06-20 09:40:01 CRITICAL: AIS system compromise suspected
EOF
    echo -e "${YELLOW}!${NC} Created missing /var/log/sim/ais_feed.log"
fi

# Create cron job that truncates logs as documented
if [ ! -f "/etc/cron.d/log-truncate" ]; then
    cat > /etc/cron.d/log-truncate << 'EOF'
# Log truncation trap - removes evidence
*/5 * * * * root truncate -s 1000 /var/log/sim/ais_feed.log 2>/dev/null
EOF
    echo -e "${YELLOW}!${NC} Created log truncation cron job"
fi

echo ""
echo "========================================"
echo "VERIFICATION SUMMARY"
echo "========================================"
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}All checks passed! Setup is complete and matches documentation.${NC}"
else
    echo -e "${RED}Found $ISSUES issues that need attention.${NC}"
    echo "Run the setup script again or manually create missing items."
fi

echo ""
echo "INSTRUCTIONS FOR TECHNICAL TEAM EXIST FOR:"
echo "- Investigating /var/log/sim/ais_feed.log ✓"
echo "- Finding trap script at /home/ubuntu/restore_feed.sh ✓"
echo "- Checking cron jobs in /etc/cron.d/ ✓"
echo "- Investigating service account failures ✓"
echo "- Discovering container misrouting evidence ✓"