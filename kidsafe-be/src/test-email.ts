/**
 * Test script for email service
 * This script will test sending OTP and alert emails
 * 
 * Usage:
 * Set environment variables MAILJET_API_KEY, MAILJET_API_SECRET, and EMAIL_FROM
 * Then run: npx ts-node src/test-email.ts
 */

// Using require instead of import for node-mailjet
const Mailjet = require('node-mailjet');

async function main() {
  console.log('=== KidSafe Email Service Test ===');
  
  const apiKey = process.env.MAILJET_API_KEY;
  const apiSecret = process.env.MAILJET_API_SECRET;
  const fromEmail = process.env.EMAIL_FROM || 'noreply@kidsafe.com';
  const testEmail = process.env.TEST_EMAIL;
  
  if (!apiKey || !apiSecret) {
    console.error('Error: MAILJET_API_KEY and MAILJET_API_SECRET must be set');
    return;
  }
  
  if (!testEmail) {
    console.error('Error: TEST_EMAIL must be set to the email address for testing');
    return;
  }
  
  console.log(`Using API Key: ${apiKey.substring(0, 4)}...`);
  console.log(`Using Email From: ${fromEmail}`);
  console.log(`Will send test emails to: ${testEmail}`);
  
  try {
    // Initialize Mailjet
    const mailjet = Mailjet.apiConnect(apiKey, apiSecret);
    
    // Test OTP email
    console.log('\nSending test OTP email...');
    const otp = '123456';
    
    const otpResponse = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: 'KidSafe'
          },
          To: [
            {
              Email: testEmail
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
    });
    
    console.log('OTP email sent successfully:', otpResponse.response.status === 200);
    
    // Test alert email
    console.log('\nSending test alert email...');
    const childName = 'Test Child';
    const message = 'This is a test alert for suspicious activity detected.';
    
    const alertResponse = await mailjet.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: fromEmail,
            Name: 'KidSafe'
          },
          To: [
            {
              Email: testEmail
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
    
    console.log('Alert email sent successfully:', alertResponse.response.status === 200);
    
    console.log('\nEmail tests completed!');
  } catch (error) {
    console.error('Error testing email service:', error);
  }
}

main(); 