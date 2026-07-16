/**
 * JWT Signing Module for Universal ID Verification
 * Provides offline verification capability using RS256 (RSA + SHA-256)
 */

import { sign, verify as cryptoVerify, generateKeyPairSync } from 'crypto';

// JWT header for RS256
const JWT_HEADER = {
  alg: 'RS256',
  typ: 'JWT'
};

/**
 * Base64URL encoding (RFC 4648)
 */
function base64urlEncode(str: string | Buffer): string {
  return str.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Base64URL decoding
 */
function base64urlDecode(str: string): Buffer {
  // Add padding if needed
  const padding = str.length % 4;
  const base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    + (padding ? '='.repeat(4 - padding) : '');
  return Buffer.from(base64, 'base64');
}

/**
 * Create JWT payload for Universal ID
 */
export function createUniversalIdPayload(
  universalId: string,
  name: string,
  email: string,
  expiresInSeconds: number = 365 * 24 * 60 * 60 // 1 year default
): object {
  const now = Math.floor(Date.now() / 1000);
  return {
    iss: 'universal-guard-trust',
    sub: universalId,
    name: name,
    email: email,
    iat: now,
    exp: now + expiresInSeconds
  };
}

/**
 * Sign a JWT token using RSA private key
 */
export function signJwt(payload: object, privateKeyPem: string): string {
  // Encode header
  const headerEncoded = base64urlEncode(JSON.stringify(JWT_HEADER));
  
  // Encode payload
  const payloadEncoded = base64urlEncode(JSON.stringify(payload));
  
  // Create signature using crypto.sign
  const dataToSign = `${headerEncoded}.${payloadEncoded}`;
  const signatureBuffer = sign('RSA-SHA256', Buffer.from(dataToSign), {
    key: privateKeyPem,
    format: 'pem'
  });
  
  const signatureEncoded = base64urlEncode(signatureBuffer);
  
  return `${headerEncoded}.${payloadEncoded}.${signatureEncoded}`;
}

/**
 * Verify a JWT token using RSA public key
 */
export function verifyJwt(token: string, publicKeyPem: string): { valid: boolean; payload?: any; error?: string } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, error: 'Invalid token format' };
    }
    
    const [headerEncoded, payloadEncoded, signatureEncoded] = parts;
    
    // Decode and verify header
    const header = JSON.parse(base64urlDecode(headerEncoded).toString());
    if (header.alg !== 'RS256' || header.typ !== 'JWT') {
      return { valid: false, error: 'Invalid token header' };
    }
    
    // Decode payload
    const payload = JSON.parse(base64urlDecode(payloadEncoded).toString());
    
    // Verify signature
    const dataToVerify = `${headerEncoded}.${payloadEncoded}`;
    const signature = base64urlDecode(signatureEncoded);
    
    const isValid = cryptoVerify('RSA-SHA256', Buffer.from(dataToVerify), {
      key: publicKeyPem,
      format: 'pem'
    }, signature);
    
    if (!isValid) {
      return { valid: false, error: 'Invalid signature' };
    }
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return { valid: false, error: 'Token expired' };
    }
    
    return { valid: true, payload };
  } catch (error: any) {
    return { valid: false, error: error.message || 'Verification failed' };
  }
}

/**
 * Generate RSA key pair for signing/verification
 * Returns object with private and public keys in PEM format
 */
export function generateKeyPair(): { privateKey: string; publicKey: string } {
  const { publicKey, privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });
  
  return { privateKey, publicKey };
}

/**
 * Get private key from environment
 */
export function getPrivateKey(): string | null {
  return process.env.UNIVERSAL_ID_PRIVATE_KEY || null;
}

/**
 * Get public key from environment
 */
export function getPublicKey(): string | null {
  return process.env.UNIVERSAL_ID_PUBLIC_KEY || null;
}