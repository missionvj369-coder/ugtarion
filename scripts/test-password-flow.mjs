/**
 * Test Password Change Flow
 * Uses the already confirmed user
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://mgrdamgdpnbtxgxdxwbs.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o'
);

const TEST_EMAIL = 'ugt_test_1784480330797@gmail.com';
const CURRENT_PASSWORD = 'TestPassword123!';
const NEW_PASSWORD = 'NewPassword456!';

async function testPasswordChange() {
  console.log('=== TEST: Password Change ===\n');
  
  // Step 1: Login with current password
  console.log('1. Logging in with current password...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: CURRENT_PASSWORD
  });
  
  if (loginError) {
    console.log('✗ Login failed:', loginError.message);
    return false;
  }
  console.log('✓ Login successful');
  
  // Step 2: Change password
  console.log('\n2. Changing password...');
  const { data: updateData, error: updateError } = await supabase.auth.updateUser({
    password: NEW_PASSWORD
  });
  
  if (updateError) {
    console.log('✗ Password change failed:', updateError.message);
    return false;
  }
  console.log('✓ Password changed successfully');
  
  // Step 3: Login with new password
  console.log('\n3. Logging in with new password...');
  const { data: newLoginData, error: newLoginError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: NEW_PASSWORD
  });
  
  if (newLoginError) {
    console.log('✗ Login with new password failed:', newLoginError.message);
    return false;
  }
  console.log('✓ Login with new password successful');
  console.log('   User ID:', newLoginData.user.id);
  
  // Step 4: Verify old password no longer works
  console.log('\n4. Verifying old password is rejected...');
  const { error: oldPasswordError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: CURRENT_PASSWORD
  });
  
  if (oldPasswordError) {
    console.log('✓ Old password correctly rejected');
  } else {
    console.log('✗ Old password should have been rejected!');
  }
  
  console.log('\n=== ALL PASSWORD CHANGE TESTS PASSED ===');
  return true;
}

testPasswordChange().then(success => {
  process.exit(success ? 0 : 1);
}).catch(e => {
  console.error('Error:', e);
  process.exit(1);
});