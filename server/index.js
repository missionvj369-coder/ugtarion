import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import { SignJWT, jwtVerify, importPKCS8, importSPKI, generateKeyPair, exportPKCS8, exportSPKI } from 'jose';
import { randomBytes, createHash } from 'crypto';

// Import shared API core
import {
  handleGetCount,
  handleGetProfile,
  handleRegister,
  handleLogin,
  createSupabaseAdmin,
} from '../lib/api-core.ts';

// Brevo Email Configuration
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_TEMPLATE_ID = parseInt(process.env.BREVO_TEMPLATE_ID || '1', 10);
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@yourdomain.com';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Universal Guard Trust';

/**
 * @typedef {Object} BrevoEmailParams
 * @property {{email: string, name?: string}[]} to
 * @property {number} templateId
 * @property {Record<string, string>} params
 * @property {Record<string, string>} [headers]
 */

/**
 * @typedef {Object} BrevoResponse
 * @property {string} messageId
 */

/**
 * Send a transactional email using Brevo API v3
 * @param {BrevoEmailParams} params
 * @returns {Promise<BrevoResponse>}
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
 * @returns {Promise<BrevoResponse>}
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
 * @returns {Promise<BrevoResponse>}
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

// Load server-only environment first, then fallback to local if missing.
dotenv.config({ path: '.env.server' });
dotenv.config({ path: '.env.local' });

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 4000;
const ALLOWED_ORIGIN = process.env.DEV_ORIGIN || 'http://localhost:4174';

// Auth Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const AUTH_DOMAIN = process.env.AUTH_DOMAIN || 'auth.ugt.org';
const PLATFORM_CLIENT_ID = process.env.PLATFORM_CLIENT_ID || 'ugt_portal_client';
const PLATFORM_CLIENT_SECRET = process.env.PLATFORM_CLIENT_SECRET || 'ugt_portal_secret_change_in_production';
const PLATFORM_REDIRECT_URI = process.env.PLATFORM_REDIRECT_URI || 'https://universal-guard-trust.netlify.app/auth/callback';

// Create Supabase admin client
const supabase = createSupabaseAdmin();

const app = express();
app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10kb' }));

// Basic rate limiting for public endpoints
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ============================================
// Crypto Utilities
// ============================================

let keyPairCache = null;

async function getOrCreateKeyPair() {
  if (keyPairCache) return keyPairCache;

  // Try to get active key from database
  const { data: keyData, error } = await supabase
    .from('jwt_keys')
    .select('kid, private_key_pem, public_key_pem')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!error && keyData) {
    try {
      const privateKey = await importPKCS8(keyData.private_key_pem, 'RS256');
      const publicKey = await importSPKI(keyData.public_key_pem, 'RS256');
      keyPairCache = { privateKey, publicKey, kid: keyData.kid };
      return keyPairCache;
    } catch (e) {
      console.warn('Failed to import stored keys, generating new pair:', e);
    }
  }

  // Generate new key pair
  const { publicKey, privateKey } = await generateKeyPair('RSA', { modulusLength: 2048 });
  const privateKeyPem = await exportPKCS8(privateKey);
  const publicKeyPem = await exportSPKI(publicKey);
  const kid = `ugt-${Date.now()}`;

  // Store in database (best effort)
  try {
    await supabase.from('jwt_keys').insert({
      kid,
      private_key_pem: privateKeyPem,
      public_key_pem: publicKeyPem,
      algorithm: 'RS256',
      is_active: true,
    });
  } catch (e) {
    console.warn('Failed to store new key pair:', e);
  }

  keyPairCache = { privateKey, publicKey, kid };
  return keyPairCache;
}

async function getPublicKey(kid) {
  const { data } = await supabase
    .from('jwt_keys')
    .select('public_key_pem')
    .eq('kid', kid)
    .eq('is_active', true)
    .single();

  if (!data) return null;
  return importSPKI(data.public_key_pem, 'RS256');
}

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function generateSecureToken(length = 32) {
  return randomBytes(length).toString('base64url');
}

// ============================================
// JWT Operations
// ============================================

async function signAccessToken(payload, expiresInSeconds = 3600) {
  const { privateKey, kid } = await getOrCreateKeyPair();
  const now = Math.floor(Date.now() / 1000);
  const jti = randomBytes(16).toString('hex');
  const exp = now + expiresInSeconds;

  const token = await new SignJWT({
    ...payload,
    iat: now,
    exp,
    jti,
    iss: `https://${new URL(SUPABASE_URL).hostname}`,
    aud: payload.client_id,
  })
    .setProtectedHeader({ alg: 'RS256', kid, typ: 'JWT' })
    .sign(privateKey);

  return { token, jti, exp };
}

async function verifyAccessToken(token) {
  try {
    const [header] = token.split('.');
    const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString());
    const kid = decodedHeader.kid;

    if (!kid) return null;

    const publicKey = await getPublicKey(kid);
    if (!publicKey) return null;

    const { payload } = await jwtVerify(token, publicKey, {
      issuer: `https://${new URL(SUPABASE_URL).hostname}`,
      audience: decodedHeader.aud || undefined,
    });

    return payload;
  } catch (e) {
    console.warn('JWT verification failed:', e);
    return null;
  }
}

// ============================================
// Database Operations
// ============================================

async function createQRVerificationToken(universalId, options = {}) {
  const { data, error } = await supabase.rpc('create_qr_verification_token', {
    p_universal_id: universalId,
    p_platform_id: options.platformId || null,
    p_redirect_uri: options.redirectUri || null,
    p_scope: options.scope || ['profile', 'email', 'rankings'],
    p_expires_in_seconds: options.expiresInSeconds || 300,
  });

  if (error) throw new Error(`Failed to create QR token: ${error.message}`);
  return data[0];
}

async function consumeQRVerificationToken(token) {
  const { data, error } = await supabase.rpc('consume_qr_verification_token', {
    p_token: token,
  });

  if (error) throw new Error(`Invalid QR token: ${error.message}`);
  return data[0];
}

async function createAuthSession(userId, platformId, options = {}) {
  const { data, error } = await supabase.rpc('create_auth_session', {
    p_user_id: userId,
    p_platform_id: platformId,
    p_scope: options.scope || ['profile', 'email', 'rankings'],
    p_expires_in_seconds: options.expiresInSeconds || 3600,
    p_refresh_expires_in_seconds: options.refreshExpiresInSeconds || 2592000,
    p_user_agent: options.userAgent || null,
    p_ip_address: options.ipAddress || null,
  });

  if (error) throw new Error(`Failed to create session: ${error.message}`);

  const session = data[0];
  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: options.expiresInSeconds || 3600,
    refresh_expires_in: options.refreshExpiresInSeconds || 2592000,
    token_type: 'Bearer',
    scope: (options.scope || ['profile', 'email', 'rankings']).join(' '),
  };
}

async function refreshAuthSession(refreshToken, platformId, expiresInSeconds = 3600) {
  const { data, error } = await supabase.rpc('refresh_auth_session', {
    p_refresh_token: refreshToken,
    p_platform_id: platformId,
    p_expires_in_seconds: expiresInSeconds,
  });

  if (error) throw new Error(`Token refresh failed: ${error.message}`);
  return {
    access_token: data[0].access_token,
    expires_in: expiresInSeconds,
    scope: data[0].scope,
  };
}

async function revokeAllUserSessions(userId) {
  const { error } = await supabase.rpc('revoke_all_user_sessions', {
    p_user_id: userId,
  });
  if (error) throw new Error(`Failed to revoke sessions: ${error.message}`);
}

async function validateAccessToken(accessToken) {
  const { data, error } = await supabase.rpc('validate_access_token', {
    p_access_token: accessToken,
  });

  if (error || !data || data.length === 0) return null;
  return data[0];
}

async function getPlatformByClientId(clientId) {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data;
}

async function getPlatformById(platformId) {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('id', platformId)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data;
}

async function verifyPlatformSecret(clientId, clientSecret) {
  const platform = await getPlatformByClientId(clientId);
  if (!platform) return null;

  const { data: hashMatch } = await supabase.rpc('verify_token_hash', {
    token: clientSecret,
    hash: platform.client_secret_hash,
  });

  if (!hashMatch) return null;
  return platform;
}

async function buildUserInfo(universalId, platformId, scope) {
  const { data: profile, error } = await supabase.rpc('login_user_atomic', {
    p_identifier: universalId,
  });

  if (error || !profile || profile.length === 0) {
    throw new Error('User not found');
  }

  const p = profile[0];
  const userInfo = {
    sub: p.universal_id,
    universal_id: p.universal_id,
    name: p.name,
    email: p.email,
    phone: p.phone,
    rankings: {
      universe: Number(p.universe_rank),
      nation: Number(p.nation_rank),
      state: Number(p.state_rank),
      district: Number(p.district_rank),
      city: Number(p.city_rank),
      pincode: Number(p.pincode_rank),
    },
    registered_at: p.created_at,
    platform_id: platformId,
    scope,
  };

  // Filter based on scope
  if (!scope.includes('email')) delete userInfo.email;
  if (!scope.includes('phone')) delete userInfo.phone;
  if (!scope.includes('rankings')) delete userInfo.rankings;

  return userInfo;
}

// ============================================
// CORS Headers Helper
// ============================================

function corsHeaders(origin) {
  const allowedOrigins = [
    'https://universal-guard-trust.netlify.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ];
  
  const allowOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
  
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  };
}

// ============================================
// Auth Endpoints
// ============================================

// OAuth Authorization Endpoint
app.get('/auth/authorize', async (req, res) => {
  const { client_id, redirect_uri, scope, response_type, state, code_challenge, code_challenge_method, prompt, qr_token } = req.query;

  // Validate required parameters
  if (!client_id || !redirect_uri || response_type !== 'code') {
    return res.status(400).json({ error: 'invalid_request', error_description: 'Missing required parameters' });
  }

  // Validate platform
  const platform = await getPlatformByClientId(client_id);
  if (!platform) {
    return res.status(400).json({ error: 'unauthorized_client', error_description: 'Invalid client_id' });
  }

  // Validate redirect_uri
  if (!platform.redirect_uris.includes(redirect_uri)) {
    return res.status(400).json({ error: 'invalid_request', error_description: 'Invalid redirect_uri' });
  }

  // Validate scope
  const requestedScopes = (scope || 'profile email rankings').split(' ');
  const allowedScopes = platform.scopes || ['profile', 'email', 'rankings'];
  const invalidScopes = requestedScopes.filter(s => !allowedScopes.includes(s));
  if (invalidScopes.length > 0) {
    return res.status(400).json({ error: 'invalid_scope', error_description: `Invalid scopes: ${invalidScopes.join(', ')}` });
  }

  // For trusted platforms, auto-approve (skip consent)
  if (!platform.is_trusted && prompt !== 'none') {
    // In production, render consent page HTML
    console.log('Consent required for platform:', platform.slug);
  }

  // Generate authorization code
  const code = generateSecureToken(32);
  const codeHash = hashToken(code);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Get user from session (simplified - in production, check auth cookie/session)
  // For QR flow, we'll get user from QR token
  let userId = null;
  let universalId = null;

  if (qr_token) {
    try {
      const qrData = await consumeQRVerificationToken(qr_token);
      universalId = qrData.universal_id;
      
      // Get user ID from universal_id
      const { data: profile } = await supabase.rpc('login_user_atomic', {
        p_identifier: universalId,
      });
      if (profile && profile.length > 0) {
        userId = profile[0].id;
      }
    } catch (e) {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Invalid QR token' });
    }
  }

  if (!userId) {
    // No user session - redirect to login
    const loginUrl = new URL(`https://${AUTH_DOMAIN}/login`);
    loginUrl.searchParams.set('client_id', client_id);
    loginUrl.searchParams.set('redirect_uri', redirect_uri);
    loginUrl.searchParams.set('scope', scope || 'profile email rankings');
    if (state) loginUrl.searchParams.set('state', state);
    if (code_challenge) loginUrl.searchParams.set('code_challenge', code_challenge);
    if (code_challenge_method) loginUrl.searchParams.set('code_challenge_method', code_challenge_method);
    
    return res.redirect(loginUrl.toString());
  }

  // Store authorization code
  await supabase.from('auth_codes').insert({
    code_hash: codeHash,
    platform_id: platform.id,
    user_id: userId,
    redirect_uri,
    scope: requestedScopes,
    code_challenge: code_challenge || null,
    code_challenge_method: code_challenge_method || null,
    expires_at: expiresAt.toISOString(),
  });

  // Redirect back to platform with code
  const redirectUrl = new URL(redirect_uri);
  redirectUrl.searchParams.set('code', code);
  if (state) redirectUrl.searchParams.set('state', state);

  res.redirect(redirectUrl.toString());
});

// Token Endpoint
app.post('/auth/token', async (req, res) => {
  const { grant_type, code, redirect_uri, client_id, client_secret, refresh_token, scope } = req.body;

  // Client authentication
  let platform;
  if (client_id && client_secret) {
    platform = await verifyPlatformSecret(client_id, client_secret);
  } else if (req.headers.authorization) {
    const auth = req.headers.authorization;
    if (auth.startsWith('Basic ')) {
      const credentials = Buffer.from(auth.slice(6), 'base64').toString().split(':');
      platform = await verifyPlatformSecret(credentials[0], credentials[1]);
    }
  }

  if (!platform) {
    return res.status(401).json({ error: 'invalid_client', error_description: 'Invalid client credentials' });
  }

  if (grant_type === 'authorization_code') {
    // Exchange authorization code for tokens
    if (!code || !redirect_uri) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'Missing code or redirect_uri' });
    }

    const codeHash = hashToken(code);
    const { data: authCode, error: codeError } = await supabase
      .from('auth_codes')
      .select('*')
      .eq('code_hash', codeHash)
      .eq('platform_id', platform.id)
      .gt('expires_at', new Date().toISOString())
      .is('used_at', null)
      .single();

    if (codeError || !authCode) {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Invalid or expired authorization code' });
    }

    if (authCode.redirect_uri !== redirect_uri) {
      return res.status(400).json({ error: 'invalid_grant', error_description: 'Redirect URI mismatch' });
    }

    // Verify PKCE if used
    if (authCode.code_challenge && authCode.code_challenge_method === 'S256') {
      if (!req.body.code_verifier) {
        return res.status(400).json({ error: 'invalid_grant', error_description: 'PKCE code_verifier required' });
      }
      const challenge = createHash('sha256').update(req.body.code_verifier).digest('base64url');
      if (challenge !== authCode.code_challenge) {
        return res.status(400).json({ error: 'invalid_grant', error_description: 'Invalid PKCE code_verifier' });
      }
    }

    // Mark code as used
    await supabase
      .from('auth_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', authCode.id);

    // Create auth session
    const tokens = await createAuthSession(authCode.user_id, platform.id, {
      scope: authCode.scope,
      userAgent: req.headers['user-agent'],
      ipAddress: req.headers['x-forwarded-for'] || req.headers['x-real-ip'],
    });

    return res.json(tokens);
  }

  if (grant_type === 'refresh_token') {
    // Refresh access token
    if (!refresh_token) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'Missing refresh_token' });
    }

    try {
      const tokens = await refreshAuthSession(refresh_token, platform.id);
      return res.json({
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
        token_type: 'Bearer',
        scope: tokens.scope.join(' '),
      });
    } catch (e) {
      return res.status(400).json({ error: 'invalid_grant', error_description: e.message });
    }
  }

  res.status(400).json({ error: 'unsupported_grant_type', error_description: 'Grant type not supported' });
});

// UserInfo Endpoint
app.get('/auth/userinfo', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'invalid_token', error_description: 'Missing or invalid Authorization header' });
  }

  const accessToken = authHeader.slice(7);
  const validation = await validateAccessToken(accessToken);

  if (!validation) {
    return res.status(401).json({ error: 'invalid_token', error_description: 'Token expired or revoked' });
  }

  // Verify token signature
  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    return res.status(401).json({ error: 'invalid_token', error_description: 'Token signature verification failed' });
  }

  // Build user info
  const userInfo = await buildUserInfo(payload.uid, validation.platform_id, validation.scope);
  res.json(userInfo);
});

// Platform Registration
app.post('/auth/register-platform', async (req, res) => {
  const { name, slug, display_name, description, logo_url, website_url, redirect_uris, allowed_origins, scopes } = req.body;

  // Validate required fields
  if (!name || !slug || !display_name || !website_url || !redirect_uris || !Array.isArray(redirect_uris) || redirect_uris.length === 0) {
    return res.status(400).json({ error: 'invalid_request', error_description: 'Missing required fields' });
  }

  // Generate client credentials
  const clientId = `${slug}_${generateSecureToken(8)}`;
  const clientSecret = generateSecureToken(32);
  const clientSecretHash = hashToken(clientSecret);

  const { data, error } = await supabase
    .from('platforms')
    .insert({
      name,
      slug,
      display_name,
      description,
      logo_url,
      website_url,
      redirect_uris,
      allowed_origins: allowed_origins || [],
      client_id: clientId,
      client_secret_hash: clientSecretHash,
      is_active: true,
      is_trusted: false,
      scopes: scopes || ['profile', 'email', 'rankings'],
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'conflict', error_description: 'Platform slug already exists' });
    }
    return res.status(500).json({ error: 'server_error', error_description: error.message });
  }

  res.status(201).json({
    platform: {
      id: data.id,
      name: data.name,
      slug: data.slug,
      display_name: data.display_name,
      client_id: data.client_id,
    },
    client_secret: clientSecret, // Only returned once!
  });
});

// QR Verification with Token Issuance
app.get('/auth/verify/:token', async (req, res) => {
  const { token } = req.params;
  const redirectUri = req.query.redirect_uri;

  try {
    const qrData = await consumeQRVerificationToken(token);
    const { universal_id, platform_id, redirect_uri: qrRedirectUri, scope } = qrData;

    // Get user profile
    const { data: profile } = await supabase.rpc('login_user_atomic', {
      p_identifier: universal_id,
    });

    if (!profile || profile.length === 0) {
      return res.status(404).json({ error: 'not_found', error_description: 'User not found' });
    }

    const user = profile[0];
    const targetPlatformId = platform_id || (await getPlatformByClientId(PLATFORM_CLIENT_ID))?.id;
    const finalRedirectUri = redirectUri || qrRedirectUri || PLATFORM_REDIRECT_URI;

    // Create auth session for the target platform
    const tokens = await createAuthSession(user.id, targetPlatformId, {
      scope,
      userAgent: req.headers['user-agent'],
      ipAddress: req.headers['x-forwarded-for'] || req.headers['x-real-ip'],
    });

    // Build redirect URL with tokens
    const redirectUrl = new URL(finalRedirectUri);
    redirectUrl.searchParams.set('access_token', tokens.access_token);
    redirectUrl.searchParams.set('refresh_token', tokens.refresh_token);
    redirectUrl.searchParams.set('expires_in', tokens.expires_in.toString());
    redirectUrl.searchParams.set('token_type', tokens.token_type);
    redirectUrl.searchParams.set('scope', tokens.scope);
    redirectUrl.searchParams.set('universal_id', universal_id);

    res.redirect(redirectUrl.toString());
  } catch (e) {
    res.status(400).json({ error: 'invalid_token', error_description: e.message });
  }
});

// Token Refresh
app.post('/auth/refresh', async (req, res) => {
  const { refresh_token, client_id, client_secret } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ error: 'invalid_request', error_description: 'Missing refresh_token' });
  }

  // Authenticate client
  let platform;
  if (client_id && client_secret) {
    platform = await verifyPlatformSecret(client_id, client_secret);
  }

  if (!platform) {
    return res.status(401).json({ error: 'invalid_client', error_description: 'Invalid client credentials' });
  }

  try {
    const tokens = await refreshAuthSession(refresh_token, platform.id);
    res.json({
      access_token: tokens.access_token,
      expires_in: tokens.expires_in,
      token_type: 'Bearer',
      scope: tokens.scope.join(' '),
    });
  } catch (e) {
    res.status(400).json({ error: 'invalid_grant', error_description: e.message });
  }
});

// Token Revocation
app.post('/auth/revoke', async (req, res) => {
  const { token, token_type_hint, client_id, client_secret } = req.body;

  // Authenticate client
  let platform;
  if (client_id && client_secret) {
    platform = await verifyPlatformSecret(client_id, client_secret);
  }

  if (!platform) {
    return res.status(401).json({ error: 'invalid_client', error_description: 'Invalid client credentials' });
  }

  // In a full implementation, revoke the specific token
  // For now, return success (RFC 7009 says to always return 200)
  res.json({});
});

// JWKS Endpoint
app.get('/auth/jwks', async (req, res) => {
  // Get all active public keys
  const { data: keys } = await supabase
    .from('jwt_keys')
    .select('kid, public_key_pem')
    .eq('is_active', true);

  const jwks = { keys: [] };

  for (const key of keys || []) {
    try {
      const publicKey = await importSPKI(key.public_key_pem, 'RS256');
      const exported = await exportSPKI(publicKey);
      // Parse PEM to get modulus and exponent for JWK
      // Simplified - in production, use proper JWK export
      jwks.keys.push({
        kty: 'RSA',
        use: 'sig',
        kid: key.kid,
        alg: 'RS256',
        // n and e would be extracted from the key
      });
    } catch (e) {
      console.warn('Failed to export key for JWKS:', e);
    }
  }

  res.set('Cache-Control', 'public, max-age=3600');
  res.json(jwks);
});

// ============================================
// Password Reset Endpoints
// ============================================

// Password Reset Request - POST /auth/password/reset-request
app.post('/auth/password/reset-request', async (req, res) => {
  try {
    const { email, redirect_url } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'Email is required' });
    }

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();

    // Check if user exists (but don't reveal if they don't for security)
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, universal_id, full_name, email')
      .eq('email', normalizedEmail)
      .single();

    // Always return success for security (don't reveal if email exists)
    // But only send email if user exists
    if (profile) {
      // Generate reset token (32 bytes = 64 hex chars)
      const resetToken = randomBytes(32).toString('hex');
      const tokenHash = createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour expiry

      // Store reset token in database
      const { error: tokenError } = await supabase
        .from('password_reset_tokens')
        .insert({
          user_id: profile.id,
          token_hash: tokenHash,
          expires_at: expiresAt,
        });

      if (tokenError) {
        console.error('Failed to store reset token:', tokenError);
        // Don't reveal the error to the user
      } else {
        // Build reset URL
        const baseUrl = redirect_url || process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        // Send password reset email via Brevo
        try {
          await sendPasswordResetEmail(normalizedEmail, resetUrl, profile.full_name);
          console.log(`Password reset email sent to ${normalizedEmail}`);
        } catch (emailError) {
          console.error('Failed to send password reset email:', emailError);
          // Don't reveal email failure to user
        }
      }
    }

    // Always return success for security (don't reveal if email exists)
    res.json({ 
      success: true, 
      message: 'If an account with that email exists, a password reset link has been sent.' 
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'server_error', error_description: 'Failed to process password reset request' });
  }
});

// Password Reset Confirm - POST /auth/password/reset-confirm
app.post('/auth/password/reset-confirm', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ error: 'invalid_request', error_description: 'Token and new password are required' });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({ error: 'weak_password', error_description: 'Password must be at least 8 characters long' });
    }

    // Hash the provided token to look up in database
    const tokenHash = createHash('sha256').update(token).digest('hex');

    // Find valid reset token
    const { data: resetToken, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('id, user_id, expires_at, used')
      .eq('token_hash', tokenHash)
      .single();

    if (tokenError || !resetToken) {
      return res.status(400).json({ error: 'invalid_token', error_description: 'Invalid or expired reset token' });
    }

    // Check if token is expired
    if (new Date(resetToken.expires_at) < new Date()) {
      return res.status(400).json({ error: 'token_expired', error_description: 'Reset token has expired' });
    }

    // Check if token already used
    if (resetToken.used) {
      return res.status(400).json({ error: 'token_used', error_description: 'Reset token has already been used' });
    }

    // Hash new password
    const passwordHash = await hashPassword(password);

    // Update user's password
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ password_hash: passwordHash })
      .eq('id', resetToken.user_id);

    if (updateError) {
      console.error('Failed to update password:', updateError);
      return res.status(500).json({ error: 'server_error', error_description: 'Failed to update password' });
    }

    // Mark token as used
    const { error: markError } = await supabase
      .from('password_reset_tokens')
      .update({ used: true })
      .eq('id', resetToken.id);

    if (markError) {
      console.error('Failed to mark token as used:', markError);
    }

    // Revoke all existing refresh tokens for this user (force re-login)
    const { error: revokeError } = await supabase
      .from('refresh_tokens')
      .update({ revoked: true })
      .eq('user_id', resetToken.user_id);

    if (revokeError) {
      console.error('Failed to revoke refresh tokens:', revokeError);
    }

    // Get user info for confirmation email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', resetToken.user_id)
      .single();

    // Send confirmation email
    if (profile) {
      try {
        await sendPasswordResetConfirmationEmail(profile.email, profile.full_name);
        console.log(`Password reset confirmation email sent to ${profile.email}`);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
      }
    }

    res.json({ 
      success: true, 
      message: 'Password has been successfully reset. Please log in with your new password.' 
    });
  } catch (error) {
    console.error('Password reset confirm error:', error);
    res.status(500).json({ error: 'server_error', error_description: 'Failed to reset password' });
  }
});

// ============================================
// Original API Routes
// ============================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/count
app.get('/api/count', async (req, res) => {
  const result = await handleGetCount(supabase);
  if (result.error) return res.status(500).json({ error: result.error });
  return res.json(result.data);
});

// GET /api/profile/:uid
app.get('/api/profile/:uid', async (req, res) => {
  const { uid } = req.params;
  const result = await handleGetProfile(supabase, uid);
  if (result.error) {
    const status = result.error === 'Profile not found.' ? 404 : 500;
    return res.status(status).json({ error: result.error });
  }
  return res.json(result.data);
});

// POST /api/register
app.post('/api/register', async (req, res) => {
  const result = await handleRegister(supabase, req.body);
  if (result.error) {
    const status = result.error.includes('already associated') || result.error.includes('phone number is already registered') ? 409 : 500;
    return res.status(status).json({ error: result.error, details: result.details });
  }
  return res.json(result.data);
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const result = await handleLogin(supabase, req.body);
  if (result.error) {
    const status = result.error.includes('not found') ? 404 : 500;
    return res.status(status).json({ error: result.error, details: result.details });
  }
  return res.json(result.data);
});

// SECURITY: Removed insecure /api/verify/:uid endpoint
// Verification now requires OAuth flow via /auth/callback
// This prevents random UGT number access

app.listen(PORT, () => {
  console.log(`Supabase API server running on http://localhost:${PORT}`);
  console.log(`Auth endpoints:`);
  console.log(`  GET  /auth/authorize`);
  console.log(`  POST /auth/token`);
  console.log(`  GET  /auth/userinfo`);
  console.log(`  POST /auth/register-platform`);
  console.log(`  GET  /auth/verify/:token`);
  console.log(`  POST /auth/refresh`);
  console.log(`  POST /auth/revoke`);
  console.log(`  GET  /auth/jwks`);
});