-- Fix password strength validation in register_user_with_password
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql

-- Drop existing function
DROP FUNCTION IF EXISTS public.register_user_with_password(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) CASCADE;

-- Recreate with password strength validation
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
    v_has_upper BOOLEAN;
    v_has_lower BOOLEAN;
    v_has_digit BOOLEAN;
    v_has_special BOOLEAN;
BEGIN
    -- Password strength validation
    IF LENGTH(p_password) < 8 THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must be at least 8 characters long';
        RETURN;
    END IF;
    
    v_has_upper := (p_password ~ '[A-Z]');
    v_has_lower := (p_password ~ '[a-z]');
    v_has_digit := (p_password ~ '[0-9]');
    v_has_special := (p_password ~ '[!@#$%^&*(),.?":{}|<>]');
    
    IF NOT v_has_upper THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one uppercase letter';
        RETURN;
    END IF;
    
    IF NOT v_has_lower THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one lowercase letter';
        RETURN;
    END IF;
    
    IF NOT v_has_digit THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one number';
        RETURN;
    END IF;
    
    IF NOT v_has_special THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)';
        RETURN;
    END IF;
    
    -- Check for duplicate email
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = p_email) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This email is already registered.';
        RETURN;
    END IF;
    
    -- Check for duplicate phone
    IF EXISTS (SELECT 1 FROM public.profiles WHERE phone = p_phone) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This phone number is already registered.';
        RETURN;
    END IF;
    
    -- Generate UID using the sequence
    v_universal_id := public.get_next_ugt_id();
    
    -- Hash the password
    v_password_hash := public.hash_password(p_password);
    
    -- Insert the profile
    INSERT INTO public.profiles (universal_id, name, dob, email, phone, pincode, city, district, state, nation, password_hash)
    VALUES (v_universal_id, p_name, p_dob, p_email, p_phone, p_pincode, p_city, p_district, p_state, p_nation, v_password_hash)
    RETURNING id INTO v_profile_id;
    
    RETURN QUERY SELECT true, v_universal_id, 'Registration successful! Your Universal ID is ' || v_universal_id;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.register_user_with_password(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- Verify
SELECT 'Password strength validation added' as status;