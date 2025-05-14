# Email Service Documentation

This document outlines how to use the email service in the KidSafe application, which is implemented using Mailjet.

## Setup

1. Create a Mailjet account at [https://www.mailjet.com/](https://www.mailjet.com/)
2. Obtain your API keys from the Mailjet dashboard
3. Configure your environment variables:

```
MAILJET_API_KEY=your_mailjet_api_key
MAILJET_API_SECRET=your_mailjet_api_secret
EMAIL_FROM=noreply@yourdomain.com
```

For development, you can set `EMAIL_PREVIEW=true` to log emails to the console instead of actually sending them.

## Usage

The email service provides two main methods:

### 1. Sending OTPs

```typescript
// Inject the service
constructor(private readonly emailService: EmailService) {}

// Send an OTP
await this.emailService.sendOTP('user@example.com', '123456');
```

### 2. Sending Alerts

```typescript
// Inject the service
constructor(private readonly emailService: EmailService) {}

// Send an alert
await this.emailService.sendAlert(
  'parent@example.com',
  'Child Name',
  'Alert message about the child activity'
);
```

## Implementation Notes

- The service uses Mailjet v3.1 API
- HTML templates are included for both OTP and alert emails
- Error handling is implemented with appropriate logging
- Development mode includes console logging instead of actual sending

## Testing

You can test the email service using the provided test script:

```bash
# Set environment variables first
export MAILJET_API_KEY=your_api_key
export MAILJET_API_SECRET=your_api_secret
export EMAIL_FROM=your_from_email

# Run the test script
npm run test:email
``` 