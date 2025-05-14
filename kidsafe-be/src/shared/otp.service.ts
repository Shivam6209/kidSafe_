import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';

interface OTPRecord {
  otp: string;
  expires: Date;
  verified: boolean;
}

@Injectable()
export class OtpService {
  private otpStore: Map<string, OTPRecord> = new Map();
  
  constructor(private readonly emailService: EmailService) {}

  /**
   * Generate a new OTP for the given email
   */
  generateOTP(email: string): string {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store the OTP with 10 minute expiration
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10);
    
    this.otpStore.set(email, {
      otp,
      expires,
      verified: false,
    });
    
    return otp;
  }

  /**
   * Verify an OTP for the given email
   */
  verifyOTP(email: string, otp: string): boolean {
    const record = this.otpStore.get(email);
    
    // Check if OTP exists
    if (!record) {
      return false;
    }
    
    // Check if OTP has expired
    if (record.expires < new Date()) {
      this.otpStore.delete(email);
      return false;
    }
    
    // Check if OTP matches
    if (record.otp !== otp) {
      return false;
    }
    
    // Mark as verified
    record.verified = true;
    this.otpStore.set(email, record);
    
    return true;
  }

  /**
   * Check if email has been verified with OTP
   */
  isVerified(email: string): boolean {
    const record = this.otpStore.get(email);
    return !!record && record.verified;
  }

  /**
   * Send OTP to the provided email
   */
  async sendOTP(email: string): Promise<boolean> {
    const otp = this.generateOTP(email);
    return await this.emailService.sendOTP(email, otp);
  }

  /**
   * Remove verification status for an email
   */
  clearVerification(email: string): void {
    this.otpStore.delete(email);
  }
} 