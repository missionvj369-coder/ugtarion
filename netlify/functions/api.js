import dotenv from 'dotenv';

// Load server env for local development (netlify dev)
dotenv.config({ path: '.env.server' });

// Import shared API core logic
import {
  handleGetCount,
  handleGetProfile,
  handleRegister,
  handleLogin,
  buildRecord,
  createSupabaseAdmin,
} from '../../lib/api-core.js';

// Create Supabase client using shared function (falls back to anon key for local dev)
const supabase = createSupabaseAdmin();

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

export async function handler(event) {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: defaultCorsHeaders };
    }

    // Parse path: '/.netlify/functions/api/profile/UGT-000001' -> ['profile', 'UGT-000001']
    const prefix = '/.netlify/functions/api';
    const path = event.path && event.path.startsWith(prefix)
      ? event.path.slice(prefix.length)
      : event.path || '/';
    const parts = path.split('/').filter(Boolean);

    // GET /count
    if (event.httpMethod === 'GET' && parts[0] === 'count') {
      const result = await handleGetCount(supabase);
      return jsonResponse(result.error ? 500 : 200, result.error ? { error: result.error } : result.data);
    }

    // GET /profile/:uid
    if (event.httpMethod === 'GET' && parts[0] === 'profile' && parts[1]) {
      const result = await handleGetProfile(supabase, parts[1]);
      return jsonResponse(result.error ? (result.error === 'Profile not found.' ? 404 : 500) : 200, result.error ? { error: result.error } : result.data);
    }

    // POST /register
    if (event.httpMethod === 'POST' && parts[0] === 'register') {
      const body = event.body ? JSON.parse(event.body) : {};
      const result = await handleRegister(supabase, body);
      const isDuplicate = result.error && (result.error.includes('already associated') || result.error.includes('already registered'));
      return jsonResponse(result.error ? (isDuplicate ? 409 : 500) : 200, result.error ? { error: result.error, details: result.details } : result.data);
    }

// POST /login
    if (event.httpMethod === 'POST' && parts[0] === 'login') {
      const body = event.body ? JSON.parse(event.body) : {};
      const result = await handleLogin(supabase, body);
      return jsonResponse(result.error ? (result.error.includes('not found') ? 404 : 500) : 200, result.error ? { error: result.error, details: result.details } : result.data);
    }

    // GET /verify/:uid - Public verification endpoint for QR code scanning
    // This allows public verification of UGT IDs via QR codes
    if (event.httpMethod === 'GET' && parts[0] === 'verify' && parts[1]) {
      const uid = parts[1];
      const result = await handleGetProfile(supabase, uid);
      // Return limited public info for verification
      if (result.error) {
        return jsonResponse(404, { error: 'Universal ID not found in the registry.' });
      }
      const publicData = {
        universal_id: result.data.id,
        name: result.data.name,
        registered_at: result.data.registered_at,
        nation: result.data.nation,
        state: result.data.state,
        city: result.data.city,
        universe_rank: result.data.universe_rank,
        world_rank: result.data.universe_rank,
        country_rank: result.data.country_rank,
        state_rank: result.data.state_rank,
        district_rank: result.data.district_rank,
        city_rank: result.data.city_rank,
      };
      return jsonResponse(200, publicData);
    }

    return jsonResponse(404, { error: 'Not found' });
  } catch (err) {
    console.error('Function error:', err?.message || err);
    return jsonResponse(500, { error: err?.message || 'Internal error' });
  }
}