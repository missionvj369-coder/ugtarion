import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.server' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.server');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFunctions() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: "SELECT proname, prosrc FROM pg_proc WHERE proname IN ('register_user_with_password', 'login_user_atomic', 'hash_password', 'verify_password', 'get_next_ugt_id')"
  });
  console.log('Data:', data);
  console.log('Error:', error);
}

checkFunctions();