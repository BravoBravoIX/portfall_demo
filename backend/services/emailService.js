const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.enabled = process.env.GMAIL_ENABLED === 'true';
    this.emailMap = {
      // Internal simulation addresses → Real Gmail addresses
      'media@simrange.local': 'portfall.mediacomms@gmail.com',
      'legal@simrange.local': 'portfall.legal@gmail.com',
      'tech@portnet.internal': 'portfall.technical@gmail.com',
      'ceo@simrange.local': 'portfall.executive@gmail.com',
      'ops@simrange.local': 'portfall.operations@gmail.com',
      'incident@simrange.local': 'portfall.incident@gmail.com',
      // Add more mappings as needed
    };

    if (this.enabled) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD
        }
      });
      console.log('📧 Gmail SMTP service enabled');
    } else {
      console.log('📧 Gmail SMTP service disabled (set GMAIL_ENABLED=true to enable)');
    }
  }

  async sendEmail(emailData) {
    if (!this.enabled) {
      console.log('📧 Gmail sending skipped (disabled)');
      return { skipped: true, reason: 'Gmail service disabled' };
    }

    try {
      const { subject, to, body, from_name, sendReal } = emailData;
      
      // Skip if sendReal is explicitly false
      if (sendReal === false) {
        console.log('📧 Gmail sending skipped (sendReal=false)');
        return { skipped: true, reason: 'sendReal flag is false' };
      }

      // Map internal addresses to real Gmail addresses
      const recipients = Array.isArray(to) ? to : [to];
      const realRecipients = recipients.map(addr => {
        const mapped = this.emailMap[addr] || addr;
        if (mapped !== addr) {
          console.log(`📧 Mapped ${addr} → ${mapped}`);
        }
        return mapped;
      });

      // Determine sender name
      const senderName = from_name || this.extractSenderName(subject, body) || 'Portfall Scenario';

      const mailOptions = {
        from: `"${senderName}" <${process.env.GMAIL_USER}>`,
        to: realRecipients.join(', '),
        subject: subject || 'Portfall Simulation Message',
        html: (body || 'No content provided').replace(/\\n/g, '\n').replace(/\n/g, '<br>'),
        replyTo: process.env.GMAIL_USER
      };

      console.log(`📧 Sending email: "${subject}" to ${realRecipients.join(', ')}`);
      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email sent successfully:', result.messageId);
      return { 
        success: true, 
        messageId: result.messageId,
        recipients: realRecipients
      };

    } catch (error) {
      console.error('❌ Email send error:', error.message);
      // Don't throw - just log and return error result
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  extractSenderName(subject, body) {
    // Try to intelligently extract sender from content
    if (subject && subject.toLowerCase().includes('journalist')) {
      return 'Media Inquiry';
    }
    if (subject && subject.toLowerCase().includes('government')) {
      return 'Government Office';
    }
    if (subject && subject.toLowerCase().includes('vendor')) {
      return 'Vendor Support';
    }
    if (body && body.includes('Network Operations')) {
      return 'Network Operations';
    }
    return null;
  }
}

module.exports = new EmailService();