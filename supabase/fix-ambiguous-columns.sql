-- Targeted fix for "column reference 'email' is ambiguous" + "structure of query does not match function result type"
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql

-- 1. Force drop all related functions (CASCADE to handle dependencies)
DROP FUNCTION IF EXISTS public.register_user_atomic(TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.login_user_atomic(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.calculate_universal_standings(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_next_ugt_id() CASCADE;
DROP FUNCTION IF EXISTS public.get_total_registrations() CASCADE;

-- 2. Recreate calculate_universal_standings (dependency) - EXACT column order
CREATE OR REPLACE FUNCTION public.calculate_universal_standings(target_uid TEXT)
RETURNS TABLE (
    global_order BIGINT,
    universe_rank BIGINT,
    nation_rank BIGINT,
    state_rank BIGINT,
    district_rank BIGINT,
    city_rank BIGINT,
    pincode_rank BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    target_nation TEXT;
    target_state TEXT;
    target_district TEXT;
    target_city TEXT;
    target_pincode TEXT;
BEGIN
    SELECT p.nation, p.state, p.district, p.city, p.pincode
    INTO target_nation, target_state, target_district, target_city, target_pincode
    FROM public.profiles p
    WHERE p.universal_id = target_uid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with universal_id % not found', target_uid;
    END IF;

    RETURN QUERY
    WITH ranked AS (
        SELECT
            p.universal_id,
            ROW_NUMBER() OVER (ORDER BY p.created_at ASC)::BIGINT AS global_order,
            ROW_NUMBER() OVER (ORDER BY p.created_at ASC)::BIGINT AS universe_rank,
            ROW_NUMBER() OVER (PARTITION BY p.nation ORDER BY p.created_at ASC)::BIGINT AS nation_rank,
            ROW_NUMBER() OVER (PARTITION BY p.state ORDER BY p.created_at ASC)::BIGINT AS state_rank,
            ROW_NUMBER() OVER (PARTITION BY p.district ORDER BY p.created_at ASC)::BIGINT AS district_rank,
            ROW_NUMBER() OVER (PARTITION BY p.city ORDER BY p.created_at ASC)::BIGINT AS city_rank,
            ROW_NUMBER() OVER (PARTITION BY p.pincode ORDER BY p.created_at ASC)::BIGINT AS pincode_rank
        FROM public.profiles p
    )
    SELECT
        r.global_order,
        r.universe_rank,
        r.nation_rank,
        r.state_rank,
        r.district_rank,
        r.city_rank,
        r.pincode_rank
    FROM ranked r
    WHERE r.universal_id = target_uid;
END;
$$;

GRANT EXECUTE ON FUNCTION public.calculate_universal_standings(TEXT) TO anon, authenticated, service_role;

-- 3. Recreate get_next_ugt_id
CREATE OR REPLACE FUNCTION public.get_next_ugt_id()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE next_num BIGINT;
BEGIN
    next_num := nextval('public.ugt_id_seq');
    RETURN 'UGT-' || LPAD(next_num::TEXT, 6, '0');
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_next_ugt_id() TO anon, authenticated, service_role;

-- 4. Recreate register_user_atomic - SELECT matches RETURNS TABLE exactly (18 cols, same order, same types)
CREATE OR REPLACE FUNCTION public.register_user_atomic(
    p_name TEXT, p_dob DATE, p_email TEXT, p_phone TEXT,
    p_pincode TEXT, p_city TEXT, p_district TEXT, p_state TEXT, p_nation TEXT
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
BEGIN
    -- FIXED: Use p.email (table alias) not bare email
    IF EXISTS (SELECT 1 FROM public.profiles p WHERE p.email = v_email) THEN
        RAISE EXCEPTION 'This email is already associated with a Universal ID.';
    END IF;

    v_universal_id := public.get_next_ugt_id();

    INSERT INTO public.profiles (universal_id, name, dob, email, phone, pincode, city, district, state, nation)
    VALUES (v_universal_id, TRIM(p_name), p_dob, v_email, TRIM(p_phone), TRIM(p_pincode), TRIM(p_city), TRIM(p_district), TRIM(p_state), TRIM(p_nation));

    -- SELECT column order MUST match RETURNS TABLE exactly (18 columns)
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
GRANT EXECUTE ON FUNCTION public.register_user_atomic(TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- 5. Recreate login_user_atomic - SELECT matches RETURNS TABLE exactly (19 cols, same order, same types)
CREATE OR REPLACE FUNCTION public.login_user_atomic(p_identifier TEXT)
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
    pincode_rank BIGINT,
    password_hash TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_identifier TEXT := LOWER(TRIM(p_identifier));
BEGIN
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
        s.pincode_rank::BIGINT,
        p.password_hash::TEXT
    FROM public.profiles p
    CROSS JOIN LATERAL public.calculate_universal_standings(p.universal_id) s
    WHERE p.universal_id ILIKE v_identifier OR p.email = v_identifier OR p.phone = v_identifier
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Universal ID, Email, or Phone not found. Please check spelling or register first.';
    END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.login_user_atomic(TEXT) TO anon, authenticated, service_role;

-- 6. Recreate get_total_registrations
CREATE OR REPLACE FUNCTION public.get_total_registrations()
RETURNS BIGINT LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN RETURN (SELECT COUNT(*)::BIGINT FROM public.profiles); END;
$$;
GRANT EXECUTE ON FUNCTION public.get_total_registrations() TO anon, authenticated, service_role;

-- 7. Reset sequence to match existing data (next ID = max + 1)
SELECT setval('public.ugt_id_seq', 
    COALESCE((
        SELECT MAX(CAST(REPLACE(universal_id, 'UGT-', '') AS INTEGER))
        FROM public.profiles
        WHERE universal_id LIKE 'UGT-%'
    ), 0) + 1
);