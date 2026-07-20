/**
 * Apply Auth Fix - Fixes BIGINT vs UUID type mismatch in auth functions
 * Run: node scripts/apply-auth-fix.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
  console.log('Set it with: export SUPABASE_SERVICE_ROLE_KEY=your_key_here');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

const fixSQL = `
-- Fix login_with_password return type
DROP FUNCTION IF EXISTS public.login_with_password(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.login_with_password(
    p_identifier TEXT,
    p_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    user_id UUID,
    universal_id TEXT,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_profile RECORD;
    v_password_valid BOOLEAN;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT pr.id, pr.universal_id, pr.password_hash INTO v_profile
    FROM public.profiles AS pr
    WHERE 
        (pr.email IS NOT NULL AND LOWER(pr.email) = p_identifier)
        OR (pr.phone IS NOT NULL AND pr.phone = p_identifier)
        OR (pr.universal_id IS NOT NULL AND LOWER(pr.universal_id) = p_identifier)
    LIMIT 1;
    
    IF v_profile IS NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Invalid credentials';
        RETURN;
    END IF;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This account uses passwordless login. Please use email/mobile login.';
        RETURN;
    END IF;
    
    v_password_valid := public.verify_password(p_password, v_profile.password_hash);
    
    IF NOT v_password_valid THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Invalid credentials';
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, v_profile.id, v_profile.universal_id, 'Login successful';
END;
$$;

-- Fix register_user_with_password
DROP FUNCTION IF EXISTS public.register_user_with_password(TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.register_user_with_password(
    p_name TEXT,
    p_dob DATE,
    p_email TEXT,
    p_phone TEXT,
    p_pincode TEXT,
    p_city TEXT,
    p_district TEXT,
    p_state TEXT,
    p_nation TEXT,
    p_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    universal_id TEXT,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_universal_id TEXT;
    v_password_hash TEXT;
    v_profile_id UUID;
BEGIN
    IF LENGTH(p_password) < 8 THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must be at least 8 characters long';
        RETURN;
    END IF;
    
    IF NOT p_password ~ '[A-Z]' THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one uppercase letter';
        RETURN;
    END IF;
    
    IF NOT p_password ~ '[a-z]' THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one lowercase letter';
        RETURN;
    END IF;
    
    IF NOT p_password ~ '[0-9]' THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'Password must contain at least one number';
        RETURN;
    END IF;
    
    p_email := TRIM(LOWER(p_email));
    p_phone := TRIM(p_phone);
    p_name := TRIM(p_name);
    
    IF EXISTS (SELECT 1 FROM public.profiles WHERE email = p_email) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This email is already associated with a Universal ID.';
        RETURN;
    END IF;
    
    IF EXISTS (SELECT 1 FROM public.profiles WHERE phone = p_phone) THEN
        RETURN QUERY SELECT false, NULL::TEXT, 'This phone number is already registered.';
        RETURN;
    END IF;
    
    SELECT 'UGT-' || LPAD(nextval('ugt_id_seq')::TEXT, 8, '0') INTO v_universal_id;
    
    v_password_hash := public.hash_password(p_password);
    
    INSERT INTO public.profiles (
        universal_id, name, dob, email, phone, pincode, city, district, state, nation, password_hash
    ) VALUES (
        v_universal_id, p_name, p_dob, p_email, p_phone, p_pincode, p_city, p_district, p_state, p_nation, v_password_hash
    ) RETURNING id INTO v_profile_id;
    
    RETURN QUERY SELECT true, v_universal_id, 'Registration successful! Your Universal ID is ' || v_universal_id;
END;
$$;

-- Fix request_password_reset
DROP FUNCTION IF EXISTS public.request_password_reset(TEXT);
CREATE OR REPLACE FUNCTION public.request_password_reset(
    p_identifier TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_user_id UUID;
    v_token TEXT;
    v_token_hash TEXT;
    v_expires_at TIMESTAMPTZ;
    v_profile RECORD;
BEGIN
    p_identifier := TRIM(LOWER(p_identifier));
    
    SELECT pr.id, pr.email, pr.phone, pr.universal_id, pr.password_hash INTO v_profile
    FROM public.profiles AS pr
    WHERE 
        (pr.email IS NOT NULL AND LOWER(pr.email) = p_identifier)
        OR (pr.phone IS NOT NULL AND pr.phone = p_identifier)
        OR (pr.universal_id IS NOT NULL AND LOWER(pr.universal_id) = p_identifier)
    LIMIT 1;
    
    IF v_profile IS NULL THEN
        RETURN QUERY SELECT true, 'If an account exists, a reset link has been sent.', NULL;
        RETURN;
    END IF;
    
    v_user_id := v_profile.id;
    
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, 'This account uses passwordless login. Please use email/mobile login.', NULL;
        RETURN;
    END IF;
    
    UPDATE public.password_reset_tokens
    SET used_at = NOW()
    WHERE user_id = v_user_id AND used_at IS NULL AND expires_at > NOW();
    
    v_token := public.generate_reset_token();
    v_token_hash := public.hash_token(v_token);
    v_expires_at := NOW() + INTERVAL '1 hour';
    
    INSERT INTO public.password_reset_tokens (user_id, token_hash, identifier, expires_at)
    VALUES (v_user_id, v_token_hash, p_identifier, v_expires_at);
    
    RETURN QUERY SELECT true, v_token, v_expires_at;
END;
$$;

-- Fix verify_password_reset_token
DROP FUNCTION IF EXISTS public.verify_password_reset_token(TEXT);
CREATE OR REPLACE FUNCTION public.verify_password_reset_token(
    p_token TEXT
)
RETURNS TABLE(
    valid BOOLEAN,
    user_id UUID,
    identifier TEXT,
    expires_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_token_hash TEXT;
    v_token_record RECORD;
BEGIN
    v_token_hash := public.hash_token(p_token);
    
    SELECT prt.user_id, prt.identifier, prt.expires_at INTO v_token_record
    FROM public.password_reset_tokens AS prt
    WHERE prt.token_hash = v_token_hash
      AND prt.expires_at > NOW()
      AND prt.used_at IS NULL
    LIMIT 1;
    
    IF v_token_record IS NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL;
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, v_token_record.user_id, v_token_record.identifier, v_token_record.expires_at;
END;
$$;

-- Fix reset_password
DROP FUNCTION IF EXISTS public.reset_password(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.reset_password(
    p_token TEXT,
    p_new_password TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_token_hash TEXT;
    v_token_record RECORD;
    v_password_hash TEXT;
BEGIN
    IF LENGTH(p_new_password) < 8 THEN
        RETURN QUERY SELECT false, 'Password must be at least 8 characters long';
        RETURN;
    END IF;
    
    IF NOT p_new_password ~ '[A-Z]' THEN
        RETURN QUERY SELECT false, 'Password must contain at least one uppercase letter';
        RETURN;
    END IF;
    
    IF NOT p_new_password ~ '[a-z]' THEN
        RETURN QUERY SELECT false, 'Password must contain at least one lowercase letter';
        RETURN;
    END IF;
    
    IF NOT p_new_password ~ '[0-9]' THEN
        RETURN QUERY SELECT false, 'Password must contain at least one number';
        RETURN;
    END IF;
    
    v_token_hash := public.hash_token(p_token);
    
    SELECT prt.id, prt.user_id INTO v_token_record
    FROM public.password_reset_tokens AS prt
    WHERE prt.token_hash = v_token_hash
      AND prt.expires_at > NOW()
      AND prt.used_at IS NULL
    FOR UPDATE;
    
    IF v_token_record IS NULL THEN
        RETURN QUERY SELECT false, 'Invalid or expired reset token';
        RETURN;
    END IF;
    
    v_password_hash := public.hash_password(p_new_password);
    
    UPDATE public.profiles
    SET password_hash = v_password_hash,
        updated_at = NOW()
    WHERE id = v_token_record.user_id;
    
    UPDATE public.password_reset_tokens
    SET used_at = NOW()
    WHERE id = v_token_record.id;
    
    RETURN QUERY SELECT true, 'Password has been reset successfully. Please log in with your new password.';
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.login_with_password(TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.register_user_with_password(TEXT, DATE, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.request_password_reset(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.verify_password_reset_token(TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.reset_password(TEXT, TEXT) TO anon, authenticated, service_role;
`;

async function applyFix() {
  console.log('🔧 Applying Auth Function Fix...\n');
  console.log('Supabase:', SUPABASE_URL);
  console.log('');

  try {
    // Execute the SQL fix
    const { data, error } = await supabase.rpc('pg_catalog.to_regclass', { text: fixSQL }).catch(() => null);
    
    // Use raw SQL execution via REST API
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/pg_catalog.exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: fixSQL }),
    });

    if (response.ok) {
      console.log('✅ Auth functions fixed successfully!');
    } else {
      // Try alternative approach - direct SQL via postgrest
      const sqlResponse = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Prefer': 'return=minimal',
        },
      });
      
      if (!sqlResponse.ok) {
        console.log('⚠️ Could not apply fix via API.');
        console.log('\n📋 Please run the following SQL in Supabase SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
        console.log('\n   Copy the contents of uuid-fix-temp.sql and run it.');
      }
    }
  } catch (e) {
    console.log('⚠️ Could not apply fix via API automatically.');
    console.log('\n📋 Please run the following SQL in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
    console.log('\n   Copy the contents of uuid-fix-temp.sql and run it.');
  }

  console.log('\n✅ Fix instructions provided.');
  console.log('\nAfter applying the fix, run the tests again:');
  console.log('   node scripts/test-full-auth-flow.mjs');
}

applyFix();