/**
 * Session management utilities for authentication
 */

import { SESSION_CONFIG } from './security';

const SESSION_KEY = 'ugt_session';
const REMEMBER_ME_KEY = 'ugt_remember_me';

export interface Session {
  userId: string;
  createdAt: number;
  expiresAt: number;
  rememberMe: boolean;
  lastActivity: number;
}

export interface SessionMetadata {
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  timeRemaining: number;
}

/**
 * Create a new session
 */
export function createSession(
  userId: string,
  rememberMe: boolean = false
): Session {
  const now = Date.now();
  const maxAge = rememberMe 
    ? SESSION_CONFIG.rememberMeMaxAgeMs 
    : SESSION_CONFIG.maxSessionAgeMs;
  
  const session: Session = {
    userId,
    createdAt: now,
    expiresAt: now + maxAge,
    rememberMe,
    lastActivity: now,
  };

  // Store session
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      }
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  }

  return session;
}

/**
 * Get current session
 */
export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    
    const session: Session = JSON.parse(stored);
    
    // Check if session is expired
    if (Date.now() > session.expiresAt) {
      clearSession();
      return null;
    }
    
    return session;
  } catch (e) {
    console.error('Failed to get session:', e);
    return null;
  }
}

/**
 * Update session activity
 */
export function updateSessionActivity(): Session | null {
  const session = getSession();
  if (!session) return null;
  
  session.lastActivity = Date.now();
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to update session:', e);
    }
  }
  
  return session;
}

/**
 * Check if session should be refreshed
 */
export function shouldRefreshSession(): boolean {
  const session = getSession();
  if (!session) return false;
  
  const timeUntilExpiry = session.expiresAt - Date.now();
  return timeUntilExpiry < SESSION_CONFIG.refreshThresholdMs;
}

/**
 * Extend session (refresh expiration)
 */
export function extendSession(): Session | null {
  const session = getSession();
  if (!session) return null;
  
  const maxAge = session.rememberMe 
    ? SESSION_CONFIG.rememberMeMaxAgeMs 
    : SESSION_CONFIG.maxSessionAgeMs;
  
  session.expiresAt = Date.now() + maxAge;
  session.lastActivity = Date.now();
  
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.error('Failed to extend session:', e);
    }
  }
  
  return session;
}

/**
 * Clear session
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  } catch (e) {
    console.error('Failed to clear session:', e);
  }
}

/**
 * Get session metadata
 */
export function getSessionMetadata(): SessionMetadata | null {
  const session = getSession();
  if (!session) return null;
  
  const now = Date.now();
  const isActive = now < session.expiresAt;
  const timeRemaining = Math.max(0, session.expiresAt - now);
  
  return {
    userId: session.userId,
    createdAt: new Date(session.createdAt),
    expiresAt: new Date(session.expiresAt),
    isActive,
    timeRemaining,
  };
}

/**
 * Check if "remember me" was previously selected
 */
export function wasRememberMeSelected(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(REMEMBER_ME_KEY) === 'true';
}

/**
 * Session activity tracker (for auto-logout)
 */
export class SessionTracker {
  private timeoutId: number | null = null;
  private readonly timeoutMs: number;
  private readonly onTimeout: () => void;

  constructor(
    timeoutMs: number = 30 * 60 * 1000, // 30 minutes default
    onTimeout: () => void = () => {}
  ) {
    this.timeoutMs = timeoutMs;
    this.onTimeout = onTimeout;
  }

  start(): void {
    this.reset();
    
    if (typeof window !== 'undefined') {
      // Track user activity
      const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
      events.forEach(event => {
        window.addEventListener(event, () => this.reset(), { passive: true });
      });
    }
  }

  reset(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    this.timeoutId = window.setTimeout(() => {
      this.onTimeout();
    }, this.timeoutMs);
  }

  stop(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

// Default session tracker instance
let defaultTracker: SessionTracker | null = null;

export function getSessionTracker(onTimeout: () => void = () => {}): SessionTracker {
  if (!defaultTracker) {
    defaultTracker = new SessionTracker(30 * 60 * 1000, onTimeout);
  }
  return defaultTracker;
}