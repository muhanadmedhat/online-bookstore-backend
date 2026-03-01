const crypto = require('node:crypto');
const transporter = require('../config/mailer');

function generateVerificationCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  const bytes = crypto.randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

async function sendVerificationCode(email, code) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 0;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background-color: #40d877; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">ChapterOne Bookstore</h1>
        </div>
        <div style="padding: 30px; text-align: center;">
          <h2 style="color: #333333; margin-top: 0;">Verify Your Email Address</h2>
          <p style="color: #666666; font-size: 16px; line-height: 1.5;">
            Thank you for registering with ChapterOne! To complete your sign up and secure your account, please use the verification code below:
          </p>
          <div style="background-color: #f9f9f9; border: 2px dashed #40d877; border-radius: 8px; padding: 20px; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #40d877; letter-spacing: 5px;">${code}</span>
          </div>
          <p style="color: #999999; font-size: 14px; margin-bottom: 0;">
            This code will expire in 10 minutes. If you did not create an account, no further action is required.
          </p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; text-align: center; border-top: 1px solid #eeeeee;">
          <p style="color: #aaaaaa; font-size: 12px; margin: 0;">
            &copy; ${new Date().getFullYear()} ChapterOne Bookstore. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"ChapterOne Bookstore" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to ChapterOne! Verify your email',
    html: htmlContent
  });
}

module.exports = {generateVerificationCode, hashCode, sendVerificationCode};
