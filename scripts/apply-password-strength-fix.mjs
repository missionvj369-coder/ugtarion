/**
 * Apply Password Strength Fix
 * Updates the register_user_with_password function with password strength validation
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyPasswordStrengthFix() {
  console.log('🔧 Applying password strength validation fix...\n');
  
  // Read the SQL file
  const sqlFilePath = path.join(process.cwd(), 'supabase', 'fix-password-strength.sql');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  // Try to execute via RPC if available
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    if (error) {
      console.log('RPC exec_sql not available, trying direct approach...');
      console.log('Please run this SQL manually in Supabase SQL Editor:');
      console.log('https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
    } else {
      console.log('✅ Password strength validation added successfully!');
    }
  } catch (e) {
    console.log('RPC not available:', e.message);
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
  }
  
  // Test the function with a weak password
  console.log('\n🧪 Testing password strength validation...\n');
  
  const testCases = [
    { password: 'weak', expected: 'fail', desc: 'Too short' },
    { password: 'alllowercase', expected: 'fail', desc: 'No uppercase, number, special' },
    { password: 'ALLUPPERCASE', expected: 'fail', desc: 'No lowercase, number, special' },
    { password: '12345678', expected: 'fail', desc: 'No letters, special' },
    { password: 'Password1', expected: 'fail', desc: 'No special character' },
    { password: 'Password1!', expected: 'pass', desc: 'Valid password' },
  ];
  
  for (const test of testCases) {
    try {
      const { data, error } = await supabase.rpc('register_user_with_password', {
        p_name: 'Test User',
        p_dob: '1990-01-01',
        p_email: `test_${Date.now()}@example.com`,
        p_phone: `999999${Date.now()}`.slice(-10),
        p_pincode: '123456',
        p_city: 'Test City',
        p_district: 'Test District',
        p_state: 'Test State',
        p_nation: 'India',
        p_password: test.password
      });
      
      const result = Array.isArray(data) ? data[0] : data;
      const success = result?.success === true;
      const message = result?.message || error?.message || 'Unknown error';
      
      const actualResult = success ? 'pass' : 'fail';
      const status = actualResult === test.expected ? '✅' : '❌';
      
      console.log(`${status} "${test.password}" (${test.desc}): ${message}`);
    } catch (e) {
      console.log(`❌ "${test.password}": ${e.message}`);
    }
  }
}

applyPasswordStrengthFix().catch(console.error);