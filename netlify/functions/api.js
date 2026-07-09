import { supabase } from './_supabase.js';
import { z } from 'zod';

const defaultCorsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': process.env.DEV_ORIGIN || '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: defaultCorsHeaders,
    body: JSON.stringify(payload),
  };
}

function buildRecord(profile, ranks) {
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

const registerSchema = z.object({
  name: z.string().min(1),
  dob: z.string().min(4),
  email: z.string().email(),
  phone: z.string().min(6),
  pincode: z.string().min(3),
  city: z.string().min(1),
  district: z.string().min(1),
  state: z.string().min(1),
  nation: z.string().min(1),
});

const loginSchema = z.object({ identifier: z.string().min(1) });

export async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: defaultCorsHeaders };

    // event.path example: '/.netlify/functions/api/profile/UGT-000001'
    const prefix = '/.netlify/functions/api';
    const path = event.path && event.path.startsWith(prefix) ? event.path.slice(prefix.length) : event.path || '/';
    const parts = path.split('/').filter(Boolean);

    // GET /count
    if (event.httpMethod === 'GET' && parts[0] === 'count') {
      const { count, error } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      if (error) return jsonResponse(500, { error: error.message });
      return jsonResponse(200, { count: count || 0 });
    }

    // GET /profile/:uid
    if (event.httpMethod === 'GET' && parts[0] === 'profile' && parts[1]) {
      const uid = parts[1];
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('universal_id', uid).maybeSingle();
      if (profileError) return jsonResponse(500, { error: profileError.message });
      if (!profile) return jsonResponse(404, { error: 'Profile not found.' });
      const { data: standings, error: rpcError } = await supabase.rpc('calculate_universal_standings', { target_uid: profile.universal_id });
      if (rpcError || !standings || standings.length === 0) return jsonResponse(500, { error: rpcError?.message || 'Unable to calculate standings.' });
      return jsonResponse(200, buildRecord(profile, standings[0]));
    }

    // POST /register
    if (event.httpMethod === 'POST' && parts[0] === 'register') {
      const body = event.body ? JSON.parse(event.body) : {};
      const parse = registerSchema.safeParse(body);
      if (!parse.success) return jsonResponse(400, { error: 'Invalid registration payload', details: parse.error.errors });
      const { name, dob, email, phone, pincode, city, district, state, nation } = parse.data;

      const { data: existing, error: existingError } = await supabase.from('profiles').select('id').eq('email', email.trim().toLowerCase()).maybeSingle();
      if (existingError) return jsonResponse(500, { error: existingError.message });
      if (existing) return jsonResponse(409, { error: 'This email is already associated with a Universal ID.' });

      const { count, error: countError } = await supabase.from('profiles').select('id', { count: 'exact', head: true });
      if (countError) return jsonResponse(500, { error: countError.message });
      const generatedId = `UGT-${String((count || 0) + 1).padStart(6, '0')}`;

      const { data: profile, error: insertError } = await supabase.from('profiles').insert([{
        universal_id: generatedId,
        name: name.trim(),
        dob,
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        pincode: pincode.trim(),
        city: city.trim(),
        district: district.trim(),
        state: state.trim(),
        nation: nation.trim(),
      }]).select('*').single();

      if (insertError || !profile) return jsonResponse(500, { error: insertError?.message || 'Failed to persist profile.' });
      const { data: standings, error: rpcError } = await supabase.rpc('calculate_universal_standings', { target_uid: profile.universal_id });
      if (rpcError || !standings || standings.length === 0) return jsonResponse(500, { error: rpcError?.message || 'Failed calculating standings.' });
      return jsonResponse(200, buildRecord(profile, standings[0]));
    }

    // POST /login
    if (event.httpMethod === 'POST' && parts[0] === 'login') {
      const body = event.body ? JSON.parse(event.body) : {};
      const parse = loginSchema.safeParse(body);
      if (!parse.success) return jsonResponse(400, { error: 'Invalid login payload' });
      const { identifier } = parse.data;
      const cleanInput = identifier.trim().toLowerCase();
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').or(`universal_id.ilike.${cleanInput},email.eq.${cleanInput}`).maybeSingle();
      if (profileError) return jsonResponse(500, { error: profileError.message });
      if (!profile) return jsonResponse(404, { error: 'Universal ID or Email not found.' });
      const { data: standings, error: rpcError } = await supabase.rpc('calculate_universal_standings', { target_uid: profile.universal_id });
      if (rpcError || !standings || standings.length === 0) return jsonResponse(500, { error: rpcError?.message || 'Failed gathering standings.' });
      return jsonResponse(200, buildRecord(profile, standings[0]));
    }

    return jsonResponse(404, { error: 'Not found' });
  } catch (err) {
    console.error('Function error', err?.message || err);
    return jsonResponse(500, { error: err?.message || 'Internal error' });
  }
}
