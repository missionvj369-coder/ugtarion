import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Import shared API core
import {
  handleGetCount,
  handleGetProfile,
  handleRegister,
  handleLogin,
  createSupabaseAdmin,
} from '../lib/api-core.ts';

// Load server-only environment first, then fallback to local if missing.
dotenv.config({ path: '.env.server' });
dotenv.config({ path: '.env.local' });

const PORT = process.env.API_PORT ? Number(process.env.API_PORT) : 4000;
const ALLOWED_ORIGIN = process.env.DEV_ORIGIN || 'http://localhost:4174';

// Create Supabase admin client
const supabase = createSupabaseAdmin();

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

// GET /api/count
app.get('/api/count', async (req, res) => {
  const result = await handleGetCount(supabase);
  if (result.error) return res.status(500).json({ error: result.error });
  return res.json(result.data);
});

// GET /api/profile/:uid
app.get('/api/profile/:uid', async (req, res) => {
  const { uid } = req.params;
  const result = await handleGetProfile(supabase, uid);
  if (result.error) {
    const status = result.error === 'Profile not found.' ? 404 : 500;
    return res.status(status).json({ error: result.error });
  }
  return res.json(result.data);
});

// POST /api/register
app.post('/api/register', async (req, res) => {
  const result = await handleRegister(supabase, req.body);
  if (result.error) {
    const status = result.error.includes('already associated') || result.error.includes('phone number is already registered') ? 409 : 500;
    return res.status(status).json({ error: result.error, details: result.details });
  }
  return res.json(result.data);
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  const result = await handleLogin(supabase, req.body);
  if (result.error) {
    const status = result.error.includes('not found') ? 404 : 500;
    return res.status(status).json({ error: result.error, details: result.details });
  }
  return res.json(result.data);
});

app.listen(PORT, () => {
  console.log(`Supabase API server running on http://localhost:${PORT}`);
});