import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
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
} from '../../lib/api-core.js';

// Supabase client with service role key (server-side only)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or VITE_SUPABASE_URL/SUPABASE_URL in function environment');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

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
      return jsonResponse(result.error ? (result.error.includes('already associated') ? 409 : 500) : 200, result.error ? { error: result.error, details: result.details } : result.data);
    }

    // POST /login
    if (event.httpMethod === 'POST' && parts[0] === 'login') {
      const body = event.body ? JSON.parse(event.body) : {};
      const result = await handleLogin(supabase, body);
      return jsonResponse(result.error ? (result.error.includes('not found') ? 404 : 500) : 200, result.error ? { error: result.error, details: result.details } : result.data);
    }

    return jsonResponse(404, { error: 'Not found' });
  } catch (err) {
    console.error('Function error:', err?.message || err);
    return jsonResponse(500, { error: err?.message || 'Internal error' });
  }
}