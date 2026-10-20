// UGTARION dynamic Worker — API + static frontend from one origin.
// `wrangler deploy` with [assets] directory="dist" + D1 binding `DB`.
// Frontend (dist/) is served via env.ASSETS; /api/* and /auth/* are live D1 routes.
import {
  findProfile,
  findProfileByUid,
  toRecord,
  countProfiles,
  registerProfile,
  verifyPassword,
  createPasswordReset,
  consumePasswordReset,
} from './db.js';

const JSON_HEADERS = { 'content-type': 'application/json' };
const ok = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
const err = (message, status = 400, extra = {}) =>
  ok({ success: false, error: message, ...extra }, status);

function corsHeaders(request) {
  const origin = request.headers.get('origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight for API consumers on other origins
    if (request.method === 'OPTIONS' && (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/'))) {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    // ---------- Health ----------
    if (url.pathname === '/api/health' && request.method === 'GET') {
      try {
        await env.DB.prepare('SELECT 1 as connected').first();
        return ok({ ok: true, status: 'Dynamic Worker Active', database: 'Connected' });
      } catch (e) {
        return ok({ ok: false, status: 'Degraded', database: 'Error', error: e.message }, 500);
      }
    }

    // Connection test route (legacy)
    if (url.pathname === '/api/test' && request.method === 'GET') {
      try {
        const row = await env.DB.prepare('SELECT 1 as connected').first();
        return ok({
          success: true,
          status: 'Dynamic Worker Active',
          database: row ? 'Connected' : 'Error',
          brevoKeySet: !!env.BREVO_API_KEY,
          sender: env.SENDER_EMAIL || 'soulconnect@ugtglobal.space',
        });
      } catch (e) {
        return err(e.message, 500);
      }
    }

    // ---------- Registry count ----------
    if (url.pathname === '/api/count' && request.method === 'GET') {
      try {
        return ok({ count: await countProfiles(env.DB) });
      } catch (e) {
        return err(e.message, 500);
      }
    }


    // ---------- Register ----------
    if (url.pathname === '/api/register' && request.method === 'POST') {
      const body = await readJson(request);
      const required = ['name', 'dob', 'email', 'phone', 'pincode', 'city', 'district', 'state', 'nation', 'password'];
      const missing = required.filter((k) => !String(body[k] ?? '').trim());
      if (missing.length) return err(`Missing required fields: ${missing.join(', ')}`, 400);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(body.email).trim())) {
        return err('Invalid email address.', 400);
      }
      const pw = String(body.password || '');
      if (pw.length < 8) return err('Password must be at least 8 characters.', 400);
      if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/[0-9]/.test(pw) || !/[!@#$%^&*(),.?":{}|<>]/.test(pw)) {
        return err('Password must include upper, lower, number, and special character.', 400);
      }
      try {
        const row = await registerProfile(env.DB, body);
        const record = toRecord(row);
        if (!record) return err('Registration failed. Please try again.', 500);
        return ok(record, 201);
      } catch (e) {
        if (e.code === 'DUPLICATE') return err(e.message, 409, { code: 'DUPLICATE' });
        return err(e.message || 'Registration failed.', 500);
      }
    }

    // ---------- Login (email, phone, or Universal ID + password) ----------
    if (url.pathname === '/api/login' && request.method === 'POST') {
      const { identifier, password } = await readJson(request);
      if (!String(identifier ?? '').trim() || !String(password ?? '')) {
        return err('Identifier and password are required.', 400);
      }
      try {
        const row = await findProfile(env.DB, String(identifier).trim());
        if (!row || !row.password_hash) return err('Invalid credentials.', 401);
        const valid = await verifyPassword(String(password), row.password_hash);
        if (!valid) return err('Invalid credentials.', 401);
        return ok(toRecord(row));
      } catch (e) {
        return err(e.message || 'Login failed.', 500);
      }
    }

    // ---------- Profile / verify (public read; VerificationPage tries
    // profile -> verify -> public/profile, with/without UGT- prefix) ----------
    const profileMatch = url.pathname.match(/^\/api\/(profile|verify|public\/profile)\/(.+)$/);
    if (profileMatch && request.method === 'GET') {
      try {
        const rawUid = decodeURIComponent(String(profileMatch[2] || '')).trim();
        let row = rawUid ? await findProfileByUid(env.DB, rawUid) : null;
        if (!row && rawUid && !/^UGT-/i.test(rawUid)) {
          row = await findProfileByUid(env.DB, `UGT-${rawUid}`);
        }
        if (!row && rawUid) row = await findProfile(env.DB, rawUid);
        if (!row) return err('Universal ID not found in the registry.', 404);
        return ok(toRecord(row));
      } catch (e) {
        return err(e.message || 'Lookup failed.', 500);
      }
    }

    // Legacy direct password-reset (Brevo template); keeps old clients working.
    if (url.pathname === '/api/password-reset' && request.method === 'POST') {
      try {
        const { email, resetToken } = await readJson(request);
        if (!email) return err('Email is required', 400);
        const appUrl = env.APP_URL || url.origin;
        const resetLink = `${String(appUrl).replace(/\/$/, '')}/reset-password?token=${resetToken || ''}`;
        if (env.BREVO_API_KEY) {
          const res = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'api-key': env.BREVO_API_KEY,
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              sender: {
                name: env.SENDER_NAME || 'Universal Guard Trust',
                email: env.SENDER_EMAIL || 'soulconnect@ugtglobal.space',
              },
              to: [{ email: String(email).trim() }],
              templateId: parseInt(env.BREVO_TEMPLATE_ID || '1', 10),
              params: { resetLink },
            }),
          });
          if (!res.ok) return err(await res.text(), 400);
        } else {
          console.log(`[password-reset] BREVO_API_KEY not set — link for ${email}: ${resetLink}`);
        }
        return ok({ success: true, message: 'Reset email sent successfully' });
      } catch (e) {
        return err(e.message, 500);
      }
    }

    // ---------- Password reset: request (always generic success) ----------
    if (url.pathname === '/auth/password/reset-request' && request.method === 'POST') {
      const body = await readJson(request);
      const identifier = String(body.email || body.identifier || '').trim().toLowerCase();
      const generic = { success: true, message: 'If an account exists, a reset link has been sent.' };
      if (!identifier) return ok(generic);
      try {
        const profile = await findProfile(env.DB, identifier);
        if (!profile) return ok(generic);
        const { token } = await createPasswordReset(env.DB, profile.id, identifier);
        const base = String(body.redirect_url || '').trim() || env.APP_URL || url.origin;
        const resetLink = `${String(base).replace(/\/$/, '')}/reset-password?token=${token}`;
        if (env.BREVO_API_KEY) {
          try {
            const res = await fetch('https://api.brevo.com/v3/smtp/email', {
              method: 'POST',
              headers: {
                accept: 'application/json',
                'api-key': env.BREVO_API_KEY,
                'content-type': 'application/json',
              },
              body: JSON.stringify({
                sender: {
                  name: env.SENDER_NAME || 'Universal Guard Trust',
                  email: env.SENDER_EMAIL || 'soulconnect@ugtglobal.space',
                },
                to: [{ email: profile.email }],
                templateId: parseInt(env.BREVO_TEMPLATE_ID || '1', 10),
                params: { resetLink },
              }),
            });
            if (!res.ok) console.log(`[password-reset] email failed: ${await res.text()}`);
          } catch (e) {
            console.log(`[password-reset] email error, link: ${resetLink} (${e.message})`);
          }
        } else {
          console.log(`[password-reset] BREVO_API_KEY not set — link for ${profile.email}: ${resetLink}`);
        }
        return ok(generic);
      } catch (e) {
        console.log(`[password-reset] request error: ${e.message}`);
        return ok(generic);
      }
    }

    // ---------- Password reset: confirm ----------
    if (url.pathname === '/auth/password/reset-confirm' && request.method === 'POST') {
      const { token, password } = await readJson(request);
      if (!token) return err('Invalid or missing reset token.', 400);
      const pw = String(password || '');
      if (pw.length < 8) return err('Password must be at least 8 characters.', 400);
      if (!/[A-Z]/.test(pw) || !/[a-z]/.test(pw) || !/[0-9]/.test(pw)) {
        return err('Password must include upper, lower, and number.', 400);
      }
      try {
        await consumePasswordReset(env.DB, String(token), pw);
        return ok({ success: true, message: 'Password reset successful. Please log in.' });
      } catch (e) {
        return err(e.message || 'Invalid or expired reset token.', e.code === 'INVALID_TOKEN' ? 400 : 500);
      }
    }

    // Unknown /api or /auth route
    if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/')) {
      return err('Endpoint not found', 404);
    }

    // 2. Serve Static Frontend Assets with SPA Routing Fallback
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return env.ASSETS.fetch(new Request(new URL('/', request.url), request));
    }
  },
};