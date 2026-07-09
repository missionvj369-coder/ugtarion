const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const ACTIVE_USER_ID_KEY = 'ugt_supabase_active_user_id';

interface ApiResult<T> {
  error?: string;
  [key: string]: any;
  data?: T;
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.error || response.statusText || 'API request failed.');
  }
  return payload as T;
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
}): Promise<UniversalIdRecord> {
  return apiRequest<UniversalIdRecord>('/api/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(identifier: string): Promise<UniversalIdRecord> {
  return apiRequest<UniversalIdRecord>('/api/login', {
    method: 'POST',
    body: JSON.stringify({ identifier }),
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
