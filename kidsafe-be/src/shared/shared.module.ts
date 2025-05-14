import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { OtpService } from './otp.service';
import { NotificationService } from './notification.service';

@Module({
  providers: [EmailService, OtpService, NotificationService],
  exports: [EmailService, OtpService, NotificationService],
})
export class SharedModule {} 