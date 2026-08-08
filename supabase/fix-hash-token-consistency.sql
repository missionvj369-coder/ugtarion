-- Fix: Ensure hash_token function uses consistent encoding
-- This fixes the issue where tokens might not match due to encoding differences

-- Drop existing function first
DROP FUNCTION IF EXISTS public.hash_token(TEXT);

-- Function to hash reset tokens using SHA256 with explicit UTF-8 encoding
-- Using convert_to ensures consistent encoding across different PostgreSQL configurations
CREATE OR REPLACE FUNCTION public.hash_token(token TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT encode(sha256(convert_to(token, 'utf8')::bytea), 'hex');
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.hash_token(TEXT) TO anon, authenticated, service_role;

-- Verify the function was created correctly
DO $$
BEGIN
    -- Test the hash_token function
    PERFORM public.hash_token('test_token_123');
    RAISE NOTICE 'hash_token function is working correctly';
END $$;