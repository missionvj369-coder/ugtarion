/**
 * Universal Guard Trust - Auth Client SDK
 * Client-side library for integrating UGT OAuth/OIDC authentication
 * Works in browser and React Native environments
 */

// ============================================
// Types
// ============================================

export interface UGTAuthConfig {
  authDomain: string;           // e.g., 'auth.ugt.org' or 'localhost:4000'
  clientId: string;             // Platform client_id
  clientSecret?: string;        // Platform client_secret (for server-side)
  redirectUri: string;          // Platform redirect_uri
  scope?: string;               // Space-separated scopes (default: 'profile email rankings')
  usePKCE?: boolean;            // Use PKCE for public clients (default: true)
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in?: number;
  token_type: 'Bearer';
  scope: string;
  universal_id?: string;
}

export interface UserInfo {
  sub: string;
  universal_id: string;
  name: string;
  email?: string;
  phone?: string;
  rankings?: {
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

export interface QRVerificationResult {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: 'Bearer';
  scope: string;
  universal_id: string;
  user: UserInfo;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  tokens: TokenResponse | null;
  universalId: string | null;
}

export interface PKCEChallenge {
  codeVerifier: string;
  codeChallenge: string;
  codeChallengeMethod: 'S256';
}

export interface AuthorizationParams {
  client_id: string;
  redirect_uri: string;
  scope: string;
  response_type: 'code';
  state?: string;
  code_challenge?: string;
  code_challenge_method?: 'S256';
  prompt?: 'consent' | 'login' | 'none';
  qr_token?: string;
}

// ============================================
// Crypto Utilities (Browser-compatible)
// ============================================

function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

function base64URLEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return base64URLEncode(String.fromCharCode(...hashArray));
}

export async function generatePKCE(): Promise<PKCEChallenge> {
  const codeVerifier = generateRandomString(32);
  const codeChallenge = await sha256(codeVerifier);
  return {
    codeVerifier,
    codeChallenge,
    codeChallengeMethod: 'S256',
  };
}

export function generateState(): string {
  return generateRandomString(16);
}

// ============================================
// Token Storage
// ============================================

const TOKEN_STORAGE_KEY = 'ugt_auth_tokens';
const USER_STORAGE_KEY = 'ugt_auth_user';
const STATE_STORAGE_KEY = 'ugt_auth_state';
const PKCE_STORAGE_KEY = 'ugt_auth_pkce';

export function saveTokens(tokens: TokenResponse): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
  }
}

export function getTokens(): TokenResponse | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearTokens(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

export function saveUser(user: UserInfo): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}

export function getUser(): UserInfo | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function saveState(state: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(STATE_STORAGE_KEY, state);
  }
}

export function getState(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(STATE_STORAGE_KEY);
}

export function clearState(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(STATE_STORAGE_KEY);
  }
}

export function savePKCE(pkce: PKCEChallenge): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(PKCE_STORAGE_KEY, JSON.stringify(pkce));
  }
}

export function getPKCE(): PKCEChallenge | null {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(PKCE_STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearPKCE(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(PKCE_STORAGE_KEY);
  }
}

// ============================================
// UGT Auth Client Class
// ============================================

export class UGTAuthClient {
  private config: UGTAuthConfig;
  private listeners: Set<(state: AuthState) => void> = new Set();
  private currentState: AuthState = {
    isAuthenticated: false,
    user: null,
    tokens: null,
    universalId: null,
  };

  constructor(config: UGTAuthConfig) {
    this.config = {
      scope: 'profile email rankings',
      usePKCE: true,
      ...config,
    };

    // Initialize from storage
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    const tokens = getTokens();
    const user = getUser();
    
    if (tokens && user) {
      this.currentState = {
        isAuthenticated: true,
        user,
        tokens,
        universalId: user.universal_id,
      };
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentState));
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.add(listener);
    // Immediately notify with current state
    listener(this.currentState);
    return () => this.listeners.delete(listener);
  }

  getState(): AuthState {
    return { ...this.currentState };
  }

  getAuthDomain(): string {
    return this.config.authDomain;
  }

  // ============================================
  // Authorization URL Building
  // ============================================

  buildAuthorizationUrl(params: Partial<AuthorizationParams> = {}): string {
    const pkce = this.config.usePKCE ? getPKCE() : null;
    
    const url = new URL(`https://${this.config.authDomain}/auth/authorize`);
    url.searchParams.set('client_id', this.config.clientId);
    url.searchParams.set('redirect_uri', this.config.redirectUri);
    url.searchParams.set('scope', this.config.scope || 'profile email rankings');
    url.searchParams.set('response_type', 'code');
    
    if (params.state) {
      url.searchParams.set('state', params.state);
      saveState(params.state);
    } else {
      const state = generateState();
      url.searchParams.set('state', state);
      saveState(state);
    }

    if (pkce) {
      url.searchParams.set('code_challenge', pkce.codeChallenge);
      url.searchParams.set('code_challenge_method', pkce.codeChallengeMethod);
    }

    if (params.prompt) {
      url.searchParams.set('prompt', params.prompt);
    }

    if (params.qr_token) {
      url.searchParams.set('qr_token', params.qr_token);
    }

    return url.toString();
  }

  buildQRVerificationUrl(token: string, redirectUri?: string): string {
    const url = new URL(`https://${this.config.authDomain}/auth/verify/${token}`);
    if (redirectUri) {
      url.searchParams.set('redirect_uri', redirectUri);
    }
    return url.toString();
  }

  // ============================================
  // QR Code Generation
  // ============================================

  async generateQRCode(universalId: string, options: {
    platformId?: string;
    redirectUri?: string;
    scope?: string;
    expiresInSeconds?: number;
  } = {}): Promise<{ token: string; qrUrl: string; expiresAt: Date }> {
    // This would typically call a backend endpoint to create the QR token
    // For client-side, we'll use the auth server's QR token creation endpoint
    // In practice, this should be done server-side for security
    
    const response = await fetch(`https://${this.config.authDomain}/auth/create-qr-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        universal_id: universalId,
        platform_id: options.platformId,
        redirect_uri: options.redirectUri || this.config.redirectUri,
        scope: (options.scope || this.config.scope || 'profile email rankings').split(' '),
        expires_in_seconds: options.expiresInSeconds || 300,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create QR token');
    }

    const data = await response.json();
    return {
      token: data.token,
      qrUrl: this.buildQRVerificationUrl(data.token, options.redirectUri),
      expiresAt: new Date(data.expires_at),
    };
  }

  // ============================================
  // Token Exchange
  // ============================================

  async exchangeCodeForTokens(code: string, state?: string): Promise<TokenResponse> {
    // Verify state
    const storedState = getState();
    if (state && storedState !== state) {
      throw new Error('Invalid state parameter');
    }
    clearState();

    // Get PKCE verifier
    const pkce = getPKCE();
    clearPKCE();

    const body: Record<string, string> = {
      grant_type: 'authorization_code',
      code,
      redirect_uri: this.config.redirectUri,
      client_id: this.config.clientId,
    };

    if (this.config.clientSecret) {
      body.client_secret = this.config.clientSecret;
    }

    if (pkce) {
      body.code_verifier = pkce.codeVerifier;
    }

    const response = await fetch(`https://${this.config.authDomain}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error_description || 'Token exchange failed');
    }

    const tokens = await response.json();
    return tokens;
  }

  async refreshAccessToken(): Promise<TokenResponse> {
    const tokens = getTokens();
    if (!tokens?.refresh_token) {
      throw new Error('No refresh token available');
    }

    const body: Record<string, string> = {
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
      client_id: this.config.clientId,
    };

    if (this.config.clientSecret) {
      body.client_secret = this.config.clientSecret;
    }

    const response = await fetch(`https://${this.config.authDomain}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(body),
    });

    if (!response.ok) {
      const error = await response.json();
      // If refresh token is invalid, clear auth state
      if (response.status === 400 || response.status === 401) {
        this.logout();
      }
      throw new Error(error.error_description || 'Token refresh failed');
    }

    const newTokens = await response.json();
    // Merge with existing tokens (keep refresh_token if not rotated)
    const mergedTokens = { ...tokens, ...newTokens };
    saveTokens(mergedTokens);
    this.updateAuthState(mergedTokens);
    return mergedTokens;
  }

  // ============================================
  // User Info
  // ============================================

  async fetchUserInfo(accessToken?: string): Promise<UserInfo> {
    const tokens = getTokens();
    const token = accessToken || tokens?.access_token;
    
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(`https://${this.config.authDomain}/auth/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        try {
          const newTokens = await this.refreshAccessToken();
          return this.fetchUserInfo(newTokens.access_token);
        } catch {
          this.logout();
        }
      }
      throw new Error('Failed to fetch user info');
    }

    const userInfo = await response.json();
    saveUser(userInfo);
    this.currentState.user = userInfo;
    this.currentState.universalId = userInfo.universal_id;
    this.notifyListeners();
    return userInfo;
  }

  // ============================================
  // QR Verification (for QR code scanning)
  // ============================================

  async verifyQRToken(token: string): Promise<QRVerificationResult> {
    const response = await fetch(`https://${this.config.authDomain}/auth/verify/${token}`, {
      method: 'GET',
      redirect: 'manual', // Don't follow redirect, we want the tokens
    });

    // The response will be a redirect with tokens in URL params
    // In practice, the redirect will be followed by the browser
    // This method is for programmatic verification
    
    const redirectUrl = response.url;
    const url = new URL(redirectUrl);
    
    const universalId = url.searchParams.get('universal_id');
    if (!universalId) {
      throw new Error('QR verification failed - no universal_id received');
    }

    const tokens: TokenResponse = {
      access_token: url.searchParams.get('access_token') || '',
      refresh_token: url.searchParams.get('refresh_token') || '',
      expires_in: parseInt(url.searchParams.get('expires_in') || '3600'),
      token_type: 'Bearer',
      scope: url.searchParams.get('scope') || '',
      universal_id: universalId,
    };

    if (!tokens.access_token) {
      throw new Error('QR verification failed - no tokens received');
    }

    saveTokens(tokens);
    const userInfo = await this.fetchUserInfo(tokens.access_token);
    
    return {
      ...tokens,
      universal_id: universalId,
      user: userInfo,
    };
  }

  // ============================================
  // Authentication Flow Methods
  // ============================================

  login(params: { prompt?: 'consent' | 'login' | 'none'; qrToken?: string } = {}): void {
    if (this.config.usePKCE) {
      generatePKCE().then(pkce => {
        savePKCE(pkce);
        const authUrl = this.buildAuthorizationUrl({
          prompt: params.prompt,
          qr_token: params.qrToken,
        });
        window.location.href = authUrl;
      });
    } else {
      const authUrl = this.buildAuthorizationUrl({
        prompt: params.prompt,
        qr_token: params.qrToken,
      });
      window.location.href = authUrl;
    }
  }

  async handleCallback(url: string = window.location.href): Promise<TokenResponse> {
    const urlObj = new URL(url);
    const code = urlObj.searchParams.get('code');
    const state = urlObj.searchParams.get('state');
    const error = urlObj.searchParams.get('error');
    const errorDescription = urlObj.searchParams.get('error_description');

    if (error) {
      throw new Error(errorDescription || error);
    }

    if (!code) {
      throw new Error('No authorization code in callback');
    }

    const tokens = await this.exchangeCodeForTokens(code, state || undefined);
    saveTokens(tokens);
    const userInfo = await this.fetchUserInfo(tokens.access_token);
    
    this.currentState = {
      isAuthenticated: true,
      user: userInfo,
      tokens,
      universalId: userInfo.universal_id,
    };
    this.notifyListeners();

    return tokens;
  }

  logout(revokeTokens: boolean = false): void {
    const tokens = getTokens();
    
    if (revokeTokens && tokens?.access_token) {
      // Attempt to revoke tokens (fire and forget)
      fetch(`https://${this.config.authDomain}/auth/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          token: tokens.access_token,
          token_type_hint: 'access_token',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret || '',
        }),
      }).catch(() => {}); // Ignore errors
    }

    clearTokens();
    this.currentState = {
      isAuthenticated: false,
      user: null,
      tokens: null,
      universalId: null,
    };
    this.notifyListeners();
  }

  async revokeAllSessions(): Promise<void> {
    const tokens = getTokens();
    if (!tokens?.access_token) return;

    await fetch(`https://${this.config.authDomain}/auth/revoke-all`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });
    
    this.logout();
  }

  // ============================================
  // Token Validation
  // ============================================

  isTokenExpired(tokens?: TokenResponse): boolean {
    const tokenData = tokens || getTokens();
    if (!tokenData) return true;
    
    // Check if token expires in the next 60 seconds
    const issuedAt = Date.now() - (tokenData.expires_in * 1000);
    const expiresAt = issuedAt + (tokenData.expires_in * 1000);
    return Date.now() >= (expiresAt - 60000);
  }

  async ensureValidToken(): Promise<string> {
    const tokens = getTokens();
    if (!tokens) {
      throw new Error('Not authenticated');
    }

    if (this.isTokenExpired(tokens)) {
      const newTokens = await this.refreshAccessToken();
      return newTokens.access_token;
    }

    return tokens.access_token;
  }

  // ============================================
  // Utility Methods
  // ============================================

  getUniversalId(): string | null {
    return this.currentState.universalId;
  }

  getUser(): UserInfo | null {
    return this.currentState.user;
  }

  getAccessToken(): string | null {
    return this.currentState.tokens?.access_token || null;
  }

  isAuthenticated(): boolean {
    return this.currentState.isAuthenticated;
  }

  private updateAuthState(tokens: TokenResponse): void {
    this.currentState = {
      ...this.currentState,
      isAuthenticated: true,
      tokens,
    };
    this.notifyListeners();
  }
}

// ============================================
// React Hook (for React applications)
// ============================================

/*
import { useState, useEffect, createContext, useContext } from 'react';

const AuthContext = createContext<{ client: UGTAuthClient | null }>({ client: null });

export function UGTAuthProvider({ 
  children, 
  config 
}: { 
  children: React.ReactNode; 
  config: UGTAuthConfig; 
}) {
  const [client] = useState(() => new UGTAuthClient(config));
  const [authState, setAuthState] = useState(client.getState());

  useEffect(() => {
    return client.subscribe(setAuthState);
  }, [client]);

  return (
    <AuthContext.Provider value={{ client }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useUGTAuth() {
  const { client } = useContext(AuthContext);
  if (!client) {
    throw new Error('useUGTAuth must be used within UGTAuthProvider');
  }
  return client;
}
*/

// ============================================
// Factory Function
// ============================================

export function createUGTAuthClient(config: UGTAuthConfig): UGTAuthClient {
  return new UGTAuthClient(config);
}

// ============================================
// Default Export
// ============================================

export default UGTAuthClient;