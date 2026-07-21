/**
 * Security utilities for input validation, sanitization, and protection
 */

// XSS prevention - escape HTML special characters
export function escapeHtml(unsafe: string): string {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

// SQL injection prevention (for client-side logging only, server handles DB)
export function sanitizeForLogging(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[\n\r]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 1000); // Limit length
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim().toLowerCase());
}

// Phone validation (international format support)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
  return phoneRegex.test(phone.trim()) && phone.replace(/\D/g, '').length >= 10;
}

// Universal ID validation
export function isValidUniversalId(uid: string): boolean {
  // Format: UGT-XXXXXXXX (8 alphanumeric characters after prefix)
  const uidRegex = /^UGT-[A-Z0-9]{8}$/i;
  return uidRegex.test(uid.trim());
}

// Password strength checker
export interface PasswordStrength {
  score: number; // 0-5
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  color: string;
  feedback: string[];
}

export function checkPasswordStrength(password: string): PasswordStrength {
  const feedback: string[] = [];
  let score = 0;

  if (password.length === 0) {
    return { score: 0, label: 'Very Weak', color: 'text-red-500', feedback: ['Password is required'] };
  }

  // Length checks
  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters');

  if (password.length >= 12) score++;

  // Character type checks
  if (/[a-z]/.test(password)) score++;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Add uppercase letters');

  if (/[0-9]/.test(password)) score++;
  else feedback.push('Add numbers');

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  else feedback.push('Add special characters');

  // Cap score at 5
  score = Math.min(score, 5);

  const labels: PasswordStrength['label'][] = ['Very Weak', 'Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['text-red-500', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500'];

  return {
    score,
    label: labels[score],
    color: colors[score],
    feedback: feedback.slice(0, 3), // Limit feedback
  };
}

// Validate password meets requirements
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one special character' };
  }
  return { valid: true };
}

// Generate secure random token
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash sensitive data for logging (one-way)
export async function hashForLogging(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Content Security Policy headers
export const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https: blob:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://ugtglobal.space",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ');

// Security headers object
export const SECURITY_HEADERS = {
  'Content-Security-Policy': CSP_HEADER,
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

// Rate limit configuration
export const RATE_LIMITS = {
  login: { windowMs: 15 * 60 * 1000, maxRequests: 5 }, // 5 attempts per 15 min
  passwordReset: { windowMs: 60 * 60 * 1000, maxRequests: 3 }, // 3 per hour
  registration: { windowMs: 60 * 60 * 1000, maxRequests: 5 }, // 5 per hour
  otpRequest: { windowMs: 5 * 60 * 1000, maxRequests: 3 }, // 3 OTP requests per 5 min
  apiRequest: { windowMs: 60 * 1000, maxRequests: 100 }, // 100 API calls per min
};

// Account lockout configuration
export const ACCOUNT_LOCKOUT = {
  maxFailedAttempts: 5,
  lockoutDurationMs: 30 * 60 * 1000, // 30 minutes
  warningThreshold: 3, // Warn after 3 failed attempts
};

// Session configuration
export const SESSION_CONFIG = {
  refreshThresholdMs: 5 * 60 * 1000, // Refresh token 5 min before expiry
  maxSessionAgeMs: 7 * 24 * 60 * 60 * 1000, // 7 days max session
  rememberMeMaxAgeMs: 30 * 24 * 60 * 60 * 1000, // 30 days with remember me
};

// Token expiration times
export const TOKEN_EXPIRY = {
  passwordReset: 60 * 60 * 1000, // 1 hour
  emailVerification: 24 * 60 * 60 * 1000, // 24 hours
  magicLink: 15 * 60 * 1000, // 15 minutes
  otp: 5 * 60 * 1000, // 5 minutes
};