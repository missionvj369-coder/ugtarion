-- ============================================
-- Row Level Security (RLS) Policies
-- Universal Guard Trust Database
-- ============================================

-- Enable RLS on existing tables only
DO $$
DECLARE
    tbl TEXT;
BEGIN
    -- Check and enable RLS for profiles
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND schemaname = 'public') THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
        DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
        DROP POLICY IF EXISTS "Service role full access to profiles" ON profiles;
        -- Create policies (using text comparison for compatibility)
        CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING ((auth.uid())::text = (id)::text);
        CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING ((auth.uid())::text = (id)::text);
        CREATE POLICY "Service role full access to profiles" ON profiles FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
        RAISE NOTICE 'RLS enabled on profiles';
    ELSE
        RAISE NOTICE 'profiles table not found, skipping';
    END IF;

    -- Check and enable RLS for auth_codes
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'auth_codes' AND schemaname = 'public') THEN
        ALTER TABLE auth_codes ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Service role full access to auth_codes" ON auth_codes;
        CREATE POLICY "Service role full access to auth_codes" ON auth_codes FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
        RAISE NOTICE 'RLS enabled on auth_codes';
    ELSE
        RAISE NOTICE 'auth_codes table not found, skipping';
    END IF;

    -- Check and enable RLS for refresh_tokens
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'refresh_tokens' AND schemaname = 'public') THEN
        ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can view own refresh tokens" ON refresh_tokens;
        DROP POLICY IF EXISTS "Service role can manage refresh tokens" ON refresh_tokens;
        CREATE POLICY "Users can view own refresh tokens" ON refresh_tokens FOR SELECT USING ((auth.uid())::text = (user_id)::text);
        CREATE POLICY "Service role can manage refresh tokens" ON refresh_tokens FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
        RAISE NOTICE 'RLS enabled on refresh_tokens';
    ELSE
        RAISE NOTICE 'refresh_tokens table not found, skipping';
    END IF;

    -- Check and enable RLS for password_reset_tokens
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'password_reset_tokens' AND schemaname = 'public') THEN
        ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Service role full access to password_reset_tokens" ON password_reset_tokens;
        CREATE POLICY "Service role full access to password_reset_tokens" ON password_reset_tokens FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
        RAISE NOTICE 'RLS enabled on password_reset_tokens';
    ELSE
        RAISE NOTICE 'password_reset_tokens table not found, skipping';
    END IF;

    -- Check and enable RLS for jwt_keys
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'jwt_keys' AND schemaname = 'public') THEN
        ALTER TABLE jwt_keys ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Service role full access to jwt_keys" ON jwt_keys;
        CREATE POLICY "Service role full access to jwt_keys" ON jwt_keys FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
        RAISE NOTICE 'RLS enabled on jwt_keys';
    ELSE
        RAISE NOTICE 'jwt_keys table not found, skipping';
    END IF;

    -- Check and enable RLS for platforms
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'platforms' AND schemaname = 'public') THEN
        ALTER TABLE platforms ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Anyone can view active platforms" ON platforms;
        DROP POLICY IF EXISTS "Service role can manage platforms" ON platforms;
        CREATE POLICY "Anyone can view active platforms" ON platforms FOR SELECT USING (is_active = true);
        CREATE POLICY "Service role can manage platforms" ON platforms FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
        RAISE NOTICE 'RLS enabled on platforms';
    ELSE
        RAISE NOTICE 'platforms table not found, skipping';
    END IF;

    -- Check and enable RLS for auth_sessions
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'auth_sessions' AND schemaname = 'public') THEN
        ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Users can view own sessions" ON auth_sessions;
        DROP POLICY IF EXISTS "Service role can manage sessions" ON auth_sessions;
        CREATE POLICY "Users can view own sessions" ON auth_sessions FOR SELECT USING ((auth.uid())::text = (user_id)::text);
        CREATE POLICY "Service role can manage sessions" ON auth_sessions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
        RAISE NOTICE 'RLS enabled on auth_sessions';
    ELSE
        RAISE NOTICE 'auth_sessions table not found, skipping';
    END IF;

    -- Check and enable RLS for qr_verification_tokens
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'qr_verification_tokens' AND schemaname = 'public') THEN
        ALTER TABLE qr_verification_tokens ENABLE ROW LEVEL SECURITY;
        DROP POLICY IF EXISTS "Service role full access to qr_verification_tokens" ON qr_verification_tokens;
        CREATE POLICY "Service role full access to qr_verification_tokens" ON qr_verification_tokens FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
        RAISE NOTICE 'RLS enabled on qr_verification_tokens';
    ELSE
        RAISE NOTICE 'qr_verification_tokens table not found, skipping';
    END IF;
END $$;

-- ============================================
-- Verify RLS is enabled
-- ============================================

SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;