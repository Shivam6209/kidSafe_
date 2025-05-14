import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  
  // In-memory store of device tokens for simplicity
  // In production, this would be stored in a database
  private deviceTokens: Map<number, string[]> = new Map();
  
  constructor(private readonly emailService: EmailService) {}
  
  /**
   * Register a device token for a child
   */
  registerDeviceToken(childId: number, token: string): boolean {
    try {
      const tokens = this.deviceTokens.get(childId) || [];
      if (!tokens.includes(token)) {
        tokens.push(token);
      }
      this.deviceTokens.set(childId, tokens);
      return true;
    } catch (error) {
      this.logger.error(`Failed to register device token: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Send a push notification to a child's device
   */
  async sendPushNotification(
    childId: number, 
    payload: NotificationPayload
  ): Promise<boolean> {
    try {
      const tokens = this.deviceTokens.get(childId);
      if (!tokens || tokens.length === 0) {
        this.logger.warn(`No device tokens found for child ${childId}`);
        return false;
      }
      
      // This is a mock implementation
      // In production, this would use Firebase Cloud Messaging or another push service
      this.logger.log(`Sending push notification to child ${childId}: ${JSON.stringify(payload)}`);
      
      return true;
    } catch (error) {
      this.logger.error(`Failed to send push notification: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Send an alert about a child via email and push notification
   */
  async sendAlert(
    parentEmail: string,
    childId: number,
    childName: string,
    message: string
  ): Promise<boolean> {
    try {
      // Send email alert
      const emailSent = await this.emailService.sendAlert(
        parentEmail,
        childName,
        message
      );
      
      // Send push notification
      const notificationSent = await this.sendPushNotification(childId, {
        title: 'KidSafe Alert',
        body: message,
        data: {
          childId,
          childName,
          type: 'alert'
        }
      });
      
      return emailSent || notificationSent;
    } catch (error) {
      this.logger.error(`Failed to send alert: ${error.message}`);
      return false;
    }
  }
  
  /**
   * Send a time limit notification
   */
  async sendTimeLimitAlert(
    parentEmail: string,
    childId: number,
    childName: string,
    appName: string
  ): Promise<boolean> {
    const message = `${childName} has reached their time limit for ${appName}.`;
    return this.sendAlert(parentEmail, childId, childName, message);
  }
  
  /**
   * Send a restricted content notification
   */
  async sendRestrictedContentAlert(
    parentEmail: string,
    childId: number,
    childName: string,
    contentType: string
  ): Promise<boolean> {
    const message = `${childName} attempted to access restricted ${contentType} content.`;
    return this.sendAlert(parentEmail, childId, childName, message);
  }
} 