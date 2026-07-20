-- ============================================
-- CLEAN FIX: Drop all and recreate with BIGINT
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Drop existing functions (by exact signature)
DROP FUNCTION IF EXISTS public.register_user_with_password(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.login_with_password(TEXT, TEXT);
DROP FUNCTION IF EXISTS public.request_password_reset(TEXT);
DROP FUNCTION IF EXISTS public.verify_password_reset_token(TEXT);
DROP FUNCTION IF EXISTS public.reset_password(TEXT, TEXT);

-- 2. Create register_user_with_password with BIGINT
CREATE OR REPLACE FUNCTION public.register_user_with_password(
    p_name TEXT,
    p_dob TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_pincode TEXT,
    p_city TEXT,
    p_district TEXT,
    p_state TEXT,
    p_nation TEXT,
    p_password TEXT
)
RETURNS TABLE(success BOOLEAN, universal_id TEXT, message TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_universal_id TEXT;
    v_profile_id BIGINT;
    v_password_hash TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = p_email) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This email is already registered.';
        RETURN;
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.profiles WHERE phone = p_phone) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This phone number is already registered.';
        RETURN;
    END IF;
    
    SELECT 'UGT-' || LPAD(nextval('ugt_id_seq')::TEXT, 8, '0') INTO v_universal_id;
    v_password_hash := public.hash_password(p_password);
    
    INSERT INTO public.profiles (universal_id, name, dob, email, phone, pincode, city, district, state, nation, password_hash)
    VALUES (v_universal_id, p_name, p_dob, p_email, p_phone, p_pincode, p_city, p_district, p_state, p_nation, v_password_hash)
    RETURNING id INTO v_profile_id;
    
    RETURN QUERY SELECT true, v_universal_id, 'Registration successful! Your Universal ID is ' || v_universal_id;
END;
$$;

-- 3. Create login_with_password with BIGINT
CREATE OR REPLACE FUNCTION public.login_with_password(p_identifier TEXT, p_password TEXT)
RETURNS TABLE(success BOOLEAN, universal_id TEXT, user_id BIGINT, message TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_profile RECORD;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT pr.id, pr.universal_id, pr.email, pr.phone, pr.password_hash INTO v_profile
    FROM public.profiles AS pr
    WHERE (pr.email IS NOT NULL AND LOWER(pr.email) = p_identifier)
       OR (pr.phone IS NOT NULL AND pr.phone = p_identifier)
       OR (pr.universal_id IS NOT NULL AND LOWER(pr.universal_id) = p_identifier)
    LIMIT 1;
    
    IF v_profile IS NULL THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::BIGINT, 'No account found.';
        RETURN;
    END IF;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::BIGINT, 'Use passwordless login.';
        RETURN;
    END IF;
    
    IF NOT public.verify_password(p_password, v_profile.password_hash) THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::BIGINT, 'Invalid password.';
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, v_profile.universal_id, v_profile.id, 'Login successful!';
END;
$$;

-- 4. Create request_password_reset
CREATE OR REPLACE FUNCTION public.request_password_reset(p_identifier TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT, expires_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id BIGINT;
    v_token TEXT;
    v_token_hash TEXT;
    v_expires_at TIMESTAMPTZ;
    v_profile RECORD;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT pr.id, pr.email, pr.phone, pr.universal_id, pr.password_hash INTO v_profile
    FROM public.profiles AS pr
    WHERE (pr.email IS NOT NULL AND LOWER(pr.email) = p_identifier)
       OR (pr.phone IS NOT NULL AND pr.phone = p_identifier)
       OR (pr.universal_id IS NOT NULL AND LOWER(pr.universal_id) = p_identifier)
    LIMIT 1;
    
    IF v_profile IS NULL THEN
        RETURN QUERY SELECT true, 'If an account exists, a reset link has been sent.', NULL;
        RETURN;
    END IF;
    
    v_user_id := v_profile.id;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, 'Use passwordless login.', NULL;
        RETURN;
    END IF;
    
    UPDATE public.password_reset_tokens SET used_at = NOW()
    WHERE user_id = v_user_id AND used_at IS NULL AND expires_at > NOW();
    
    v_token := public.generate_reset_token();
    v_token_hash := public.hash_token(v_token);
    v_expires_at := NOW() + INTERVAL '1 hour';
    
    INSERT INTO public.password_reset_tokens (user_id, token_hash, identifier, expires_at)
    VALUES (v_user_id, v_token_hash, p_identifier, v_expires_at);
    
    RETURN QUERY SELECT true, v_token, v_expires_at;
END;
$$;

-- 5. Create verify_password_reset_token
CREATE OR REPLACE FUNCTION public.verify_password_reset_token(p_token TEXT)
RETURNS TABLE(valid BOOLEAN, user_id BIGINT, identifier TEXT, expires_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_token_hash TEXT;
    v_token_record RECORD;
BEGIN
    v_token_hash := public.hash_token(p_token);
    
    SELECT prt.user_id, prt.identifier, prt.expires_at INTO v_token_record
    FROM public.password_reset_tokens AS prt
    WHERE prt.token_hash = v_token_hash AND prt.expires_at > NOW() AND prt.used_at IS NULL
    LIMIT 1;
    
    IF v_token_record IS NULL THEN
        RETURN QUERY SELECT false, NULL::BIGINT, NULL::TEXT, NULL;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, v_token_record.user_id, v_token_record.identifier, v_token_record.expires_at;
END;
$$;

-- 6. Create reset_password
CREATE OR REPLACE FUNCTION public.reset_password(p_token TEXT, p_new_password TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_token_hash TEXT;
    v_token_record RECORD;
    v_password_hash TEXT;
BEGIN
    IF LENGTH(p_new_password) < 8 THEN
        RETURN QUERY SELECT false, 'Password must be at least 8 characters';
        RETURN;
    END IF;
    
    v_token_hash := public.hash_token(p_token);
    
    SELECT prt.id, prt.user_id INTO v_token_record
    FROM public.password_reset_tokens AS prt
    WHERE prt.token_hash = v_token_hash AND prt.expires_at > NOW() AND prt.used_at IS NULL
    FOR UPDATE;
    
    IF v_token_record IS NULL THEN
        RETURN QUERY SELECT false, 'Invalid or expired reset token';
        RETURN;
    END IF;
    
    v_password_hash := public.hash_password(p_new_password);
    
    UPDATE public.profiles SET password_hash = v_password_hash, updated_at = NOW()
    WHERE id = v_token_record.user_id;
    
    UPDATE public.password_reset_tokens SET used_at = NOW()
    WHERE id = v_token_record.id;
    
    RETURN QUERY SELECT true, 'Password reset successful!';
END;
$$;

-- 7. Grant permissions
GRANT EXECUTE ON FUNCTION public.register_user_with_password(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.login_with_password(TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.request_password_reset(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_password_reset_token(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.reset_password(TEXT, TEXT) TO anon, authenticated, service_role;

-- 8. Verify
SELECT 'Functions recreated successfully' as status;