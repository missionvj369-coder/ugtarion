import dotenv from 'dotenv';

dotenv.config({ path: '.env.server' });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_SERVICE_KEY || !SUPABASE_ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables in .env.server');
  process.exit(1);
}

async function test() {
  // Check RLS policies on profiles table using Supabase Management API
  const response = await fetch('https://api.supabase.com/v1/projects/mgrdamgdpnbtxgxdxwbs/database/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: "SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check FROM pg_policies WHERE tablename = 'profiles';"
    })
  });
  
  const result = await response.json();
  console.log('RLS Policies on profiles:');
  console.log('Status:', response.status);
  console.log('Result:', JSON.stringify(result, null, 2));
}

test().catch(console.error);