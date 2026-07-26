/**
 * Universal Guard Trust - Netlify Functions Auth Endpoints
 * OAuth/OIDC Authorization Server for Cross-Platform UGT Login
 * 
 * Endpoints:
 * - GET  /.netlify/functions/auth/authorize       - OAuth Authorization Endpoint
 * - POST /.netlify/functions/auth/token           - Token Endpoint
 * - GET  /.netlify/functions/auth/userinfo        - UserInfo Endpoint
 * - POST /.netlify/functions/auth/register-platform - Platform Registration
 * - GET  /.netlify/functions/auth/verify/:token   - QR Verification with Token Issuance
 * - POST /.netlify/functions/auth/refresh         - Token Refresh
 * - POST /.netlify/functions/auth/revoke          - Token Revocation
 * - GET  /.netlify/functions/auth/jwks            - JWKS Endpoint
 */

import { createClient } from '@supabase/supabase-js';
import { SignJWT, jwtVerify, importPKCS8, importSPKI, generateKeyPair, exportPKCS8, exportSPKI } from 'jose';
import { randomBytes, createHash } from 'crypto';
import { sendPasswordResetEmail, sendPasswordResetConfirmationEmail, sendFallbackPasswordResetEmail } from './brevo-email.js';

// ============================================
// Password Authentication Handlers
// ============================================

async function handleRegister(event) {
  const body = JSON.parse(event.body || '{}');
  const { name, dob, email, phone, pincode, city, district, state, nation, password } = body;

  // Validate required fields
  if (!name || !dob || !email || !phone || !pincode || !city || !district || !state || !nation || !password) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Missing required fields' }),
    };
  }

  // Validate password strength
  if (password.length < 8) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Password must be at least 8 characters long' }),
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Password must contain at least one uppercase letter' }),
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Password must contain at least one lowercase letter' }),
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Password must contain at least one number' }),
    };
  }

  try {
    const { data, error } = await supabase.rpc('register_user_with_password', {
      p_name: name,
      p_dob: dob,
      p_email: email,
      p_phone: phone,
      p_pincode: pincode,
      p_city: city,
      p_district: district,
      p_state: state,
      p_nation: nation,
      p_password: password,
    });

    if (error) {
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'registration_failed', error_description: error.message }),
      };
    }

    const result = data[0];
    return {
      statusCode: result.success ? 201 : 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({
        success: result.success,
        universal_id: result.universal_id,
        message: result.message,
      }),
    };
  } catch (e) {
    console.error('Registration error:', e);
    return {
      statusCode: 500,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'server_error', error_description: 'Registration failed' }),
    };
  }
}

async function handleLogin(event) {
  const body = JSON.parse(event.body || '{}');
  const { identifier, password } = body;

  if (!identifier || !password) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Identifier and password are required' }),
    };
  }

  try {
    const { data, error } = await supabase.rpc('login_with_password', {
      p_identifier: identifier,
      p_password: password,
    });

    if (error) {
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'login_failed', error_description: error.message }),
      };
    }

    const result = data[0];
    
    if (!result.success) {
      return {
        statusCode: 401,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ 
          success: false, 
          message: result.message 
        }),
      };
    }

    // Create auth session for the default platform
    const platform = await getPlatformByClientId(PLATFORM_CLIENT_ID);
    if (!platform) {
      return {
        statusCode: 500,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'server_error', error_description: 'Platform not configured' }),
      };
    }

    const tokens = await createAuthSession(result.user_id, platform.id, {
      userAgent: event.headers['user-agent'],
      ipAddress: event.headers['x-forwarded-for'] || event.headers['x-real-ip'],
    });

    // Get user info
    const userInfo = await buildUserInfo(result.universal_id, platform.id, ['profile', 'email', 'rankings']);

    return {
      statusCode: 200,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({
        success: true,
        user_id: result.user_id,
        universal_id: result.universal_id,
        message: result.message,
        tokens,
        user: userInfo,
      }),
    };
  } catch (e) {
    console.error('Login error:', e);
    return {
      statusCode: 500,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'server_error', error_description: 'Login failed' }),
    };
  }
}

async function handleForgotPassword(event) {
  const body = JSON.parse(event.body || '{}');
  const { identifier } = body;

  if (!identifier) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Identifier is required' }),
    };
  }

  try {
    const { data, error } = await supabase.rpc('request_password_reset', {
      p_identifier: identifier,
    });

    if (error) {
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'reset_failed', error_description: error.message }),
      };
    }

    const result = data[0];
    
    // If successful and we have a reset token (returned in message field), send the email
    if (result.success && result.message && result.message.length > 20) {
      const resetToken = result.message; // Token is returned in the message field
      
      // Get the user's email from the identifier or profile
      let userEmail = identifier;
      let userName = null;
      
      // If identifier is not an email, try to get the user's email from the profile
      if (!identifier.includes('@')) {
        const { data: profile } = await supabase.rpc('login_user_atomic', {
          p_identifier: identifier,
        });
        if (profile && profile.length > 0) {
          userEmail = profile[0].email;
          userName = profile[0].name;
        }
      } else {
        // If identifier is email, get name from profile
        const { data: profile } = await supabase.rpc('login_user_atomic', {
          p_identifier: identifier,
        });
        if (profile && profile.length > 0) {
          userName = profile[0].name;
        }
      }
      
      // Build the reset URL - use query parameter for token
      // Use UGT_FRONTEND_URL if set, otherwise fallback to ugtglobal.space
      // Clean up the URL by removing trailing slashes or /-
      let frontendUrl = process.env.UGT_FRONTEND_URL || process.env.FRONTEND_URL || 'https://ugtglobal.space';
      frontendUrl = frontendUrl.replace(/\/+$/, '').replace(/\/-$/, '');
      const resetUrl = `${frontendUrl}/password-reset/confirm?token=${resetToken}`;
      
      // Send password reset email using fallback HTML email (more reliable than Brevo template)
      // The fallback email has the reset link embedded directly in the HTML
      try {
        await sendFallbackPasswordResetEmail(userEmail, resetUrl, userName);
        console.log(`Password reset email sent to ${userEmail}`);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
        // Don't fail the request if email fails - log and continue
      }
    }
    
    return {
      statusCode: 200,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({
        success: result.success,
        message: result.message,
        expires_at: result.expires_at,
        // In development, include the token for testing
        ...(process.env.NODE_ENV !== 'production' && result.success ? { reset_token: result.message } : {}),
      }),
    };
  } catch (e) {
    console.error('Forgot password error:', e);
    return {
      statusCode: 500,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'server_error', error_description: 'Password reset request failed' }),
    };
  }
}

async function handleVerifyResetToken(event) {
  const body = JSON.parse(event.body || '{}');
  const { token } = body;

  if (!token) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Token is required' }),
    };
  }

  try {
    const { data, error } = await supabase.rpc('verify_password_reset_token', {
      p_token: token,
    });

    if (error) {
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'verification_failed', error_description: error.message }),
      };
    }

    const result = data[0];
    return {
      statusCode: 200,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({
        valid: result.valid,
        user_id: result.user_id,
        identifier: result.identifier,
        expires_at: result.expires_at,
      }),
    };
  } catch (e) {
    console.error('Verify reset token error:', e);
    return {
      statusCode: 500,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'server_error', error_description: 'Token verification failed' }),
    };
  }
}

async function handleResetPassword(event) {
  const body = JSON.parse(event.body || '{}');
  const { token, new_password } = body;

  if (!token || !new_password) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Token and new password are required' }),
    };
  }

  // Validate password strength
  if (new_password.length < 8) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Password must be at least 8 characters long' }),
    };
  }
  if (!/[A-Z]/.test(new_password)) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Password must contain at least one uppercase letter' }),
    };
  }
  if (!/[a-z]/.test(new_password)) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Password must contain at least one lowercase letter' }),
    };
  }
  if (!/[0-9]/.test(new_password)) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Password must contain at least one number' }),
    };
  }

  try {
    const { data, error } = await supabase.rpc('reset_password', {
      p_token: token,
      p_new_password: new_password,
    });

    if (error) {
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'reset_failed', error_description: error.message }),
      };
    }

    const result = data[0];
    
    // If successful, send confirmation email
    if (result.success) {
      // Get the user's email from the token
      const { data: tokenData } = await supabase.rpc('verify_password_reset_token', {
        p_token: token,
      });
      
      if (tokenData && tokenData.length > 0 && tokenData[0].identifier) {
        const userEmail = tokenData[0].identifier;
        
        // Get user name from profile
        let userName = null;
        const { data: profile } = await supabase.rpc('login_user_atomic', {
          p_identifier: userEmail,
        });
        if (profile && profile.length > 0) {
          userName = profile[0].name;
        }
        
        // Send password reset confirmation email via Brevo
        try {
          await sendPasswordResetConfirmationEmail(userEmail, userName);
          console.log(`Password reset confirmation email sent to ${userEmail}`);
        } catch (emailError) {
          console.error('Failed to send password reset confirmation email:', emailError);
          // Don't fail the request if email fails - log and continue
        }
      }
    }
    
    return {
      statusCode: result.success ? 200 : 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({
        success: result.success,
        message: result.message,
      }),
    };
  } catch (e) {
    console.error('Reset password error:', e);
    return {
      statusCode: 500,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'server_error', error_description: 'Password reset failed' }),
    };
  }
}

// ============================================
// Configuration & Supabase Client
// ============================================

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const AUTH_DOMAIN = process.env.AUTH_DOMAIN || 'auth.ugt.org';
const PLATFORM_CLIENT_ID = process.env.PLATFORM_CLIENT_ID || 'ugt_portal_client';
const PLATFORM_CLIENT_SECRET = process.env.PLATFORM_CLIENT_SECRET || 'ugt_portal_secret_change_in_production';
const PLATFORM_REDIRECT_URI = process.env.PLATFORM_REDIRECT_URI || 'https://ugtglobal.space/auth/callback';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase configuration');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

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
// CORS Headers
// ============================================

function corsHeaders(origin) {
  const allowedOrigins = [
    'https://ugtglobal.space',
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
// Request Handlers
// ============================================

async function handleAuthorize(event) {
  const params = event.queryStringParameters || {};
  const { client_id, redirect_uri, scope, response_type, state, code_challenge, code_challenge_method, prompt } = params;

  // Validate required parameters
  if (!client_id || !redirect_uri || response_type !== 'code') {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Missing required parameters' }),
    };
  }

  // Validate platform
  const platform = await getPlatformByClientId(client_id);
  if (!platform) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'unauthorized_client', error_description: 'Invalid client_id' }),
    };
  }

  // Validate redirect_uri
  if (!platform.redirect_uris.includes(redirect_uri)) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Invalid redirect_uri' }),
    };
  }

  // Validate scope
  const requestedScopes = (scope || 'profile email rankings').split(' ');
  const allowedScopes = platform.scopes || ['profile', 'email', 'rankings'];
  const invalidScopes = requestedScopes.filter(s => !allowedScopes.includes(s));
  if (invalidScopes.length > 0) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_scope', error_description: `Invalid scopes: ${invalidScopes.join(', ')}` }),
    };
  }

  // For trusted platforms, auto-approve (skip consent)
  // For others, show consent page (simplified - in production, render HTML page)
  if (!platform.is_trusted && prompt !== 'none') {
    // In production, render consent page HTML
    // For now, we'll auto-approve for demo
    console.log('Consent required for platform:', platform.slug);
  }

  // Generate authorization code
  const code = generateSecureToken(32);
  const codeHash = hashToken(code);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Get user from session (simplified - in production, check auth cookie/session)
  // For QR flow, we'll get user from QR token
  const qrToken = params.qr_token;
  let userId = null;
  let universalId = null;

  if (qrToken) {
    try {
      const qrData = await consumeQRVerificationToken(qrToken);
      universalId = qrData.universal_id;
      
      // Get user ID from universal_id
      const { data: profile } = await supabase.rpc('login_user_atomic', {
        p_identifier: universalId,
      });
      if (profile && profile.length > 0) {
        userId = profile[0].id;
      }
    } catch (e) {
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid QR token' }),
      };
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
    
    return {
      statusCode: 302,
      headers: {
        ...corsHeaders(event.headers.origin),
        Location: loginUrl.toString(),
      },
      body: '',
    };
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

  return {
    statusCode: 302,
    headers: {
      ...corsHeaders(event.headers.origin),
      Location: redirectUrl.toString(),
    },
    body: '',
  };
}

async function handleToken(event) {
  const body = JSON.parse(event.body || '{}');
  const { grant_type, code, redirect_uri, client_id, client_secret, refresh_token, scope } = body;

  // Client authentication
  let platform;
  if (client_id && client_secret) {
    platform = await verifyPlatformSecret(client_id, client_secret);
  } else if (event.headers.authorization) {
    const auth = event.headers.authorization;
    if (auth.startsWith('Basic ')) {
      const credentials = Buffer.from(auth.slice(6), 'base64').toString().split(':');
      platform = await verifyPlatformSecret(credentials[0], credentials[1]);
    }
  }

  if (!platform) {
    return {
      statusCode: 401,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_client', error_description: 'Invalid client credentials' }),
    };
  }

  if (grant_type === 'authorization_code') {
    // Exchange authorization code for tokens
    if (!code || !redirect_uri) {
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'invalid_request', error_description: 'Missing code or redirect_uri' }),
      };
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
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid or expired authorization code' }),
      };
    }

    if (authCode.redirect_uri !== redirect_uri) {
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'invalid_grant', error_description: 'Redirect URI mismatch' }),
      };
    }

    // Verify PKCE if used
    if (authCode.code_challenge && authCode.code_challenge_method === 'S256') {
      if (!body.code_verifier) {
        return {
          statusCode: 400,
          headers: corsHeaders(event.headers.origin),
          body: JSON.stringify({ error: 'invalid_grant', error_description: 'PKCE code_verifier required' }),
        };
      }
      const challenge = createHash('sha256').update(body.code_verifier).digest('base64url');
      if (challenge !== authCode.code_challenge) {
        return {
          statusCode: 400,
          headers: corsHeaders(event.headers.origin),
          body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid PKCE code_verifier' }),
        };
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
      userAgent: event.headers['user-agent'],
      ipAddress: event.headers['x-forwarded-for'] || event.headers['x-real-ip'],
    });

    return {
      statusCode: 200,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify(tokens),
    };
  }

  if (grant_type === 'refresh_token') {
    // Refresh access token
    if (!refresh_token) {
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'invalid_request', error_description: 'Missing refresh_token' }),
      };
    }

    try {
      const tokens = await refreshAuthSession(refresh_token, platform.id);
      return {
        statusCode: 200,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({
          access_token: tokens.access_token,
          expires_in: tokens.expires_in,
          token_type: 'Bearer',
          scope: tokens.scope.join(' '),
        }),
      };
    } catch (e) {
      return {
        statusCode: 400,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'invalid_grant', error_description: e.message }),
      };
    }
  }

  return {
    statusCode: 400,
    headers: corsHeaders(event.headers.origin),
    body: JSON.stringify({ error: 'unsupported_grant_type', error_description: 'Grant type not supported' }),
  };
}

async function handleUserInfo(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      statusCode: 401,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_token', error_description: 'Missing or invalid Authorization header' }),
    };
  }

  const accessToken = authHeader.slice(7);
  const validation = await validateAccessToken(accessToken);

  if (!validation) {
    return {
      statusCode: 401,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_token', error_description: 'Token expired or revoked' }),
    };
  }

  // Verify token signature
  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    return {
      statusCode: 401,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_token', error_description: 'Token signature verification failed' }),
    };
  }

  // Build user info
  const userInfo = await buildUserInfo(payload.uid, validation.platform_id, validation.scope);
  return {
    statusCode: 200,
    headers: corsHeaders(event.headers.origin),
    body: JSON.stringify(userInfo),
  };
}

async function handleRegisterPlatform(event) {
  const body = JSON.parse(event.body || '{}');
  const { name, slug, display_name, description, logo_url, website_url, redirect_uris, allowed_origins, scopes } = body;

  // Validate required fields
  if (!name || !slug || !display_name || !website_url || !redirect_uris || !Array.isArray(redirect_uris) || redirect_uris.length === 0) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Missing required fields' }),
    };
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
      return {
        statusCode: 409,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'conflict', error_description: 'Platform slug already exists' }),
      };
    }
    return {
      statusCode: 500,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'server_error', error_description: error.message }),
    };
  }

  return {
    statusCode: 201,
    headers: corsHeaders(event.headers.origin),
    body: JSON.stringify({
      platform: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        display_name: data.display_name,
        client_id: data.client_id,
      },
      client_secret: clientSecret, // Only returned once!
    }),
  };
}

async function handleQRVerify(event) {
  const token = event.path.split('/').pop(); // Extract token from /verify/:token
  const redirectUri = event.queryStringParameters?.redirect_uri;

  try {
    const qrData = await consumeQRVerificationToken(token);
    const { universal_id, platform_id, redirect_uri: qrRedirectUri, scope } = qrData;

    // Get user profile
    const { data: profile } = await supabase.rpc('login_user_atomic', {
      p_identifier: universal_id,
    });

    if (!profile || profile.length === 0) {
      return {
        statusCode: 404,
        headers: corsHeaders(event.headers.origin),
        body: JSON.stringify({ error: 'not_found', error_description: 'User not found' }),
      };
    }

    const user = profile[0];
    const targetPlatformId = platform_id || (await getPlatformByClientId(PLATFORM_CLIENT_ID))?.id;
    const finalRedirectUri = redirectUri || qrRedirectUri || PLATFORM_REDIRECT_URI;

    // Create auth session for the target platform
    const tokens = await createAuthSession(user.id, targetPlatformId, {
      scope,
      userAgent: event.headers['user-agent'],
      ipAddress: event.headers['x-forwarded-for'] || event.headers['x-real-ip'],
    });

    // Build redirect URL with tokens (for implicit flow) or redirect to platform callback
    const redirectUrl = new URL(finalRedirectUri);
    redirectUrl.searchParams.set('access_token', tokens.access_token);
    redirectUrl.searchParams.set('refresh_token', tokens.refresh_token);
    redirectUrl.searchParams.set('expires_in', tokens.expires_in.toString());
    redirectUrl.searchParams.set('token_type', tokens.token_type);
    redirectUrl.searchParams.set('scope', tokens.scope);
    redirectUrl.searchParams.set('universal_id', universal_id);

    return {
      statusCode: 302,
      headers: {
        ...corsHeaders(event.headers.origin),
        Location: redirectUrl.toString(),
      },
      body: '',
    };
  } catch (e) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_token', error_description: e.message }),
    };
  }
}

async function handleRefresh(event) {
  const body = JSON.parse(event.body || '{}');
  const { refresh_token, client_id, client_secret } = body;

  if (!refresh_token) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_request', error_description: 'Missing refresh_token' }),
    };
  }

  // Authenticate client
  let platform;
  if (client_id && client_secret) {
    platform = await verifyPlatformSecret(client_id, client_secret);
  }

  if (!platform) {
    return {
      statusCode: 401,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_client', error_description: 'Invalid client credentials' }),
    };
  }

  try {
    const tokens = await refreshAuthSession(refresh_token, platform.id);
    return {
      statusCode: 200,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({
        access_token: tokens.access_token,
        expires_in: tokens.expires_in,
        token_type: 'Bearer',
        scope: tokens.scope.join(' '),
      }),
    };
  } catch (e) {
    return {
      statusCode: 400,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_grant', error_description: e.message }),
    };
  }
}

async function handleRevoke(event) {
  const body = JSON.parse(event.body || '{}');
  const { token, token_type_hint, client_id, client_secret } = body;

  // Authenticate client
  let platform;
  if (client_id && client_secret) {
    platform = await verifyPlatformSecret(client_id, client_secret);
  }

  if (!platform) {
    return {
      statusCode: 401,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'invalid_client', error_description: 'Invalid client credentials' }),
    };
  }

  // In a full implementation, revoke the specific token
  // For now, return success (RFC 7009 says to always return 200)
  return {
    statusCode: 200,
    headers: corsHeaders(event.headers.origin),
    body: JSON.stringify({}),
  };
}

async function handleJWKS(event) {
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

  return {
    statusCode: 200,
    headers: {
      ...corsHeaders(event.headers.origin),
      'Cache-Control': 'public, max-age=3600',
    },
    body: JSON.stringify(jwks),
  };
}

// ============================================
// Main Handler
// ============================================

export const handler = async function(event, context) {
  // Handle both direct function calls and redirects from /auth/*
  let path = event.path.replace('/.netlify/functions/auth', '');
  if (path === event.path) {
    // If no change, try removing /auth prefix
    path = event.path.replace('/auth', '');
  }
  const method = event.httpMethod;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders(event.headers.origin),
      body: '',
    };
  }

  try {
    // Route to appropriate handler
    if (path === '/authorize' && method === 'GET') {
      return await handleAuthorize(event);
    }
    if (path === '/token' && method === 'POST') {
      return await handleToken(event);
    }
    if (path === '/userinfo' && method === 'GET') {
      return await handleUserInfo(event);
    }
    if (path === '/register-platform' && method === 'POST') {
      return await handleRegisterPlatform(event);
    }
    if (path.startsWith('/verify/') && method === 'GET') {
      return await handleQRVerify(event);
    }
    if (path === '/refresh' && method === 'POST') {
      return await handleRefresh(event);
    }
    if (path === '/revoke' && method === 'POST') {
      return await handleRevoke(event);
    }
    if (path === '/jwks' && method === 'GET') {
      return await handleJWKS(event);
    }
    // Password Authentication Endpoints
    if (path === '/register' && method === 'POST') {
      return await handleRegister(event);
    }
    if (path === '/login' && method === 'POST') {
      return await handleLogin(event);
    }
    if (path === '/forgot-password' && method === 'POST') {
      return await handleForgotPassword(event);
    }
    if (path === '/verify-reset-token' && method === 'POST') {
      return await handleVerifyResetToken(event);
    }
    if (path === '/reset-password' && method === 'POST') {
      return await handleResetPassword(event);
    }

    return {
      statusCode: 404,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'not_found', error_description: 'Endpoint not found' }),
    };
  } catch (error) {
    console.error('Auth function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders(event.headers.origin),
      body: JSON.stringify({ error: 'server_error', error_description: 'Internal server error' }),
    };
  }
};