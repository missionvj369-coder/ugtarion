/**
 * Brevo (Sendinblue) Transactional Email Service - CommonJS for Netlify Functions
 * 
 * Sends transactional emails using Brevo API v3
 * Template ID 1 contains a dynamic button linked to {{ params.RESET_URL }}
 */

// Brevo API Configuration
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_TEMPLATE_ID = parseInt(process.env.BREVO_TEMPLATE_ID || '1', 10);
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@yourdomain.com';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Universal Guard Trust';

/**
 * Send a transactional email using Brevo API v3
 * @param {Object} params - Email parameters including template ID and dynamic params
 * @returns {Promise<Object>} Promise resolving to Brevo response with messageId
 */
async function sendBrevoEmail(params) {
  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY is not configured. Please set it in environment variables.');
  }

  const payload = {
    sender: {
      email: BREVO_SENDER_EMAIL,
      name: BREVO_SENDER_NAME,
    },
    to: params.to,
    templateId: params.templateId,
    params: params.params,
    headers: params.headers || {},
  };

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Brevo API error: ${response.status} ${response.statusText}`;
    throw new Error(`Failed to send email via Brevo: ${errorMessage}`);
  }

  return response.json();
}

/**
 * Send password reset email using Brevo template
 * @param {string} email - Recipient email address
 * @param {string} resetUrl - Full reset URL with token (e.g., https://app.domain.com/reset-password?token=xxx)
 * @param {string} [userName] - Optional user name for personalization
 * @returns {Promise<Object>} Promise resolving to Brevo response
 */
async function sendPasswordResetEmail(email, resetUrl, userName) {
  // Validate reset URL
  if (!resetUrl || !resetUrl.startsWith('http')) {
    throw new Error('Invalid reset URL provided');
  }

  const params = {
    to: [{ email, name: userName || email.split('@')[0] }],
    templateId: BREVO_TEMPLATE_ID,
    params: {
      RESET_URL: resetUrl,
      USER_NAME: userName || email.split('@')[0],
      EMAIL: email,
      // Additional params for the email body (in case template uses them)
      BUTTON_URL: resetUrl, // Alternative parameter name some templates use
      LINK: resetUrl, // Another common parameter name
    },
    headers: {
      'X-UGT-Email-Type': 'password-reset',
      'X-Reset-URL': resetUrl, // Debug header (remove in production)
    },
  };

  console.log('Sending password reset email with URL:', resetUrl);
  return sendBrevoEmail(params);
}

/**
 * Send password reset confirmation email (after successful reset)
 * @param {string} email - Recipient email address
 * @param {string} [userName] - Optional user name for personalization
 * @returns {Promise<Object>} Promise resolving to Brevo response
 */
async function sendPasswordResetConfirmationEmail(email, userName) {
  const params = {
    to: [{ email, name: userName || email.split('@')[0] }],
    templateId: BREVO_TEMPLATE_ID, // You may want a different template ID for confirmation
    params: {
      RESET_URL: '', // Not needed for confirmation
      USER_NAME: userName || email.split('@')[0],
      EMAIL: email,
      MESSAGE: 'Your password has been successfully reset. If you did not make this change, please contact support immediately.',
    },
    headers: {
      'X-UGT-Email-Type': 'password-reset-confirmation',
    },
  };

  return sendBrevoEmail(params);
}

/**
 * Test Brevo API connection
 * @returns {Promise<boolean>} Promise resolving to boolean indicating if API is accessible
 */
async function testBrevoConnection() {
  if (!BREVO_API_KEY) {
    return false;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/account', {
      method: 'GET',
      headers: {
        'api-key': BREVO_API_KEY,
        'Accept': 'application/json',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Send a fallback HTML email for password reset when Brevo template fails
 * This creates a complete HTML email with the reset link embedded
 * @param {string} email - Recipient email address
 * @param {string} resetUrl - Full reset URL with token
 * @param {string} [userName] - Optional user name for personalization
 * @returns {Promise<Object>} Promise resolving to Brevo response
 */
async function sendFallbackPasswordResetEmail(email, resetUrl, userName) {
  const name = userName || email.split('@')[0];
  const currentYear = new Date().getFullYear();
  
  // Create a beautiful HTML email template
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - Universal Guard Trust</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
    <!-- Header -->
    <tr>
      <td style="background: linear-gradient(135deg, #166534 0%, #15803d 100%); padding: 30px 40px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Universal Guard Trust</h1>
      </td>
    </tr>
    
    <!-- Content -->
    <tr>
      <td style="padding: 40px;">
        <h2 style="color: #18181b; margin: 0 0 20px 0; font-size: 22px;">Password Reset Request</h2>
        
        <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
          Hello ${name},
        </p>
        
        <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
          We received a request to reset your password. Click the button below to create a new password for your account.
        </p>
        
        <!-- Button -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
          <tr>
            <td style="text-align: center; padding: 0 0 30px 0;">
              <a href="${resetUrl}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; padding: 16px 32px; border-radius: 8px;">
                Reset Password
              </a>
            </td>
          </tr>
        </table>
        
        <!-- Alternative Link -->
        <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          Or copy and paste this link into your browser:
        </p>
        <p style="color: #16a34a; font-size: 13px; word-break: break-all; margin: 0 0 30px 0;">
          <a href="${resetUrl}" style="color: #16a34a; text-decoration: underline;">${resetUrl}</a>
        </p>
        
        <!-- Security Notice -->
        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; margin: 0 0 30px 0;">
          <p style="color: #92400e; font-size: 14px; line-height: 1.6; margin: 0;">
            <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>
        </div>
        
        <!-- Footer Info -->
        <p style="color: #71717a; font-size: 14px; line-height: 1.6; margin: 0;">
          This is an automated message from Universal Guard Trust. Please do not reply to this email.
        </p>
      </td>
    </tr>
    
    <!-- Footer -->
    <tr>
      <td style="background-color: #f4f4f5; padding: 24px 40px; text-align: center; border-top: 1px solid #e4e4e7;">
        <p style="color: #71717a; font-size: 12px; margin: 0 0 8px 0;">
          © ${currentYear} Universal Guard Trust. All rights reserved.
        </p>
        <p style="color: #a1a1aa; font-size: 12px; margin: 0;">
          Universal Guard Trust | Building Trust, One Identity at a Time
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textContent = `
Password Reset - Universal Guard Trust

Hello ${name},

We received a request to reset your password. Click the link below to create a new password for your account:

${resetUrl}

This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.

© ${currentYear} Universal Guard Trust
  `.trim();

  const payload = {
    sender: {
      email: BREVO_SENDER_EMAIL,
      name: BREVO_SENDER_NAME,
    },
    to: [{ email, name }],
    subject: 'Password Reset - Universal Guard Trust',
    htmlContent: htmlContent,
    textContent: textContent,
    headers: {
      'X-UGT-Email-Type': 'password-reset-fallback',
    },
  };

  console.log('Sending fallback password reset email to:', email);
  
  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': BREVO_API_KEY,
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `Brevo API error: ${response.status} ${response.statusText}`;
    throw new Error(`Failed to send fallback email via Brevo: ${errorMessage}`);
  }

  return response.json();
}

export {
  sendBrevoEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
  sendFallbackPasswordResetEmail,
  testBrevoConnection,
  BREVO_API_URL,
  BREVO_TEMPLATE_ID,
  BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME,
};
