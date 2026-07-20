/**
 * Complete Auth Flow Test
 * Tests: Register → Login → Forgot Password → Reset Password → Re-login
 * 
 * Usage: node scripts/test-full-auth-flow.mjs
 */

import { createClient } from '@supabase/supabase-js';

// Configuration - Update these for your environment
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

// Auth function endpoint (using redirects from ugtglobal.space)
const AUTH_FUNCTION_URL = 'https://ugtglobal.space/auth';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Generate unique test user
const timestamp = Date.now();
const TEST_USER = {
  name: `Test User ${timestamp}`,
  dob: '1990-01-15',
  email: `ugt_full_test_${timestamp}@test.com`,
  phone: `999999${String(timestamp).slice(-4)}`,
  pincode: '110001',
  city: 'New Delhi',
  district: 'Central Delhi',
  state: 'Delhi',
  nation: 'India',
  password: 'TestPass123!',
  newPassword: 'NewPass456!'
};

let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function log(testName, passed, message) {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${testName}`);
  if (message) console.log(`   ${message}`);
  testResults.tests.push({ name: testName, passed, message });
  if (passed) testResults.passed++;
  else testResults.failed++;
}

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// TEST 1: Register New User
// ============================================
async function testRegister() {
  console.log('\n📝 TEST 1: User Registration\n');
  console.log(`   Email: ${TEST_USER.email}`);
  console.log(`   Phone: ${TEST_USER.phone}\n`);

  try {
    const response = await fetch(`${AUTH_FUNCTION_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: TEST_USER.name,
        dob: TEST_USER.dob,
        email: TEST_USER.email,
        phone: TEST_USER.phone,
        pincode: TEST_USER.pincode,
        city: TEST_USER.city,
        district: TEST_USER.district,
        state: TEST_USER.state,
        nation: TEST_USER.nation,
        password: TEST_USER.password
      })
    });

    const data = await response.json();
    console.log('   Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      TEST_USER.userId = data.user_id;
      TEST_USER.universalId = data.universal_id;
      log('User Registration', true, `Universal ID: ${data.universal_id}`);
      return true;
    } else {
      log('User Registration', false, data.error_description || data.message);
      return false;
    }
  } catch (error) {
    log('User Registration', false, error.message);
    return false;
  }
}

// ============================================
// TEST 2: Login with Registered User
// ============================================
async function testLogin() {
  console.log('\n🔐 TEST 2: User Login\n');
  console.log(`   Email: ${TEST_USER.email}\n`);

  try {
    const response = await fetch(`${AUTH_FUNCTION_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: TEST_USER.email,
        password: TEST_USER.password
      })
    });

    const data = await response.json();
    console.log('   Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      TEST_USER.accessToken = data.tokens?.access_token;
      log('User Login', true, `Access token received`);
      return true;
    } else {
      log('User Login', false, data.error_description || data.message);
      return false;
    }
  } catch (error) {
    log('User Login', false, error.message);
    return false;
  }
}

// ============================================
// TEST 3: Forgot Password (Request Reset)
// ============================================
async function testForgotPassword() {
  console.log('\n🔑 TEST 3: Forgot Password (Request Reset)\n');
  console.log(`   Email: ${TEST_USER.email}\n`);

  try {
    const response = await fetch(`${AUTH_FUNCTION_URL}/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: TEST_USER.email
      })
    });

    const data = await response.json();
    console.log('   Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      // In development, the reset token is returned in the response
      if (data.reset_token) {
        TEST_USER.resetToken = data.reset_token;
        log('Forgot Password Request', true, `Reset token received (dev mode)`);
      } else {
        log('Forgot Password Request', true, `Reset email sent to ${TEST_USER.email}`);
        log('Forgot Password Request', false, 'Reset token not in response - check email');
      }
      return true;
    } else {
      log('Forgot Password Request', false, data.error_description || data.message);
      return false;
    }
  } catch (error) {
    log('Forgot Password Request', false, error.message);
    return false;
  }
}

// ============================================
// TEST 4: Reset Password
// ============================================
async function testResetPassword() {
  console.log('\n🔄 TEST 4: Reset Password\n');
  console.log(`   Token: ${TEST_USER.resetToken ? 'Available' : 'Not available'}\n`);

  if (!TEST_USER.resetToken) {
    log('Password Reset', false, 'No reset token available - skipped');
    return false;
  }

  try {
    const response = await fetch(`${AUTH_FUNCTION_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: TEST_USER.resetToken,
        new_password: TEST_USER.newPassword
      })
    });

    const data = await response.json();
    console.log('   Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      log('Password Reset', true, 'Password changed successfully');
      return true;
    } else {
      log('Password Reset', false, data.error_description || data.message);
      return false;
    }
  } catch (error) {
    log('Password Reset', false, error.message);
    return false;
  }
}

// ============================================
// TEST 5: Login with OLD Password (Should Fail)
// ============================================
async function testOldPasswordRejected() {
  console.log('\n🚫 TEST 5: Login with OLD Password (Should Fail)\n');
  console.log(`   Email: ${TEST_USER.email}\n`);

  try {
    const response = await fetch(`${AUTH_FUNCTION_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: TEST_USER.email,
        password: TEST_USER.password // Old password
      })
    });

    const data = await response.json();
    console.log('   Response:', JSON.stringify(data, null, 2));

    if (!response.ok || !data.success) {
      log('Old Password Rejected', true, 'Old password correctly rejected');
      return true;
    } else {
      log('Old Password Rejected', false, 'Old password was accepted - security issue!');
      return false;
    }
  } catch (error) {
    log('Old Password Rejected', false, error.message);
    return false;
  }
}

// ============================================
// TEST 6: Login with NEW Password (Should Work)
// ============================================
async function testNewPasswordWorks() {
  console.log('\n✅ TEST 6: Login with NEW Password (Should Work)\n');
  console.log(`   Email: ${TEST_USER.email}\n`);

  try {
    const response = await fetch(`${AUTH_FUNCTION_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: TEST_USER.email,
        password: TEST_USER.newPassword // New password
      })
    });

    const data = await response.json();
    console.log('   Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      log('New Password Works', true, 'Successfully logged in with new password');
      return true;
    } else {
      log('New Password Works', false, data.error_description || data.message);
      return false;
    }
  } catch (error) {
    log('New Password Works', false, error.message);
    return false;
  }
}

// ============================================
// TEST 7: Verify Reset Token is Invalidated
// ============================================
async function testTokenInvalidated() {
  console.log('\n🔒 TEST 7: Verify Reset Token is Invalidated\n');

  if (!TEST_USER.resetToken) {
    log('Token Invalidated', false, 'No reset token to test');
    return false;
  }

  try {
    const response = await fetch(`${AUTH_FUNCTION_URL}/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: TEST_USER.resetToken,
        new_password: 'AnotherPass789!'
      })
    });

    const data = await response.json();
    console.log('   Response:', JSON.stringify(data, null, 2));

    if (!response.ok || !data.success) {
      log('Token Invalidated', true, 'Reset token correctly rejected after use');
      return true;
    } else {
      log('Token Invalidated', false, 'Reset token still works - security issue!');
      return false;
    }
  } catch (error) {
    log('Token Invalidated', false, error.message);
    return false;
  }
}

// ============================================
// MAIN TEST RUNNER
// ============================================
async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   UNIVERSAL GUARD TRUST - COMPLETE AUTH FLOW TEST');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n   Supabase: ${SUPABASE_URL}`);
  console.log(`   Auth Function: ${AUTH_FUNCTION_URL}`);
  console.log(`   Test Email: ${TEST_USER.email}`);
  console.log(`   Timestamp: ${new Date().toISOString()}\n`);

  const tests = [
    { name: 'User Registration', fn: testRegister },
    { name: 'User Login', fn: testLogin },
    { name: 'Forgot Password Request', fn: testForgotPassword },
    { name: 'Password Reset', fn: testResetPassword },
    { name: 'Old Password Rejected', fn: testOldPasswordRejected },
    { name: 'New Password Works', fn: testNewPasswordWorks },
    { name: 'Token Invalidated', fn: testTokenInvalidated }
  ];

  for (const test of tests) {
    await sleep(500); // Small delay between tests
    await test.fn();
  }

  // Print Summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('   TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n   Total Tests: ${testResults.passed + testResults.failed}`);
  console.log(`   ✅ Passed: ${testResults.passed}`);
  console.log(`   ❌ Failed: ${testResults.failed}`);
  console.log(`   Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);

  if (testResults.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Your auth system is working correctly.\n');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED. Please review the issues above.\n');
  }

  console.log('═══════════════════════════════════════════════════════════════\n');

  return testResults.failed === 0;
}

// Run tests
runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });