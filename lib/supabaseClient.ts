import { createClient } from '@supabase/supabase-js';
import type { UniversalIdRecord } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

const secretKeyPatterns = [/^sb_secret/i, /^service_role/i, /secret/i];
if (secretKeyPatterns.some((pattern) => pattern.test(SUPABASE_ANON_KEY))) {
  throw new Error('Unsafe Supabase key detected in browser build. Use the public anon key only.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ACTIVE_USER_ID_KEY = 'ugt_supabase_active_user_id';

function buildRecord(profile: any, ranks: any): UniversalIdRecord {
  return {
    id: profile.universal_id,
    name: profile.name,
    dob: profile.dob,
    email: profile.email,
    phone: profile.phone,
    pincode: profile.pincode,
    city: profile.city,
    district: profile.district,
    state: profile.state,
    nation: profile.nation,
    registeredAt: profile.created_at,
    order: Number(ranks.global_order),
    universeRank: Number(ranks.universe_rank),
    nationRank: Number(ranks.nation_rank),
    stateRank: Number(ranks.state_rank),
    districtRank: Number(ranks.district_rank),
    cityRank: Number(ranks.city_rank),
    pincodeRank: Number(ranks.pincode_rank),
  };
}

/**
 * Fetch total registration count from the live database.
 */
export const getSupabaseUserCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error fetching global count:', error);
    return 0;
  }
  return count || 0;
};

/**
 * Register a new user ATOMICALLY using the database RPC function.
 * This uses the atomic PostgreSQL sequence (ugt_id_seq) to generate unique IDs
 * without race conditions - works universally across client, server, and edge functions.
 */
export const registerUserInSupabase = async (data: {
  name: string;
  dob: string;
  email: string;
  phone: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  nation: string;
}): Promise<UniversalIdRecord> => {
  // Use atomic RPC function - handles ID generation, duplicate check, and insert in single transaction
  const { data: result, error } = await supabase.rpc('register_user_atomic', {
    p_name: data.name.trim(),
    p_dob: data.dob,
    p_email: data.email.trim().toLowerCase(),
    p_phone: data.phone.trim(),
    p_pincode: data.pincode.trim(),
    p_city: data.city.trim(),
    p_district: data.district.trim(),
    p_state: data.state.trim(),
    p_nation: data.nation.trim(),
  });

  if (error) {
    // Handle duplicate email error from the RPC function
    if (error.message?.includes('already associated')) {
      throw new Error('This email is already associated with a Universal ID.');
    }
    throw new Error(error.message || 'Registration failed');
  }

  if (!result || result.length === 0) {
    throw new Error('Registration failed - no data returned');
  }

  const profile = result[0];
  setActiveSupabaseUserId(profile.universal_id);
  return buildRecord(profile, profile);
};

/**
 * Log a user in across devices securely using either their email address or unique ID.
 * Uses atomic RPC function for consistent login with ranks calculation.
 */
export const loginUserInSupabase = async (identifier: string): Promise<UniversalIdRecord> => {
  const cleanInput = identifier.trim().toLowerCase();

  // Use atomic RPC function for login - handles lookup and ranks in single call
  const { data: result, error } = await supabase.rpc('login_user_atomic', {
    p_identifier: cleanInput,
  });

  if (error) {
    if (error.message?.includes('not found')) {
      throw new Error('Universal ID or Email not found. Please check spelling or register first.');
    }
    throw new Error(error.message || 'Login failed');
  }

  if (!result || result.length === 0) {
    throw new Error('Universal ID or Email not found. Please check spelling or register first.');
  }

  const profile = result[0];
  setActiveSupabaseUserId(profile.universal_id);
  return buildRecord(profile, profile);
};

/**
 * Re-authenticates active local login tokens to stream dashboard analytics instantly upon page loads.
 */
export const getActiveSupabaseUser = async (): Promise<UniversalIdRecord | null> => {
  if (typeof window === 'undefined') return null;
  const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY);
  if (!activeId) return null;

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('universal_id', activeId)
      .maybeSingle();

    if (!profile) return null;

    const { data: standings } = await supabase
      .rpc('calculate_universal_standings', { target_uid: profile.universal_id });

    if (!standings || standings.length === 0) return null;

    return buildRecord(profile, standings[0]);
  } catch {
    return null;
  }
};

/**
 * Session persistence utility
 */
export const setActiveSupabaseUserId = (id: string | null) => {
  if (typeof window === 'undefined') return;
  if (id === null) {
    localStorage.removeItem(ACTIVE_USER_ID_KEY);
  } else {
    localStorage.setItem(ACTIVE_USER_ID_KEY, id);
  }
};

/**
 * Send Email OTP for passwordless authentication
 */
export const sendEmailOtp = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: false, // Only send OTP to existing users
    },
  });

  if (error) {
    if (error.message.includes('not found') || error.message.includes('User not found')) {
      throw new Error('No account found with this email. Please register first.');
    }
    throw new Error(error.message || 'Failed to send OTP. Please try again.');
  }
};

/**
 * Verify Email OTP and get user session
 */
export const verifyEmailOtp = async (email: string, token: string): Promise<UniversalIdRecord> => {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: 'email',
  });

  if (error) {
    if (error.message.includes('expired') || error.message.includes('invalid')) {
      throw new Error('Invalid or expired OTP. Please request a new one.');
    }
    throw new Error(error.message || 'OTP verification failed');
  }

  if (!data.user) {
    throw new Error('Authentication failed. Please try again.');
  }

  // Get the user's profile and ranks
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', data.user.email)
    .maybeSingle();

  if (!profile) {
    throw new Error('Profile not found. Please contact support.');
  }

  const { data: standings } = await supabase
    .rpc('calculate_universal_standings', { target_uid: profile.universal_id });

  if (!standings || standings.length === 0) {
    throw new Error('Failed to load rankings. Please try again.');
  }

  setActiveSupabaseUserId(profile.universal_id);
  return buildRecord(profile, standings[0]);
};

/**
 * Send Email OTP for new user registration (creates user if not exists)
 */
export const sendRegistrationEmailOtp = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim().toLowerCase(),
    options: {
      shouldCreateUser: true, // Create user if not exists
    },
  });

  if (error) {
    throw new Error(error.message || 'Failed to send OTP. Please try again.');
  }
};

/**
 * Verify Registration Email OTP and complete registration
 */
export const verifyRegistrationEmailOtp = async (email: string, token: string): Promise<UniversalIdRecord> => {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim().toLowerCase(),
    token: token.trim(),
    type: 'email',
  });

  if (error) {
    if (error.message.includes('expired') || error.message.includes('invalid')) {
      throw new Error('Invalid or expired OTP. Please request a new one.');
    }
    throw new Error(error.message || 'OTP verification failed');
  }

  if (!data.user) {
    throw new Error('Authentication failed. Please try again.');
  }

  // Check if profile already exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('email', data.user.email)
    .maybeSingle();

  if (profile) {
    // Profile exists, just log in
    const { data: standings } = await supabase
      .rpc('calculate_universal_standings', { target_uid: profile.universal_id });

    if (!standings || standings.length === 0) {
      throw new Error('Failed to load rankings. Please try again.');
    }

    setActiveSupabaseUserId(profile.universal_id);
    return buildRecord(profile, standings[0]);
  }

  // Profile doesn't exist - user needs to complete registration
  // We'll return a special indicator that registration is needed
  throw new Error('REGISTRATION_REQUIRED');
};

/**
 * Sign out from Supabase Auth
 */
export const signOutSupabase = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Sign out error:', error);
  }
  setActiveSupabaseUserId(null);
};

/**
 * Log authentication event for audit trail
 */
export const logAuthEvent = async (
  eventType: string,
  options: {
    userId?: string;
    platformId?: string;
    identifier?: string;
    ipAddress?: string;
    userAgent?: string;
    success: boolean;
    errorMessage?: string;
    metadata?: Record<string, any>;
  }
): Promise<void> => {
  try {
    await supabase.rpc('log_auth_event', {
      p_event_type: eventType,
      p_user_id: options.userId || null,
      p_platform_id: options.platformId || null,
      p_identifier: options.identifier || null,
      p_ip_address: options.ipAddress || null,
      p_user_agent: options.userAgent || null,
      p_success: options.success,
      p_error_message: options.errorMessage || null,
      p_metadata: options.metadata || {},
    });
  } catch (error) {
    // Don't throw - audit logging should not break auth flow
    console.error('Failed to log auth event:', error);
  }
};

/**
 * Check rate limit for authentication operations
 */
export const checkRateLimit = async (
  key: string,
  windowSeconds: number,
  maxRequests: number
): Promise<{ allowed: boolean; currentCount: number; resetAt: Date }> => {
  const { data, error } = await supabase.rpc('check_rate_limit', {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max_requests: maxRequests,
  });

  if (error) {
    // Fail open - allow request if rate limit check fails
    console.warn('Rate limit check failed, allowing request:', error);
    return {
      allowed: true,
      currentCount: 0,
      resetAt: new Date(Date.now() + windowSeconds * 1000),
    };
  }

  return {
    allowed: data[0].allowed,
    currentCount: data[0].current_count,
    resetAt: new Date(data[0].reset_at),
  };
};

/**
 * Register a new user with password
 */
export const registerUserWithPassword = async (data: {
  name: string;
  dob: string;
  email: string;
  phone: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  nation: string;
  password: string;
}): Promise<UniversalIdRecord> => {
  const { data: result, error } = await supabase.rpc('register_user_with_password', {
    p_name: data.name.trim(),
    p_dob: data.dob,
    p_email: data.email.trim().toLowerCase(),
    p_phone: data.phone.trim(),
    p_pincode: data.pincode.trim(),
    p_city: data.city.trim(),
    p_district: data.district.trim(),
    p_state: data.state.trim(),
    p_nation: data.nation.trim(),
    p_password: data.password,
  });

  if (error) {
    if (error.message?.includes('already associated') || error.message?.includes('already registered')) {
      throw new Error('This email or phone is already registered. Please use a different one or log in.');
    }
    throw new Error(error.message || 'Registration failed');
  }

  if (!result || result.length === 0) {
    throw new Error('Registration failed - no data returned');
  }

  const profile = result[0];
  setActiveSupabaseUserId(profile.universal_id);
  return buildRecord(profile, profile);
};

/**
 * Log in with password (email, phone, or universal_id + password)
 */
export const loginWithPassword = async (identifier: string, password: string): Promise<UniversalIdRecord> => {
  const cleanInput = identifier.trim().toLowerCase();

  const { data: result, error } = await supabase.rpc('login_with_password', {
    p_identifier: cleanInput,
    p_password: password,
  });

  if (error) {
    if (error.message?.includes('Invalid credentials') || error.message?.includes('not found')) {
      throw new Error('Invalid credentials. Please check your email/phone/UID and password.');
    }
    if (error.message?.includes('passwordless')) {
      throw new Error('This account uses passwordless login. Please use email/mobile login.');
    }
    throw new Error(error.message || 'Login failed');
  }

  if (!result || result.length === 0) {
    throw new Error('Invalid credentials. Please check your email/phone/UID and password.');
  }

  const loginResult = result[0];
  
  // CRITICAL: Check the success flag from the database function
  if (!loginResult.success) {
    throw new Error(loginResult.message || 'Invalid credentials. Please check your email/phone/UID and password.');
  }

  // Fetch the full profile with rankings for the dashboard
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('universal_id', loginResult.universal_id)
    .single();

  if (profileError || !profile) {
    throw new Error('Failed to load profile. Please try again.');
  }

  const { data: standings } = await supabase
    .rpc('calculate_universal_standings', { target_uid: profile.universal_id });

  if (!standings || standings.length === 0) {
    throw new Error('Failed to load rankings. Please try again.');
  }

  setActiveSupabaseUserId(profile.universal_id);
  return buildRecord(profile, standings[0]);
};

/**
 * Request password reset (sends reset token via email/SMS)
 * Uses the Netlify function to send the email via Brevo
 */
export const requestPasswordReset = async (identifier: string): Promise<{ success: boolean; message: string; expiresAt: Date | null }> => {
  const cleanInput = identifier.trim().toLowerCase();

  // Call the Netlify function which handles both token creation AND email sending
  const authFunctionUrl = import.meta.env.VITE_AUTH_FUNCTION_URL || 'https://ugtglobal.space/.netlify/functions/auth';
  
  try {
    const response = await fetch(`${authFunctionUrl}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier: cleanInput }),
    });

    const data = await response.json();

    if (!response.ok) {
      // For security, don't reveal if user exists - return success anyway
      return { success: true, message: 'If an account exists, a reset link has been sent.', expiresAt: null };
    }

    return {
      success: data.success,
      message: data.message || 'If an account exists, a reset link has been sent.',
      expiresAt: data.expires_at ? new Date(data.expires_at) : null,
    };
  } catch (error) {
    // Network error - for security, don't reveal if user exists
    console.error('Password reset request failed:', error);
    return { success: true, message: 'If an account exists, a reset link has been sent.', expiresAt: null };
  }
};

/**
 * Verify password reset token
 */
export const verifyPasswordResetToken = async (token: string): Promise<{ valid: boolean; userId: string | null; identifier: string | null; expiresAt: Date | null }> => {
  const { data: result, error } = await supabase.rpc('verify_password_reset_token', {
    p_token: token,
  });

  if (error) {
    throw new Error(error.message || 'Failed to verify reset token');
  }

  if (!result || result.length === 0) {
    return { valid: false, userId: null, identifier: null, expiresAt: null };
  }

  const res = result[0];
  return {
    valid: res.valid,
    userId: res.user_id,
    identifier: res.identifier,
    expiresAt: res.expires_at ? new Date(res.expires_at) : null,
  };
};

/**
 * Reset password with token
 */
export const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  const { data: result, error } = await supabase.rpc('reset_password', {
    p_token: token,
    p_new_password: newPassword,
  });

  if (error) {
    throw new Error(error.message || 'Failed to reset password');
  }

  if (!result || result.length === 0) {
    throw new Error('Failed to reset password');
  }

  const res = result[0];
  return {
    success: res.success,
    message: res.message,
  };
};

/**
 * Update password for authenticated user
 */
export const updatePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY);
  if (!activeId) {
    throw new Error('Not authenticated');
  }

  const { data: result, error } = await supabase.rpc('update_password', {
    p_user_id: activeId,
    p_current_password: currentPassword,
    p_new_password: newPassword,
  });

  if (error) {
    throw new Error(error.message || 'Failed to update password');
  }

  if (!result || result.length === 0) {
    throw new Error('Failed to update password');
  }

  const res = result[0];
  return {
    success: res.success,
    message: res.message,
  };
};
