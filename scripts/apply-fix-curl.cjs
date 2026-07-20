/**
 * Apply fix using node fetch
 */

const https = require('https');

const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

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

GRANT EXECUTE ON FUNCTION public.login_with_password(TEXT, TEXT) TO anon, authenticated, service_role;
`;

const data = JSON.stringify({ query: fixSQL });

const options = {
  hostname: 'api.supabase.com',
  port: 443,
  path: '/v1/projects/mgrdamgdpnbtxgxdxwbs/database/query',
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(data);
req.end();