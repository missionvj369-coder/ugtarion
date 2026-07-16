-- Migration: Password Authentication & Password Reset System
-- Run this in Supabase SQL Editor or via supabase db push

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 1. Add password_hash column to profiles table
-- ============================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Add index for faster login lookups by email/phone
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);

-- ============================================
-- 2. Create password_reset_tokens table
-- ============================================
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    token_hash TEXT UNIQUE NOT NULL,              -- Hashed reset token
    identifier TEXT NOT NULL,                     -- email, phone, or universal_id used for reset
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for password reset tokens
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
    SELECT crypt(password, gen_salt('bf', 12));  -- bcrypt with cost 12
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

-- ============================================
-- 5. Function to request password reset
-- ============================================
CREATE OR REPLACE FUNCTION public.request_password_reset(
    p_identifier TEXT  -- email, phone, or universal_id
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
    -- Normalize identifier
    p_identifier := TRIM(LOWER(p_identifier));
    
    -- Find user by email, phone, or universal_id
    SELECT id, email, phone, universal_id INTO v_profile
    FROM public.profiles
    WHERE 
        (email IS NOT NULL AND LOWER(email) = p_identifier)
        OR (phone IS NOT NULL AND phone = p_identifier)
        OR (universal_id IS NOT NULL AND LOWER(universal_id) = p_identifier)
    LIMIT 1;
    
    IF NOT FOUND THEN
        -- Don't reveal if user exists (security best practice)
        -- But return success to prevent user enumeration
        RETURN QUERY SELECT true, 'If an account exists, a reset link has been sent.', NULL;
    END IF;
    
    v_user_id := v_profile.id;
    
    -- Check if user has a password set (not OAuth-only account)
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, 'This account uses passwordless login. Please use email/mobile login.', NULL;
    END IF;
    
    -- Invalidate any existing unused tokens for this user
    UPDATE public.password_reset_tokens
    SET used_at = NOW()
    WHERE user_id = v_user_id AND used_at IS NULL AND expires_at > NOW();
    
    -- Generate new reset token
    v_token := public.generate_reset_token();
    v_token_hash := public.hash_token(v_token);
    v_expires_at := NOW() + INTERVAL '1 hour';  -- 1 hour expiry
    
    -- Store token
    INSERT INTO public.password_reset_tokens (user_id, token_hash, identifier, expires_at)
    VALUES (v_user_id, v_token_hash, p_identifier, v_expires_at);
    
    -- In production, send email/SMS with reset link containing the token
    -- For now, we return the token (in production, send via email/SMS service)
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
    user_id UUID,
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
    -- Validate password strength
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
    
    -- Find and lock the token
    SELECT * INTO v_token_record
    FROM public.password_reset_tokens
    WHERE token_hash = v_token_hash
      AND expires_at > NOW()
      AND used_at IS NULL
    FOR UPDATE;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Invalid or expired reset token';
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
    
    -- Revoke all existing sessions for security
    PERFORM public.revoke_all_user_sessions(v_token_record.user_id);
    
    RETURN QUERY SELECT true, 'Password has been reset successfully. Please log in with your new password.';
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_password(TEXT, TEXT) TO anon, authenticated, service_role;

-- ============================================
-- 8. Function for password-based login
-- ============================================
CREATE OR REPLACE FUNCTION public.login_with_password(
    p_identifier TEXT,      -- email, phone, or universal_id
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
    
    -- Check if user has password set
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, NULL, NULL, 'This account uses passwordless login. Please use email/mobile login.';
    END IF;
    
    -- Verify password
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
    v_profile_id UUID;
BEGIN
    -- Validate password strength
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
    
    -- Normalize inputs
    p_email := TRIM(LOWER(p_email));
    p_phone := TRIM(p_phone);
    p_name := TRIM(p_name);
    
    -- Check for existing email
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = p_email) THEN
        RETURN QUERY SELECT false, NULL, 'This email is already associated with a Universal ID.';
    END IF;
    
    -- Check for existing phone
    IF EXISTS (SELECT 1 FROM public.profiles WHERE phone = p_phone) THEN
        RETURN QUERY SELECT false, NULL, 'This phone number is already registered.';
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
    
    -- Initialize standings
    INSERT INTO public.standings (profile_id) VALUES (v_profile_id);
    
    RETURN QUERY SELECT true, v_universal_id, 'Registration successful! Your Universal ID is ' || v_universal_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_user_with_password(TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- ============================================
-- 10. Function to update password (for logged-in users)
-- ============================================
CREATE OR REPLACE FUNCTION public.update_password(
    p_user_id UUID,
    p_current_password TEXT,
    p_new_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_profile RECORD;
    v_password_valid BOOLEAN;
    v_new_password_hash TEXT;
BEGIN
    -- Validate new password strength
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
    
    -- Get current password hash
    SELECT password_hash INTO v_profile
    FROM public.profiles
    WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'User not found';
    END IF;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, 'This account uses passwordless login';
    END IF;
    
    -- Verify current password
    v_password_valid := public.verify_password(p_current_password, v_profile.password_hash);
    
    IF NOT v_password_valid THEN
        RETURN QUERY SELECT false, 'Current password is incorrect';
    END IF;
    
    -- Hash new password
    v_new_password_hash := public.hash_password(p_new_password);
    
    -- Update password
    UPDATE public.profiles
    SET password_hash = v_new_password_hash,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Revoke all sessions for security
    PERFORM public.revoke_all_user_sessions(p_user_id);
    
    RETURN QUERY SELECT true, 'Password updated successfully. Please log in again.';
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_password(UUID, TEXT, TEXT) TO authenticated, service_role;

-- ============================================
-- 11. Cleanup expired reset tokens (can be run as cron job)
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