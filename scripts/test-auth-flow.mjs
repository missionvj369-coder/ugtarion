/**
 * Test Authentication Flow
 * Tests: Registration, Login, Password Reset Request
 * 
 * Usage: node scripts/test-auth-flow.mjs
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config({ path: '.env.server' });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.server');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Test data
const testUser = {
  name: 'Test User',
  dob: '1990-01-15',
  email: `test_${Date.now()}@test.com`,
  phone: `99999${String(Date.now()).slice(-5)}`,
  pincode: '123456',
  city: 'Test City',
  district: 'Test District',
  state: 'Test State',
  nation: 'India',
  password: 'TestPass123!'
};

console.log('🧪 Starting Authentication Flow Tests\n');
console.log('='.repeat(50));

// Helper to hash token
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// Test 1: Register User with Password
async function testRegistration() {
  console.log('\n📝 TEST 1: Registration with Password');
  console.log('-'.repeat(40));
  
  try {
    const { data, error } = await supabase.rpc('register_user_with_password', {
      p_name: testUser.name,
      p_dob: testUser.dob,
      p_email: testUser.email,
      p_phone: testUser.phone,
      p_pincode: testUser.pincode,
      p_city: testUser.city,
      p_district: testUser.district,
      p_state: testUser.state,
      p_nation: testUser.nation,
      p_password: testUser.password,
    });

    if (error) {
      console.log('❌ Registration FAILED:', error.message);
      return null;
    }

    const result = data?.[0] || data;
    if (result.success) {
      console.log('✅ Registration SUCCESS!');
      console.log(`   Universal ID: ${result.universal_id}`);
      console.log(`   Message: ${result.message}`);
      return result.universal_id;
    } else {
      console.log('❌ Registration FAILED:', result.message);
      return null;
    }
  } catch (err) {
    console.log('❌ Registration ERROR:', err.message);
    return null;
  }
}

// Test 2: Login with Password
async function testLogin(universalId) {
  console.log('\n🔐 TEST 2: Login with Password');
  console.log('-'.repeat(40));
  
  try {
    const { data, error } = await supabase.rpc('login_with_password', {
      p_identifier: universalId,
      p_password: testUser.password,
    });

    if (error) {
      console.log('❌ Login FAILED:', error.message);
      return false;
    }

    const result = data?.[0] || data;
    if (result.success) {
      console.log('✅ Login SUCCESS!');
      console.log(`   User ID: ${result.user_id}`);
      console.log(`   Universal ID: ${result.universal_id}`);
      return true;
    } else {
      console.log('❌ Login FAILED:', result.message);
      return false;
    }
  } catch (err) {
    console.log('❌ Login ERROR:', err.message);
    return false;
  }
}

// Test 3: Request Password Reset
async function testPasswordResetRequest(universalId) {
  console.log('\n🔑 TEST 3: Password Reset Request');
  console.log('-'.repeat(40));
  
  try {
    const { data, error } = await supabase.rpc('request_password_reset', {
      p_identifier: universalId,
    });

    if (error) {
      console.log('❌ Password Reset Request FAILED:', error.message);
      return null;
    }

    const result = data?.[0] || data;
    if (result.success) {
      console.log('✅ Password Reset Request SUCCESS!');
      console.log(`   Message: ${result.message}`);
      console.log(`   Token: ${result.expires_at ? 'Token generated (check email)' : 'N/A'}`);
      return result;
    } else {
      console.log('❌ Password Reset Request FAILED:', result.message);
      return null;
    }
  } catch (err) {
    console.log('❌ Password Reset Request ERROR:', err.message);
    return null;
  }
}

// Test 4: Verify Reset Token
async function testVerifyResetToken(token) {
  console.log('\n🔍 TEST 4: Verify Reset Token');
  console.log('-'.repeat(40));
  
  if (!token) {
    console.log('⚠️  Skipping - no token provided');
    return false;
  }
  
  try {
    const { data, error } = await supabase.rpc('verify_password_reset_token', {
      p_token: token,
    });

    if (error) {
      console.log('❌ Token Verification FAILED:', error.message);
      return false;
    }

    const result = data?.[0] || data;
    if (result.valid) {
      console.log('✅ Token Verification SUCCESS!');
      console.log(`   User ID: ${result.user_id}`);
      console.log(`   Expires: ${result.expires_at}`);
      return true;
    } else {
      console.log('❌ Token Verification FAILED: Invalid token');
      return false;
    }
  } catch (err) {
    console.log('❌ Token Verification ERROR:', err.message);
    return false;
  }
}

// Test 5: Reset Password
async function testResetPassword(token, newPassword) {
  console.log('\n🔄 TEST 5: Reset Password');
  console.log('-'.repeat(40));
  
  if (!token) {
    console.log('⚠️  Skipping - no token provided');
    return false;
  }
  
  try {
    const { data, error } = await supabase.rpc('reset_password', {
      p_token: token,
      p_new_password: newPassword,
    });

    if (error) {
      console.log('❌ Password Reset FAILED:', error.message);
      return false;
    }

    const result = data?.[0] || data;
    if (result.success) {
      console.log('✅ Password Reset SUCCESS!');
      console.log(`   Message: ${result.message}`);
      return true;
    } else {
      console.log('❌ Password Reset FAILED:', result.message);
      return false;
    }
  } catch (err) {
    console.log('❌ Password Reset ERROR:', err.message);
    return false;
  }
}

// Test 6: Login with wrong password (should fail)
async function testLoginWrongPassword(universalId) {
  console.log('\n🚫 TEST 6: Login with Wrong Password (should fail)');
  console.log('-'.repeat(40));
  
  try {
    const { data, error } = await supabase.rpc('login_with_password', {
      p_identifier: universalId,
      p_password: 'WrongPassword123!',
    });

    if (error) {
      console.log('❌ Login FAILED (expected):', error.message);
      return true;
    }

    const result = data?.[0] || data;
    if (!result.success) {
      console.log('✅ Login correctly FAILED:', result.message);
      return true;
    } else {
      console.log('❌ Login should have failed but succeeded!');
      return false;
    }
  } catch (err) {
    console.log('✅ Login correctly FAILED:', err.message);
    return true;
  }
}

// Main test runner
async function runTests() {
  console.log('\n🚀 Universal Guard Trust - Authentication Tests');
  console.log('='.repeat(50));
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Test Email: ${testUser.email}`);
  console.log(`Test Phone: ${testUser.phone}`);
  console.log('='.repeat(50));

  const results = {
    registration: false,
    login: false,
    passwordResetRequest: false,
    verifyToken: false,
    resetPassword: false,
    wrongPassword: false,
  };

  // Test 1: Registration
  const universalId = await testRegistration();
  results.registration = !!universalId;

  if (!universalId) {
    console.log('\n⚠️  Registration failed, skipping dependent tests');
    printSummary(results);
    return;
  }

  // Test 2: Login
  results.login = await testLogin(universalId);

  // Test 3: Password Reset Request
  const resetResult = await testPasswordResetRequest(universalId);
  results.passwordResetRequest = !!resetResult;
  const resetToken = resetResult?.message; // Token is returned in message field

  // Test 4: Verify Token (if we got a token)
  if (resetToken && resetToken.length > 20) {
    results.verifyToken = await testVerifyResetToken(resetToken);
  } else {
    console.log('\n⚠️  TEST 4: Skipped (no token returned)');
  }

  // Test 5: Reset Password (if we have a token)
  if (resetToken && resetToken.length > 20) {
    results.resetPassword = await testResetPassword(resetToken, 'NewPass456!');
  } else {
    console.log('\n⚠️  TEST 5: Skipped (no token returned)');
  }

  // Test 6: Wrong password
  results.wrongPassword = await testLoginWrongPassword(universalId);

  // Print summary
  printSummary(results);
}

function printSummary(results) {
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  
  const testNames = {
    registration: 'Registration',
    login: 'Login',
    passwordResetRequest: 'Password Reset Request',
    verifyToken: 'Verify Token',
    resetPassword: 'Reset Password',
    wrongPassword: 'Wrong Password Rejection',
  };

  let passed = 0;
  let failed = 0;

  for (const [key, name] of Object.entries(testNames)) {
    const status = results[key] ? '✅ PASS' : '❌ FAIL';
    console.log(`   ${status} - ${name}`);
    if (results[key]) passed++; else failed++;
  }

  console.log('='.repeat(50));
  console.log(`Total: ${passed} passed, ${failed} failed`);
  console.log('='.repeat(50));

  if (failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the output above.');
  }
}

// Run tests
runTests().catch(console.error);