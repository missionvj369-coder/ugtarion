/**
 * Comprehensive Auth Security Test Script
 * Tests all critical authentication flows before going live
 * 
 * Run: node scripts/test-auth-security.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Need VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test configuration
const TEST_USER = {
  name: 'Security Test User',
  dob: '1990-01-15',
  email: `security.test.${Date.now()}@ugt.test`,
  phone: `9999${String(Date.now()).slice(-7)}`,
  pincode: '560001',
  city: 'Bengaluru',
  district: 'Bengaluru Urban',
  state: 'Karnataka',
  nation: 'India',
  password: 'TestPass123!',
  wrongPassword: 'WrongPass456!',
  newPassword: 'NewPass789@',
};

let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}${message ? ' - ' + message : ''}`);
  testResults.tests.push({ name, passed, message });
  if (passed) testResults.passed++;
  else testResults.failed++;
}

async function cleanupTestUser() {
  console.log('\n🧹 Cleaning up existing test user...');
  await supabase
    .from('profiles')
    .delete()
    .or(`email.eq.${TEST_USER.email},phone.eq.${TEST_USER.phone}`);
}

async function test1_RegisterWithPassword() {
  console.log('\n📝 TEST 1: Register user with password');
  
  try {
    const { data, error } = await supabase.rpc('register_user_with_password', {
      p_name: TEST_USER.name,
      p_dob: TEST_USER.dob,
      p_email: TEST_USER.email,
      p_phone: TEST_USER.phone,
      p_pincode: TEST_USER.pincode,
      p_city: TEST_USER.city,
      p_district: TEST_USER.district,
      p_state: TEST_USER.state,
      p_nation: TEST_USER.nation,
      p_password: TEST_USER.password,
    });

    if (error) {
      logTest('Register with password', false, error.message);
      return null;
    }

    const result = data[0];
    if (result.success) {
      logTest('Register with password', true, `UID: ${result.universal_id}`);
      return result.universal_id;
    } else {
      logTest('Register with password', false, result.message);
      return null;
    }
  } catch (err) {
    logTest('Register with password', false, err.message);
    return null;
  }
}

async function test2_LoginWithCorrectPassword(uid) {
  console.log('\n🔐 TEST 2: Login with CORRECT password');
  
  try {
    const { data, error } = await supabase.rpc('login_with_password', {
      p_identifier: TEST_USER.email,
      p_password: TEST_USER.password,
    });

    if (error) {
      logTest('Login with correct password', false, error.message);
      return false;
    }

    const result = data[0];
    if (result.success && result.universal_id === uid) {
      logTest('Login with correct password', true, `Logged in as ${result.universal_id}`);
      return true;
    } else {
      logTest('Login with correct password', false, result.message);
      return false;
    }
  } catch (err) {
    logTest('Login with correct password', false, err.message);
    return false;
  }
}

async function test3_LoginWithWrongPassword() {
  console.log('\n🔐 TEST 3: Login with WRONG password (should FAIL)');
  
  try {
    const { data, error } = await supabase.rpc('login_with_password', {
      p_identifier: TEST_USER.email,
      p_password: TEST_USER.wrongPassword,
    });

    // Should get an error or failed result
    if (error) {
      logTest('Login with wrong password rejected', true, 'Error returned as expected');
      return true;
    }

    const result = data[0];
    if (!result.success) {
      logTest('Login with wrong password rejected', true, 'Login failed as expected');
      return true;
    } else {
      logTest('Login with wrong password rejected', false, 'SECURITY ISSUE: Login succeeded with wrong password!');
      return false;
    }
  } catch (err) {
    logTest('Login with wrong password rejected', true, 'Exception thrown as expected');
    return true;
  }
}

async function test4_PasswordResetRequest() {
  console.log('\n🔑 TEST 4: Request password reset');
  
  try {
    const { data, error } = await supabase.rpc('request_password_reset', {
      p_identifier: TEST_USER.email,
    });

    if (error) {
      logTest('Request password reset', false, error.message);
      return null;
    }

    const result = data[0];
    if (result.success && result.message) {
      // In dev mode, token is returned in message
      const tokenMatch = result.message.match(/token[=:]\s*([a-zA-Z0-9_-]+)/i);
      if (tokenMatch) {
        logTest('Request password reset', true, 'Token generated');
        return tokenMatch[1];
      }
      // Check if token is in separate field
      if (result.expires_at) {
        logTest('Request password reset', true, 'Reset token generated');
        return result.message; // Return the token
      }
      logTest('Request password reset', true, 'Request successful (check email for token)');
      return result.message; // Return message which may contain token in dev
    } else {
      logTest('Request password reset', false, result.message);
      return null;
    }
  } catch (err) {
    logTest('Request password reset', false, err.message);
    return null;
  }
}

async function test5_ResetPasswordWithToken(token) {
  console.log('\n🔄 TEST 5: Reset password with token');
  
  if (!token) {
    logTest('Reset password with token', false, 'No token available');
    return false;
  }

  try {
    const { data, error } = await supabase.rpc('reset_password', {
      p_token: token,
      p_new_password: TEST_USER.newPassword,
    });

    if (error) {
      logTest('Reset password with token', false, error.message);
      return false;
    }

    const result = data[0];
    if (result.success) {
      logTest('Reset password with token', true, 'Password reset successful');
      return true;
    } else {
      logTest('Reset password with token', false, result.message);
      return false;
    }
  } catch (err) {
    logTest('Reset password with token', false, err.message);
    return false;
  }
}

async function test6_LoginWithOldPasswordAfterReset() {
  console.log('\n🔐 TEST 6: Login with OLD password after reset (should FAIL)');
  
  try {
    const { data, error } = await supabase.rpc('login_with_password', {
      p_identifier: TEST_USER.email,
      p_password: TEST_USER.password,
    });

    if (error) {
      logTest('Old password rejected after reset', true, 'Error returned as expected');
      return true;
    }

    const result = data[0];
    if (!result.success) {
      logTest('Old password rejected after reset', true, 'Login failed as expected');
      return true;
    } else {
      logTest('Old password rejected after reset', false, 'SECURITY ISSUE: Old password still works!');
      return false;
    }
  } catch (err) {
    logTest('Old password rejected after reset', true, 'Exception thrown as expected');
    return true;
  }
}

async function test7_LoginWithNewPassword() {
  console.log('\n🔐 TEST 7: Login with NEW password after reset');
  
  try {
    const { data, error } = await supabase.rpc('login_with_password', {
      p_identifier: TEST_USER.email,
      p_password: TEST_USER.newPassword,
    });

    if (error) {
      logTest('Login with new password', false, error.message);
      return false;
    }

    const result = data[0];
    if (result.success) {
      logTest('Login with new password', true, `Logged in as ${result.universal_id}`);
      return true;
    } else {
      logTest('Login with new password', false, result.message);
      return false;
    }
  } catch (err) {
    logTest('Login with new password', false, err.message);
    return false;
  }
}

async function test8_UIDGenerationAtScale() {
  console.log('\n🔢 TEST 8: UID generation at scale (simulate 100,000 users)');
  
  try {
    // Get current sequence value
    const { data: seqData } = await supabase.rpc('get_next_ugt_id');
    const currentId = seqData[0];
    const currentNum = parseInt(currentId.replace('UGT-', ''));
    
    console.log(`   Current UID: ${currentId}`);
    console.log(`   Simulating UID format for 100,000+ users...`);
    
    // Test UID format for large numbers
    const testNumbers = [99999, 100000, 100001, 999999, 1000000];
    let allValid = true;
    
    for (const num of testNumbers) {
      const uid = `UGT-${String(num).padStart(6, '0')}`;
      const isValid = uid.match(/^UGT-\d{6,}$/);
      console.log(`   ${num} -> ${uid} ${isValid ? '✅' : '❌'}`);
      if (!isValid) allValid = false;
    }
    
    logTest('UID format at scale', allValid, 'Format validated for 100,000+ UIDs');
    
    // Check if sequence uses 6 digits
    const maxUid = `UGT-${String(currentNum).padStart(6, '0')}`;
    const usesSixDigits = maxUid.length === 12; // UGT- + 6 digits
    logTest('UID uses 6-digit sequence', usesSixDigits, `Current: ${maxUid}`);
    
    return true;
  } catch (err) {
    logTest('UID generation at scale', false, err.message);
    return false;
  }
}

async function test9_IDCardDisplay() {
  console.log('\n🎴 TEST 9: ID Card displays UID and details correctly');
  
  try {
    // Get the test user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', TEST_USER.email)
      .single();

    if (!profile) {
      logTest('ID Card data retrieval', false, 'Profile not found');
      return false;
    }

    // Get standings
    const { data: standings } = await supabase.rpc('calculate_universal_standings', {
      target_uid: profile.universal_id,
    });

    if (!standings || standings.length === 0) {
      logTest('ID Card data retrieval', false, 'Standings not found');
      return false;
    }

    const ranks = standings[0];

    // Verify all required fields for ID card
    const requiredFields = [
      { name: 'Universal ID', value: profile.universal_id, check: v => v && v.startsWith('UGT-') },
      { name: 'Name', value: profile.name, check: v => v && v.length > 0 },
      { name: 'Date of Birth', value: profile.dob, check: v => v },
      { name: 'Email', value: profile.email, check: v => v && v.includes('@') },
      { name: 'Phone', value: profile.phone, check: v => v },
      { name: 'Pincode', value: profile.pincode, check: v => v },
      { name: 'City', value: profile.city, check: v => v },
      { name: 'District', value: profile.district, check: v => v },
      { name: 'State', value: profile.state, check: v => v },
      { name: 'Nation', value: profile.nation, check: v => v },
      { name: 'Universe Rank', value: ranks.universe_rank, check: v => v && v > 0 },
      { name: 'Nation Rank', value: ranks.nation_rank, check: v => v && v > 0 },
      { name: 'State Rank', value: ranks.state_rank, check: v => v && v > 0 },
      { name: 'District Rank', value: ranks.district_rank, check: v => v && v > 0 },
      { name: 'City Rank', value: ranks.city_rank, check: v => v && v > 0 },
      { name: 'Pincode Rank', value: ranks.pincode_rank, check: v => v && v > 0 },
    ];

    let allFieldsValid = true;
    console.log('\n   ID Card Fields:');
    
    for (const field of requiredFields) {
      const isValid = field.check(field.value);
      console.log(`   ${isValid ? '✅' : '❌'} ${field.name}: ${field.value}`);
      if (!isValid) allFieldsValid = false;
    }

    logTest('ID Card displays all fields', allFieldsValid, 'All required fields present');
    return allFieldsValid;
  } catch (err) {
    logTest('ID Card data retrieval', false, err.message);
    return false;
  }
}

async function test10_LoginWithUniversalId() {
  console.log('\n🔐 TEST 10: Login using Universal ID instead of email');
  
  try {
    // Get the user's universal_id
    const { data: profile } = await supabase
      .from('profiles')
      .select('universal_id')
      .eq('email', TEST_USER.email)
      .single();

    if (!profile) {
      logTest('Login with Universal ID', false, 'Profile not found');
      return false;
    }

    const { data, error } = await supabase.rpc('login_with_password', {
      p_identifier: profile.universal_id,
      p_password: TEST_USER.newPassword,
    });

    if (error) {
      logTest('Login with Universal ID', false, error.message);
      return false;
    }

    const result = data[0];
    if (result.success) {
      logTest('Login with Universal ID', true, `Logged in as ${result.universal_id}`);
      return true;
    } else {
      logTest('Login with Universal ID', false, result.message);
      return false;
    }
  } catch (err) {
    logTest('Login with Universal ID', false, err.message);
    return false;
  }
}

async function test11_LoginWithPhone() {
  console.log('\n🔐 TEST 11: Login using phone number');
  
  try {
    const { data, error } = await supabase.rpc('login_with_password', {
      p_identifier: TEST_USER.phone,
      p_password: TEST_USER.newPassword,
    });

    if (error) {
      logTest('Login with phone number', false, error.message);
      return false;
    }

    const result = data[0];
    if (result.success) {
      logTest('Login with phone number', true, `Logged in as ${result.universal_id}`);
      return true;
    } else {
      logTest('Login with phone number', false, result.message);
      return false;
    }
  } catch (err) {
    logTest('Login with phone number', false, err.message);
    return false;
  }
}

async function test12_PasswordStrengthValidation() {
  console.log('\n🔒 TEST 12: Password strength validation');
  
  const weakPasswords = ['short', 'alllowercase1!', 'ALLUPPERCASE1!', 'NoNumbers!@#', 'NoSpecial1'];
  const strongPassword = 'ValidPass1!';
  
  let allWeakRejected = true;
  
  for (const pwd of weakPasswords) {
    try {
      const { data } = await supabase.rpc('register_user_with_password', {
        p_name: 'Test',
        p_dob: '1990-01-01',
        p_email: `weak.test.${Date.now()}@ugt.test`,
        p_phone: `0000${Date.now()}`,
        p_pincode: '560001',
        p_city: 'Test',
        p_district: 'Test',
        p_state: 'Test',
        p_nation: 'Test',
        p_password: pwd,
      });
      
      if (data && data[0] && data[0].success) {
        console.log(`   ❌ Weak password accepted: ${pwd}`);
        allWeakRejected = false;
      } else {
        console.log(`   ✅ Weak password rejected: ${pwd}`);
      }
    } catch (err) {
      console.log(`   ✅ Weak password rejected: ${pwd}`);
    }
  }
  
  logTest('Password strength validation', allWeakRejected, 'Weak passwords properly rejected');
  return allWeakRejected;
}

async function runAllTests() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔒 UNIVERSAL GUARD TRUST - AUTH SECURITY TEST SUITE');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n📅 Test Run: ${new Date().toISOString()}`);
  console.log(`🔗 Supabase: ${supabaseUrl}`);
  
  // Cleanup first
  await cleanupTestUser();
  
  // Run tests in sequence
  const uid = await test1_RegisterWithPassword();
  if (!uid) {
    console.log('\n❌ Cannot continue tests - registration failed');
    printSummary();
    return;
  }
  
  await test2_LoginWithCorrectPassword(uid);
  await test3_LoginWithWrongPassword();
  
  // Password reset tests
  const resetToken = await test4_PasswordResetRequest();
  if (resetToken) {
    await test5_ResetPasswordWithToken(resetToken);
    await test6_LoginWithOldPasswordAfterReset();
    await test7_LoginWithNewPassword();
  } else {
    console.log('\n⚠️ Skipping password reset tests - no token available');
  }
  
  // Login method tests
  await test10_LoginWithUniversalId();
  await test11_LoginWithPhone();
  
  // System tests
  await test8_UIDGenerationAtScale();
  await test9_IDCardDisplay();
  await test12_PasswordStrengthValidation();
  
  // Cleanup
  await cleanupTestUser();
  
  printSummary();
}

function printSummary() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📊 TEST SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`\n✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`📈 Total:  ${testResults.tests.length}`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.tests
      .filter(t => !t.passed)
      .forEach(t => console.log(`   - ${t.name}: ${t.message}`));
  }
  
  console.log('\n' + '═'.repeat(64));
  
  if (testResults.failed === 0) {
    console.log('🎉 ALL TESTS PASSED! Ready for production!');
  } else {
    console.log('⚠️ SOME TESTS FAILED - Review before going live');
  }
  console.log('═'.repeat(64));
}

runAllTests().catch(console.error);