-- Create a function to reset the profiles ID sequence
CREATE OR REPLACE FUNCTION reset_profiles_sequence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM setval('profiles_id_seq', 1, false);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION reset_profiles_sequence() TO authenticated;
GRANT EXECUTE ON FUNCTION reset_profiles_sequence() TO anon;
GRANT EXECUTE ON FUNCTION reset_profiles_sequence() TO service_role;