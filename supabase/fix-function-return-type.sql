-- ============================================
-- FIX FUNCTION RETURN TYPES TO MATCH BIGINT IDs
-- Run this in Supabase SQL Editor
-- ============================================

-- Fix register_user_with_password to return BIGINT
DROP FUNCTION IF EXISTS public.register_user_with_password(
    TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
);
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
RETURNS TABLE(
    success BOOLEAN,
    universal_id TEXT,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
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
    
    INSERT INTO public.profiles (
        universal_id, name, dob, email, phone, pincode, city, district, state, nation, password_hash
    ) VALUES (
        v_universal_id, p_name, p_dob, p_email, p_phone, p_pincode, p_city, p_district, p_state, p_nation, v_password_hash
    ) RETURNING id INTO v_profile_id;
    
    RETURN QUERY SELECT true, v_universal_id, 'Registration successful! Your Universal ID is ' || v_universal_id;
END;
$$;

-- Fix login_with_password to return BIGINT
DROP FUNCTION IF EXISTS public.login_with_password(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.login_with_password(
    p_identifier TEXT,
    p_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    universal_id TEXT,
    user_id BIGINT,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_profile RECORD;
    v_password_hash TEXT;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT pr.id, pr.universal_id, pr.email, pr.phone, pr.password_hash INTO v_profile
    FROM public.profiles AS pr
    WHERE 
        (pr.email IS NOT NULL AND LOWER(pr.email) = p_identifier)
        OR (pr.phone IS NOT NULL AND pr.phone = p_identifier)
        OR (pr.universal_id IS NOT NULL AND LOWER(pr.universal_id) = p_identifier)
    LIMIT 1;
    
    IF v_profile IS NULL THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::BIGINT, 'No account found with this identifier.';
        RETURN;
    END IF;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::BIGINT, 'This account uses passwordless login. Please use email/mobile login.';
        RETURN;
    END IF;
    
    IF NOT public.verify_password(p_password, v_profile.password_hash) THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::BIGINT, 'Invalid password.';
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, v_profile.universal_id, v_profile.id, 'Login successful!';
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.register_user_with_password(
    TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.login_with_password(TEXT, TEXT) TO anon, authenticated, service_role;

-- Verify the functions
SELECT routine_name, data_type 
FROM information_schema.parameters 
JOIN information_schema.routines ON routines.routine_name = parameters.specific_name
WHERE parameter_name = '_return'
AND routines.routine_name IN ('register_user_with_password', 'login_with_password');