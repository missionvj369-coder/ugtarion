-- Fix login_with_password - explicit casting
DROP FUNCTION IF EXISTS public.login_with_password(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.login_with_password(p_identifier TEXT, p_password TEXT)
RETURNS TABLE(success BOOLEAN, universal_id TEXT, user_id BIGINT, message TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_id BIGINT;
    v_universal_id TEXT;
    v_password_hash TEXT;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT pr.id, pr.universal_id, pr.password_hash INTO v_id, v_universal_id, v_password_hash
    FROM public.profiles AS pr
    WHERE (pr.email IS NOT NULL AND LOWER(pr.email) = p_identifier)
       OR (pr.phone IS NOT NULL AND pr.phone = p_identifier)
       OR (pr.universal_id IS NOT NULL AND LOWER(pr.universal_id) = p_identifier)
    LIMIT 1;
    
    IF v_id IS NULL THEN
        RETURN QUERY SELECT false, ''::TEXT, 0::BIGINT, 'No account found.'::TEXT;
        RETURN;
    END IF;
    
    IF v_password_hash IS NULL THEN
        RETURN QUERY SELECT false, ''::TEXT, 0::BIGINT, 'Use passwordless login.'::TEXT;
        RETURN;
    END IF;
    
    IF NOT public.verify_password(p_password, v_password_hash) THEN
        RETURN QUERY SELECT false, ''::TEXT, 0::BIGINT, 'Invalid password.'::TEXT;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, v_universal_id, v_id, 'Login successful!'::TEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.login_with_password(TEXT, TEXT) TO anon, authenticated, service_role;