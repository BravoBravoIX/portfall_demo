# Customer Email Integration Guide

This guide explains how customers can integrate their own email systems with the Portfall simulation platform.

## Overview

The Portfall simulation can send real emails through your organization's email system. This enables:
- Realistic crisis communication exercises
- Actual email workflows during simulations
- Integration with your existing email infrastructure
- Complete control over email delivery

## Supported Email Systems

### 1. Gmail / Google Workspace
```javascript
// Configuration
GMAIL_ENABLED=true
GMAIL_USER=portfall-control@customer.com
GMAIL_APP_PASSWORD=your_app_password_here
```

**Setup Steps:**
1. Create a dedicated Gmail account (e.g., `portfall-control@yourcompany.com`)
2. Enable 2-Factor Authentication
3. Generate an App Password (Google Account → Security → App passwords)
4. Provide the app password to configure the system

### 2. Microsoft 365 / Outlook
```javascript
// Configuration
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=portfall@yourcompany.com
SMTP_PASSWORD=your_password
```

**Setup Steps:**
1. Create a dedicated mailbox in your Microsoft 365 admin center
2. Enable SMTP authentication for the account
3. Provide credentials and SMTP settings

### 3. Corporate SMTP Server
```javascript
// Configuration
SMTP_HOST=mail.yourcompany.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=portfall@yourcompany.com
SMTP_PASSWORD=your_password
```

**Setup Steps:**
1. Create email account on your mail server
2. Ensure SMTP relay permissions are configured
3. Provide SMTP host, port, and credentials

### 4. SendGrid (API-based)
```javascript
// Configuration
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
```

**Setup Steps:**
1. Create SendGrid account and verify your domain
2. Generate API key with Mail Send permissions
3. Provide API key for configuration

### 5. Amazon SES
```javascript
// Configuration
EMAIL_SERVICE=ses
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

**Setup Steps:**
1. Verify your domain in Amazon SES
2. Create IAM user with SES send permissions
3. Provide AWS credentials

## Implementation Options

### Option A: We Manage (Simplest)
1. You create a dedicated email account for the simulation
2. Provide us with:
   - Email address
   - SMTP settings
   - Authentication credentials (app password preferred)
3. We configure and test the integration
4. Emails are sent during your simulation

**Security Note:** We recommend using app-specific passwords rather than main account passwords.

### Option B: You Host (Most Secure)
1. We provide you with a configured Docker container
2. You set environment variables with your credentials:
   ```bash
   docker run -e SMTP_HOST=mail.company.com \
              -e SMTP_USER=portfall@company.com \
              -e SMTP_PASSWORD=your_password \
              portfall-email-service
   ```
3. Your credentials never leave your infrastructure

### Option C: Hybrid Approach
1. Email service runs in your infrastructure
2. Connects to our simulation platform via secure API
3. You maintain complete control of email sending
4. We never handle your credentials

## Email Address Mapping

The system maps simulation email addresses to real addresses:

```javascript
// Default mapping (customizable)
'media@simrange.local' → 'portfall-media@yourcompany.com'
'legal@simrange.local' → 'portfall-legal@yourcompany.com'
'ceo@simrange.local' → 'portfall-executive@yourcompany.com'
```

You can customize these mappings to match your organization's structure.

## Required Email Accounts

For a full simulation, create these email accounts:
- `portfall-control@yourcompany.com` - Master control account (sends all emails)
- `portfall-executive@yourcompany.com` - Executive team
- `portfall-legal@yourcompany.com` - Legal/Compliance team
- `portfall-technical@yourcompany.com` - Technical/IT team
- `portfall-media@yourcompany.com` - Media/Communications team
- `portfall-operations@yourcompany.com` - Operations team
- `portfall-incident@yourcompany.com` - Incident Coordinator

## Testing Your Integration

We provide a test suite to verify your email configuration:

```bash
# Test single email
npm run test-email -- --to your-email@company.com

# Test all team emails
npm run test-all-emails

# Verify delivery and formatting
npm run verify-email-setup
```

## Security Considerations

1. **Use App Passwords**: Never share main account passwords
2. **Dedicated Accounts**: Create simulation-specific email accounts
3. **Access Control**: Limit who can access these accounts
4. **Audit Trail**: All emails are logged for review
5. **Encryption**: Use TLS/SSL for SMTP connections
6. **Temporary Access**: Revoke credentials after simulation

## Advanced Configuration

### Custom Email Templates
```javascript
// Customize email appearance
EMAIL_TEMPLATE_HEADER="[SIMULATION]"
EMAIL_TEMPLATE_FOOTER="This is a training exercise"
EMAIL_TEMPLATE_STYLE="corporate"
```

### Rate Limiting
```javascript
// Prevent email flooding
EMAIL_RATE_LIMIT=10 // Max emails per minute
EMAIL_BURST_LIMIT=20 // Max burst size
```

### Delivery Options
```javascript
// Control email behavior
EMAIL_SEND_REAL=true // Actually send emails
EMAIL_ALSO_LOG=true // Log all emails locally
EMAIL_BCC_MONITOR=monitor@company.com // BCC for oversight
```

## Troubleshooting

### Common Issues

**Authentication Failed**
- Verify credentials are correct
- Check if 2FA is required (use app passwords)
- Ensure SMTP is enabled for the account

**Emails Not Delivered**
- Check spam/junk folders
- Verify SMTP settings (host, port, security)
- Review firewall rules for SMTP traffic
- Check email service logs

**Connection Timeout**
- Verify network connectivity to SMTP server
- Check if port 587/465/25 is blocked
- Try different SMTP ports

### Debug Mode
Enable detailed logging:
```bash
EMAIL_DEBUG=true
SMTP_DEBUG=true
```

## Support

For email integration assistance:
1. Provide your email system type
2. Share any error messages (remove passwords)
3. Describe your network setup (firewalls, proxies)
4. Include test results from our verification suite

We support all major email providers and can accommodate custom requirements.

## Quick Start Checklist

- [ ] Choose email system (Gmail, Office 365, SMTP, etc.)
- [ ] Create dedicated simulation email account
- [ ] Generate app password or API key
- [ ] Provide credentials securely
- [ ] Test email delivery
- [ ] Create team email accounts
- [ ] Configure email mappings
- [ ] Run full simulation test

## Example Configurations

### Gmail/Google Workspace
```env
EMAIL_SERVICE=gmail
GMAIL_ENABLED=true
GMAIL_USER=portfall-control@yourcompany.com
GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
```

### Office 365
```env
EMAIL_SERVICE=smtp
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=portfall@yourcompany.com
SMTP_PASSWORD=your_password
```

### SendGrid
```env
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=portfall@yourcompany.com
```

### Corporate SMTP
```env
EMAIL_SERVICE=smtp
SMTP_HOST=mail.internal.company.com
SMTP_PORT=25
SMTP_SECURE=false
SMTP_USER=portfall
SMTP_PASSWORD=your_password
SMTP_SKIP_CERT_VERIFY=true  # For self-signed certificates
```

## Privacy & Compliance

- All email content is generated by the simulation
- No personal data is collected or stored
- Email logs can be purged after exercises
- Compliant with GDPR and data protection requirements
- Audit trails available for compliance review