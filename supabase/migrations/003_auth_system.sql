-- Migration: Universal UGT Authentication System
-- Run this in Supabase SQL Editor or via supabase db push

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Platforms table - registered UGT platforms
CREATE TABLE IF NOT EXISTS public.platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,                    -- e.g., 'universal-guard-trust', 'ugt-marketplace'
    display_name TEXT NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT NOT NULL,
    redirect_uris TEXT[] NOT NULL DEFAULT '{}',   -- Allowed OAuth redirect URIs
    allowed_origins TEXT[] NOT NULL DEFAULT '{}', -- CORS origins
    client_id TEXT UNIQUE NOT NULL,               -- Public client identifier
    client_secret_hash TEXT NOT NULL,             -- Hashed secret
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_trusted BOOLEAN NOT NULL DEFAULT false,    -- Trusted platforms skip consent
    scopes TEXT[] NOT NULL DEFAULT '{profile,email,rankings}', -- Allowed scopes
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for client_id lookups
CREATE INDEX IF NOT EXISTS idx_platforms_client_id ON public.platforms(client_id);
CREATE INDEX IF NOT EXISTS idx_platforms_slug ON public.platforms(slug);

-- Auth sessions - cross-platform user sessions
CREATE TABLE IF NOT EXISTS public.auth_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
    session_token_hash TEXT NOT NULL,             -- Hashed session token
    refresh_token_hash TEXT NOT NULL,             -- Hashed refresh token
    access_token_jti TEXT UNIQUE NOT NULL,        -- JWT ID for revocation
    scope TEXT[] NOT NULL DEFAULT '{profile,email,rankings}',
    expires_at TIMESTAMPTZ NOT NULL,
    refresh_expires_at TIMESTAMPTZ NOT NULL,
    user_agent TEXT,
    ip_address INET,
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- Indexes for session lookups
CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON public.auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_platform_id ON public.auth_sessions(platform_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_access_token_jti ON public.auth_sessions(access_token_jti);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires_at ON public.auth_sessions(expires_at);

-- OAuth Authorization Codes - for PKCE flow
CREATE TABLE IF NOT EXISTS public.auth_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_hash TEXT UNIQUE NOT NULL,               -- Hashed authorization code
    platform_id UUID NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    redirect_uri TEXT NOT NULL,
    scope TEXT[] NOT NULL DEFAULT '{profile,email,rankings}',
    code_challenge TEXT,                          -- PKCE challenge
    code_challenge_method TEXT,                   -- 'S256' or 'plain'
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_codes_code_hash ON public.auth_codes(code_hash);
CREATE INDEX IF NOT EXISTS idx_auth_codes_expires_at ON public.auth_codes(expires_at);

-- JWT Key Rotation - store public/private key pairs
CREATE TABLE IF NOT EXISTS public.jwt_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kid TEXT UNIQUE NOT NULL,                     -- Key ID
    private_key_pem TEXT NOT NULL,                -- Encrypted private key
    public_key_pem TEXT NOT NULL,                 -- Public key
    algorithm TEXT NOT NULL DEFAULT 'RS256',
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jwt_keys_kid ON public.jwt_keys(kid);
CREATE INDEX IF NOT EXISTS idx_jwt_keys_is_active ON public.jwt_keys(is_active);

-- QR Verification Tokens - short-lived tokens for QR code verification
CREATE TABLE IF NOT EXISTS public.qr_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token_hash TEXT UNIQUE NOT NULL,              -- Hashed token
    universal_id TEXT NOT NULL,
    platform_id UUID REFERENCES public.platforms(id) ON DELETE SET NULL, -- Target platform (optional)
    redirect_uri TEXT,                            -- Where to redirect after verification
    scope TEXT[] NOT NULL DEFAULT '{profile,email,rankings}',
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_qr_verification_tokens_token_hash ON public.qr_verification_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_qr_verification_tokens_expires_at ON public.qr_verification_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auth_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jwt_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Platforms policies
DROP POLICY IF EXISTS "Platforms readable by service role" ON public.platforms;
CREATE POLICY "Platforms readable by service role" ON public.platforms
    FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Platforms manageable by service role" ON public.platforms;
CREATE POLICY "Platforms manageable by service role" ON public.platforms
    FOR ALL USING (auth.role() = 'service_role');

-- Auth sessions policies
DROP POLICY IF EXISTS "Auth sessions readable by service role" ON public.auth_sessions;
CREATE POLICY "Auth sessions readable by service role" ON public.auth_sessions
    FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Auth sessions manageable by service role" ON public.auth_sessions;
CREATE POLICY "Auth sessions manageable by service role" ON public.auth_sessions
    FOR ALL USING (auth.role() = 'service_role');

-- Auth codes policies
DROP POLICY IF EXISTS "Auth codes readable by service role" ON public.auth_codes;
CREATE POLICY "Auth codes readable by service role" ON public.auth_codes
    FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Auth codes manageable by service role" ON public.auth_codes;
CREATE POLICY "Auth codes manageable by service role" ON public.auth_codes
    FOR ALL USING (auth.role() = 'service_role');

-- JWT keys policies
DROP POLICY IF EXISTS "JWT keys readable by service role" ON public.jwt_keys;
CREATE POLICY "JWT keys readable by service role" ON public.jwt_keys
    FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "JWT keys manageable by service role" ON public.jwt_keys;
CREATE POLICY "JWT keys manageable by service role" ON public.jwt_keys
    FOR ALL USING (auth.role() = 'service_role');

-- QR verification tokens policies
DROP POLICY IF EXISTS "QR tokens readable by service role" ON public.qr_verification_tokens;
CREATE POLICY "QR tokens readable by service role" ON public.qr_verification_tokens
    FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "QR tokens manageable by service role" ON public.qr_verification_tokens;
CREATE POLICY "QR tokens manageable by service role" ON public.qr_verification_tokens
    FOR ALL USING (auth.role() = 'service_role');

-- Function to hash tokens (using pgcrypto)
CREATE OR REPLACE FUNCTION public.hash_token(token TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT encode(digest(token, 'sha256'), 'hex');
$$;

-- Function to verify token hash
CREATE OR REPLACE FUNCTION public.verify_token_hash(token TEXT, hash TEXT)
RETURNS BOOLEAN LANGUAGE sql IMMUTABLE AS $$
    SELECT public.hash_token(token) = hash;
$$;

-- Function to generate secure random token
CREATE OR REPLACE FUNCTION public.generate_secure_token(length INT DEFAULT 32)
RETURNS TEXT LANGUAGE sql VOLATILE AS $$
    SELECT encode(gen_random_bytes(length), 'base64url');
$$;

-- Function to create QR verification token
CREATE OR REPLACE FUNCTION public.create_qr_verification_token(
    p_universal_id TEXT,
    p_platform_id UUID DEFAULT NULL,
    p_redirect_uri TEXT DEFAULT NULL,
    p_scope TEXT[] DEFAULT '{profile,email,rankings}',
    p_expires_in_seconds INT DEFAULT 300  -- 5 minutes
)
RETURNS TABLE(token TEXT, token_hash TEXT, expires_at TIMESTAMPTZ) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_token TEXT;
    v_token_hash TEXT;
    v_expires_at TIMESTAMPTZ;
BEGIN
    v_token := public.generate_secure_token(32);
    v_token_hash := public.hash_token(v_token);
    v_expires_at := NOW() + (p_expires_in_seconds || ' seconds')::INTERVAL;
    
    INSERT INTO public.qr_verification_tokens (token_hash, universal_id, platform_id, redirect_uri, scope, expires_at)
    VALUES (v_token_hash, p_universal_id, p_platform_id, p_redirect_uri, p_scope, v_expires_at);
    
    RETURN QUERY SELECT v_token, v_token_hash, v_expires_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_qr_verification_token(TEXT, UUID, TEXT, TEXT[], INT) TO anon, authenticated, service_role;

-- Function to consume QR verification token
CREATE OR REPLACE FUNCTION public.consume_qr_verification_token(p_token TEXT)
RETURNS TABLE(
    universal_id TEXT,
    platform_id UUID,
    redirect_uri TEXT,
    scope TEXT[]
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_token_hash TEXT;
BEGIN
    v_token_hash := public.hash_token(p_token);
    
    UPDATE public.qr_verification_tokens
    SET used_at = NOW()
    WHERE token_hash = v_token_hash
      AND expires_at > NOW()
      AND used_at IS NULL
    RETURNING universal_id, platform_id, redirect_uri, scope
    INTO STRICT universal_id, platform_id, redirect_uri, scope;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or expired QR verification token';
    END IF;
    
    RETURN QUERY SELECT universal_id, platform_id, redirect_uri, scope;
END;
$$;

GRANT EXECUTE ON FUNCTION public.consume_qr_verification_token(TEXT) TO anon, authenticated, service_role;

-- Function to create auth session
CREATE OR REPLACE FUNCTION public.create_auth_session(
    p_user_id UUID,
    p_platform_id UUID,
    p_scope TEXT[] DEFAULT '{profile,email,rankings}',
    p_expires_in_seconds INT DEFAULT 3600,        -- 1 hour access token
    p_refresh_expires_in_seconds INT DEFAULT 2592000, -- 30 days refresh token
    p_user_agent TEXT DEFAULT NULL,
    p_ip_address INET DEFAULT NULL
)
RETURNS TABLE(
    session_id UUID,
    access_token TEXT,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ,
    refresh_expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_access_token TEXT;
    v_refresh_token TEXT;
    v_access_token_hash TEXT;
    v_refresh_token_hash TEXT;
    v_access_token_jti TEXT;
    v_expires_at TIMESTAMPTZ;
    v_refresh_expires_at TIMESTAMPTZ;
    v_session_id UUID;
BEGIN
    v_access_token := public.generate_secure_token(32);
    v_refresh_token := public.generate_secure_token(32);
    v_access_token_hash := public.hash_token(v_access_token);
    v_refresh_token_hash := public.hash_token(v_refresh_token);
    v_access_token_jti := public.generate_secure_token(16);
    v_expires_at := NOW() + (p_expires_in_seconds || ' seconds')::INTERVAL;
    v_refresh_expires_at := NOW() + (p_refresh_expires_in_seconds || ' seconds')::INTERVAL;
    
    INSERT INTO public.auth_sessions (
        user_id, platform_id, session_token_hash, refresh_token_hash,
        access_token_jti, scope, expires_at, refresh_expires_at,
        user_agent, ip_address
    ) VALUES (
        p_user_id, p_platform_id, v_access_token_hash, v_refresh_token_hash,
        v_access_token_jti, p_scope, v_expires_at, v_refresh_expires_at,
        p_user_agent, p_ip_address
    ) RETURNING id INTO v_session_id;
    
    RETURN QUERY SELECT v_session_id, v_access_token, v_refresh_token, v_expires_at, v_refresh_expires_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_auth_session(UUID, UUID, TEXT[], INT, INT, TEXT, INET) TO service_role;

-- Function to validate and refresh access token
CREATE OR REPLACE FUNCTION public.refresh_auth_session(
    p_refresh_token TEXT,
    p_platform_id UUID,
    p_expires_in_seconds INT DEFAULT 3600
)
RETURNS TABLE(
    access_token TEXT,
    expires_at TIMESTAMPTZ,
    scope TEXT[]
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_refresh_token_hash TEXT;
    v_session public.auth_sessions%ROWTYPE;
    v_new_access_token TEXT;
    v_new_access_token_hash TEXT;
    v_new_access_token_jti TEXT;
    v_new_expires_at TIMESTAMPTZ;
BEGIN
    v_refresh_token_hash := public.hash_token(p_refresh_token);
    
    SELECT * INTO v_session
    FROM public.auth_sessions
    WHERE refresh_token_hash = v_refresh_token_hash
      AND platform_id = p_platform_id
      AND refresh_expires_at > NOW()
      AND revoked_at IS NULL
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or expired refresh token';
    END IF;
    
    -- Revoke old access token
    UPDATE public.auth_sessions
    SET revoked_at = NOW()
    WHERE id = v_session.id;
    
    -- Generate new access token
    v_new_access_token := public.generate_secure_token(32);
    v_new_access_token_hash := public.hash_token(v_new_access_token);
    v_new_access_token_jti := public.generate_secure_token(16);
    v_new_expires_at := NOW() + (p_expires_in_seconds || ' seconds')::INTERVAL;
    
    INSERT INTO public.auth_sessions (
        user_id, platform_id, session_token_hash, refresh_token_hash,
        access_token_jti, scope, expires_at, refresh_expires_at,
        user_agent, ip_address
    ) VALUES (
        v_session.user_id, v_session.platform_id, v_new_access_token_hash, v_session.refresh_token_hash,
        v_new_access_token_jti, v_session.scope, v_new_expires_at, v_session.refresh_expires_at,
        v_session.user_agent, v_session.ip_address
    );
    
    RETURN QUERY SELECT v_new_access_token, v_new_expires_at, v_session.scope;
END;
$$;

GRANT EXECUTE ON FUNCTION public.refresh_auth_session(TEXT, UUID, INT) TO service_role;

-- Function to revoke all user sessions (logout everywhere)
CREATE OR REPLACE FUNCTION public.revoke_all_user_sessions(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    UPDATE public.auth_sessions
    SET revoked_at = NOW()
    WHERE user_id = p_user_id
      AND revoked_at IS NULL;
END;
$$;

GRANT EXECUTE ON FUNCTION public.revoke_all_user_sessions(UUID) TO service_role;

-- Function to validate access token (for resource servers)
CREATE OR REPLACE FUNCTION public.validate_access_token(p_access_token TEXT)
RETURNS TABLE(
    user_id UUID,
    platform_id UUID,
    scope TEXT[],
    expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_token_hash TEXT;
BEGIN
    v_token_hash := public.hash_token(p_access_token);
    
    SELECT user_id, platform_id, scope, expires_at
    INTO STRICT user_id, platform_id, scope, expires_at
    FROM public.auth_sessions
    WHERE session_token_hash = v_token_hash
      AND expires_at > NOW()
      AND revoked_at IS NULL;
    
    RETURN QUERY SELECT user_id, platform_id, scope, expires_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_access_token(TEXT) TO service_role;

-- Insert default platform for current UGT platform
INSERT INTO public.platforms (name, slug, display_name, description, website_url, redirect_uris, allowed_origins, client_id, client_secret_hash, is_trusted, scopes)
VALUES (
    'Universal Guard Trust Portal',
    'universal-guard-trust',
    'UGT Portal',
    'Main Universal Guard Trust Identity Portal',
    'https://universal-guard-trust.netlify.app',
    ARRAY['https://universal-guard-trust.netlify.app/auth/callback', 'http://localhost:5173/auth/callback'],
    ARRAY['https://universal-guard-trust.netlify.app', 'http://localhost:5173'],
    'ugt_portal_client',
    public.hash_token('ugt_portal_secret_change_in_production'),
    true,
    ARRAY['profile', 'email', 'rankings', 'admin']
) ON CONFLICT (slug) DO NOTHING;

-- Create initial JWT key pair (in production, generate properly and store securely)
-- This is a placeholder - replace with actual generated keys
INSERT INTO public.jwt_keys (kid, private_key_pem, public_key_pem, algorithm, is_active)
VALUES (
    'ugt-2024-01',
    '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD...', -- Replace with real key
    '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...\n-----END PUBLIC KEY-----',
    'RS256',
    true
) ON CONFLICT (kid) DO NOTHING;