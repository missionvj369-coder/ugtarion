// Full scenario test: register -> login -> verify -> rankings (offline).
// Mirrors worker/db.js logic against in-memory SQLite (node:sqlite).
// Usage: node scripts/test-user-scenarios.mjs
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { pbkdf2Sync, randomBytes, createHash } from 'node:crypto';

const ROOT = path.join(import.meta.dirname ?? process.cwd(), '..');
const results = [];
function check(name, cond, detail = '') {
  results.push({ name, ok: !!cond, detail });
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? '  -- ' + detail : ''}`);
}

const db = new DatabaseSync(':memory:');
db.exec('PRAGMA foreign_keys = ON;');
db.exec(fs.readFileSync(path.join(ROOT, 'migrations', '000_fresh_setup.d1.sql'), 'utf8'));

const b64 = (b) => Buffer.from(b).toString('base64');
const unb64 = (s) => Buffer.from(s, 'base64');
function hashPw(pw) {
  const salt = randomBytes(16);
  const h = pbkdf2Sync(pw, salt, 120000, 32, 'sha256');
  return `pbkdf2$120000$${b64(salt)}$${b64(h)}`;
}
function verifyPw(pw, stored) {
  try {
    const parts = stored.split('$');
    const h = pbkdf2Sync(pw, unb64(parts[2]), parseInt(parts[1], 10), unb64(parts[3]).length, 'sha256');
    return Buffer.from(h).equals(unb64(parts[3]));
  } catch { return false; }
}
function nextUid() {
  const r = db.prepare('UPDATE ugt_id_counter SET next_value = next_value + 1 WHERE id = 1 RETURNING next_value - 1 AS seq').get();
  return `UGT-${String(r.seq).padStart(9, '0')}`;
}
function register(u) {
  const email = u.email.trim().toLowerCase();
  const dup = db.prepare('SELECT universal_id FROM profiles WHERE lower(email) = lower(?) OR phone = ? LIMIT 1').get(email, u.phone);
  if (dup) { const e = new Error('DUPLICATE'); e.code = 'DUPLICATE'; throw e; }
  const uid = nextUid();
  db.prepare('INSERT INTO profiles (id, universal_id, name, dob, email, phone, password_hash, pincode, city, district, state, nation, created_at) VALUES (lower(hex(randomblob(16))), ?, ?, ?, lower(?), ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(uid, u.name, u.dob, email, u.phone, u.password ? hashPw(u.password) : null, u.pincode, u.city, u.district, u.state, u.nation, u.created_at || new Date().toISOString());
  return uid;
}
function rankRow(uid) {
  return db.prepare(`SELECT p.*,
    (SELECT COUNT(*) FROM profiles) AS global_order,
    (SELECT COUNT(*) + 1 FROM profiles WHERE created_at < p.created_at) AS universe_rank,
    (SELECT COUNT(*) + 1 FROM profiles WHERE created_at < p.created_at AND nation = p.nation) AS nation_rank,
    (SELECT COUNT(*) + 1 FROM profiles WHERE created_at < p.created_at AND state = p.state) AS state_rank,
    (SELECT COUNT(*) + 1 FROM profiles WHERE created_at < p.created_at AND district = p.district) AS district_rank,
    (SELECT COUNT(*) + 1 FROM profiles WHERE created_at < p.created_at AND city = p.city) AS city_rank,
    (SELECT COUNT(*) + 1 FROM profiles WHERE created_at < p.created_at AND pincode = p.pincode) AS pincode_rank
    FROM profiles p WHERE p.universal_id = ? LIMIT 1`).get(uid);
}
// 1) Register 3 users across regions
const u1 = register({ name: 'Asha Delhi', dob: '1990-01-01', email: 'asha@example.com', phone: '+911111111111', pincode: '110001', city: 'Delhi', district: 'Delhi', state: 'Delhi', nation: 'India', password: 'TestPass123', created_at: '2026-01-01T10:00:00.000Z' });
check('register user 1 gets UGT-000000001', u1 === 'UGT-000000001', u1);
const u2 = register({ name: 'Ravi Mumbai', dob: '1991-02-02', email: 'ravi@example.com', phone: '+912222222222', pincode: '400001', city: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', nation: 'India', password: 'TestPass123', created_at: '2026-01-02T10:00:00.000Z' });
check('register user 2 gets UGT-000000002', u2 === 'UGT-000000002', u2);
const u3 = register({ name: 'John NYC', dob: '1992-03-03', email: 'john@example.com', phone: '+12125551234', pincode: '10001', city: 'New York', district: 'New York', state: 'New York', nation: 'USA', password: 'TestPass123', created_at: '2026-01-03T10:00:00.000Z' });
check('register user 3 gets UGT-000000003', u3 === 'UGT-000000003', u3);

// 2) Users saved in table
const count = db.prepare('SELECT COUNT(*) AS c FROM profiles').get().c;
check('3 users saved in profiles table', count === 3, `count=${count}`);
const saved = db.prepare('SELECT universal_id, email, phone, password_hash FROM profiles WHERE universal_id = ?').get(u1);
check('user row has email+phone+password_hash', !!(saved && saved.email && saved.phone && saved.password_hash), saved && saved.email);

// 3) Duplicates rejected
let dupEmail = false;
try { register({ name: 'Dup', dob: '1990-01-01', email: 'ASHA@example.com', phone: '+913333333333', pincode: '110001', city: 'Delhi', district: 'Delhi', state: 'Delhi', nation: 'India', password: 'TestPass123' }); } catch (e) { dupEmail = e.code === 'DUPLICATE'; }
check('duplicate email (case-insensitive) rejected', dupEmail);
let dupPhone = false;
try { register({ name: 'Dup', dob: '1990-01-01', email: 'new@example.com', phone: '+911111111111', pincode: '110001', city: 'Delhi', district: 'Delhi', state: 'Delhi', nation: 'India', password: 'TestPass123' }); } catch (e) { dupPhone = e.code === 'DUPLICATE'; }
check('duplicate phone rejected', dupPhone);


// 4) Login: correct / wrong / unknown
const row1 = db.prepare('SELECT * FROM profiles WHERE lower(email) = lower(?) LIMIT 1').get('asha@example.com');
check('login correct password verifies', verifyPw('TestPass123', row1.password_hash));
check('login wrong password rejected', !verifyPw('WrongPass999', row1.password_hash));
const unknown = db.prepare('SELECT * FROM profiles WHERE lower(email) = lower(?) LIMIT 1').get('nobody@example.com');
check('unknown identifier not found', !unknown);

// 5) Verify by UID
const v = db.prepare('SELECT * FROM profiles WHERE universal_id = ? LIMIT 1').get(u2);
check('verify finds user by UID', v && v.name === 'Ravi Mumbai', v && v.universal_id);
const vMiss = db.prepare('SELECT * FROM profiles WHERE universal_id = ? LIMIT 1').get('UGT-999999999');
check('verify unknown UID returns nothing', !vMiss);

// 6) Rankings: earliest registered = rank 1 everywhere
const r1 = rankRow(u1); const r2 = rankRow(u2); const r3 = rankRow(u3);
check('universe ranks 1,2,3 by created_at', r1.universe_rank === 1 && r2.universe_rank === 2 && r3.universe_rank === 3, `${r1.universe_rank},${r2.universe_rank},${r3.universe_rank}`);
check('nation rank India 1,2 and USA 1', r1.nation_rank === 1 && r2.nation_rank === 2 && r3.nation_rank === 1, `IN:${r1.nation_rank},${r2.nation_rank} US:${r3.nation_rank}`);
check('state/city/pin/district all 1 in different areas', r1.state_rank === 1 && r2.state_rank === 1 && r3.city_rank === 1 && r3.pincode_rank === 1 && r3.district_rank === 1);

// 7) Same-city second user gets scoped rank 2
const u4 = register({ name: 'Neha Delhi', dob: '1993-04-04', email: 'neha@example.com', phone: '+914444444444', pincode: '110001', city: 'Delhi', district: 'Delhi', state: 'Delhi', nation: 'India', password: 'TestPass123', created_at: '2026-01-04T10:00:00.000Z' });
const r4 = rankRow(u4);
const r1b = rankRow(u1);
check('same city/state/pin newcomer rank 2 first stays 1', r4.city_rank === 2 && r4.state_rank === 2 && r4.pincode_rank === 2 && r1b.city_rank === 1, `city:${r4.city_rank} state:${r4.state_rank} pin:${r4.pincode_rank}`);
check('same nation newcomer nation rank 3', r4.nation_rank === 3, `nation:${r4.nation_rank}`);
check('universe rank newcomer is 4', r4.universe_rank === 4, `universe:${r4.universe_rank}`);
check('count is 4 after fourth user', db.prepare('SELECT COUNT(*) AS c FROM profiles').get().c === 4);

// 8) Password reset token lifecycle
const tokHash = createHash('sha256').update('token-abc').digest('hex');
db.prepare("INSERT INTO password_reset_tokens (id, user_id, token_hash, identifier, expires_at) VALUES ('t1', ?, ?, ?, '2099-01-01T00:00:00.000Z')").run(row1.id, tokHash, 'asha@example.com');
const tok = db.prepare('SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL LIMIT 1').get(tokHash);
check('reset token stored and retrievable by hash', !!(tok && tok.id));
db.prepare('UPDATE profiles SET password_hash = ? WHERE id = ?').run(hashPw('NewPass456'), row1.id);
db.prepare('UPDATE password_reset_tokens SET used_at = ? WHERE id = ?').run(new Date().toISOString(), 't1');
const row1b = db.prepare('SELECT password_hash FROM profiles WHERE id = ?').get(row1.id);
check('password changed after reset', verifyPw('NewPass456', row1b.password_hash) && !verifyPw('TestPass123', row1b.password_hash));
const reused = db.prepare('SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL LIMIT 1').get(tokHash);
check('used token cannot be reused', !reused);

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} scenarios passed.`);
if (failed.length) { console.error('FAILED:', failed.map((f) => f.name).join(' | ')); process.exit(1); }
console.log('All user and ranking scenarios working perfectly (offline, in-memory SQLite).');
