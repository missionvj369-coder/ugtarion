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
  // Check auth.users table structure
  const response = await fetch('https://api.supabase.com/v1/projects/mgrdamgdpnbtxgxdxwbs/database/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'auth' ORDER BY ordinal_position;"
    })
  });
  
  const result = await response.json();
  console.log('Auth.users table structure:');
  console.log('Status:', response.status);
  console.log('Result:', JSON.stringify(result, null, 2));
  
  // Check a sample auth user
  const response2 = await fetch('https://api.supabase.com/v1/projects/mgrdamgdpnbtxgxdxwbs/database/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: "SELECT id, email, phone, created_at FROM auth.users LIMIT 3;"
    })
  });
  
  const result2 = await response2.json();
  console.log('\nSample auth users:');
  console.log('Status:', response2.status);
  console.log('Result:', JSON.stringify(result2, null, 2));
  
  // Check if there's a link between auth.users and profiles
  const response3 = await fetch('https://api.supabase.com/v1/projects/mgrdamgdpnbtxgxdxwbs/database/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: "SELECT p.id as profile_id, p.universal_id, p.email as profile_email, u.id as auth_id, u.email as auth_email FROM profiles p LEFT JOIN auth.users u ON p.email = u.email LIMIT 5;"
    })
  });
  
  const result3 = await response3.json();
  console.log('\nProfile-Auth user link:');
  console.log('Status:', response3.status);
  console.log('Result:', JSON.stringify(result3, null, 2));
}

test().catch(console.error);