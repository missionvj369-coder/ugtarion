-- ============================================================================
-- UGTARION - Cloudflare D1 - FRESH DATABASE SETUP (single-file, idempotent)
-- ============================================================================
-- Creates ALL tables from scratch. Pure Cloudflare (Worker + D1/SQLite).
-- Safe to re-run: drops are guarded by IF EXISTS, indexes/seeds use
-- IF NOT EXISTS / ON CONFLICT DO NOTHING.
--
-- HOW TO RUN (pick ONE):
--   A) Cloudflare dashboard -> D1 -> ugtarion -> Console -> paste this whole
--      file -> Execute.  (Easiest. No login/CLI needed.)
--   B) CLI (needs `npx wrangler login` first):
--        npx wrangler d1 execute ugtarion --remote --file=migrations/000_fresh_setup.d1.sql
-- Local dev equivalent:
--        npx wrangler d1 execute ugtarion --local --file=migrations/000_fresh_setup.d1.sql
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 001 - Core profiles + UGT-ID counter
-- ----------------------------------------------------------------------------

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

-- UGT-ID counter: single row, bumped atomically by the Worker.
DROP TABLE IF EXISTS ugt_id_counter;
CREATE TABLE ugt_id_counter (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    next_value INTEGER NOT NULL DEFAULT 1
);
INSERT INTO ugt_id_counter (id, next_value) VALUES (1, 1);
-- ----------------------------------------------------------------------------
-- 002 - Platforms / sessions / QR
-- ----------------------------------------------------------------------------

DROP TABLE IF EXISTS auth_sessions;
DROP TABLE IF EXISTS auth_codes;
DROP TABLE IF EXISTS qr_verification_tokens;
DROP TABLE IF EXISTS jwt_keys;
DROP TABLE IF EXISTS platforms;

CREATE TABLE platforms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT NOT NULL,
    redirect_uris TEXT NOT NULL DEFAULT '[]',
    allowed_origins TEXT NOT NULL DEFAULT '[]',
    client_id TEXT UNIQUE NOT NULL,
    client_secret_hash TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 1,
    is_trusted INTEGER NOT NULL DEFAULT 0,
    scopes TEXT NOT NULL DEFAULT '["profile","email","rankings"]',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_platforms_client_id ON platforms(client_id);
CREATE INDEX IF NOT EXISTS idx_platforms_slug ON platforms(slug);

CREATE TABLE auth_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    platform_id TEXT NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL,
    refresh_token_hash TEXT NOT NULL,
    access_token_jti TEXT UNIQUE NOT NULL,
    scope TEXT NOT NULL DEFAULT '["profile","email","rankings"]',
    expires_at TEXT NOT NULL,
    refresh_expires_at TEXT NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    last_used_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    revoked_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_platform_id ON auth_sessions(platform_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_jti ON auth_sessions(access_token_jti);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON auth_sessions(expires_at);

CREATE TABLE auth_codes (
    id TEXT PRIMARY KEY,
    code_hash TEXT UNIQUE NOT NULL,
    platform_id TEXT NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    redirect_uri TEXT NOT NULL,
    scope TEXT NOT NULL DEFAULT '["profile","email","rankings"]',
    code_challenge TEXT,
    code_challenge_method TEXT,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_auth_codes_code_hash ON auth_codes(code_hash);
CREATE INDEX IF NOT EXISTS idx_auth_codes_expires_at ON auth_codes(expires_at);

CREATE TABLE jwt_keys (
    kid TEXT PRIMARY KEY,
    private_key_pem TEXT NOT NULL,
    public_key_pem TEXT NOT NULL,
    algorithm TEXT NOT NULL DEFAULT 'RS256',
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    rotated_at TEXT
);

CREATE TABLE qr_verification_tokens (
    id TEXT PRIMARY KEY,
    token_hash TEXT UNIQUE NOT NULL,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    universal_id TEXT NOT NULL,
    purpose TEXT NOT NULL DEFAULT 'verification',
    expires_at TEXT NOT NULL,
    used_at TEXT,
    revoked_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_hash ON qr_verification_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_user_id ON qr_verification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_tokens_expires_at ON qr_verification_tokens(expires_at);
-- ----------------------------------------------------------------------------
-- Seed: default portal platform.
-- NOTE: client_secret_hash MUST be replaced with a real SHA-256 hex of a
-- strong secret; the value below is a non-functional placeholder.
-- ----------------------------------------------------------------------------
INSERT INTO platforms (id, name, slug, display_name, description, website_url, redirect_uris, allowed_origins, client_id, client_secret_hash, is_trusted, scopes)
VALUES (
    lower(hex(randomblob(16))),
    'Universal Guard Trust Portal',
    'universal-guard-trust',
    'UGT Portal',
    'Main Universal Guard Trust Identity Portal',
    'https://ugtglobal.space',
    '["https://ugtglobal.space/auth/callback","http://localhost:5173/auth/callback"]',
    '["https://ugtglobal.space","http://localhost:5173"]',
    'ugt_portal_client',
    'REPLACE_WITH_SHA256_HEX_OF_STRONG_SECRET',
    1,
    '["profile","email","rankings","admin"]'
) ON CONFLICT(slug) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 003 - OTP / refresh tokens / audit / rate limiting
-- ----------------------------------------------------------------------------

DROP TABLE IF EXISTS rate_limit_counters;
DROP TABLE IF EXISTS auth_audit_log;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS otp_challenges;

CREATE TABLE otp_challenges (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
    otp_hash TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    max_attempts INTEGER NOT NULL DEFAULT 3,
    consumed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_otp_identifier_channel ON otp_challenges(identifier, channel);
CREATE INDEX IF NOT EXISTS idx_otp_expires_at ON otp_challenges(expires_at);

CREATE TABLE refresh_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    platform_id TEXT REFERENCES platforms(id) ON DELETE SET NULL,
    token_hash TEXT NOT NULL,
    user_agent TEXT,
    ip_address TEXT,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    replaced_by_token_id TEXT REFERENCES refresh_tokens(id),
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
CREATE TABLE auth_audit_log (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    user_id TEXT REFERENCES profiles(id) ON DELETE SET NULL,
    platform_id TEXT REFERENCES platforms(id) ON DELETE SET NULL,
    identifier TEXT,
    ip_address TEXT,
    user_agent TEXT,
    success INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    metadata TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_auth_audit_user_id ON auth_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_audit_created_at ON auth_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_auth_audit_event_type ON auth_audit_log(event_type);

CREATE TABLE rate_limit_counters (
    id TEXT PRIMARY KEY,
    key TEXT NOT NULL,
    window_start TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_rate_limit_key_window ON rate_limit_counters(key, window_start);

-- ----------------------------------------------------------------------------
-- 004 - Password reset
-- ----------------------------------------------------------------------------

DROP TABLE IF EXISTS password_reset_tokens;
CREATE TABLE password_reset_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    identifier TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_password_reset_token_hash ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_expires_at ON password_reset_tokens(expires_at);
