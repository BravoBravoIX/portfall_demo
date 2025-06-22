#!/bin/bash

# Verification script for vm-gateway setup
# Checks that all planted evidence exists and matches documentation

echo "========================================"
echo "VM-GATEWAY SETUP VERIFICATION"
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

# Check for documented trap script
check_exists "/opt/security/remove_malware.sh" "TRAP: remove_malware.sh"
if [ -f "/opt/security/remove_malware.sh" ]; then
    check_content "/opt/security/remove_malware.sh" "rm -f /var/log/gateway/\*" "Evidence destruction command"
fi

# Check for documented log files
check_exists "/var/log/gateway/" "Gateway log directory"
check_exists "/var/log/gateway/vendor.log" "Vendor session log"
check_exists "/var/log/gateway/auth.log" "Gateway auth log"

# Check for reference files
check_exists "/opt/reference/hash_expected.txt" "Reference hash file"

# Check vendor log content
if [ -f "/var/log/gateway/vendor.log" ]; then
    check_content "/var/log/gateway/vendor.log" "admin=true, temp_session=true" "Admin temp_session"
    check_content "/var/log/gateway/vendor.log" "inject_payload.sh" "Payload script upload"
    check_content "/var/log/gateway/vendor.log" "Checksum validation: FAILED" "Checksum failure"
fi

# Check auth log content
if [ -f "/var/log/gateway/auth.log" ]; then
    check_content "/var/log/gateway/auth.log" "Failed password for root" "Root login failures"
    check_content "/var/log/gateway/auth.log" "Accepted password for ghost" "Ghost user login"
fi

echo ""
echo "2. CHECKING USERS AND PERMISSIONS"
echo "================================="

# Check users
check_user "gateway"
check_user "ghost"
check_user "vendor_api"

# Check sudo permissions for gateway user
if sudo -l -U gateway 2>/dev/null | grep -q "NOPASSWD: ALL"; then
    echo -e "${GREEN}✓${NC} Gateway user has sudo NOPASSWD privileges"
else
    echo -e "${RED}✗${NC} Gateway user missing sudo NOPASSWD privileges"
    ((ISSUES++))
fi

echo ""
echo "3. CHECKING VENDOR PORTAL EVIDENCE"
echo "=================================="

# Vendor portal configuration
check_exists "/opt/vendor-portal/config/api.conf" "Vendor API configuration"
if [ -f "/opt/vendor-portal/config/api.conf" ]; then
    check_content "/opt/vendor-portal/config/api.conf" "admin_override = true" "Admin override enabled"
    check_content "/opt/vendor-portal/config/api.conf" "bypass_auth = 198.51.100.17" "Auth bypass for attacker IP"
    check_content "/opt/vendor-portal/config/api.conf" "remote_execution = enabled" "Remote execution enabled"
fi

# Uploaded payload
check_exists "/opt/vendor-portal/scripts/inject_payload.sh" "Injected payload script"
if [ -f "/opt/vendor-portal/scripts/inject_payload.sh" ]; then
    check_content "/opt/vendor-portal/scripts/inject_payload.sh" "useradd.*ghost" "Ghost user creation"
    check_content "/opt/vendor-portal/scripts/inject_payload.sh" "curl.*198.51.100.17" "C2 callback"
fi

# Hidden cache
check_exists "/tmp/.vendor_cache/" "Hidden vendor cache directory"
check_exists "/tmp/.vendor_cache/exfil_list.txt" "Exfiltration list"

echo ""
echo "4. CHECKING SERVICES AND CRON JOBS"
echo "=================================="

# Service files
check_exists "/etc/systemd/system/vendor-api.service" "Vendor API service"

# Cron jobs
check_exists "/etc/cron.d/vendor-sync" "Vendor sync cron job"
if [ -f "/etc/cron.d/vendor-sync" ]; then
    check_content "/etc/cron.d/vendor-sync" "curl.*198.51.100.17" "Malicious cron callback"
fi

# Nginx config
check_exists "/etc/nginx/sites-available/vendor-portal" "Nginx vendor portal config"
if [ -f "/etc/nginx/sites-available/vendor-portal" ]; then
    check_content "/etc/nginx/sites-available/vendor-portal" "allow 198.51.100.17" "Suspicious IP whitelist"
fi

echo ""
echo "5. CHECKING BASH HISTORIES"
echo "========================="

# Check ghost user history
if [ -f "/home/ghost/.bash_history" ]; then
    echo -e "${GREEN}✓${NC} Ghost user bash history exists"
    check_content "/home/ghost/.bash_history" "cat /etc/shadow" "Shadow file access"
    check_content "/home/ghost/.bash_history" "./inject_payload.sh" "Payload execution"
else
    echo -e "${RED}✗${NC} Ghost user bash history MISSING"
    ((ISSUES++))
fi

# Check root history
if [ -f "/root/.bash_history" ]; then
    check_content "/root/.bash_history" "DO NOT RUN.*remove_malware.sh" "Investigation note"
fi

# Check gateway user history
if [ -f "/home/gateway/.bash_history" ]; then
    echo -e "${GREEN}✓${NC} Gateway user bash history exists"
    check_content "/home/gateway/.bash_history" "cat /opt/security/remove_malware.sh" "Trap script investigation"
fi

echo ""
echo "6. TESTING TECHNICAL TEAM INVESTIGATION PATHS"
echo "============================================"

echo "Can technical team find the trap script?"
if [ -f "/opt/security/remove_malware.sh" ]; then
    echo -e "${GREEN}✓${NC} ls -la /opt/security/ would show remove_malware.sh"
fi

echo "Can they examine vendor logs?"
if [ -f "/var/log/gateway/vendor.log" ]; then
    echo -e "${GREEN}✓${NC} cat /var/log/gateway/vendor.log would show suspicious activity"
fi

echo "Can they check for unauthorized users?"
if grep -q "ghost" /etc/passwd; then
    echo -e "${GREEN}✓${NC} grep ghost /etc/passwd would find unauthorized user"
fi

echo "Can they find the payload script?"
if [ -f "/opt/vendor-portal/scripts/inject_payload.sh" ]; then
    echo -e "${GREEN}✓${NC} find /opt -name '*.sh' would locate inject_payload.sh"
fi

echo ""
echo "7. VERIFYING INVESTIGATION COMMANDS"
echo "==================================="

# Test commands from documentation
echo "Testing documented investigation commands:"
check_command "cd /var/log/gateway/ && ls -la" "Navigate to gateway logs"
check_command "grep -i 'payload\|inject' /var/log/gateway/vendor.log" "Search for payload references"
check_command "grep -i 'failed\|ghost' /var/log/gateway/auth.log" "Search auth failures"

echo ""
echo "8. CHECKING NETWORK EVIDENCE"
echo "============================"

# Check syslog for network connections
if [ -f "/var/log/syslog" ]; then
    check_content "/var/log/syslog" "198.51.100.17" "Attacker IP in syslog"
    check_content "/var/log/syslog" "vendor-api.*Received script upload" "Script upload logged"
fi

echo ""
echo "9. VERIFYING HASH MISMATCH CAPABILITY"
echo "====================================="

if [ -f "/opt/reference/hash_expected.txt" ] && [ -f "/var/log/gateway/vendor.log" ]; then
    EXPECTED_HASH=$(grep -o '[a-f0-9]\{64\}' /opt/reference/hash_expected.txt 2>/dev/null | head -1)
    ACTUAL_HASH=$(sha256sum /var/log/gateway/vendor.log 2>/dev/null | awk '{print $1}')
    
    if [ -n "$EXPECTED_HASH" ] && [ -n "$ACTUAL_HASH" ]; then
        if [ "$EXPECTED_HASH" != "$ACTUAL_HASH" ]; then
            echo -e "${GREEN}✓${NC} Hash mismatch exists (tampering detectable)"
        else
            echo -e "${YELLOW}!${NC} Hashes match - tampering won't be detectable"
        fi
    fi
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
echo "GATEWAY USER CREDENTIALS:"
echo "Username: gateway"
echo "Password: Trust3dV3ndor"
echo ""
echo "INSTRUCTIONS FOR TECHNICAL TEAM EXIST FOR:"
echo "- Preserving evidence in /var/log/gateway/ ✓"
echo "- Finding trap script at /opt/security/remove_malware.sh ✓"
echo "- Analyzing vendor sessions and auth failures ✓"
echo "- Discovering ghost user and payload scripts ✓"
echo "- Checking hash integrity ✓"