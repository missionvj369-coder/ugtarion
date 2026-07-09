import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

// Load server-only environment first, then fallback to local if missing.
dotenv.config({ path: '.env.server' });
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 4000;
const ALLOWED_ORIGIN = process.env.DEV_ORIGIN || 'http://localhost:4174';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase service role credentials. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

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

const app = express();
app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGIN }));
app.use(express.json({ limit: '10kb' }));

// Basic rate limiting for public endpoints
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // limit each IP to 60 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.get('/api/count', async (req, res) => {
  const { count, error } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ count: count || 0 });
});

app.get('/api/profile/:uid', async (req, res) => {
  const { uid } = req.params;
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('universal_id', uid)
    .maybeSingle();

  if (profileError) return res.status(500).json({ error: profileError.message });
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });

  const { data: standings, error: rpcError } = await supabase
    .rpc('calculate_universal_standings', { target_uid: profile.universal_id });

  if (rpcError || !standings || standings.length === 0) {
    return res.status(500).json({ error: rpcError?.message || 'Unable to calculate standings.' });
  }

  return res.json(buildRecord(profile, standings[0]));
});

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

app.post('/api/register', async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid registration payload', details: parse.error.errors });
  const { name, dob, email, phone, pincode, city, district, state, nation } = parse.data;

  const { data: existing, error: existingError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();

  if (existingError) return res.status(500).json({ error: existingError.message });
  if (existing) return res.status(409).json({ error: 'This email is already associated with a Universal ID.' });

  const { count, error: countError } = await supabase
    .from('profiles')
    .select('id', { count: 'exact', head: true });

  if (countError) return res.status(500).json({ error: countError.message });

  const generatedId = `UGT-${String((count || 0) + 1).padStart(6, '0')}`;

  const { data: profile, error: insertError } = await supabase
    .from('profiles')
    .insert([{
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
    }])
    .select('*')
    .single();

  if (insertError || !profile) return res.status(500).json({ error: insertError?.message || 'Failed to persist profile.' });

  const { data: standings, error: rpcError } = await supabase
    .rpc('calculate_universal_standings', { target_uid: profile.universal_id });

  if (rpcError || !standings || standings.length === 0) {
    return res.status(500).json({ error: rpcError?.message || 'Failed calculating standings.' });
  }

  return res.json(buildRecord(profile, standings[0]));
});

const loginSchema = z.object({ identifier: z.string().min(1) });

app.post('/api/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid login payload' });
  const { identifier } = parse.data;

  const cleanInput = identifier.trim().toLowerCase();
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .or(`universal_id.ilike.${cleanInput},email.eq.${cleanInput}`)
    .maybeSingle();

  if (profileError) return res.status(500).json({ error: profileError.message });
  if (!profile) return res.status(404).json({ error: 'Universal ID or Email not found.' });

  const { data: standings, error: rpcError } = await supabase
    .rpc('calculate_universal_standings', { target_uid: profile.universal_id });

  if (rpcError || !standings || standings.length === 0) {
    return res.status(500).json({ error: rpcError?.message || 'Failed gathering standings.' });
  }

  return res.json(buildRecord(profile, standings[0]));
});

app.listen(PORT, () => {
  console.log(`Supabase API server running on http://localhost:${PORT}`);
});
