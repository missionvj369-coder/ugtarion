-- Migration: Reset profiles ID sequence to 1
-- This resets the auto-increment counter so the next profile gets ID 1

-- Create function to reset sequence
CREATE OR REPLACE FUNCTION reset_profiles_sequence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM setval('profiles_id_seq', 1, false);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION reset_profiles_sequence() TO authenticated;
GRANT EXECUTE ON FUNCTION reset_profiles_sequence() TO anon;
GRANT EXECUTE ON FUNCTION reset_profiles_sequence() TO service_role;

-- Call the function to reset the sequence
SELECT reset_profiles_sequence();