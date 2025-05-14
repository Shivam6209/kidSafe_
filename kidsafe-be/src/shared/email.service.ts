import { Injectable, Logger } from '@nestjs/common';
// Using require instead of import for node-mailjet as type definitions might be missing
const Mailjet = require('node-mailjet');

@Injectable()
export class EmailService {
  private mailjet;
  private readonly logger = new Logger(EmailService.name);
  private readonly usePreviewMode: boolean = false;

  constructor() {
    try {
      // Initialize Mailjet with API keys
      const apiKey = process.env.MAILJET_API_KEY;
      const apiSecret = process.env.MAILJET_API_SECRET;
      
      if (!apiKey || !apiSecret) {
        this.logger.warn('Mailjet API keys not provided. Email functionality will be limited to preview mode.');
        this.usePreviewMode = true;
      } else {
        this.mailjet = Mailjet.apiConnect(apiKey, apiSecret);
        this.logger.log(`Mailjet client initialized with API key: ${apiKey.substring(0, 4)}...`);
        
        if (this.usePreviewMode) {
          this.logger.log('Email preview mode is ENABLED. Emails will be logged but not sent.');
        } else {
          this.logger.log('Email sending is ENABLED. Emails will be sent to recipients.');
        }
      }
    } catch (error) {
      this.logger.error(`Failed to initialize Mailjet client: ${error.message}`);
      this.usePreviewMode = true;
    }
  }

  async sendOTP(email: string, otp: string): Promise<boolean> {
    try {
      // When in preview mode or if Mailjet client failed to initialize, use preview mode
      if (this.usePreviewMode || !this.mailjet) {
        this.logger.log(`Email preview (OTP): To: ${email}, Code: ${otp}`);
        return true;
      }

      this.logger.log(`Attempting to send OTP email to ${email}...`);
      
      const fromEmail = process.env.EMAIL_FROM || 'noreply@kidsafe.com';
      
      this.logger.log(`Using sender: ${fromEmail}`);
      
      const payload = {
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: 'KidSafe'
            },
            To: [
              {
                Email: email
              }
            ],
            Subject: 'Your KidSafe Verification Code',
            TextPart: `Your verification code is: ${otp}. This code will expire in 10 minutes.`,
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4a6cf7;">KidSafe Verification</h2>
                <p>Your verification code is:</p>
                <div style="background-color: #f5f5f5; padding: 10px; font-size: 24px; text-align: center; letter-spacing: 5px; font-weight: bold;">
                  ${otp}
                </div>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this code, please ignore this email.</p>
              </div>
            `
          }
        ]
      };
      
      this.logger.log(`Email payload prepared: ${JSON.stringify(payload, null, 2)}`);
      
      const response = await this.mailjet.post('send', { version: 'v3.1' }).request(payload);
      
      this.logger.log(`Full Mailjet response: ${JSON.stringify(response.body, null, 2)}`);
      this.logger.log(`OTP email sent to ${email} with status ${response.response.status}`);
      
      return response.response.status === 200;
    } catch (error) {
      this.logger.error(`Failed to send OTP email to ${email}: ${error.message}`);
      if (error.response) {
        this.logger.error(`API error response: ${JSON.stringify(error.response.data || error.response.body || {})}`);
      }
      return false;
    }
  }

  async sendAlert(email: string, childName: string, message: string): Promise<boolean> {
    try {
      // When in preview mode or if Mailjet client failed to initialize, use preview mode
      if (this.usePreviewMode || !this.mailjet) {
        this.logger.log(`Email preview (Alert): To: ${email}, Subject: KidSafe Alert: ${childName}, Message: ${message}`);
        return true;
      }

      this.logger.log(`Attempting to send alert email to ${email}...`);
      
      const fromEmail = process.env.EMAIL_FROM || 'noreply@kidsafe.com';
      
      this.logger.log(`Using sender: ${fromEmail}`);
      
      const response = await this.mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: 'KidSafe'
            },
            To: [
              {
                Email: email
              }
            ],
            Subject: `KidSafe Alert: ${childName}`,
            TextPart: message,
            HTMLPart: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4a6cf7;">KidSafe Alert</h2>
                <p>${message}</p>
                <p>Please check your KidSafe dashboard for more details.</p>
              </div>
            `
          }
        ]
      });
      
      this.logger.log(`Full Mailjet response: ${JSON.stringify(response.body, null, 2)}`);
      this.logger.log(`Alert email sent to ${email} with status ${response.response.status}`);
      
      return response.response.status === 200;
    } catch (error) {
      this.logger.error(`Failed to send alert email to ${email}: ${error.message}`);
      if (error.response) {
        this.logger.error(`API error response: ${JSON.stringify(error.response.data || error.response.body || {})}`);
      }
      return false;
    }
  }
} 