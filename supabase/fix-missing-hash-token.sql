-- Fix: Drop and recreate hash_token function with correct parameter name

-- Drop existing function first
DROP FUNCTION IF EXISTS public.hash_token(TEXT);

-- Function to hash reset tokens using SHA256
CREATE OR REPLACE FUNCTION public.hash_token(token TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT encode(sha256(convert_to(token, 'utf8')::bytea), 'hex');
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.hash_token(TEXT) TO anon, authenticated, service_role;