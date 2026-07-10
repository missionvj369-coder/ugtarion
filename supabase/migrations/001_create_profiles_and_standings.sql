-- Migration: Create profiles table and calculate_universal_standings RPC function
-- Run this in Supabase SQL Editor or via supabase db push

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    universal_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    dob DATE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    pincode TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    nation TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_universal_id ON public.profiles(universal_id);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_nation ON public.profiles(nation);
CREATE INDEX IF NOT EXISTS idx_profiles_state ON public.profiles(state);
CREATE INDEX IF NOT EXISTS idx_profiles_district ON public.profiles(district);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON public.profiles(city);
CREATE INDEX IF NOT EXISTS idx_profiles_pincode ON public.profiles(pincode);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (PostgreSQL doesn't support CREATE POLICY IF NOT EXISTS)
DROP POLICY IF EXISTS "Allow public read access" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert" ON public.profiles;
DROP POLICY IF EXISTS "Allow service role full access" ON public.profiles;

-- Policy: Allow anon key to read (for public registry count)
CREATE POLICY "Allow public read access" ON public.profiles
    FOR SELECT USING (true);

-- Policy: Allow anon key to insert (for registration)
CREATE POLICY "Allow public insert" ON public.profiles
    FOR INSERT WITH CHECK (true);

-- Policy: Allow service role full access (for server-side operations)
CREATE POLICY "Allow service role full access" ON public.profiles
    FOR ALL USING (auth.role() = 'service_role');

-- Create a sequence for generating sequential UGT IDs atomically
CREATE SEQUENCE IF NOT EXISTS public.ugt_id_seq START 1;

-- Drop existing functions if they exist (to handle return type changes)
DROP FUNCTION IF EXISTS public.calculate_universal_standings(TEXT);
DROP FUNCTION IF EXISTS public.get_next_ugt_id();
DROP FUNCTION IF EXISTS public.register_user_atomic(TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.login_user_atomic(TEXT);
DROP FUNCTION IF EXISTS public.get_total_registrations();

-- Function to calculate universal standings (ranks) for a given user
-- Returns global, nation, state, district, city, pincode ranks
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
    -- Fetch the target user's geographic data
    SELECT nation, state, district, city, pincode
    INTO target_nation, target_state, target_district, target_city, target_pincode
    FROM public.profiles
    WHERE universal_id = target_uid;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with universal_id % not found', target_uid;
    END IF;

    -- Calculate all ranks using window functions in a single query
    RETURN QUERY
    WITH ranked AS (
        SELECT
            p.universal_id,
            ROW_NUMBER() OVER (ORDER BY p.created_at ASC) AS global_order,
            ROW_NUMBER() OVER (ORDER BY p.created_at ASC) AS universe_rank,
            ROW_NUMBER() OVER (PARTITION BY p.nation ORDER BY p.created_at ASC) AS nation_rank,
            ROW_NUMBER() OVER (PARTITION BY p.state ORDER BY p.created_at ASC) AS state_rank,
            ROW_NUMBER() OVER (PARTITION BY p.district ORDER BY p.created_at ASC) AS district_rank,
            ROW_NUMBER() OVER (PARTITION BY p.city ORDER BY p.created_at ASC) AS city_rank,
            ROW_NUMBER() OVER (PARTITION BY p.pincode ORDER BY p.created_at ASC) AS pincode_rank
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

-- Grant execute permission to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.calculate_universal_standings(TEXT) TO anon, authenticated, service_role;

-- Function to get total registration count (uses sequence for atomic ID generation)
CREATE OR REPLACE FUNCTION public.get_next_ugt_id()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    next_num BIGINT;
BEGIN
    next_num := nextval('public.ugt_id_seq');
    RETURN 'UGT-' || LPAD(next_num::TEXT, 6, '0');
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_next_ugt_id() TO anon, authenticated, service_role;

-- Function to atomically register a user and return their record with ranks
-- This avoids race conditions by doing everything in a single transaction
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
BEGIN
    -- Check for duplicate email
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = v_email) THEN
        RAISE EXCEPTION 'This email is already associated with a Universal ID.';
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
        TRIM(p_phone),
        TRIM(p_pincode),
        TRIM(p_city),
        TRIM(p_district),
        TRIM(p_state),
        TRIM(p_nation)
    );

    -- Return the inserted profile with calculated ranks
    RETURN QUERY
    SELECT
        p.universal_id,
        p.name,
        p.dob,
        p.email,
        p.phone,
        p.pincode,
        p.city,
        p.district,
        p.state,
        p.nation,
        p.created_at,
        s.global_order,
        s.universe_rank,
        s.nation_rank,
        s.state_rank,
        s.district_rank,
        s.city_rank,
        s.pincode_rank
    FROM public.profiles p
    CROSS JOIN LATERAL public.calculate_universal_standings(p.universal_id) s
    WHERE p.universal_id = v_universal_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_user_atomic(
    TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO anon, authenticated, service_role;

-- Function to login user and get their ranks
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
    pincode_rank BIGINT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_identifier TEXT := LOWER(TRIM(p_identifier));
BEGIN
    RETURN QUERY
    SELECT
        p.universal_id,
        p.name,
        p.dob,
        p.email,
        p.phone,
        p.pincode,
        p.city,
        p.district,
        p.state,
        p.nation,
        p.created_at,
        s.global_order,
        s.universe_rank,
        s.nation_rank,
        s.state_rank,
        s.district_rank,
        s.city_rank,
        s.pincode_rank
    FROM public.profiles p
    CROSS JOIN LATERAL public.calculate_universal_standings(p.universal_id) s
    WHERE p.universal_id ILIKE v_identifier OR p.email = v_identifier
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Universal ID or Email not found. Please check spelling or register first.';
    END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.login_user_atomic(TEXT) TO anon, authenticated, service_role;

-- Function to get total registration count
CREATE OR REPLACE FUNCTION public.get_total_registrations()
RETURNS BIGINT LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.profiles);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_total_registrations() TO anon, authenticated, service_role;