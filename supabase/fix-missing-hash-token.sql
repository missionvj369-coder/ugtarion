-- Fix: Add missing hash_token function for password reset

-- Function to hash reset tokens (using pgcrypto's crypt)
CREATE OR REPLACE FUNCTION public.hash_token(token TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT encode(sha256(convert_to(token, 'utf8')::bytea), 'hex');
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.hash_token(TEXT) TO anon, authenticated, service_role;