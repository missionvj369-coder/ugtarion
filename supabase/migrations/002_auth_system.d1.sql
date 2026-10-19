-- ================================================
-- UGTARION D1 MIGRATION 002 - Platforms / sessions / QR (Cloudflare D1 / SQLite)
-- ================================================
-- Replaces Supabase 003_auth_system.sql
-- Removed: extensions, pgcrypto/gen_random_uuid, TEXT[], INET, TIMESTAMPTZ,
-- plpgsql functions (hash_token/verify/generate_secure_token, QR, sessions).
-- App layer hashes tokens (SHA-256 hex) and generates secrets with
-- crypto.getRandomValues; JSON columns stored as TEXT.
--
-- Apply:
--   npx wrangler d1 execute ugtarion --local  --file=supabase/migrations/002_auth_system.d1.sql
--   npx wrangler d1 execute ugtarion --remote --file=supabase/migrations/002_auth_system.d1.sql
-- ================================================

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

-- Seed: default portal platform + placeholder JWT key id.
-- NOTE: client_secret_hash MUST be replaced with a real SHA-256 hex of a
-- strong secret by the deployer; the value below is a non-functional placeholder.
INSERT INTO platforms (id, name, slug, display_name, description, website_url, redirect_uris, allowed_origins, client_id, client_secret_hash, is_trusted, scopes)
VALUES (
    lower(hex(randomblob(16))),
    'Universal Guard Trust Portal',
    'universal-guard-trust',
    'UGT Portal',
    'Main Universal Guard Trust Identity Portal',
    'https://universal-guard-trust.netlify.app',
    '["https://universal-guard-trust.netlify.app/auth/callback","http://localhost:5173/auth/callback"]',
    '["https://universal-guard-trust.netlify.app","http://localhost:5173"]',
    'ugt_portal_client',
    'REPLACE_WITH_SHA256_HEX_OF_STRONG_SECRET',
    1,
    '["profile","email","rankings","admin"]'
) ON CONFLICT(slug) DO NOTHING;
