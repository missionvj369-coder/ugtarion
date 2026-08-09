import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.server' });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.server');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkFunction() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: "SELECT routine_definition FROM information_schema.routines WHERE routine_name = 'register_user_with_password' AND routine_schema = 'public'"
  });
  
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Function definition:', JSON.stringify(data, null, 2));
  }
}

checkFunction();