-- ============================================
-- CONVERT PROFILES TABLE TO UUID
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add new UUID column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS new_id UUID DEFAULT uuid_generate_v4();

-- 2. Update existing records with UUIDs
UPDATE public.profiles SET new_id = uuid_generate_v4() WHERE new_id IS NULL;

-- 3. Set NOT NULL constraint
ALTER TABLE public.profiles ALTER COLUMN new_id SET NOT NULL;

-- 4. Drop the old sequence and BIGINT id column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS id CASCADE;

-- 5. Rename new_id to id
ALTER TABLE public.profiles RENAME COLUMN new_id TO id;

-- 6. Set id as primary key
ALTER TABLE public.profiles ADD PRIMARY KEY (id);

-- 7. Update password_reset_tokens to use UUID user_id
ALTER TABLE public.password_reset_tokens DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.password_reset_tokens ADD COLUMN user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- 8. Check if there are any other tables referencing profiles.id
-- (Run this to see what else might need updating)
-- SELECT table_name, column_name FROM information_schema.columns 
-- WHERE column_default LIKE '%profiles_id_seq%';

-- 9. Verify the profiles table
SELECT id, universal_id, email FROM public.profiles LIMIT 5;