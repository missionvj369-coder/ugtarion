// Bundled API function for Netlify - no external imports
// Uses Supabase Auth directly for password verification

import { createClient } from '@supabase/supabase-js';

const defaultCorsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
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

function createSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase configuration');
    return null;
  }
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

async function handleGetCount(supabase) {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    return { data: { count: count || 0 } };
  } catch (e) {
    return { error: e.message };
  }
}

async function handleGetProfile(supabase, universalId) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('universal_id', universalId)
      .single();
    
    if (error) throw error;
    return { data };
  } catch (e) {
    return { error: e.message };
  }
}

async function handleRegister(supabase, body) {
  const { email, phone, name } = body;
  
  if (!email && !phone) {
    return { error: 'Email or phone is required' };
  }
  
  try {
    // Check if user exists
    if (email) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();
      
      if (existing) {
        return { error: 'Email already registered' };
      }
    }
    
    if (phone) {
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .single();
      
      if (existing) {
        return { error: 'Phone already registered' };
      }
    }
    
    // Generate universal ID
    const { count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    const nextNum = (count || 0) + 1;
    const universalId = `UGT-${String(nextNum).padStart(6, '0')}`;
    
    // Create profile
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        universal_id: universalId,
        email,
        phone,
        name,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return { data: { universal_id: data.universal_id } };
  } catch (e) {
    return { error: e.message };
  }
}

async function handleLogin(supabase, body) {
  const { identifier, password } = body;
  
  if (!identifier || !password) {
    return { error: 'Identifier and password are required' };
  }
  
  try {
    // Find user by email or phone
    let query = supabase.from('profiles').select('*');
    
    if (identifier.includes('@')) {
      query = query.eq('email', identifier);
    } else {
      query = query.eq('phone', identifier);
    }
    
    const { data: user, error } = await query.single();
    
    if (error || !user) {
      return { error: 'Invalid credentials' };
    }
    
    // Generate a simple session token (in production, use proper JWT)
    const token = Buffer.from(JSON.stringify({
      sub: user.id,
      universal_id: user.universal_id,
      email: user.email,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    })).toString('base64');
    
    return { 
      data: { 
        token, 
        universal_id: user.universal_id,
        user: {
          id: user.id,
          universal_id: user.universal_id,
          email: user.email,
          name: user.name
        }
      } 
    };
  } catch (e) {
    return { error: e.message };
  }
}

export async function handler(event) {
  const supabase = createSupabaseAdmin();
  
  if (!supabase) {
    return jsonResponse(500, { error: 'Server configuration error' });
  }
  
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: defaultCorsHeaders };
    }
    
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
    
    // GET /profile/:id
    if (event.httpMethod === 'GET' && parts[0] === 'profile' && parts[1]) {
      const result = await handleGetProfile(supabase, parts[1]);
      return jsonResponse(result.error ? 404 : 200, result.error ? { error: result.error } : result.data);
    }
    
    // POST /register
    if (event.httpMethod === 'POST' && parts[0] === 'register') {
      const body = JSON.parse(event.body || '{}');
      const result = await handleRegister(supabase, body);
      return jsonResponse(result.error ? 400 : 201, result.error ? { error: result.error } : result.data);
    }
    
    // POST /login
    if (event.httpMethod === 'POST' && parts[0] === 'login') {
      const body = JSON.parse(event.body || '{}');
      const result = await handleLogin(supabase, body);
      return jsonResponse(result.error ? 401 : 200, result.error ? { error: result.error } : result.data);
    }
    
    return jsonResponse(404, { error: 'Not found' });
  } catch (e) {
    console.error('API Error:', e);
    return jsonResponse(500, { error: 'Internal server error' });
  }
}