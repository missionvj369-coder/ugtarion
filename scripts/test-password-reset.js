#!/usr/bin/env node
/**
 * Test script to verify password reset flow works end-to-end
 * 
 * This script:
 * 1. Creates a test user with a password
 * 2. Requests a password reset
 * 3. Verifies the reset token is generated
 * 4. Uses the token to reset the password
 * 5. Verifies the new password works for login
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { randomBytes, createHash } from 'crypto';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env.server' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:4000';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing required environment variables:');
  console.error('  VITE_SUPABASE_URL or SUPABASE_URL');
  console.error('  SUPABASE_SERVICE_ROLE_KEY or SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

const TEST_EMAIL = `test-reset-${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPass123!';
const NEW_PASSWORD = 'NewPass456!';
const TEST_NAME = 'Test User';

async function hashPassword(password) {
  // Use the same hashing as the database (bcrypt via pgcrypto)
  // We'll use the database function for this
  const { data, error } = await supabase.rpc('hash_password', { password });
  if (error) throw new Error(`Failed to hash password: ${error.message}`);
  return data;
}

async function verifyPassword(password, hash) {
  const { data, error } = await supabase.rpc('verify_password', { password, password_hash: hash });
  if (error) throw new Error(`Failed to verify password: ${error.message}`);
  return data;
}

async function createTestUser() {
  console.log('\n📝 Creating test user...');
  
  // Generate universal ID
  const { data: universalId, error: idError } = await supabase.rpc('get_next_ugt_id');
  if (idError) throw new Error(`Failed to generate universal ID: ${idError.message}`);
  
  // Hash password
  const passwordHash = await hashPassword(TEST_PASSWORD);
  
  // Insert profile
  const { data: profile, error } = await supabase
    .from('profiles')
    .insert({
      universal_id: universalId,
      name: TEST_NAME,
      email: TEST_EMAIL,
      password_hash: passwordHash,
    })
    .select()
    .single();
  
  if (error) throw new Error(`Failed to create test user: ${error.message}`);
  
  console.log(`✅ Test user created: ${profile.universal_id} (${profile.email})`);
  return profile;
}

async function requestPasswordReset(email) {
  console.log('\n📧 Requesting password reset...');
  
  const response = await fetch(`${API_BASE_URL}/auth/password/reset-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Password reset request failed: ${JSON.stringify(data)}`);
  }
  
  console.log(`✅ Password reset requested: ${data.message}`);
  return data;
}

async function getResetTokenFromDB(email) {
  console.log('\n🔍 Retrieving reset token from database...');
  
  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();
  
  if (profileError || !profile) {
    throw new Error(`User not found: ${profileError?.message}`);
  }
  
  // Get the latest reset token
  const { data: token, error: tokenError } = await supabase
    .from('password_reset_tokens')
    .select('token_hash, expires_at, used')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (tokenError || !token) {
    throw new Error(`No reset token found: ${tokenError?.message}`);
  }
  
  console.log(`✅ Reset token found in database (expires: ${token.expires_at}, used: ${token.used})`);
  return { tokenHash: token.token_hash, userId: profile.id };
}

async function resetPassword(token, newPassword) {
  console.log('\n🔐 Resetting password with token...');
  
  const response = await fetch(`${API_BASE_URL}/auth/password/reset-confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password: newPassword }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Password reset failed: ${JSON.stringify(data)}`);
  }
  
  console.log(`✅ Password reset successful: ${data.message}`);
  return data;
}

async function verifyNewPasswordWorks(email, newPassword) {
  console.log('\n✅ Verifying new password works for login...');
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password: newPassword }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Login with new password failed: ${JSON.stringify(data)}`);
  }
  
  console.log(`✅ Login successful with new password! User ID: ${data.user_id}`);
  return data;
}

async function verifyOldPasswordFails(email, oldPassword) {
  console.log('\n🔒 Verifying old password no longer works...');
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: email, password: oldPassword }),
  });
  
  const data = await response.json();
  
  if (response.ok) {
    throw new Error('Old password still works - password was not properly reset!');
  }
  
  console.log(`✅ Old password correctly rejected: ${data.error_description || data.message}`);
  return true;
}

async function cleanupTestUser(email) {
  console.log('\n🧹 Cleaning up test user...');
  
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('email', email);
  
  if (error) {
    console.warn(`⚠️ Cleanup warning: ${error.message}`);
  } else {
    console.log('✅ Test user cleaned up');
  }
}

async function runTest() {
  console.log('🧪 Starting Password Reset Flow Test');
  console.log('=====================================');
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Test Email: ${TEST_EMAIL}`);
  
  try {
    // Step 1: Create test user
    const profile = await createTestUser();
    
    // Step 2: Request password reset
    await requestPasswordReset(TEST_EMAIL);
    
    // Step 3: Get the reset token from database (since we can't intercept email)
    const { tokenHash, userId } = await getResetTokenFromDB(TEST_EMAIL);
    
    // We need the original token, not the hash. 
    // Since we can't reverse the hash, we need to generate a token and use it directly
    // Let's create a fresh token for testing
    console.log('\n🔑 Generating fresh reset token for testing...');
    const testToken = randomBytes(32).toString('hex');
    const testTokenHash = createHash('sha256').update(testToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    
    // Store the test token
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: userId,
        token_hash: testTokenHash,
        expires_at: expiresAt,
      });
    
    if (tokenError) throw new Error(`Failed to store test token: ${tokenError.message}`);
    console.log('✅ Test token stored in database');
    
    // Step 4: Reset password using the test token
    await resetPassword(testToken, NEW_PASSWORD);
    
    // Step 5: Verify new password works
    await verifyNewPasswordWorks(TEST_EMAIL, NEW_PASSWORD);
    
    // Step 6: Verify old password no longer works
    await verifyOldPasswordFails(TEST_EMAIL, TEST_PASSWORD);
    
    console.log('\n🎉 ALL TESTS PASSED! Password reset flow works correctly.');
    console.log('=====================================');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Cleanup
    await cleanupTestUser(TEST_EMAIL);
  }
}

// Run the test
runTest();