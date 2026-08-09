import dotenv from 'dotenv';

dotenv.config({ path: '.env.server' });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.server');
  process.exit(1);
}

async function testRegistration() {
  // Test registration with a new email/phone
  const testEmail = `test_${Date.now()}@example.com`;
  const testPhone = `99999${Date.now().toString().slice(-5)}`;
  
  const response = await fetch(SUPABASE_URL + '/rest/v1/rpc/register_user_with_password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_SERVICE_KEY,
    },
    body: JSON.stringify({
      p_name: 'Test User',
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
  
  const result = await response.json();
  console.log('Registration result:');
  console.log('Status:', response.status);
  console.log('Result:', JSON.stringify(result, null, 2));
  
  if (result && result[0] && result[0].universal_id) {
    const universalId = result[0].universal_id;
    console.log('\n--- Testing login_user_atomic ---');
    
    // Test login_user_atomic
    const response2 = await fetch(SUPABASE_URL + '/rest/v1/rpc/login_user_atomic', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_SERVICE_KEY,
        'Authorization': 'Bearer ' + SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify({
        p_identifier: universalId
      })
    });
    
    const result2 = await response2.json();
    console.log('login_user_atomic result:');
    console.log('Status:', response2.status);
    console.log('Result:', JSON.stringify(result2, null, 2));
  }
}

testRegistration().catch(console.error);