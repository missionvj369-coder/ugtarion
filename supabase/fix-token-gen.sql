-- Drop existing functions first
DROP FUNCTION IF EXISTS public.hash_token(TEXT);
DROP FUNCTION IF EXISTS public.generate_reset_token();

-- Fix generate_reset_token to use standard base64
CREATE OR REPLACE FUNCTION public.generate_reset_token()
RETURNS TEXT AS $$
DECLARE
    v_bytes BYTEA;
BEGIN
    v_bytes := gen_random_bytes(32);
    RETURN encode(v_bytes, 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix hash_token to use standard base64
CREATE OR REPLACE FUNCTION public.hash_token(p_token TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN encode(sha256(p_token::bytea), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.generate_reset_token() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.hash_token(TEXT) TO anon, authenticated, service_role;