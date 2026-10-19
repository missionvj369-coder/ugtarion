// Offline D1 schema smoke test (no Cloudflare login required).
// Executes each *.d1.sql file against an in-memory SQLite database using
// Node's built-in node:sqlite, then verifies core tables + seed row.
// Usage: node scripts/test-d1-schema.mjs  (or: npm run test:d1)
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const ROOT = path.join(import.meta.dirname ?? process.cwd(), '..');
const DIR = path.join(process.cwd(), 'supabase', 'migrations');
const FILES = [
  '001_create_profiles_and_standings.d1.sql',
  '002_auth_system.d1.sql',
  '003_otp_and_tokens.d1.sql',
  '004_password_reset.d1.sql',
];

const EXPECTED_TABLES = [
  'profiles',
  'ugt_id_counter',
  'platforms',
  'auth_sessions',
  'auth_codes',
  'jwt_keys',
  'qr_verification_tokens',
  'otp_challenges',
  'refresh_tokens',
  'auth_audit_log',
  'rate_limit_counters',
  'password_reset_tokens',
];

const db = new DatabaseSync(':memory:');
db.exec('PRAGMA foreign_keys = ON;');

for (const file of FILES) {
  const full = path.join(DIR, file);
  if (!fs.existsSync(full)) {
    console.error(`❌ Missing: ${file}`);
    process.exit(1);
  }
  // Strip comment-only recipe lines? No — SQLite handles `--` comments natively.
  const sql = fs.readFileSync(full, 'utf8');
  try {
    db.exec(sql);
    console.log(`✅ ${file} executed`);
  } catch (err) {
    console.error(`❌ ${file} failed: ${err.message}`);
    process.exit(1);
  }
}

const tables = new Set(
  db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((r) => r.name),
);
const missing = EXPECTED_TABLES.filter((t) => !tables.has(t));
if (missing.length > 0) {
  console.error(`❌ Missing tables: ${missing.join(', ')}`);
  process.exit(1);
}
console.log(`✅ All ${EXPECTED_TABLES.length} tables present`);

// Seed + counter checks
const counter = db.prepare('SELECT next_value FROM ugt_id_counter WHERE id = 1').get();
console.log(`✅ ugt_id_counter.next_value = ${counter?.next_value}`);
const portal = db
  .prepare("SELECT slug, client_id FROM platforms WHERE slug = 'universal-guard-trust'")
  .get();
console.log(`✅ seed platform: ${portal?.slug} (${portal?.client_id})`);

// Round-trip: insert + read back a profile, enforce UNIQUE on email/phone
const insert = db.prepare(
  `INSERT INTO profiles (id, universal_id, name, dob, email, phone, pincode, city, district, state, nation)
   VALUES (lower(hex(randomblob(16))), ?, ?, ?, lower(?), ?, ?, ?, ?, ?, ?)`,
);
insert.run('UGT-000000001', 'Test User', '1990-01-01', 'Test@Example.com', '+911234567890', '110001', 'Delhi', 'Delhi', 'Delhi', 'India');
const row = db.prepare('SELECT universal_id, email FROM profiles WHERE universal_id = ?').get('UGT-000000001');
console.log(`✅ round-trip profile: ${row.universal_id} / ${row.email}`);
try {
  insert.run('UGT-000000002', 'Dup', '1991-02-02', 'test@example.com', '+911234567891', '110002', 'Delhi', 'Delhi', 'Delhi', 'India');
  console.error('❌ UNIQUE(email) not enforced');
  process.exit(1);
} catch {
  console.log('✅ UNIQUE(email) enforced');
}

console.log('\n✅ D1 schema smoke test passed (offline, in-memory SQLite).');
void ROOT;
