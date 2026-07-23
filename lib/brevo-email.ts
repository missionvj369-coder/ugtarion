/**
 * Brevo (Sendinblue) Transactional Email Service
 * 
 * Sends transactional emails using Brevo API v3
 * Template ID 1 contains a dynamic button linked to {{ params.RESET_URL }}
 */

import { createClient } from '@supabase/supabase-js';

// Brevo API Configuration
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_TEMPLATE_ID = parseInt(process.env.BREVO_TEMPLATE_ID || '1', 10);
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'soulconnect@ugtglobal.space';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Universal Guard Trust';

interface BrevoEmailParams {
  to: { email: string; name?: string }[];
  templateId: number;
  params: Record<string, string>;
  headers?: Record<string, string>;
}

interface BrevoResponse {
  messageId: string;
}

/**
 * Send a transactional email using Brevo API v3
 * @param params - Email parameters including template ID and dynamic params
 * @returns Promise resolving to Brevo response with messageId
 */
export async function sendBrevoEmail(params: BrevoEmailParams): Promise<BrevoResponse> {
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
 * @param email - Recipient email address
 * @param resetUrl - Full reset URL with token (e.g., https://app.domain.com/reset-password?token=xxx)
 * @param userName - Optional user name for personalization
 * @returns Promise resolving to Brevo response
 */
export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  userName?: string
): Promise<BrevoResponse> {
  const params: BrevoEmailParams = {
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
 * @param email - Recipient email address
 * @param userName - Optional user name for personalization
 * @returns Promise resolving to Brevo response
 */
export async function sendPasswordResetConfirmationEmail(
  email: string,
  userName?: string
): Promise<BrevoResponse> {
  // You can create a separate template for confirmation or reuse with different params
  // For now, we'll use a simple confirmation template approach
  const params: BrevoEmailParams = {
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
 * @returns Promise resolving to boolean indicating if API is accessible
 */
export async function testBrevoConnection(): Promise<boolean> {
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

export { BREVO_API_URL, BREVO_TEMPLATE_ID, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME };