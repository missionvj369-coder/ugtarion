-- Migration 004: OTP Challenges and Refresh Tokens for Secure Authentication
-- This migration adds tables for custom OTP system and secure refresh token management

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- OTP CHALLENGES TABLE
-- Stores one-time password challenges for email/SMS verification
-- ============================================================
CREATE TABLE otp_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- email or phone number
    channel TEXT NOT NULL CHECK (channel IN ('email', 'sms')),
    otp_hash TEXT NOT NULL, -- bcrypt hash of the 6-digit OTP
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    consumed_at TIMESTAMPTZ, -- NULL until OTP is verified
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by identifier and channel
CREATE INDEX idx_otp_challenges_identifier_channel ON otp_challenges(identifier, channel);
-- Index for cleanup of expired challenges
CREATE INDEX idx_otp_challenges_expires_at ON otp_challenges(expires_at);

-- ============================================================
-- REFRESH TOKENS TABLE
-- Stores hashed refresh tokens for secure session management
-- ============================================================
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    platform_id UUID REFERENCES platforms(id) ON DELETE SET NULL,
    token_hash TEXT NOT NULL, -- bcrypt hash of the refresh token
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    replaced_by_token_id UUID REFERENCES refresh_tokens(id), -- for rotation tracking
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup by user
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
-- Index for cleanup of expired tokens
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
-- Index for revocation checks
CREATE INDEX idx_refresh_tokens_revoked_at ON refresh_tokens(revoked_at) WHERE revoked_at IS NOT NULL;

-- ============================================================
-- AUDIT LOG TABLE
-- Records all authentication events for security monitoring
-- ============================================================
CREATE TABLE auth_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL, -- 'otp_requested', 'otp_verified', 'otp_failed', 'login', 'logout', 'token_refresh', 'token_revoked', 'qr_generated', 'qr_used', 'rate_limited'
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    platform_id UUID REFERENCES platforms(id) ON DELETE SET NULL,
    identifier TEXT, -- email/phone used (hashed for privacy)
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying by user
CREATE INDEX idx_auth_audit_log_user_id ON auth_audit_log(user_id);
-- Index for time-based queries
CREATE INDEX idx_auth_audit_log_created_at ON auth_audit_log(created_at);
-- Index for event type filtering
CREATE INDEX idx_auth_audit_log_event_type ON auth_audit_log(event_type);

-- ============================================================
-- RATE LIMITING TABLE
-- Tracks rate limit counters for various auth operations
-- ============================================================
CREATE TABLE rate_limit_counters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL, -- e.g., 'otp:email:user@example.com', 'login:ip:192.168.1.1'
    window_start TIMESTAMPTZ NOT NULL,
    count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(key, window_start)
);

-- Index for fast lookup
CREATE INDEX idx_rate_limit_counters_key_window ON rate_limit_counters(key, window_start);

-- ============================================================
-- RPC FUNCTIONS
-- ============================================================

-- Function to create OTP challenge
CREATE OR REPLACE FUNCTION create_otp_challenge(
    p_identifier TEXT,
    p_channel TEXT,
    p_otp_hash TEXT,
    p_expires_in_seconds INT DEFAULT 300
) RETURNS TABLE (
    challenge_id UUID,
    expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_expires_at TIMESTAMPTZ := NOW() + (p_expires_in_seconds || ' seconds')::INTERVAL;
BEGIN
    -- Delete any existing unconsumed challenges for this identifier/channel
    DELETE FROM otp_challenges 
    WHERE identifier = p_identifier 
    AND channel = p_channel 
    AND consumed_at IS NULL;
    
    -- Insert new challenge
    INSERT INTO otp_challenges (identifier, channel, otp_hash, expires_at)
    VALUES (p_identifier, p_channel, p_otp_hash, v_expires_at)
    RETURNING id, expires_at INTO challenge_id, expires_at;
    
    RETURN QUERY SELECT challenge_id, expires_at;
END;
$$;

-- Function to verify OTP challenge
CREATE OR REPLACE FUNCTION verify_otp_challenge(
    p_identifier TEXT,
    p_channel TEXT,
    p_otp_hash TEXT
) RETURNS TABLE (
    success BOOLEAN,
    challenge_id UUID,
    error_message TEXT
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_challenge RECORD;
BEGIN
    -- Find the latest unconsumed challenge
    SELECT * INTO v_challenge
    FROM otp_challenges
    WHERE identifier = p_identifier
    AND channel = p_channel
    AND consumed_at IS NULL
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, 'No valid OTP challenge found. Please request a new code.';
    END IF;
    
    -- Check expiry
    IF v_challenge.expires_at < NOW() THEN
        RETURN QUERY SELECT FALSE, v_challenge.id, 'OTP has expired. Please request a new code.';
    END IF;
    
    -- Check max attempts
    IF v_challenge.attempts >= v_challenge.max_attempts THEN
        RETURN QUERY SELECT FALSE, v_challenge.id, 'Too many failed attempts. Please request a new code.';
    END IF;
    
    -- Increment attempts
    UPDATE otp_challenges
    SET attempts = attempts + 1, updated_at = NOW()
    WHERE id = v_challenge.id;
    
    -- Verify OTP hash (using bcrypt comparison)
    -- Note: In practice, bcrypt comparison should be done in application layer
    -- This is a placeholder - actual verification happens in app code
    IF v_challenge.otp_hash = p_otp_hash THEN
        -- Mark as consumed
        UPDATE otp_challenges
        SET consumed_at = NOW(), updated_at = NOW()
        WHERE id = v_challenge.id;
        
        RETURN QUERY SELECT TRUE, v_challenge.id, NULL;
    ELSE
        RETURN QUERY SELECT FALSE, v_challenge.id, 'Invalid OTP code.';
    END IF;
END;
$$;

-- Function to create refresh token
CREATE OR REPLACE FUNCTION create_refresh_token(
    p_user_id UUID,
    p_platform_id UUID,
    p_token_hash TEXT,
    p_user_agent TEXT,
    p_ip_address INET,
    p_expires_in_days INT DEFAULT 30
) RETURNS TABLE (
    token_id UUID,
    expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_expires_at TIMESTAMPTZ := NOW() + (p_expires_in_days || ' days')::INTERVAL;
BEGIN
    INSERT INTO refresh_tokens (user_id, platform_id, token_hash, user_agent, ip_address, expires_at)
    VALUES (p_user_id, p_platform_id, p_token_hash, p_user_agent, p_ip_address, v_expires_at)
    RETURNING id, expires_at INTO token_id, expires_at;
    
    RETURN QUERY SELECT token_id, expires_at;
END;
$$;

-- Function to rotate refresh token (revoke old, create new)
CREATE OR REPLACE FUNCTION rotate_refresh_token(
    p_old_token_id UUID,
    p_user_id UUID,
    p_platform_id UUID,
    p_new_token_hash TEXT,
    p_user_agent TEXT,
    p_ip_address INET,
    p_expires_in_days INT DEFAULT 30
) RETURNS TABLE (
    new_token_id UUID,
    expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_expires_at TIMESTAMPTZ := NOW() + (p_expires_in_days || ' days')::INTERVAL;
BEGIN
    -- Revoke old token and link to new one
    UPDATE refresh_tokens
    SET revoked_at = NOW(), replaced_by_token_id = (
        INSERT INTO refresh_tokens (user_id, platform_id, token_hash, user_agent, ip_address, expires_at)
        VALUES (p_user_id, p_platform_id, p_new_token_hash, p_user_agent, p_ip_address, v_expires_at)
        RETURNING id
    )
    WHERE id = p_old_token_id
    AND user_id = p_user_id
    AND revoked_at IS NULL
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or expired refresh token';
    END IF;
    
    -- Return new token info
    RETURN QUERY 
    SELECT id, expires_at 
    FROM refresh_tokens 
    WHERE replaced_by_token_id = p_old_token_id;
END;
$$;

-- Function to revoke refresh token
CREATE OR REPLACE FUNCTION revoke_refresh_token(
    p_token_id UUID,
    p_user_id UUID
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE id = p_token_id
    AND user_id = p_user_id
    AND revoked_at IS NULL;
END;
$$;

-- Function to revoke all user tokens (logout everywhere)
CREATE OR REPLACE FUNCTION revoke_all_user_tokens(
    p_user_id UUID
) RETURNS INT LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_count INT;
BEGIN
    UPDATE refresh_tokens
    SET revoked_at = NOW()
    WHERE user_id = p_user_id
    AND revoked_at IS NULL;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

-- Function to validate refresh token
CREATE OR REPLACE FUNCTION validate_refresh_token(
    p_token_id UUID,
    p_user_id UUID,
    p_token_hash TEXT
) RETURNS TABLE (
    valid BOOLEAN,
    token_id UUID,
    expires_at TIMESTAMPTZ,
    platform_id UUID
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_token RECORD;
BEGIN
    SELECT * INTO v_token
    FROM refresh_tokens
    WHERE id = p_token_id
    AND user_id = p_user_id
    AND revoked_at IS NULL
    AND expires_at > NOW();
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TIMESTAMPTZ, NULL::UUID;
    END IF;
    
    -- Note: Actual bcrypt comparison should be done in application layer
    -- This is a placeholder
    IF v_token.token_hash = p_token_hash THEN
        RETURN QUERY SELECT TRUE, v_token.id, v_token.expires_at, v_token.platform_id;
    ELSE
        RETURN QUERY SELECT FALSE, NULL::UUID, NULL::TIMESTAMPTZ, NULL::UUID;
    END IF;
END;
$$;

-- Function to log auth audit event
CREATE OR REPLACE FUNCTION log_auth_event(
    p_event_type TEXT,
    p_user_id UUID DEFAULT NULL,
    p_platform_id UUID DEFAULT NULL,
    p_identifier TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_success BOOLEAN,
    p_error_message TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    INSERT INTO auth_audit_log (
        event_type, user_id, platform_id, identifier, 
        ip_address, user_agent, success, error_message, metadata
    ) VALUES (
        p_event_type, p_user_id, p_platform_id, p_identifier,
        p_ip_address, p_user_agent, p_success, p_error_message, p_metadata
    );
END;
$$;

-- Function to check rate limit
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_key TEXT,
    p_window_seconds INT,
    p_max_requests INT
) RETURNS TABLE (
    allowed BOOLEAN,
    current_count INT,
    reset_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
    v_window_start TIMESTAMPTZ := DATE_TRUNC('second', NOW()) - (p_window_seconds || ' seconds')::INTERVAL;
    v_count INT;
BEGIN
    -- Clean old entries
    DELETE FROM rate_limit_counters WHERE window_start < v_window_start;
    
    -- Get or create counter for current window
    INSERT INTO rate_limit_counters (key, window_start, count)
    VALUES (p_key, DATE_TRUNC('second', NOW()), 1)
    ON CONFLICT (key, window_start) DO UPDATE SET count = rate_limit_counters.count + 1
    RETURNING count INTO v_count;
    
    IF v_count <= p_max_requests THEN
        RETURN QUERY SELECT TRUE, v_count, DATE_TRUNC('second', NOW()) + (p_window_seconds || ' seconds')::INTERVAL;
    ELSE
        RETURN QUERY SELECT FALSE, v_count, DATE_TRUNC('second', NOW()) + (p_window_seconds || ' seconds')::INTERVAL;
    END IF;
END;
$$;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- OTP Challenges: Users can only see their own challenges
ALTER TABLE otp_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own OTP challenges" ON otp_challenges
    FOR SELECT USING (
        identifier IN (
            SELECT email FROM profiles WHERE id = auth.uid()
            UNION
            SELECT phone FROM profiles WHERE id = auth.uid()
        )
    );

-- Refresh Tokens: Users can only see their own tokens
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own refresh tokens" ON refresh_tokens
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can revoke own refresh tokens" ON refresh_tokens
    FOR UPDATE USING (user_id = auth.uid());

-- Auth Audit Log: Users can only see their own events
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own auth events" ON auth_audit_log
    FOR SELECT USING (user_id = auth.uid());

-- Rate Limit Counters: No direct access (only via RPC)
ALTER TABLE rate_limit_counters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "No direct access to rate limit counters" ON rate_limit_counters
    FOR ALL USING (false);

-- ============================================================
-- GRANTS
-- ============================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON otp_challenges TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON refresh_tokens TO anon, authenticated;
GRANT SELECT, INSERT ON auth_audit_log TO anon, authenticated;
GRANT SELECT, INSERT ON rate_limit_counters TO anon, authenticated;

GRANT EXECUTE ON FUNCTION create_otp_challenge TO anon, authenticated;
GRANT EXECUTE ON FUNCTION verify_otp_challenge TO anon, authenticated;
GRANT EXECUTE ON FUNCTION create_refresh_token TO anon, authenticated;
GRANT EXECUTE ON FUNCTION rotate_refresh_token TO anon, authenticated;
GRANT EXECUTE ON FUNCTION revoke_refresh_token TO anon, authenticated;
GRANT EXECUTE ON FUNCTION revoke_all_user_tokens TO anon, authenticated;
GRANT EXECUTE ON FUNCTION validate_refresh_token TO anon, authenticated;
GRANT EXECUTE ON FUNCTION log_auth_event TO anon, authenticated;
GRANT EXECUTE ON FUNCTION check_rate_limit TO anon, authenticated;

-- ============================================================
-- CLEANUP FUNCTION (run periodically via pg_cron or external job)
-- ============================================================

CREATE OR REPLACE FUNCTION cleanup_expired_auth_data() RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    -- Delete expired OTP challenges
    DELETE FROM otp_challenges WHERE expires_at < NOW();
    
    -- Delete expired refresh tokens
    DELETE FROM refresh_tokens WHERE expires_at < NOW();
    
    -- Delete old rate limit counters (older than 1 hour)
    DELETE FROM rate_limit_counters WHERE window_start < NOW() - INTERVAL '1 hour';
    
    -- Delete audit logs older than 90 days
    DELETE FROM auth_audit_log WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

GRANT EXECUTE ON FUNCTION cleanup_expired_auth_data TO authenticated;