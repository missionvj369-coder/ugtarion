/**
 * Full Auth Flow Test Script
 * Tests: Register → Login → Password Reset → Reset Password
 * 
 * Usage: node scripts/full-auth-flow-test.mjs
 */

import https from 'https';
import crypto from 'crypto';

// Configuration
const CONFIG = {
  supabaseUrl: 'https://mgrdamgdpnbtxgxdxwbs.supabase.co',
  apiBaseUrl: 'http://localhost:4000',
  testEmail: `test_${Date.now()}@test.com`,
  testPassword: 'Test@123456',
  testName: 'Test User',
  testPhone: '9876543210',
  testDob: '1990-01-15',
  testPincode: '110001',
  testCity: 'New Delhi',
  testDistrict: 'Delhi',
  testState: 'Delhi',
  testNation: 'India'
};

// Helper function to make HTTP requests
function httpRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

// Helper to call local API
async function apiCall(endpoint, method = 'POST', body = null) {
  const url = `${CONFIG.apiBaseUrl}${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) options.body = JSON.stringify(body);
  return httpRequest(url, options);
}

// Test 1: Register User
async function testRegister() {
  console.log('\n📝 TEST 1: Register User');
  console.log('='.repeat(50));
  
  try {
    const response = await apiCall('/api/register', 'POST', {
      name: CONFIG.testName,
      dob: CONFIG.testDob,
      email: CONFIG.testEmail,
      phone: CONFIG.testPhone,
      pincode: CONFIG.testPincode,
      city: CONFIG.testCity,
      district: CONFIG.testDistrict,
      state: CONFIG.testState,
      nation: CONFIG.testNation
    });

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 200 || response.status === 201) {
      console.log('✅ Registration successful!');
      return { success: true, data: response.data };
    } else {
      console.log('❌ Registration failed!');
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test 2: Login User
async function testLogin() {
  console.log('\n🔐 TEST 2: Login User');
  console.log('='.repeat(50));
  
  try {
    const response = await apiCall('/api/login', 'POST', {
      identifier: CONFIG.testEmail,
      password: CONFIG.testPassword
    });

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('✅ Login successful!');
      return { success: true, data: response.data };
    } else {
      console.log('❌ Login failed!');
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test 3: Request Password Reset
async function testPasswordResetRequest() {
  console.log('\n🔑 TEST 3: Request Password Reset');
  console.log('='.repeat(50));
  
  try {
    const response = await apiCall('/api/password-reset/request', 'POST', {
      email: CONFIG.testEmail
    });

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('✅ Password reset email request successful!');
      console.log('📧 Check email for reset link');
      return { success: true, data: response.data };
    } else {
      console.log('❌ Password reset request failed!');
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Test 4: Confirm Password Reset
async function testPasswordResetConfirm(token, newPassword) {
  console.log('\n🔄 TEST 4: Confirm Password Reset');
  console.log('='.repeat(50));
  
  try {
    const response = await apiCall('/api/password-reset/confirm', 'POST', {
      token: token,
      newPassword: newPassword
    });

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));

    if (response.status === 200) {
      console.log('✅ Password reset successful!');
      return { success: true, data: response.data };
    } else {
      console.log('❌ Password reset failed!');
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

// Main test runner
async function runFullTest() {
  console.log('🚀 Universal Guard Trust - Full Auth Flow Test');
  console.log('='.repeat(60));
  console.log(`Test Email: ${CONFIG.testEmail}`);
  console.log(`Test Password: ${CONFIG.testPassword}`);
  console.log('='.repeat(60));

  const results = {
    register: null,
    login: null,
    passwordResetRequest: null,
    passwordResetConfirm: null
  };

  // Test 1: Register
  results.register = await testRegister();
  
  // Test 2: Login (with initial password)
  if (results.register.success) {
    results.login = await testLogin();
  } else {
    console.log('\n⚠️ Skipping login test - registration failed');
  }

  // Test 3: Password Reset Request
  if (results.register.success) {
    results.passwordResetRequest = await testPasswordResetRequest();
  }

  // Test 4: Password Reset Confirm (requires token from email)
  // Note: In real test, you would extract token from email
  // For automated testing, you may need to check database for token
  if (results.passwordResetRequest?.success) {
    console.log('\n⚠️ Password reset token sent to email');
    console.log('📧 Please check email and run password reset confirm test manually');
    console.log('   Or check password_reset_tokens table for the token');
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log('1. Registration:', results.register?.success ? '✅ PASS' : '❌ FAIL');
  console.log('2. Login:', results.login?.success ? '✅ PASS' : '❌ FAIL');
  console.log('3. Password Reset Request:', results.passwordResetRequest?.success ? '✅ PASS' : '❌ FAIL');
  console.log('4. Password Reset Confirm: ⏳ PENDING (needs token from email)');
  console.log('='.repeat(60));

  const allPassed = results.register?.success && 
                    results.login?.success && 
                    results.passwordResetRequest?.success;
  
  if (allPassed) {
    console.log('\n🎉 Core auth flows are working!');
    console.log('📧 Check email for password reset link to complete full test\n');
  } else {
    console.log('\n⚠️ Some tests failed. Please review the output above.\n');
  }

  return results;
}

// Run the test
runFullTest().catch(console.error);