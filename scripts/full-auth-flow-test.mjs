/**
 * Full Authentication Flow Test
 * Tests: Register -> Login -> Password Change -> Login with New Password
 */

import { createClient } from '@supabase/supabase-js';

// Configuration - Update these values
const SUPABASE_URL = process.env.SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const TEST_EMAIL = `ugt_test_${Date.now()}@gmail.com`;
const TEST_PASSWORD = 'TestPassword123!';
const NEW_PASSWORD = 'NewPassword456!';

async function testRegister() {
  console.log('\n=== TEST 1: Register ===');
  try {
    // Register via Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (error) {
      console.log('Register Error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✓ Registration successful');
    console.log('  User ID:', data.user?.id);
    console.log('  Email:', data.user?.email);
    return { success: true, user: data.user };
  } catch (e) {
    console.log('✗ Registration failed:', e.message);
    return { success: false, error: e.message };
  }
}

async function testLogin(email, password) {
  console.log('\n=== TEST 2: Login ===');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.log('Login Error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✓ Login successful');
    console.log('  User ID:', data.user?.id);
    console.log('  Session:', data.session ? 'Active' : 'None');
    return { success: true, session: data.session };
  } catch (e) {
    console.log('✗ Login failed:', e.message);
    return { success: false, error: e.message };
  }
}

async function testPasswordChange(email, currentPassword, newPassword) {
  console.log('\n=== TEST 3: Password Change ===');
  try {
    // First login to get valid session
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (loginError) {
      console.log('Login before password change failed:', loginError.message);
      return { success: false, error: loginError.message };
    }

    // Update password
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.log('Password Change Error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✓ Password changed successfully');
    console.log('  User ID:', data.user?.id);
    return { success: true };
  } catch (e) {
    console.log('✗ Password change failed:', e.message);
    return { success: false, error: e.message };
  }
}

async function testLoginWithNewPassword(email, newPassword) {
  console.log('\n=== TEST 4: Login with New Password ===');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: newPassword,
    });

    if (error) {
      console.log('Login Error:', error.message);
      return { success: false, error: error.message };
    }

    console.log('✓ Login with new password successful');
    console.log('  User ID:', data.user?.id);
    return { success: true };
  } catch (e) {
    console.log('✗ Login with new password failed:', e.message);
    return { success: false, error: e.message };
  }
}

async function testOldPasswordShouldFail(email, oldPassword) {
  console.log('\n=== TEST 5: Old Password Should Fail ===');
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: oldPassword,
    });

    if (error) {
      console.log('✓ Old password correctly rejected');
      console.log('  Error:', error.message);
      return { success: true };
    }

    console.log('✗ Old password should have been rejected!');
    return { success: false };
  } catch (e) {
    console.log('✓ Old password correctly rejected:', e.message);
    return { success: true };
  }
}

async function runFullTest() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║     FULL AUTHENTICATION FLOW TEST                         ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\nTest Email:', TEST_EMAIL);
  console.log('Test Password:', TEST_PASSWORD);
  console.log('New Password:', NEW_PASSWORD);

  // Test 1: Register
  const registerResult = await testRegister();
  if (!registerResult.success) {
    console.log('\n⚠️  Registration failed, but continuing with other tests...');
  }

  // Small delay to ensure user is created
  await new Promise(r => setTimeout(r, 1000));

  // Test 2: Login with original password
  const loginResult = await testLogin(TEST_EMAIL, TEST_PASSWORD);
  if (!loginResult.success) {
    console.log('\n⚠️  Login failed. Check if email verification is required.');
    console.log('   You may need to either:');
    console.log('   1. Disable email confirmation in Supabase');
    console.log('   2. Or manually confirm the user in Supabase dashboard');
  }

  // Test 3: Password Change
  const passwordChangeResult = await testPasswordChange(TEST_EMAIL, TEST_PASSWORD, NEW_PASSWORD);
  if (!passwordChangeResult.success) {
    console.log('\n⚠️  Password change failed.');
  }

  // Test 4: Login with new password
  const newLoginResult = await testLoginWithNewPassword(TEST_EMAIL, NEW_PASSWORD);
  if (!newLoginResult.success) {
    console.log('\n⚠️  Login with new password failed.');
  }

  // Test 5: Old password should fail
  const oldPasswordResult = await testOldPasswordShouldFail(TEST_EMAIL, TEST_PASSWORD);

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    TEST SUMMARY                           ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('  Register:              ', registerResult.success ? '✓ PASS' : '✗ FAIL');
  console.log('  Login (original):       ', loginResult.success ? '✓ PASS' : '✗ FAIL');
  console.log('  Password Change:       ', passwordChangeResult.success ? '✓ PASS' : '✗ FAIL');
  console.log('  Login (new password):  ', newLoginResult.success ? '✓ PASS' : '✗ FAIL');
  console.log('  Old password rejected: ', oldPasswordResult.success ? '✓ PASS' : '✗ FAIL');

  const allPassed = registerResult.success && loginResult.success && 
                    passwordChangeResult.success && newLoginResult.success && 
                    oldPasswordResult.success;
  
  console.log('\n' + (allPassed ? '🎉 ALL TESTS PASSED!' : '⚠️  SOME TESTS FAILED'));
  
  return allPassed;
}

// Run the test
runFullTest()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(e => {
    console.error('Test runner error:', e);
    process.exit(1);
  });