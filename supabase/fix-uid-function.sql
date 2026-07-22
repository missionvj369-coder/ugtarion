-- Fix for get_next_ugt_id function returning "U" instead of full UID
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql

-- 1. Drop the corrupted function
DROP FUNCTION IF EXISTS public.get_next_ugt_id() CASCADE;

-- 2. Recreate the function with correct implementation
CREATE OR REPLACE FUNCTION public.get_next_ugt_id()
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    next_num BIGINT;
BEGIN
    -- Get next value from sequence
    next_num := nextval('public.ugt_id_seq');
    -- Return properly formatted UID
    RETURN 'UGT-' || LPAD(next_num::TEXT, 6, '0');
END;
$$;

-- 3. Grant permissions
GRANT EXECUTE ON FUNCTION public.get_next_ugt_id() TO anon, authenticated, service_role;

-- 4. Verify the function works
SELECT public.get_next_ugt_id() AS test_uid;

-- 5. Check sequence status
SELECT last_value, is_called FROM public.ugt_id_seq;