-- ================================================
-- UGTARION D1 MIGRATION 001 - Core profiles (Cloudflare D1 / SQLite)
-- ================================================
-- Replaces Supabase 001_create_profiles_and_standings.sql
-- Postgres constructs removed: extensions, RLS/policies,
-- plpgsql functions, SEQUENCES, TIMESTAMPTZ, UUID defaults.
-- App layer implements: get_next_ugt_id(), register/login,
-- calculate_universal_standings() via plain queries below.
--
-- Apply:
--   npx wrangler d1 execute ugtarion --local  --file=supabase/migrations/001_create_profiles_and_standings.d1.sql
--   npx wrangler d1 execute ugtarion --remote --file=supabase/migrations/001_create_profiles_and_standings.d1.sql
-- ================================================

DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles (
    id TEXT PRIMARY KEY,
    universal_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    dob TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    pincode TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    nation TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_universal_id ON profiles(universal_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_nation ON profiles(nation);
CREATE INDEX IF NOT EXISTS idx_profiles_state ON profiles(state);
CREATE INDEX IF NOT EXISTS idx_profiles_district ON profiles(district);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_pincode ON profiles(pincode);

-- ================================================
-- UGT ID counter (replaces Postgres SEQUENCE public.ugt_id_seq)
-- One row, mutated atomically by the worker:
--   UPDATE ugt_id_counter SET next_value = next_value + 1 WHERE id = 1;
--   SELECT next_value - 1 AS seq;
-- Format in JS: numeric <= 999999999 -> 'UGT-' + pad9(seq)
--               overflow            -> 'UGT-A00000001' style (see 010 logic ported to JS)
-- ================================================
DROP TABLE IF EXISTS ugt_id_counter;
CREATE TABLE ugt_id_counter (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    next_value INTEGER NOT NULL DEFAULT 1
);
INSERT INTO ugt_id_counter (id, next_value) VALUES (1, 1);

-- ================================================
-- Query recipes (for workers / API, NOT executed here)
-- -- Register (after duplicate checks on email/phone):
-- --   INSERT INTO profiles (id, universal_id, name, dob, email, phone, password_hash, pincode, city, district, state, nation)
-- --   VALUES (lower(hex(randomblob(16))), ?, ?, ?, lower(?), ?, ?, ?, ?, ?, ?, ?);
-- -- Login lookup (case-insensitive id/email, exact phone):
-- --   SELECT * FROM profiles
-- --   WHERE lower(universal_id) = lower(?) OR lower(email) = lower(?) OR phone = ?
-- --   LIMIT 1;
-- -- Standings (global_order = row number by created_at):
-- --   SELECT COUNT(*) + 1 FROM profiles WHERE created_at < (SELECT created_at FROM profiles WHERE universal_id = ?);
-- --   Same pattern filtered by nation/state/district/city/pincode for scoped ranks.
-- ================================================

