const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createHashPassword() {
  const sql = `CREATE OR REPLACE FUNCTION public.hash_password(password TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
    SELECT crypt(password, gen_salt('bf', 12));  -- bcrypt with cost 12
$$;`;
  
  const { data, error } = await supabase.rpc('exec', { sql });
  console.log('Result:', data, error);
}

createHashPassword();