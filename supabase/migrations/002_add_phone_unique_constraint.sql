-- Migration: Add UNIQUE constraint on phone column and update RPC functions
-- Run this in Supabase SQL Editor or via supabase db push

-- Step 1: Add UNIQUE constraint on phone column
-- First, check if there are any duplicate phones and handle them
DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    -- Check for existing duplicate phones
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT phone, COUNT(*) as cnt
        FROM public.profiles
        GROUP BY phone
        HAVING COUNT(*) > 1
    ) duplicates;
    
    IF duplicate_count > 0 THEN
        RAISE NOTICE 'Found % duplicate phone numbers. Cannot add UNIQUE constraint until resolved.', duplicate_count;
        -- Option: You could auto-resolve by keeping the oldest record and deleting duplicates
        -- For now, we'll just warn and not add the constraint
    ELSE
        -- Add UNIQUE constraint on phone
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_phone_unique UNIQUE (phone);
        RAISE NOTICE 'UNIQUE constraint added to phone column successfully.';
    END IF;
END $$;

-- Step 2: Update register_user_atomic to check for duplicate phone
DROP FUNCTION IF EXISTS public.register_user_atomic(
    TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) CASCADE;

CREATE OR REPLACE FUNCTION public.register_user_atomic(
    p_name TEXT,
    p_dob DATE,
    p_email TEXT,
    p_phone TEXT,
    p_pincode TEXT,
    p_city TEXT,
    p_district TEXT,
    p_state TEXT,
    p_nation TEXT
)
RETURNS TABLE (
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
    pincode_rank BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_universal_id TEXT;
    v_email TEXT := LOWER(TRIM(p_email));
    v_phone TEXT := TRIM(p_phone);
BEGIN
    -- Check for duplicate email
    IF EXISTS (SELECT 1 FROM public.profiles p WHERE p.email = v_email) THEN
        RAISE EXCEPTION 'This email is already associated with a Universal ID.';
    END IF;

    -- Check for duplicate phone (NEW)
    IF EXISTS (SELECT 1 FROM public.profiles p WHERE p.phone = v_phone) THEN
        RAISE EXCEPTION 'This phone number is already associated with a Universal ID.';
    END IF;

    -- Atomically generate the next UGT ID
    v_universal_id := public.get_next_ugt_id();

    -- Insert the profile
    INSERT INTO public.profiles (
        universal_id, name, dob, email, phone, pincode, city, district, state, nation
    ) VALUES (
        v_universal_id,
        TRIM(p_name),
        p_dob,
        v_email,
        v_phone,
        TRIM(p_pincode),
        TRIM(p_city),
        TRIM(p_district),
        TRIM(p_state),
        TRIM(p_nation)
    );

    -- Return the inserted profile with calculated ranks
    -- SELECT column order MUST match RETURNS TABLE exactly (18 columns, same types)
    RETURN QUERY
    SELECT
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
        s.pincode_rank::BIGINT
    FROM public.profiles p
    CROSS JOIN LATERAL public.calculate_universal_standings(p.universal_id) s
    WHERE p.universal_id = v_universal_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_user_atomic(
    TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated, service_role;

-- Step 3: Grant execute permissions (already done above, but ensuring)
GRANT EXECUTE ON FUNCTION public.register_user_atomic(
    TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated, service_role;