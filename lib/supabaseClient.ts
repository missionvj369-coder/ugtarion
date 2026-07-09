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
 * Register a new user atomically into the global Supabase network.
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
  // 1. Check for duplicates safely
  const { data: existing } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', data.email.trim().toLowerCase())
    .maybeSingle();

  if (existing) {
    throw new Error('This email is already associated with a Universal ID.');
  }

  // 2. Fetch the next increment value to assemble the public UGT sequence token
  const totalCount = await getSupabaseUserCount();
  const generatedId = `UGT-${String(totalCount + 1).padStart(6, '0')}`;

  // 3. Write profile transaction out to database cluster
  const { data: profile, error: insertError } = await supabase
    .from('profiles')
    .insert([{
      universal_id: generatedId,
      name: data.name.trim(),
      dob: data.dob,
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      pincode: data.pincode.trim(),
      city: data.city.trim(),
      district: data.district.trim(),
      state: data.state.trim(),
      nation: data.nation.trim()
    }])
    .select('*')
    .single();

  if (insertError) throw new Error(insertError.message);

  // 4. Fire the calculation logic function to return computed real-time spatial positioning metrics
  const { data: standings, error: rpcError } = await supabase
    .rpc('calculate_universal_standings', { target_uid: profile.universal_id });

  if (rpcError || !standings || standings.length === 0) {
    throw new Error(rpcError?.message || 'Failed calculating live universal ranks.');
  }

  setActiveSupabaseUserId(profile.universal_id);
  return buildRecord(profile, standings[0]);
};

/**
 * Log a user in across devices securely using either their email address or unique ID.
 */
export const loginUserInSupabase = async (identifier: string): Promise<UniversalIdRecord> => {
  const cleanInput = identifier.trim().toLowerCase();

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .or(`universal_id.ilike.${cleanInput},email.eq.${cleanInput}`)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Error('Universal ID or Email not found. Please check spelling or register first.');
  }

  // Calculate ranks dynamically using live chronological positions
  const { data: standings, error: rpcError } = await supabase
    .rpc('calculate_universal_standings', { target_uid: profile.universal_id });

  if (rpcError || !standings || standings.length === 0) {
    throw new Error('Failed gathering positional database metrics.');
  }

  setActiveSupabaseUserId(profile.universal_id);
  return buildRecord(profile, standings[0]);
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