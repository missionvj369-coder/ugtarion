/**
 * Test Login with Confirmed User
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mgrdamgdpnbtxgxdxwbs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o'
);

async function testLogin() {
  console.log('Testing login with confirmed user...');
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'ugt_test_1784480330797@gmail.com',
    password: 'TestPassword123!'
  });
  
  if (error) {
    console.log('Login Error:', error.message);
    return false;
  }
  
  console.log('✓ Login successful!');
  console.log('  User ID:', data.user.id);
  console.log('  Email:', data.user.email);
  return true;
}

testLogin().then(success => {
  process.exit(success ? 0 : 1);
});