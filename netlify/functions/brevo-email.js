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
  const params = {
    to: [{ email, name: userName || email.split('@')[0] }],
    templateId: BREVO_TEMPLATE_ID,
    params: {
      RESET_URL: resetUrl,
      USER_NAME: userName || email.split('@')[0],
      EMAIL: email,
    },
    headers: {
      'X-UGT-Email-Type': 'password-reset',
    },
  };

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

export {
  sendBrevoEmail,
  sendPasswordResetEmail,
  sendPasswordResetConfirmationEmail,
  testBrevoConnection,
  BREVO_API_URL,
  BREVO_TEMPLATE_ID,
  BREVO_SENDER_EMAIL,
  BREVO_SENDER_NAME,
};
