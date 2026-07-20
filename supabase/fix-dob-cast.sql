-- Fix: Cast dob from TEXT to DATE in the function
DROP FUNCTION IF EXISTS public.register_user_with_password(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.register_user_with_password(
    p_name TEXT,
    p_dob TEXT,
    p_email TEXT,
    p_phone TEXT,
    p_pincode TEXT,
    p_city TEXT,
    p_district TEXT,
    p_state TEXT,
    p_nation TEXT,
    p_password TEXT
)
RETURNS TABLE(success BOOLEAN, universal_id TEXT, message TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_universal_id TEXT;
    v_profile_id BIGINT;
    v_password_hash TEXT;
BEGIN
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = p_email) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This email is already registered.';
        RETURN;
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.profiles WHERE phone = p_phone) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This phone number is already registered.';
        RETURN;
    END IF;
    
    SELECT 'UGT-' || LPAD(nextval('ugt_id_seq')::TEXT, 8, '0') INTO v_universal_id;
    v_password_hash := public.hash_password(p_password);
    
    INSERT INTO public.profiles (universal_id, name, dob, email, phone, pincode, city, district, state, nation, password_hash)
    VALUES (v_universal_id, p_name, p_dob::DATE, p_email, p_phone, p_pincode, p_city, p_district, p_state, p_nation, v_password_hash)
    RETURNING id INTO v_profile_id;
    
    RETURN QUERY SELECT true, v_universal_id, 'Registration successful! Your Universal ID is ' || v_universal_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_user_with_password(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;