#!/bin/bash

# Verification script for vm-opsnode setup
# Checks that all planted evidence exists and matches documentation

echo "========================================"
echo "VM-OPSNODE SETUP VERIFICATION"
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

# Function to check if user exists
check_user() {
    if id "$1" &>/dev/null; then
        echo -e "${GREEN}✓${NC} User $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} User $1 MISSING"
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

# Check for documented log files
check_exists "/var/log/cctv/" "CCTV log directory"
check_exists "/var/log/cctv/stream.log" "CCTV stream log"

# Check for archived media files
check_exists "/var/cctv/archive/" "CCTV archive directory"
check_exists "/var/cctv/archive/camera01_20240620_0930.ts" "Camera01 archive file"
check_exists "/var/cctv/archive/camera02_20240620_0930.ts" "Camera02 archive file"
check_exists "/var/cctv/archive/camera03_20240620_0930.ts" "Camera03 archive file"

# Check for reference files
check_exists "/opt/reference/expected_layout.png" "Camera layout reference"

# Check stream log content for documented issues
if [ -f "/var/log/cctv/stream.log" ]; then
    check_content "/var/log/cctv/stream.log" "dropout" "Stream dropouts"
    check_content "/var/log/cctv/stream.log" "jitter" "Signal jitter"
    check_content "/var/log/cctv/stream.log" "scrambling" "Signal scrambling"
    check_content "/var/log/cctv/stream.log" "offline" "Cameras offline"
    check_content "/var/log/cctv/stream.log" "Berth 4 coverage lost" "Berth 4 failure"
    check_content "/var/log/cctv/stream.log" "Berth 5 coverage lost" "Berth 5 failure"
    check_content "/var/log/cctv/stream.log" "Berth 7 coverage lost" "Berth 7 failure"
    check_content "/var/log/cctv/stream.log" "coordinated RF interference" "Interference pattern"
fi

echo ""
echo "2. CHECKING USERS AND PERMISSIONS"
echo "================================="

# Check users
check_user "opsnode"
check_user "svc_cctv"
check_user "svc_stream"

# Check sudo permissions for opsnode user
if sudo -l -U opsnode 2>/dev/null | grep -q "NOPASSWD: ALL"; then
    echo -e "${GREEN}✓${NC} Opsnode user has sudo NOPASSWD privileges"
else
    echo -e "${RED}✗${NC} Opsnode user missing sudo NOPASSWD privileges"
    ((ISSUES++))
fi

echo ""
echo "3. CHECKING CCTV SYSTEM EVIDENCE"
echo "================================"

# Configuration files
check_exists "/opt/cctv-manager/config/streams.conf" "CCTV streams configuration"
check_exists "/opt/cctv-manager/config/streams.conf.backup" "CCTV config backup"

if [ -f "/opt/cctv-manager/config/streams.conf" ]; then
    check_content "/opt/cctv-manager/config/streams.conf" "signal://jammer.freq" "Jammer configuration"
    check_content "/opt/cctv-manager/config/streams.conf" "interference_detection = false" "Disabled interference detection"
fi

# Disruption tools
check_exists "/opt/cctv-manager/tools/stream_disrupt.py" "Stream disruption tool"
if [ -f "/opt/cctv-manager/tools/stream_disrupt.py" ]; then
    check_content "/opt/cctv-manager/tools/stream_disrupt.py" "jam_rtsp_stream" "Jamming function"
fi

# Hidden cache
check_exists "/tmp/.cctv_cache/" "Hidden CCTV cache directory"
check_exists "/tmp/.cctv_cache/.encoder" "Hidden encoder process"

echo ""
echo "4. CHECKING CRON JOBS"
echo "===================="

check_exists "/etc/cron.d/cctv-maintenance" "CCTV maintenance cron job"
if [ -f "/etc/cron.d/cctv-maintenance" ]; then
    check_content "/etc/cron.d/cctv-maintenance" "stream_disrupt.py" "Stream disruption scheduled"
fi

echo ""
echo "5. CHECKING BASH HISTORIES"
echo "========================="

# Check service account history
if [ -f "/home/svc_cctv/.bash_history" ]; then
    echo -e "${GREEN}✓${NC} svc_cctv bash history exists"
    check_content "/home/svc_cctv/.bash_history" "stream_disrupt.py" "Disruption tool usage"
    check_content "/home/svc_cctv/.bash_history" "vi streams.conf" "Config modification"
else
    echo -e "${RED}✗${NC} svc_cctv bash history MISSING"
    ((ISSUES++))
fi

# Check opsnode user history
if [ -f "/home/opsnode/.bash_history" ]; then
    echo -e "${GREEN}✓${NC} Opsnode user bash history exists"
    check_content "/home/opsnode/.bash_history" "grep.*dropout\|jitter" "Investigation commands"
fi

# Check root history
if [ -f "/root/.bash_history" ]; then
    check_content "/root/.bash_history" "interference" "Interference investigation"
    check_content "/root/.bash_history" "stream_disrupt.py" "Tool discovery"
fi

echo ""
echo "6. TESTING TECHNICAL TEAM INVESTIGATION PATHS"
echo "============================================"

echo "Can technical team examine stream logs?"
if [ -f "/var/log/cctv/stream.log" ]; then
    echo -e "${GREEN}✓${NC} tail -n 100 /var/log/cctv/stream.log would show failures"
fi

echo "Can they check archive files?"
if [ -d "/var/cctv/archive" ]; then
    echo -e "${GREEN}✓${NC} ls -la /var/cctv/archive/ would show media files"
fi

echo "Can they find disruption tools?"
if [ -f "/opt/cctv-manager/tools/stream_disrupt.py" ]; then
    echo -e "${GREEN}✓${NC} find /opt -name '*.py' would locate stream_disrupt.py"
fi

echo ""
echo "7. VERIFYING INVESTIGATION COMMANDS"
echo "==================================="

# Test commands from documentation
echo "Testing documented investigation commands:"
# Test navigation separately
if [ -d "/var/log/cctv/" ]; then
    echo -e "${GREEN}✓${NC} Command works: cd /var/log/cctv/ (navigate to CCTV logs)"
else
    echo -e "${RED}✗${NC} Cannot navigate to /var/log/cctv/"
    ((ISSUES++))
fi

# Test file command
if file /var/cctv/archive/*.ts &>/dev/null; then
    echo -e "${GREEN}✓${NC} Command works: file /var/cctv/archive/*.ts (check media types)"
else
    echo -e "${YELLOW}!${NC} Command may have issues: Check media file types"
fi

echo ""
echo "8. CHECKING MEDIA FILE INTEGRITY"
echo "================================"

# Check if files appear corrupted/valid as expected
if [ -f "/var/cctv/archive/camera01_20240620_0930.ts" ]; then
    SIZE1=$(stat -c%s "/var/cctv/archive/camera01_20240620_0930.ts" 2>/dev/null || stat -f%z "/var/cctv/archive/camera01_20240620_0930.ts" 2>/dev/null)
    if [ "$SIZE1" -gt 1000000 ]; then
        echo -e "${GREEN}✓${NC} Camera01 file appears to be substantial size (likely corrupted as intended)"
    fi
fi

if [ -f "/var/cctv/archive/camera03_20240620_0930.ts" ]; then
    if hexdump -C "/var/cctv/archive/camera03_20240620_0930.ts" 2>/dev/null | head -1 | grep -q "47 40"; then
        echo -e "${GREEN}✓${NC} Camera03 file has valid MPEG-TS header"
    else
        echo -e "${YELLOW}!${NC} Camera03 file header may not be valid MPEG-TS"
    fi
fi

echo ""
echo "9. CHECKING SSH CONFIGURATION"
echo "============================="

if sudo sshd -T 2>/dev/null | grep -q "passwordauthentication yes"; then
    echo -e "${GREEN}✓${NC} SSH password authentication is enabled"
else
    echo -e "${RED}✗${NC} SSH password authentication may not be enabled"
    echo "    Run: sudo sed -i 's/PasswordAuthentication no/PasswordAuthentication yes/g' /etc/ssh/sshd_config"
fi

echo ""
echo "10. CHECKING ADDITIONAL FORENSIC EVIDENCE"
echo "========================================"

# Network forensics
check_exists "/var/log/netflow/flows_20240620.log" "Network flow logs"
if [ -f "/var/log/netflow/flows_20240620.log" ]; then
    check_content "/var/log/netflow/flows_20240620.log" "10.0.2.104,554,UDP" "RTSP jamming traffic"
fi

# System forensics
check_exists "/var/log/journal/cctv-stream.log" "Journal logs"
check_exists "/var/crash/cctv-stream.core" "Memory dump"
check_exists "/var/log/kern.log" "Kernel logs"
if [ -f "/var/log/kern.log" ]; then
    check_content "/var/log/kern.log" "USB device found" "USB insertion evidence"
fi

# Persistence mechanisms
check_exists "/etc/systemd/system/cctv-stream.service.d/override.conf" "Systemd persistence"
check_exists "/opt/cctv-manager/tools/pre_start.sh" "Pre-start persistence script"
check_exists "/opt/cctv-manager/tools/.config" "C2 configuration"

# Anti-forensics
check_exists "/var/log/cctv/stream.log.1" "Partially wiped log"
check_exists "/tmp/.cctv_cache/.deleted_cleanup.sh" "Recovered deleted file"

# Process artifacts
check_exists "/tmp/.proc_artifacts/" "Process artifacts directory"
check_exists "/tmp/.proc_artifacts/cmdline_8234" "Process command line"
check_exists "/tmp/.proc_artifacts/environ_8234" "Process environment"

# Operational impact
check_exists "/var/log/operations/crane_delays.log" "Operational impact logs"
if [ -f "/var/log/operations/crane_delays.log" ]; then
    check_content "/var/log/operations/crane_delays.log" "Camera_Offline" "Camera impact documented"
fi

echo ""
echo "11. ADVANCED INVESTIGATION CAPABILITIES"
echo "======================================"

echo "Can teams perform network forensics?"
if [ -f "/var/log/netflow/flows_20240620.log" ]; then
    echo -e "${GREEN}✓${NC} Network flow analysis available"
fi

echo "Can teams find persistence mechanisms?"
if [ -f "/etc/systemd/system/cctv-stream.service.d/override.conf" ]; then
    echo -e "${GREEN}✓${NC} Systemd persistence can be discovered"
fi

echo "Can teams perform memory forensics?"
if [ -f "/var/crash/cctv-stream.core" ]; then
    SIZE=$(stat -c%s "/var/crash/cctv-stream.core" 2>/dev/null || stat -f%z "/var/crash/cctv-stream.core" 2>/dev/null)
    if [ "$SIZE" -gt 1000000 ]; then
        echo -e "${GREEN}✓${NC} Memory dump available for analysis"
    fi
fi

echo "Can teams detect anti-forensics?"
if [ -f "/var/log/cctv/stream.log.1" ] && [ -f "/tmp/.cctv_cache/.deleted_cleanup.sh" ]; then
    echo -e "${GREEN}✓${NC} Anti-forensics evidence available"
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
echo "OPSNODE USER CREDENTIALS:"
echo "Username: opsnode"
echo "Password: OpsN0de2024"
echo ""
echo "INSTRUCTIONS FOR TECHNICAL TEAM EXIST FOR:"
echo "- Preserving evidence in /var/log/cctv/ ✓"
echo "- Analyzing stream logs for patterns ✓"
echo "- Checking archived media files ✓"
echo "- Identifying corrupted vs intact files ✓"
echo "- Finding camera layout reference ✓"
echo "- Detecting coordinated interference ✓"