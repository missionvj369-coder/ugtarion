-- =============================================================================
-- CRITICAL AUTH FIXES V2
-- 1. Fix register_user_with_password to return full profile (eliminates race condition)
-- 2. Ensure unique constraints on email and phone
-- 3. Fix RLS for profile retrieval
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. UNIQUE CONSTRAINTS
-- -----------------------------------------------------------------------------
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_profile_email') THEN
        ALTER TABLE public.profiles ADD CONSTRAINT unique_profile_email UNIQUE (email);
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'unique_profile_phone') THEN
        ALTER TABLE public.profiles ADD CONSTRAINT unique_profile_phone UNIQUE (phone);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. REGISTRATION FUNCTION - RETURNS FULL PROFILE
-- -----------------------------------------------------------------------------
-- This version returns the full profile data immediately, so the frontend
-- doesn't need a second query (which can fail due to RLS or race conditions).
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
    message TEXT,
    profile JSON
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_universal_id TEXT;
    v_profile_id BIGINT;
    v_password_hash TEXT;
    v_has_upper BOOLEAN;
    v_has_lower BOOLEAN;
    v_has_digit BOOLEAN;
    v_has_special BOOLEAN;
    v_profile JSON;
BEGIN
    -- Password strength validation
    IF LENGTH(p_password) < 8 THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must be at least 8 characters long'::TEXT, NULL::JSON;
        RETURN;
    END IF;
    
    v_has_upper := (p_password ~ '[A-Z]');
    v_has_lower := (p_password ~ '[a-z]');
    v_has_digit := (p_password ~ '[0-9]');
    v_has_special := (p_password ~ '[!@#$%^&*(),.?":{}|<>]');
    
    IF NOT v_has_upper THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one uppercase letter'::TEXT, NULL::JSON;
        RETURN;
    END IF;
    
    IF NOT v_has_lower THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one lowercase letter'::TEXT, NULL::JSON;
        RETURN;
    END IF;
    
    IF NOT v_has_digit THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one number'::TEXT, NULL::JSON;
        RETURN;
    END IF;
    
    IF NOT v_has_special THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'::TEXT, NULL::JSON;
        RETURN;
    END IF;
    
    -- Check for duplicate email
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = p_email) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This email is already registered.'::TEXT, NULL::JSON;
        RETURN;
    END IF;
    
    -- Check for duplicate phone
    IF EXISTS (SELECT 1 FROM public.profiles WHERE phone = p_phone) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This phone number is already registered.'::TEXT, NULL::JSON;
        RETURN;
    END IF;
    
    -- Generate UID using the sequence
    v_universal_id := public.get_next_ugt_id();
    
    -- Hash the password
    v_password_hash := public.hash_password(p_password);
    
    -- Insert the profile
    INSERT INTO public.profiles (universal_id, name, dob, email, phone, pincode, city, district, state, nation, password_hash)
    VALUES (v_universal_id, p_name, p_dob::DATE, p_email, p_phone, p_pincode, p_city, p_district, p_state, p_nation, v_password_hash)
    RETURNING id INTO v_profile_id;
    
    -- Build the profile JSON to return immediately
    SELECT json_build_object(
        'universal_id', p.universal_id,
        'name', p.name,
        'dob', p.dob,
        'email', p.email,
        'phone', p.phone,
        'pincode', p.pincode,
        'city', p.city,
        'district', p.district,
        'state', p.state,
        'nation', p.nation,
        'created_at', p.created_at
    ) INTO v_profile
    FROM public.profiles p
    WHERE p.id = v_profile_id;
    
    RETURN QUERY SELECT true, v_universal_id, 'Registration successful! Your Universal ID is ' || v_universal_id, v_profile;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_user_with_password(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 3. RLS POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profiles
DROP POLICY IF EXISTS "Allow public read access" ON public.profiles;
CREATE POLICY "Allow public read access" ON public.profiles
    FOR SELECT USING (true);

-- Ensure service role has full access
DROP POLICY IF EXISTS "Service role full access to profiles" ON public.profiles;
CREATE POLICY "Service role full access to profiles" ON public.profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

COMMIT;