-- ================================================
-- UGTARION D1 MIGRATION 004 - Password reset (Cloudflare D1 / SQLite)
-- ================================================
-- Canonical Cloudflare D1 schema for password-reset tokens.
-- Password hashing/verification happens in the Worker (WebCrypto);
-- D1 stores only the resulting hash.
--
-- Apply:
--   npx wrangler d1 execute ugtarion --local  --file=migrations/004_password_reset.d1.sql
--   npx wrangler d1 execute ugtarion --remote --file=migrations/004_password_reset.d1.sql
-- ================================================

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

-- Query recipes:
-- -- Request: invalidate prior open tokens, then insert new hashed token:
-- --   UPDATE password_reset_tokens SET used_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
-- --   WHERE user_id = ? AND used_at IS NULL AND expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now');
-- --   INSERT INTO password_reset_tokens (id, user_id, token_hash, identifier, expires_at)
-- --   VALUES (lower(hex(randomblob(16))), ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '+1 hour'));
-- -- Verify: SELECT * FROM password_reset_tokens
-- --   WHERE token_hash = ? AND used_at IS NULL AND expires_at > strftime('%Y-%m-%dT%H:%M:%fZ', 'now');
-- -- Consume: UPDATE password_reset_tokens SET used_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?;
-- -- Cleanup: DELETE FROM password_reset_tokens
-- --   WHERE expires_at < strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-24 hours');
