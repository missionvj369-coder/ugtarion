const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const ACTIVE_USER_ID_KEY = 'ugt_active_user_id';

interface ApiResult<T> {
  error?: string;
  [key: string]: any;
  data?: T;
}

// Transform RPC response (snake_case from database) to camelCase UniversalIdRecord
// RPC functions return: universal_id, created_at, global_order, universe_rank, etc.
function transformProfile(raw: {
  universal_id: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  nation: string;
  created_at: string;
  global_order: number;
  universe_rank: number;
  nation_rank: number;
  state_rank: number;
  district_rank: number;
  city_rank: number;
  pincode_rank: number;
}): UniversalIdRecord {
  return {
    id: raw.universal_id,
    name: raw.name,
    dob: raw.dob,
    email: raw.email,
    phone: raw.phone,
    pincode: raw.pincode,
    city: raw.city,
    district: raw.district,
    state: raw.state,
    nation: raw.nation,
    registeredAt: raw.created_at,
    order: raw.global_order,
    universeRank: raw.universe_rank,
    nationRank: raw.nation_rank,
    stateRank: raw.state_rank,
    districtRank: raw.district_rank,
    cityRank: raw.city_rank,
    pincodeRank: raw.pincode_rank,
  };
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Same-origin by default: the Cloudflare Worker serves /api/* from D1.
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error((payload as any)?.error || response.statusText || 'API request failed.');
  }
  return payload as T;
} catch (err) {
    throw Object.assign(
      new Error('Unable to reach the registry server. Please check your internet connection and try again.'),
      { isNetworkError: true, originalError: err }
    );
  }
}

export interface UniversalIdRecord {
  id: string;
  name: string;
  dob: string;
  email: string;
  phone: string;
  pincode: string;
  city: string;
  district: string;
  state: string;
  nation: string;
  registeredAt: string;
  order: number;
  universeRank: number;
  nationRank: number;
  stateRank: number;
  districtRank: number;
  cityRank: number;
  pincodeRank: number;
}

export async function getRegistryCount(): Promise<number> {
  const result = await apiRequest<{ count: number }>('/api/count');
  return result.count;
}

export async function registerUser(data: {
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
}): Promise<UniversalIdRecord> {
  return apiRequest<UniversalIdRecord>('/api/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(identifier: string, password: string): Promise<UniversalIdRecord> {
  return apiRequest<UniversalIdRecord>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ identifier, password }),
  });
}

export async function getProfileById(id: string): Promise<UniversalIdRecord> {
  return apiRequest<UniversalIdRecord>(`/api/profile/${encodeURIComponent(id)}`);
}

export async function getActiveUser(): Promise<UniversalIdRecord | null> {
  if (typeof window === 'undefined') return null;
  const activeId = localStorage.getItem(ACTIVE_USER_ID_KEY);
  if (!activeId) return null;
  return getProfileById(activeId);
}

export function setActiveUserId(id: string | null): void {
  if (typeof window === 'undefined') return;
  if (id === null) {
    localStorage.removeItem(ACTIVE_USER_ID_KEY);
  } else {
    localStorage.setItem(ACTIVE_USER_ID_KEY, id);
  }
}

// ============================================
// Password Reset API Functions
// ============================================

export interface PasswordResetRequestResponse {
  success: boolean;
  message: string;
}

export interface PasswordResetConfirmResponse {
  success: boolean;
  message: string;
}

/**
 * Request a password reset email
 * @param email - User's email address
 * @param redirectUrl - Optional custom redirect URL for the reset link
 * @returns Promise resolving to response with success status
 */
export async function requestPasswordReset(
  email: string,
  redirectUrl?: string
): Promise<PasswordResetRequestResponse> {
  return apiRequest<PasswordResetRequestResponse>('/auth/password/reset-request', {
    method: 'POST',
    body: JSON.stringify({ email, redirect_url: redirectUrl }),
  });
}

/**
 * Confirm password reset with token and new password
 * @param token - Reset token from email link
 * @param password - New password (min 8 characters)
 * @returns Promise resolving to response with success status
 */
export async function confirmPasswordReset(
  token: string,
  password: string
): Promise<PasswordResetConfirmResponse> {
  return apiRequest<PasswordResetConfirmResponse>('/auth/password/reset-confirm', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

