-- Fix login_with_password function with BIGINT user_id
DROP FUNCTION IF EXISTS public.login_with_password(TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.login_with_password(p_identifier TEXT, p_password TEXT)
RETURNS TABLE(success BOOLEAN, universal_id TEXT, user_id BIGINT, message TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_profile RECORD;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT pr.id, pr.universal_id, pr.email, pr.phone, pr.password_hash INTO v_profile
    FROM public.profiles AS pr
    WHERE (pr.email IS NOT NULL AND LOWER(pr.email) = p_identifier)
       OR (pr.phone IS NOT NULL AND pr.phone = p_identifier)
       OR (pr.universal_id IS NOT NULL AND LOWER(pr.universal_id) = p_identifier)
    LIMIT 1;
    
    IF v_profile IS NULL THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::BIGINT, 'No account found.';
        RETURN;
    END IF;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::BIGINT, 'Use passwordless login.';
        RETURN;
    END IF;
    
    IF NOT public.verify_password(p_password, v_profile.password_hash) THEN
        RETURN QUERY SELECT false, NULL::TEXT, NULL::BIGINT, 'Invalid password.';
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, v_profile.universal_id, v_profile.id, 'Login successful!';
END;
$$;

GRANT EXECUTE ON FUNCTION public.login_with_password(TEXT, TEXT) TO anon, authenticated, service_role;