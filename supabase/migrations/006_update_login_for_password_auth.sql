-- Migration: Update login_user_atomic to support phone and password authentication
-- Run this in Supabase SQL Editor or via supabase db push

-- ============================================
-- Update login_user_atomic to support phone and password
-- ============================================
CREATE OR REPLACE FUNCTION public.login_user_atomic(p_identifier TEXT)
RETURNS TABLE (
    id UUID,
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
        p.id::UUID,
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