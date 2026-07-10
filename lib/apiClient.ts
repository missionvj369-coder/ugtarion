const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const ACTIVE_USER_ID_KEY = 'ugt_supabase_active_user_id';

// Direct Supabase client for fallback when API server is unavailable
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Typed client for table operations (with full type safety)
let typedSupabaseClient: ReturnType<typeof createClient<Database>> | null = null;
function getTypedSupabaseClient() {
  if (!typedSupabaseClient && SUPABASE_URL && SUPABASE_ANON_KEY) {
    typedSupabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return typedSupabaseClient;
}

// Untyped client for RPC calls (avoids strict type inference issues with function args)
let untypedSupabaseClient: ReturnType<typeof createClient> | null = null;
function getUntypedSupabaseClient() {
  if (!untypedSupabaseClient && SUPABASE_URL && SUPABASE_ANON_KEY) {
    untypedSupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return untypedSupabaseClient;
}

interface ApiResult<T> {
  error?: string;
  [key: string]: any;
  data?: T;
}

// Transform snake_case Supabase response to camelCase UniversalIdRecord
function transformProfile(raw: Database['public']['Tables']['profiles']['Row']): UniversalIdRecord {
  return {
    id: raw.id,
    name: raw.name,
    dob: raw.dob,
    email: raw.email,
    phone: raw.phone,
    pincode: raw.pincode,
    city: raw.city,
    district: raw.district,
    state: raw.state,
    nation: raw.nation,
    registeredAt: raw.registered_at,
    order: raw.order,
    universeRank: raw.universe_rank,
    nationRank: raw.nation_rank,
    stateRank: raw.state_rank,
    districtRank: raw.district_rank,
    cityRank: raw.city_rank,
    pincodeRank: raw.pincode_rank,
  };
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  // Try API server first
  if (API_BASE_URL) {
    try {
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
    } catch (apiError) {
      console.warn('API server request failed, falling back to direct Supabase:', apiError);
      // Fall through to direct Supabase
    }
  }

  // Fallback to direct Supabase RPC calls
  const supabase = getUntypedSupabaseClient() as any;
  if (!supabase) {
    throw new Error('No API server configured and no Supabase client available');
  }

  // Map API paths to Supabase RPC calls
  if (path === '/api/count' && options.method !== 'POST') {
    const { count, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true });
    if (error) throw new Error(error.message);
    return { count: count || 0 } as T;
  }

  if (path === '/api/register' && options.method === 'POST') {
    const body = JSON.parse(options.body as string);
    const { data, error } = await supabase.rpc('register_user_atomic', {
      p_name: body.name.trim(),
      p_dob: body.dob,
      p_email: body.email.trim().toLowerCase(),
      p_phone: body.phone.trim(),
      p_pincode: body.pincode.trim(),
      p_city: body.city.trim(),
      p_district: body.district.trim(),
      p_state: body.state.trim(),
      p_nation: body.nation.trim(),
    });
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Registration failed - no data returned');
    return transformProfile(data[0]) as T;
  }

  if (path === '/api/login' && options.method === 'POST') {
    const body = JSON.parse(options.body as string);
    const { data, error } = await supabase.rpc('login_user_atomic', {
      p_identifier: body.identifier.trim().toLowerCase(),
    });
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Universal ID or Email not found. Please check spelling or register first.');
    return transformProfile(data[0]) as T;
  }

  if (path.startsWith('/api/profile/') && options.method !== 'POST') {
    const uid = path.split('/api/profile/')[1];
    const { data, error } = await supabase.rpc('login_user_atomic', {
      p_identifier: uid.trim().toLowerCase(),
    });
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) throw new Error('Profile not found.');
    return transformProfile(data[0]) as T;
  }

  throw new Error(`Unsupported path for direct Supabase fallback: ${path}`);
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