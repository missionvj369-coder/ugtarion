-- ============================================
-- COMBINED AUTH MIGRATION
-- Run this in Supabase SQL Editor to set up all auth functions
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. Add password_hash column to profiles table
-- ============================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add indexes for faster login lookups by email/phone
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- ============================================
-- 2. Create password_reset_tokens table
-- ============================================
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    identifier TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON public.password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for password_reset_tokens
DROP POLICY IF EXISTS "Password reset tokens readable by service role" ON public.password_reset_tokens;
CREATE POLICY "Password reset tokens readable by service role" ON public.password_reset_tokens
    FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Password reset tokens manageable by service role" ON public.password_reset_tokens;
CREATE POLICY "Password reset tokens manageable by service role" ON public.password_reset_tokens
    FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 3. Function to hash password (using pgcrypto's crypt)
-- ============================================
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT crypt(password, gen_salt('bf', 12));
$$;

-- Function to verify password
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, password_hash TEXT)
RETURNS BOOLEAN LANGUAGE sql IMMUTABLE AS $$
    SELECT crypt(password, password_hash) = password_hash;
$$;

-- ============================================
-- 4. Function to generate secure reset token
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_reset_token()
RETURNS TEXT LANGUAGE sql VOLATILE AS $$
    SELECT encode(gen_random_bytes(32), 'base64url');
$$;

-- Function to hash token (for secure token storage)
CREATE OR REPLACE FUNCTION public.hash_token(token TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT encode(sha256(token::bytea), 'hex');
$$;

-- ============================================
-- 5. Function to request password reset
-- ============================================
CREATE OR REPLACE FUNCTION public.request_password_reset(
    p_identifier TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id BIGINT;
    v_token TEXT;
    v_token_hash TEXT;
    v_expires_at TIMESTAMPTZ;
    v_profile RECORD;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT id, email, phone, universal_id INTO v_profile
    FROM public.profiles
    WHERE 
        (email IS NOT NULL AND LOWER(email) = p_identifier)
        OR (phone IS NOT NULL AND phone = p_identifier)
        OR (universal_id IS NOT NULL AND LOWER(universal_id) = p_identifier)
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT true, 'If an account exists, a reset link has been sent.', NULL;
    END IF;
    
    v_user_id := v_profile.id;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, 'This account uses passwordless login. Please use email/mobile login.', NULL;
    END IF;
    
    UPDATE public.password_reset_tokens
    SET used_at = NOW()
    WHERE user_id = v_user_id AND used_at IS NULL AND expires_at > NOW();
    
    v_token := public.generate_reset_token();
    v_token_hash := public.hash_token(v_token);
    v_expires_at := NOW() + INTERVAL '1 hour';
    
    INSERT INTO public.password_reset_tokens (user_id, token_hash, identifier, expires_at)
    VALUES (v_user_id, v_token_hash, p_identifier, v_expires_at);
    
    RETURN QUERY SELECT true, v_token, v_expires_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.request_password_reset(TEXT) TO anon, authenticated, service_role;

-- ============================================
-- 6. Function to verify password reset token
-- ============================================
CREATE OR REPLACE FUNCTION public.verify_password_reset_token(
    p_token TEXT
)
RETURNS TABLE(
    valid BOOLEAN,
    user_id BIGINT,
    identifier TEXT,
    expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_token_hash TEXT;
    v_token_record RECORD;
BEGIN
    v_token_hash := public.hash_token(p_token);
    
    SELECT * INTO v_token_record
    FROM public.password_reset_tokens
    WHERE token_hash = v_token_hash
      AND expires_at > NOW()
      AND used_at IS NULL
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL, NULL, NULL;
    END IF;
    
    RETURN QUERY SELECT true, v_token_record.user_id, v_token_record.identifier, v_token_record.expires_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_password_reset_token(TEXT) TO anon, authenticated, service_role;

-- ============================================
-- 7. Function to reset password
-- ============================================
CREATE OR REPLACE FUNCTION public.reset_password(
    p_token TEXT,
    p_new_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_token_hash TEXT;
    v_token_record RECORD;
    v_password_hash TEXT;
BEGIN
    IF LENGTH(p_new_password) < 8 THEN
        RETURN QUERY SELECT false, 'Password must be at least 8 characters long';
    END IF;
    
    IF NOT p_new_password ~ '[A-Z]' THEN
        RETURN QUERY SELECT false, 'Password must contain at least one uppercase letter';
    END IF;
    
    IF NOT p_new_password ~ '[a-z]' THEN
        RETURN QUERY SELECT false, 'Password must contain at least one lowercase letter';
    END IF;
    
    IF NOT p_new_password ~ '[0-9]' THEN
        RETURN QUERY SELECT false, 'Password must contain at least one number';
    END IF;
    
    v_token_hash := public.hash_token(p_token);
    
    SELECT * INTO v_token_record
    FROM public.password_reset_tokens
    WHERE token_hash = v_token_hash
      AND expires_at > NOW()
      AND used_at IS NULL
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Invalid or expired reset token';
    END IF;
    
    v_password_hash := public.hash_password(p_new_password);
    
    UPDATE public.profiles
    SET password_hash = v_password_hash,
        updated_at = NOW()
    WHERE id = v_token_record.user_id;
    
    UPDATE public.password_reset_tokens
    SET used_at = NOW()
    WHERE id = v_token_record.id;
    
    RETURN QUERY SELECT true, 'Password has been reset successfully. Please log in with your new password.';
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_password(TEXT, TEXT) TO anon, authenticated, service_role;

-- ============================================
-- 8. Function for password-based login
-- ============================================
CREATE OR REPLACE FUNCTION public.login_with_password(
    p_identifier TEXT,
    p_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    user_id BIGINT,
    universal_id TEXT,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_profile RECORD;
    v_password_valid BOOLEAN;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT * INTO v_profile
    FROM public.profiles
    WHERE 
        (email IS NOT NULL AND LOWER(email) = p_identifier)
        OR (phone IS NOT NULL AND phone = p_identifier)
        OR (universal_id IS NOT NULL AND LOWER(universal_id) = p_identifier)
    LIMIT 1;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, NULL, NULL, 'Invalid credentials';
    END IF;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, NULL, NULL, 'This account uses passwordless login. Please use email/mobile login.';
    END IF;
    
    v_password_valid := public.verify_password(p_password, v_profile.password_hash);
    
    IF NOT v_password_valid THEN
        RETURN QUERY SELECT false, NULL, NULL, 'Invalid credentials';
    END IF;
    
    RETURN QUERY SELECT true, v_profile.id, v_profile.universal_id, 'Login successful';
END;
$$;

GRANT EXECUTE ON FUNCTION public.login_with_password(TEXT, TEXT) TO anon, authenticated, service_role;

-- ============================================
-- 9. Function to register user with password
-- ============================================
CREATE OR REPLACE FUNCTION public.register_user_with_password(
    p_name TEXT,
    p_dob DATE,
    p_email TEXT,
    p_phone TEXT,
    p_pincode TEXT,
    p_city TEXT,
    p_district TEXT,
    p_state TEXT,
    p_nation TEXT,
    p_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    universal_id TEXT,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_universal_id TEXT;
    v_password_hash TEXT;
    v_profile_id BIGINT;
BEGIN
    IF LENGTH(p_password) < 8 THEN
        RETURN QUERY SELECT false, NULL, 'Password must be at least 8 characters long';
    END IF;
    
    IF NOT p_password ~ '[A-Z]' THEN
        RETURN QUERY SELECT false, NULL, 'Password must contain at least one uppercase letter';
    END IF;
    
    IF NOT p_password ~ '[a-z]' THEN
        RETURN QUERY SELECT false, NULL, 'Password must contain at least one lowercase letter';
    END IF;
    
    IF NOT p_password ~ '[0-9]' THEN
        RETURN QUERY SELECT false, NULL, 'Password must contain at least one number';
    END IF;
    
    p_email := TRIM(LOWER(p_email));
    p_phone := TRIM(p_phone);
    p_name := TRIM(p_name);
    
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = p_email) THEN
        RETURN QUERY SELECT false, NULL, 'This email is already associated with a Universal ID.';
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.profiles WHERE phone = p_phone) THEN
        RETURN QUERY SELECT false, NULL, 'This phone number is already registered.';
    END IF;
    
    SELECT 'UGT-' || LPAD(nextval('ugt_id_seq')::TEXT, 8, '0') INTO v_universal_id;
    
    v_password_hash := public.hash_password(p_password);
    
    INSERT INTO public.profiles (
        universal_id, name, dob, email, phone, pincode, city, district, state, nation, password_hash
    ) VALUES (
        v_universal_id, p_name, p_dob, p_email, p_phone, p_pincode, p_city, p_district, p_state, p_nation, v_password_hash
    ) RETURNING id INTO v_profile_id;
    
    RETURN QUERY SELECT true, v_universal_id, 'Registration successful! Your Universal ID is ' || v_universal_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_user_with_password(TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- ============================================
-- 10. Update login_user_atomic to include password_hash
-- ============================================
DROP FUNCTION IF EXISTS public.login_user_atomic(TEXT);
CREATE OR REPLACE FUNCTION public.login_user_atomic(p_identifier TEXT)
RETURNS TABLE (
    id BIGINT,
    universal_id TEXT,
    name TEXT,
    dob DATE,
    email TEXT,
    phone TEXT,
    pincode TEXT,
    city TEXT,
    district TEXT,
    state TEXT,
    nation TEXT,
    created_at TIMESTAMPTZ,
    global_order BIGINT,
    universe_rank BIGINT,
    nation_rank BIGINT,
    state_rank BIGINT,
    district_rank BIGINT,
    city_rank BIGINT,
    pincode_rank BIGINT,
    password_hash TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_identifier TEXT := LOWER(TRIM(p_identifier));
BEGIN
    RETURN QUERY
    SELECT
        p.id::BIGINT,
        p.universal_id::TEXT,
        p.name::TEXT,
        p.dob::DATE,
        p.email::TEXT,
        p.phone::TEXT,
        p.pincode::TEXT,
        p.city::TEXT,
        p.district::TEXT,
        p.state::TEXT,
        p.nation::TEXT,
        p.created_at::TIMESTAMPTZ,
        s.global_order::BIGINT,
        s.universe_rank::BIGINT,
        s.nation_rank::BIGINT,
        s.state_rank::BIGINT,
        s.district_rank::BIGINT,
        s.city_rank::BIGINT,
        s.pincode_rank::BIGINT,
        p.password_hash::TEXT
    FROM public.profiles p
    CROSS JOIN LATERAL public.calculate_universal_standings(p.universal_id) s
    WHERE p.universal_id ILIKE v_identifier 
       OR p.email = v_identifier
       OR p.phone = v_identifier
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Universal ID, Email, or Phone not found. Please check spelling or register first.';
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.login_user_atomic(TEXT) TO anon, authenticated, service_role;

-- ============================================
-- 11. Cleanup expired reset tokens
-- ============================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_reset_tokens()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_deleted_count INTEGER;
BEGIN
    DELETE FROM public.password_reset_tokens
    WHERE expires_at < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
    RETURN v_deleted_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.cleanup_expired_reset_tokens() TO service_role;

-- ============================================
-- VERIFICATION: Check if functions exist
-- ============================================
SELECT 
    'Functions Created:' as status,
    routine_name as function_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND routine_name IN (
    'hash_password', 'verify_password', 'generate_reset_token',
    'request_password_reset', 'verify_password_reset_token', 'reset_password',
    'login_with_password', 'register_user_with_password', 'login_user_atomic'
)
ORDER BY routine_name;