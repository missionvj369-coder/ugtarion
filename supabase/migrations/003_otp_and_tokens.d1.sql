-- ================================================
-- UGTARION D1 MIGRATION 003 - OTP / refresh tokens / audit (Cloudflare D1 / SQLite)
-- ================================================
-- Replaces Supabase 004_otp_and_refresh_tokens.sql
-- Removed: pgcrypto, gen_random_uuid, INET, JSONB, plpgsql RPC helpers,
-- RLS policies/grants (D1 has no RLS; access control lives in the Worker/API).
-- App layer implements: OTP create/verify (bcrypt in JS), refresh rotation,
-- rate limiting, audit logging, cleanup cron.
--
-- Apply:
--   npx wrangler d1 execute ugtarion --local  --file=supabase/migrations/003_otp_and_tokens.d1.sql
--   npx wrangler d1 execute ugtarion --remote --file=supabase/migrations/003_otp_and_tokens.d1.sql
-- ================================================

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

-- Query recipes:
-- -- Cleanup (cron):
-- --   DELETE FROM otp_challenges WHERE expires_at < strftime('%Y-%m-%dT%H:%M:%fZ', 'now');
-- --   DELETE FROM refresh_tokens WHERE expires_at < strftime('%Y-%m-%dT%H:%M:%fZ', 'now');
-- --   DELETE FROM rate_limit_counters WHERE window_start < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 hour');
-- --   DELETE FROM auth_audit_log WHERE created_at < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-90 days');
