-- ============================================
-- COMPREHENSIVE AUTH FIX
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql
-- ============================================

-- 1. Add password_hash column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- 2. Add updated_at column if missing
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- 3. Create hash_password function
CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT crypt(password, gen_salt('bf', 12));
$$;

-- 4. Create verify_password function
CREATE OR REPLACE FUNCTION public.verify_password(password TEXT, password_hash TEXT)
RETURNS BOOLEAN LANGUAGE sql IMMUTABLE AS $$
    SELECT crypt(password, password_hash) = password_hash;
$$;

-- 5. Create hash_token function
CREATE OR REPLACE FUNCTION public.hash_token(token TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT encode(sha256(token::bytea), 'hex');
$$;

-- 6. Create generate_reset_token function
CREATE OR REPLACE FUNCTION public.generate_reset_token()
RETURNS TEXT LANGUAGE sql VOLATILE AS $$
    SELECT encode(gen_random_bytes(32), 'base64url');
$$;

-- 7. Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,
    identifier TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token_hash ON public.password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

-- Enable RLS
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Password reset tokens readable by service role" ON public.password_reset_tokens;
CREATE POLICY "Password reset tokens readable by service role" ON public.password_reset_tokens
    FOR SELECT USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Password reset tokens manageable by service role" ON public.password_reset_tokens;
CREATE POLICY "Password reset tokens manageable by service role" ON public.password_reset_tokens
    FOR ALL USING (auth.role() = 'service_role');

-- 8. Create login_with_password function (FIXED - no ambiguous columns)
DROP FUNCTION IF EXISTS public.login_with_password(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.login_with_password(
    p_identifier TEXT,
    p_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    user_id UUID,
    universal_id TEXT,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_profile RECORD;
    v_password_valid BOOLEAN;
BEGIN
    -- Normalize identifier
    p_identifier := TRIM(LOWER(p_identifier));
    
    -- Find user by email, phone, or universal_id
    SELECT pr.id, pr.universal_id, pr.password_hash INTO v_profile
    FROM public.profiles AS pr
    WHERE 
        (pr.email IS NOT NULL AND LOWER(pr.email) = p_identifier)
        OR (pr.phone IS NOT NULL AND pr.phone = p_identifier)
        OR (pr.universal_id IS NOT NULL AND LOWER(pr.universal_id) = p_identifier)
    LIMIT 1;
    
    IF v_profile IS NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Invalid credentials';
        RETURN;
    END IF;
    
    -- Check if user has password set
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This account uses passwordless login. Please use email/mobile login.';
        RETURN;
    END IF;
    
    -- Verify password
    v_password_valid := public.verify_password(p_password, v_profile.password_hash);
    
    IF NOT v_password_valid THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Invalid credentials';
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, v_profile.id, v_profile.universal_id, 'Login successful';
END;
$$;

GRANT EXECUTE ON FUNCTION public.login_with_password(TEXT, TEXT) TO anon, authenticated, service_role;

-- 9. Create register_user_with_password function (FIXED)
DROP FUNCTION IF EXISTS public.register_user_with_password(TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);
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
    v_profile_id UUID;
BEGIN
    -- Validate password strength
    IF LENGTH(p_password) < 8 THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must be at least 8 characters long';
        RETURN;
    END IF;
    
    IF NOT p_password ~ '[A-Z]' THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one uppercase letter';
        RETURN;
    END IF;
    
    IF NOT p_password ~ '[a-z]' THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one lowercase letter';
        RETURN;
    END IF;
    
    IF NOT p_password ~ '[0-9]' THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one number';
        RETURN;
    END IF;
    
    -- Normalize inputs
    p_email := TRIM(LOWER(p_email));
    p_phone := TRIM(p_phone);
    p_name := TRIM(p_name);
    
    -- Check for existing email
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = p_email) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This email is already associated with a Universal ID.';
        RETURN;
    END IF;
    
    -- Check for existing phone
    IF EXISTS (SELECT 1 FROM public.profiles WHERE phone = p_phone) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This phone number is already registered.';
        RETURN;
    END IF;
    
    -- Generate universal ID using atomic sequence
    SELECT 'UGT-' || LPAD(nextval('ugt_id_seq')::TEXT, 8, '0') INTO v_universal_id;
    
    -- Hash password
    v_password_hash := public.hash_password(p_password);
    
    -- Insert profile with password
    INSERT INTO public.profiles (
        universal_id, name, dob, email, phone, pincode, city, district, state, nation, password_hash
    ) VALUES (
        v_universal_id, p_name, p_dob, p_email, p_phone, p_pincode, p_city, p_district, p_state, p_nation, v_password_hash
    ) RETURNING id INTO v_profile_id;
    
    RETURN QUERY SELECT true, v_universal_id, 'Registration successful! Your Universal ID is ' || v_universal_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_user_with_password(TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- 10. Create request_password_reset function (FIXED)
DROP FUNCTION IF EXISTS public.request_password_reset(TEXT);
CREATE OR REPLACE FUNCTION public.request_password_reset(
    p_identifier TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id UUID;
    v_token TEXT;
    v_token_hash TEXT;
    v_expires_at TIMESTAMPTZ;
    v_profile RECORD;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT pr.id, pr.email, pr.phone, pr.universal_id, pr.password_hash INTO v_profile
    FROM public.profiles AS pr
    WHERE 
        (pr.email IS NOT NULL AND LOWER(pr.email) = p_identifier)
        OR (pr.phone IS NOT NULL AND pr.phone = p_identifier)
        OR (pr.universal_id IS NOT NULL AND LOWER(pr.universal_id) = p_identifier)
    LIMIT 1;
    
    IF v_profile IS NULL THEN
        -- Don't reveal if user exists (security best practice)
        RETURN QUERY SELECT true, 'If an account exists, a reset link has been sent.', NULL;
        RETURN;
    END IF;
    
    v_user_id := v_profile.id;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, 'This account uses passwordless login. Please use email/mobile login.', NULL;
        RETURN;
    END IF;
    
    -- Invalidate any existing unused tokens for this user
    UPDATE public.password_reset_tokens
    SET used_at = NOW()
    WHERE user_id = v_user_id AND used_at IS NULL AND expires_at > NOW();
    
    -- Generate new reset token
    v_token := public.generate_reset_token();
    v_token_hash := public.hash_token(v_token);
    v_expires_at := NOW() + INTERVAL '1 hour';
    
    -- Store token
    INSERT INTO public.password_reset_tokens (user_id, token_hash, identifier, expires_at)
    VALUES (v_user_id, v_token_hash, p_identifier, v_expires_at);
    
    -- Return the token (in production, send via email/SMS)
    RETURN QUERY SELECT true, v_token, v_expires_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.request_password_reset(TEXT) TO anon, authenticated, service_role;

-- 11. Create verify_password_reset_token function
DROP FUNCTION IF EXISTS public.verify_password_reset_token(TEXT);
CREATE OR REPLACE FUNCTION public.verify_password_reset_token(
    p_token TEXT
)
RETURNS TABLE(
    valid BOOLEAN,
    user_id UUID,
    identifier TEXT,
    expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_token_hash TEXT;
    v_token_record RECORD;
BEGIN
    v_token_hash := public.hash_token(p_token);
    
    SELECT prt.user_id, prt.identifier, prt.expires_at INTO v_token_record
    FROM public.password_reset_tokens AS prt
    WHERE prt.token_hash = v_token_hash
      AND prt.expires_at > NOW()
      AND prt.used_at IS NULL
    LIMIT 1;
    
    IF v_token_record IS NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, v_token_record.user_id, v_token_record.identifier, v_token_record.expires_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_password_reset_token(TEXT) TO anon, authenticated, service_role;

-- 12. Create reset_password function
DROP FUNCTION IF EXISTS public.reset_password(TEXT, TEXT);
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
    -- Validate password strength
    IF LENGTH(p_new_password) < 8 THEN
        RETURN QUERY SELECT false, 'Password must be at least 8 characters long';
        RETURN;
    END IF;
    
    IF NOT p_new_password ~ '[A-Z]' THEN
        RETURN QUERY SELECT false, 'Password must contain at least one uppercase letter';
        RETURN;
    END IF;
    
    IF NOT p_new_password ~ '[a-z]' THEN
        RETURN QUERY SELECT false, 'Password must contain at least one lowercase letter';
        RETURN;
    END IF;
    
    IF NOT p_new_password ~ '[0-9]' THEN
        RETURN QUERY SELECT false, 'Password must contain at least one number';
        RETURN;
    END IF;
    
    v_token_hash := public.hash_token(p_token);
    
    -- Find and lock the token
    SELECT prt.id, prt.user_id INTO v_token_record
    FROM public.password_reset_tokens AS prt
    WHERE prt.token_hash = v_token_hash
      AND prt.expires_at > NOW()
      AND prt.used_at IS NULL
    FOR UPDATE;
    
    IF v_token_record IS NULL THEN
        RETURN QUERY SELECT false, 'Invalid or expired reset token';
        RETURN;
    END IF;
    
    -- Hash new password
    v_password_hash := public.hash_password(p_new_password);
    
    -- Update user's password
    UPDATE public.profiles
    SET password_hash = v_password_hash,
        updated_at = NOW()
    WHERE id = v_token_record.user_id;
    
    -- Mark token as used
    UPDATE public.password_reset_tokens
    SET used_at = NOW()
    WHERE id = v_token_record.id;
    
    RETURN QUERY SELECT true, 'Password has been reset successfully. Please log in with your new password.';
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_password(TEXT, TEXT) TO anon, authenticated, service_role;

-- 13. Verify all functions exist
SELECT 
    'Functions Created:' as status,
    routine_name as function_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
AND routine_name IN (
    'hash_password', 'verify_password', 'generate_reset_token', 'hash_token',
    'request_password_reset', 'verify_password_reset_token', 'reset_password',
    'login_with_password', 'register_user_with_password'
)
ORDER BY routine_name;