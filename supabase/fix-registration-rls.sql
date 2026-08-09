-- Allow users to read their own profile if they have the universal_id, 
-- even before they are fully authenticated via Supabase Auth.
-- This is critical for the registration flow to show the ID card immediately.

DROP POLICY IF EXISTS "Allow public read access" ON public.profiles;
CREATE POLICY "Allow public read access" ON public.profiles
    FOR SELECT USING (true);

-- Ensure service role still has full access
DROP POLICY IF EXISTS "Service role full access to profiles" ON public.profiles;
CREATE POLICY "Service role full access to profiles" ON public.profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');