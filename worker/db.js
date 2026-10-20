// UGT D1 data layer — Cloudflare D1 (SQLite) backing store.
// Runs in Cloudflare Workers (wrangler deploy with [assets] + [[d1_databases]] binding `DB`).

export function nowIso() {
  return new Date().toISOString();
}

export function cryptoRandomId() {
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  return [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export async function sha256Hex(input) {
  const digest = await crypto.subtle.digest('sha256', new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// PBKDF2-SHA256, 120k iterations — stored as `pbkdf2$iter$saltB64$hashB64`
// (bcrypt is Node-only; Workers use WebCrypto.)
export async function hashPassword(password) {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' },
    key,
    256,
  );
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  return `pbkdf2$120000$${b64(salt.buffer)}$${b64(bits)}`;
}

export async function verifyPassword(password, stored) {
  try {
    if (!stored || typeof stored !== 'string') return false;
    if (stored.startsWith('$2')) return false; // non-PBKDF2 hash (unverifiable here)
    const [, iterStr, saltB64, hashB64] = stored.split('$');
    const iterations = parseInt(iterStr, 10) || 120000;
    const bin = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
    const salt = bin(saltB64);
    const expected = bin(hashB64);
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations, hash: 'SHA-256' }, key, expected.length * 8);
    const actual = new Uint8Array(bits);
    if (actual.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i];
    return diff === 0;
  } catch {
    return false;
  }
}

// UGT id: atomic counter -> UGT-000000001 (9-digit) then UGT-A00000001 overflow
export async function nextUniversalId(db) {
  const row = await db
    .prepare('UPDATE ugt_id_counter SET next_value = next_value + 1 WHERE id = 1 RETURNING next_value - 1 AS seq')
    .first();
  const seq = Number(row?.seq ?? 1);
  if (seq <= 999999999) return `UGT-${String(seq).padStart(9, '0')}`;
  const offset = seq - 999999999;
  const letterIdx = Math.floor((offset - 1) / 100000000);
  const digitPart = offset - letterIdx * 100000000;
  let letter = String.fromCharCode(65 + (letterIdx % 26));
  if (letterIdx >= 26) letter = String.fromCharCode(65 + (Math.floor(letterIdx / 26) % 26)) + letter;
  return `UGT-${letter}${String(digitPart).padStart(8, '0')}`;
}

function rankQueries(where) {
  const scopes = {
    universe_rank: '',
    nation_rank: 'AND nation = p.nation',
    state_rank: 'AND state = p.state',
    district_rank: 'AND district = p.district',
    city_rank: 'AND city = p.city',
    pincode_rank: 'AND pincode = p.pincode',
  };
  const scoped = Object.entries(scopes)
    .map(([k, cond]) => `(SELECT COUNT(*) + 1 FROM profiles WHERE created_at < p.created_at ${cond}) AS ${k}`)
    .join(', ');
  return `SELECT p.*, (SELECT COUNT(*) FROM profiles) AS global_order, ${scoped} FROM profiles p WHERE ${where}`;
}

export async function findProfile(db, identifier) {
  const id = String(identifier ?? '').trim();
  if (!id) return null;
  return db
    .prepare(rankQueries('(lower(p.universal_id) = lower(?1) OR lower(p.email) = lower(?1) OR p.phone = ?1)'))
    .bind(id)
    .first();
}

export async function findProfileByUid(db, uid) {
  return db.prepare(rankQueries('p.universal_id = ?1')).bind(String(uid).trim()).first();
}

export function toRecord(p) {
  if (!p) return null;
  return {
    id: p.universal_id,
    name: p.name,
    dob: p.dob,
    email: p.email,
    phone: p.phone,
    pincode: p.pincode,
    city: p.city,
    district: p.district,
    state: p.state,
    nation: p.nation,
    registeredAt: p.created_at,
    order: Number(p.global_order ?? 0),
    universeRank: Number(p.universe_rank ?? 0),
    nationRank: Number(p.nation_rank ?? 0),
    stateRank: Number(p.state_rank ?? 0),
    districtRank: Number(p.district_rank ?? 0),
    cityRank: Number(p.city_rank ?? 0),
    pincodeRank: Number(p.pincode_rank ?? 0),
  };
}

export async function countProfiles(db) {
  const row = await db.prepare('SELECT COUNT(*) AS c FROM profiles').first();
  return Number(row?.c ?? 0);
}

export async function registerProfile(db, input) {
  const email = String(input.email).trim().toLowerCase();
  const phone = String(input.phone).trim();
  const dup = await db
    .prepare('SELECT universal_id FROM profiles WHERE lower(email) = lower(?1) OR phone = ?2 LIMIT 1')
    .bind(email, phone)
    .first();
  if (dup) {
    const err = new Error('This email or phone number is already associated with a Universal ID.');
    err.code = 'DUPLICATE';
    throw err;
  }
  const universalId = await nextUniversalId(db);
  const passwordHash = input.password ? await hashPassword(input.password) : null;
  await db
    .prepare('INSERT INTO profiles (id, universal_id, name, dob, email, phone, password_hash, pincode, city, district, state, nation, created_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)')
    .bind(
      cryptoRandomId(), universalId, String(input.name).trim(), String(input.dob),
      email, phone, passwordHash,
      String(input.pincode).trim(), String(input.city).trim(),
      String(input.district).trim(), String(input.state).trim(),
      String(input.nation).trim(), nowIso(),
    )
    .run();
  return findProfileByUid(db, universalId);
}

export async function createPasswordReset(db, userId, identifier) {
  const raw = cryptoRandomId() + cryptoRandomId();
  const tokenHash = await sha256Hex(raw);
  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString();
  await db.prepare('UPDATE password_reset_tokens SET used_at = ?1 WHERE user_id = ?2 AND used_at IS NULL AND expires_at > ?1').bind(nowIso(), userId).run();
  await db.prepare('INSERT INTO password_reset_tokens (id, user_id, token_hash, identifier, expires_at) VALUES (?1, ?2, ?3, ?4, ?5)').bind(cryptoRandomId(), userId, tokenHash, identifier, expires).run();
  return { token: raw, expiresAt: expires };
}

export async function consumePasswordReset(db, token, newPassword) {
  const tokenHash = await sha256Hex(token);
  const row = await db.prepare('SELECT * FROM password_reset_tokens WHERE token_hash = ?1 AND used_at IS NULL AND expires_at > ?2 LIMIT 1').bind(tokenHash, nowIso()).first();
  if (!row) {
    const err = new Error('Invalid or expired reset token.');
    err.code = 'INVALID_TOKEN';
    throw err;
  }
  await db.prepare('UPDATE profiles SET password_hash = ?1 WHERE id = ?2').bind(await hashPassword(newPassword), row.user_id).run();
  await db.prepare('UPDATE password_reset_tokens SET used_at = ?1 WHERE id = ?2').bind(nowIso(), row.id).run();
  await db.prepare('UPDATE auth_sessions SET revoked_at = ?1 WHERE user_id = ?2 AND revoked_at IS NULL').bind(nowIso(), row.user_id).run();
  return true;
}
