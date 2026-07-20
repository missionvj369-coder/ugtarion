-- Fix request_password_reset - fully qualified column references
DROP FUNCTION IF EXISTS public.request_password_reset(TEXT);

CREATE OR REPLACE FUNCTION public.request_password_reset(p_identifier TEXT)
RETURNS TABLE(success BOOLEAN, message TEXT, expires_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id BIGINT;
    v_token TEXT;
    v_token_hash TEXT;
    v_expires_at TIMESTAMPTZ;
    v_profile RECORD;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT pr.id, pr.email, pr.phone, pr.universal_id, pr.password_hash INTO v_profile
    FROM public.profiles AS pr
    WHERE (pr.email IS NOT NULL AND LOWER(pr.email) = p_identifier)
       OR (pr.phone IS NOT NULL AND pr.phone = p_identifier)
       OR (pr.universal_id IS NOT NULL AND LOWER(pr.universal_id) = p_identifier)
    LIMIT 1;
    
    IF v_profile IS NULL THEN
        RETURN QUERY SELECT true, 'If an account exists, a reset link has been sent.', NULL;
        RETURN;
    END IF;
    
    v_user_id := v_profile.id;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, 'Use passwordless login.', NULL;
        RETURN;
    END IF;
    
    UPDATE public.password_reset_tokens 
    SET used_at = NOW()
    WHERE user_id = v_user_id 
      AND used_at IS NULL 
      AND public.password_reset_tokens.expires_at > NOW();
    
    v_token := public.generate_reset_token();
    v_token_hash := public.hash_token(v_token);
    v_expires_at := NOW() + INTERVAL '1 hour';
    
    INSERT INTO public.password_reset_tokens (user_id, token_hash, identifier, expires_at)
    VALUES (v_user_id, v_token_hash, p_identifier, v_expires_at);
    
    RETURN QUERY SELECT true, v_token, v_expires_at;
END;
$$;

GRANT EXECUTE ON FUNCTION public.request_password_reset(TEXT) TO anon, authenticated, service_role;