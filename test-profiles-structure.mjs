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
  // Check profiles table structure
  const response = await fetch('https://api.supabase.com/v1/projects/mgrdamgdpnbtxgxdxwbs/database/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: "SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public' ORDER BY ordinal_position;"
    })
  });
  
  const result = await response.json();
  console.log('Profiles table structure:');
  console.log('Status:', response.status);
  console.log('Result:', JSON.stringify(result, null, 2));
  
  // Also check a sample profile
  const response2 = await fetch('https://api.supabase.com/v1/projects/mgrdamgdpnbtxgxdxwbs/database/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: "SELECT * FROM profiles LIMIT 1;"
    })
  });
  
  const result2 = await response2.json();
  console.log('\nSample profile:');
  console.log('Status:', response2.status);
  console.log('Result:', JSON.stringify(result2, null, 2));
}

test().catch(console.error);