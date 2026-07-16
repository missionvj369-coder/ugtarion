/**
 * Universal Guard Trust - Centralized Authentication Library
 * Provides JWT RS256 signing, token validation, and OAuth/OIDC flows
 * Used by both Netlify Functions and Express Server
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SignJWT, jwtVerify, importPKCS8, importSPKI, generateKeyPair, exportPKCS8, exportSPKI } from 'jose';
import { randomBytes } from 'crypto';

// ============================================
// Types
// ============================================

export interface UGTAuthConfig {
  supabaseUrl: string;
  supabaseServiceKey: string;
  authDomain: string;           // e.g., 'auth.ugt.org'
  platformClientId: string;
  platformClientSecret: string;
  platformRedirectUri: string;
}

export interface JWTPayload {
  sub: string;                    // universal_id
  uid: string;                    // universal_id (alias)
  platform_id: string;            // Platform UUID
  client_id: string;              // Platform client_id
  scope: string[];                // Granted scopes
  iat: number;                    // Issued at
  exp: number;                    // Expires at
  jti: string;                    // JWT ID
  iss: string;                    // Issuer (auth domain)
  aud: string;                    // Audience (platform client_id)
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  expires_in: number;             // Access token lifetime in seconds
  refresh_expires_in: number;     // Refresh token lifetime in seconds
  token_type: 'Bearer';
  scope: string;
}

export interface UserInfo {
  sub: string;
  universal_id: string;
  name: string;
  email: string;
  phone?: string;
  rankings: {
    universe: number;
    nation: number;
    state: number;
    district: number;
    city: number;
    pincode: number;
  };
  registered_at: string;
  platform_id: string;
  scope: string[];
}

export interface Platform {
  id: string;
  name: string;
  slug: string;
  display_name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string;
  redirect_uris: string[];
  allowed_origins: string[];
  client_id: string;
  client_secret_hash: string;
  is_active: boolean;
  is_trusted: boolean;
  scopes: string[];
  created_at: string;
}

export interface QRVerificationToken {
  token: string;
  universal_id: string;
  platform_id: string | null;
  redirect_uri: string | null;
  scope: string[];
  expires_at: string;
}

export interface AuthCode {
  code: string;
  platform_id: string;
  user_id: string;
  redirect_uri: string;
  scope: string[];
  code_challenge: string | null;
  code_challenge_method: string | null;
  expires_at: string;
}

// ============================================
// Crypto Utilities
// ============================================

let keyPairCache: { privateKey: CryptoKey; publicKey: CryptoKey; kid: string } | null = null;

export async function getOrCreateKeyPair(supabase: SupabaseClient): Promise<{ privateKey: CryptoKey; publicKey: CryptoKey; kid: string }> {
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

export async function getPublicKey(supabase: SupabaseClient, kid: string): Promise<CryptoKey | null> {
  const { data } = await supabase
    .from('jwt_keys')
    .select('public_key_pem')
    .eq('kid', kid)
    .eq('is_active', true)
    .single();

  if (!data) return null;
  return importSPKI(data.public_key_pem, 'RS256');
}

// ============================================
// JWT Operations
// ============================================

export async function signAccessToken(
  supabase: SupabaseClient,
  payload: Omit<JWTPayload, 'iat' | 'exp' | 'jti' | 'iss' | 'aud'>,
  expiresInSeconds: number = 3600
): Promise<{ token: string; jti: string; exp: number }> {
  const { privateKey, kid } = await getOrCreateKeyPair(supabase);
  const now = Math.floor(Date.now() / 1000);
  const jti = randomBytes(16).toString('hex');
  const exp = now + expiresInSeconds;

  const token = await new SignJWT({
    ...payload,
    iat: now,
    exp,
    jti,
    iss: `https://${new URL(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').hostname}`, // Use Supabase project as issuer
    aud: payload.client_id,
  })
    .setProtectedHeader({ alg: 'RS256', kid, typ: 'JWT' })
    .sign(privateKey);

  return { token, jti, exp };
}

export async function verifyAccessToken(
  supabase: SupabaseClient,
  token: string
): Promise<JWTPayload | null> {
  try {
    // First verify signature and get kid
    const [header] = token.split('.');
    const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString());
    const kid = decodedHeader.kid;

    if (!kid) return null;

    const publicKey = await getPublicKey(supabase, kid);
    if (!publicKey) return null;

    const { payload } = await jwtVerify(token, publicKey, {
      issuer: `https://${new URL(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').hostname}`,
      audience: decodedHeader.aud || undefined,
    });

    return payload as unknown as JWTPayload;
  } catch (e) {
    console.warn('JWT verification failed:', e);
    return null;
  }
}

// ============================================
// Database Operations
// ============================================

export async function createQRVerificationToken(
  supabase: SupabaseClient,
  universalId: string,
  options: {
    platformId?: string;
    redirectUri?: string;
    scope?: string[];
    expiresInSeconds?: number;
  } = {}
): Promise<QRVerificationToken> {
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

export async function consumeQRVerificationToken(
  supabase: SupabaseClient,
  token: string
): Promise<{ universal_id: string; platform_id: string | null; redirect_uri: string | null; scope: string[] }> {
  const { data, error } = await supabase.rpc('consume_qr_verification_token', {
    p_token: token,
  });

  if (error) throw new Error(`Invalid QR token: ${error.message}`);
  return data[0];
}

export async function createAuthSession(
  supabase: SupabaseClient,
  userId: string,
  platformId: string,
  options: {
    scope?: string[];
    expiresInSeconds?: number;
    refreshExpiresInSeconds?: number;
    userAgent?: string;
    ipAddress?: string;
  } = {}
): Promise<TokenPair> {
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

export async function refreshAuthSession(
  supabase: SupabaseClient,
  refreshToken: string,
  platformId: string,
  expiresInSeconds: number = 3600
): Promise<{ access_token: string; expires_in: number; scope: string[] }> {
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

export async function revokeAllUserSessions(
  supabase: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await supabase.rpc('revoke_all_user_sessions', {
    p_user_id: userId,
  });
  if (error) throw new Error(`Failed to revoke sessions: ${error.message}`);
}

export async function validateAccessToken(
  supabase: SupabaseClient,
  accessToken: string
): Promise<{ user_id: string; platform_id: string; scope: string[]; expires_at: string } | null> {
  const { data, error } = await supabase.rpc('validate_access_token', {
    p_access_token: accessToken,
  });

  if (error || !data || data.length === 0) return null;
  return data[0];
}

export async function getPlatformByClientId(
  supabase: SupabaseClient,
  clientId: string
): Promise<Platform | null> {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('client_id', clientId)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data as Platform;
}

export async function getPlatformById(
  supabase: SupabaseClient,
  platformId: string
): Promise<Platform | null> {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .eq('id', platformId)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data as Platform;
}

export async function verifyPlatformSecret(
  supabase: SupabaseClient,
  clientId: string,
  clientSecret: string
): Promise<Platform | null> {
  const platform = await getPlatformByClientId(supabase, clientId);
  if (!platform) return null;

  // Verify secret hash
  const { data: hashMatch } = await supabase.rpc('verify_token_hash', {
    token: clientSecret,
    hash: platform.client_secret_hash,
  });

  if (!hashMatch) return null;
  return platform;
}

// ============================================
// OAuth/OIDC Helpers
// ============================================

export function buildAuthorizationUrl(
  authDomain: string,
  params: {
    client_id: string;
    redirect_uri: string;
    scope: string;
    response_type: 'code';
    state?: string;
    code_challenge?: string;
    code_challenge_method?: 'S256' | 'plain';
    prompt?: 'consent' | 'login' | 'none';
  }
): string {
  const url = new URL(`https://${authDomain}/authorize`);
  url.searchParams.set('client_id', params.client_id);
  url.searchParams.set('redirect_uri', params.redirect_uri);
  url.searchParams.set('scope', params.scope);
  url.searchParams.set('response_type', params.response_type);
  if (params.state) url.searchParams.set('state', params.state);
  if (params.code_challenge) url.searchParams.set('code_challenge', params.code_challenge);
  if (params.code_challenge_method) url.searchParams.set('code_challenge_method', params.code_challenge_method);
  if (params.prompt) url.searchParams.set('prompt', params.prompt);
  return url.toString();
}

export function buildQRVerificationUrl(
  authDomain: string,
  token: string,
  redirectUri?: string
): string {
  const url = new URL(`https://${authDomain}/verify/${token}`);
  if (redirectUri) url.searchParams.set('redirect_uri', redirectUri);
  return url.toString();
}

export function generatePKCEChallenge(verifier: string): string {
  // S256 method: base64url(sha256(verifier))
  const hash = require('crypto').createHash('sha256').update(verifier).digest();
  return Buffer.from(hash).toString('base64url');
}

export function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}

export function generateState(): string {
  return randomBytes(16).toString('base64url');
}

// ============================================
// User Info Construction
// ============================================

export async function buildUserInfo(
  supabase: SupabaseClient,
  universalId: string,
  platformId: string,
  scope: string[]
): Promise<UserInfo> {
  // Get profile with rankings
  const { data: profile, error } = await supabase.rpc('login_user_atomic', {
    p_identifier: universalId,
  });

  if (error || !profile || profile.length === 0) {
    throw new Error('User not found');
  }

  const p = profile[0];
  const userInfo: UserInfo = {
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
  if (!scope.includes('email')) {
    delete (userInfo as any).email;
  }
  if (!scope.includes('phone')) {
    delete (userInfo as any).phone;
  }
  if (!scope.includes('rankings')) {
    delete (userInfo as any).rankings;
  }

  return userInfo;
}

// ============================================
// Supabase Client Factory
// ============================================

let supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminClient) return supabaseAdminClient;

  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY 
    || process.env.SERVICE_ROLE_KEY 
    || process.env.SUPABASE_SERVICE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase configuration: VITE_SUPABASE_URL/SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  }

  supabaseAdminClient = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  return supabaseAdminClient;
}