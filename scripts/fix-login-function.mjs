 import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function fixLoginFunction() {
  console.log('🔧 Fixing login_with_password function...\n');

  const fixSQL = `
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
    -- Normalize identifier
    p_identifier := TRIM(LOWER(p_identifier));
    
    -- Find user by email, phone, or universal_id
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
    
    -- Check if user has password set
    IF v_profile.password_hash IS NULL THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'This account uses passwordless login. Please use email/mobile login.';
        RETURN;
    END IF;
    
    -- Verify password
    v_password_valid := public.verify_password(p_password, v_profile.password_hash);
    
    IF NOT v_password_valid THEN
        RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, 'Invalid credentials';
        RETURN;
    END IF;
    
    RETURN QUERY SELECT true, v_profile.id::UUID, v_profile.universal_id, 'Login successful';
END;
$$;

GRANT EXECUTE ON FUNCTION public.login_with_password(TEXT, TEXT) TO anon, authenticated, service_role;
`;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/pg_execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ query: fixSQL })
    });

    if (!response.ok) {
      const error = await response.json();
      console.log('RPC failed, trying direct SQL execution...');
    }
  } catch (e) {
    console.log('RPC not available, trying alternative method...');
  }

  // Try using the direct SQL endpoint
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: JSON.stringify({ sql: fixSQL })
    });
    console.log('Direct exec response:', response.status);
  } catch (e) {
    console.log('Direct exec not available');
  }

  console.log('\n📋 Manual Steps Required:');
  console.log('==================================================');
  console.log('1. Go to: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
  console.log('2. Run this SQL:');
  console.log('\n' + fixSQL);
  console.log('==================================================\n');
}

fixLoginFunction().catch(console.error);