/**
 * Shared API Core - Used by both Express server and Netlify Functions
 * Eliminates code duplication between server/index.js and netlify/functions/api.js
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { z } from 'zod';

// Types
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

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: z.ZodError['errors'];
}

// Validation schemas
export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  dob: z.string().min(4, 'Date of birth is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(6, 'Phone number is required'),
  pincode: z.string().min(3, 'Pincode is required'),
  city: z.string().min(1, 'City is required'),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
  nation: z.string().min(1, 'Nation is required'),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Universal ID or Email is required'),
});

// Create Supabase client with service role key (server-side only)
export function createSupabaseAdmin(): SupabaseClient {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase credentials: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required');
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// Build UniversalIdRecord from database row + standings
export function buildRecord(profile: any, ranks: any): UniversalIdRecord {
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

// API Handlers (pure functions, no Express/Netlify dependencies)
export async function handleGetCount(supabase: SupabaseClient): Promise<ApiResponse<{ count: number }>> {
  try {
    const { data, error } = await supabase.rpc('get_total_registrations');
    if (error) throw new Error(error.message);
    return { data: { count: Number(data) || 0 } };
  } catch (err: any) {
    return { error: err.message || 'Failed to fetch count' };
  }
}

export async function handleGetProfile(supabase: SupabaseClient, uid: string): Promise<ApiResponse<UniversalIdRecord>> {
  try {
    const { data, error } = await supabase.rpc('login_user_atomic', { p_identifier: uid });
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      return { error: 'Profile not found.' };
    }
    return { data: buildRecord(data[0], data[0]) };
  } catch (err: any) {
    return { error: err.message || 'Failed to fetch profile' };
  }
}

export async function handleRegister(
  supabase: SupabaseClient,
  body: unknown
): Promise<ApiResponse<UniversalIdRecord>> {
  // Validate input
  const parse = registerSchema.safeParse(body);
  if (!parse.success) {
    return { error: 'Invalid registration payload', details: parse.error.errors };
  }

  const { name, dob, email, phone, pincode, city, district, state, nation } = parse.data;

  try {
    // Use atomic RPC function to avoid race conditions
    const { data, error } = await supabase.rpc('register_user_atomic', {
      p_name: name.trim(),
      p_dob: dob,
      p_email: email.trim().toLowerCase(),
      p_phone: phone.trim(),
      p_pincode: pincode.trim(),
      p_city: city.trim(),
      p_district: district.trim(),
      p_state: state.trim(),
      p_nation: nation.trim(),
    });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      return { error: 'Registration failed - no data returned' };
    }

    return { data: buildRecord(data[0], data[0]) };
  } catch (err: any) {
    // Handle duplicate email error
    if (err.message?.includes('already associated')) {
      return { error: 'This email is already associated with a Universal ID.' };
    }
    return { error: err.message || 'Registration failed' };
  }
}

export async function handleLogin(
  supabase: SupabaseClient,
  body: unknown
): Promise<ApiResponse<UniversalIdRecord>> {
  const parse = loginSchema.safeParse(body);
  if (!parse.success) {
    return { error: 'Invalid login payload', details: parse.error.errors };
  }

  const { identifier } = parse.data;

  try {
    const { data, error } = await supabase.rpc('login_user_atomic', {
      p_identifier: identifier.trim().toLowerCase(),
    });

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      return { error: 'Universal ID or Email not found. Please check spelling or register first.' };
    }

    return { data: buildRecord(data[0], data[0]) };
  } catch (err: any) {
    return { error: err.message || 'Login failed' };
  }
}