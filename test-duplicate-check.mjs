import dotenv from 'dotenv';

dotenv.config({ path: '.env.server' });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.server');
  process.exit(1);
}

async function testDuplicate() {
  // Test registration with duplicate email
  const testEmail = `test_${Date.now()}@example.com`;
  const testPhone = `99999${Date.now().toString().slice(-5)}`;
  
  console.log('--- First registration ---');
  const response1 = await fetch(SUPABASE_URL + '/rest/v1/rpc/register_user_with_password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_SERVICE_KEY,
    },
    body: JSON.stringify({
      p_name: 'Test User 1',
      p_dob: '1990-01-01',
      p_email: testEmail,
      p_phone: testPhone,
      p_pincode: '110001',
      p_city: 'New Delhi',
      p_district: 'New Delhi',
      p_state: 'Delhi',
      p_nation: 'India',
      p_password: 'Test@1234'
    })
  });
  
  const result1 = await response1.json();
  console.log('Status:', response1.status);
  console.log('Result:', JSON.stringify(result1, null, 2));
  
  console.log('\n--- Second registration with same email ---');
  const response2 = await fetch(SUPABASE_URL + '/rest/v1/rpc/register_user_with_password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_SERVICE_KEY,
    },
    body: JSON.stringify({
      p_name: 'Test User 2',
      p_dob: '1990-01-01',
      p_email: testEmail,  // Same email
      p_phone: `99999${Date.now().toString().slice(-5)}`,  // Different phone
      p_pincode: '110001',
      p_city: 'New Delhi',
      p_district: 'New Delhi',
      p_state: 'Delhi',
      p_nation: 'India',
      p_password: 'Test@1234'
    })
  });
  
  const result2 = await response2.json();
  console.log('Status:', response2.status);
  console.log('Result:', JSON.stringify(result2, null, 2));
  
  console.log('\n--- Third registration with same phone ---');
  const response3 = await fetch(SUPABASE_URL + '/rest/v1/rpc/register_user_with_password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_SERVICE_KEY,
    },
    body: JSON.stringify({
      p_name: 'Test User 3',
      p_dob: '1990-01-01',
      p_email: `test_${Date.now()}@example.com`,  // Different email
      p_phone: testPhone,  // Same phone
      p_pincode: '110001',
      p_city: 'New Delhi',
      p_district: 'New Delhi',
      p_state: 'Delhi',
      p_nation: 'India',
      p_password: 'Test@1234'
    })
  });
  
  const result3 = await response3.json();
  console.log('Status:', response3.status);
  console.log('Result:', JSON.stringify(result3, null, 2));
}

testDuplicate().catch(console.error);