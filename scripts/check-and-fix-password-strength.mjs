/**
 * Check and Fix Password Strength Validation
 * This script checks if password strength validation is working and applies the fix if needed
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const projectRef = 'mgrdamgdpnbtxgxdxwbs';

// Read the SQL fix file
const sqlFilePath = path.join(process.cwd(), 'supabase', 'migrations', '009_password_strength.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

function makeRequest(method, apiPath, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: apiPath,
      method: method,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testPasswordStrength() {
  console.log('🧪 Testing current password strength validation...\n');
  
  const testCases = [
    { password: 'weak', expected: 'fail', desc: 'Too short' },
    { password: 'alllowercase', expected: 'fail', desc: 'No uppercase, number, special' },
    { password: 'ALLUPPERCASE', expected: 'fail', desc: 'No lowercase, number, special' },
    { password: '12345678', expected: 'fail', desc: 'No letters, special' },
    { password: 'Password1', expected: 'fail', desc: 'No special character' },
    { password: 'Password1!', expected: 'pass', desc: 'Valid password' },
  ];
  
  let allPassed = true;
  
  for (const test of testCases) {
    try {
      const { data, error } = await supabase.rpc('register_user_with_password', {
        p_name: 'Test User',
        p_dob: new Date('1990-01-01').toISOString().split('T')[0],
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
      
      if (actualResult !== test.expected) allPassed = false;
      
      console.log(`${status} "${test.password}" (${test.desc}): ${message}`);
    } catch (e) {
      console.log(`❌ "${test.password}": ${e.message}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

async function applyFixViaManagementAPI() {
  console.log('\n🔧 Applying password strength fix via Management API...\n');
  
  try {
    const result = await makeRequest('POST', `/v1/projects/${projectRef}/database/query`, {
      query: sqlContent
    });
    
    console.log('✅ SQL executed successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error executing SQL:', error.message);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   PASSWORD STRENGTH VALIDATION CHECK & FIX');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Test current state
  const isWorking = await testPasswordStrength();
  
  if (isWorking) {
    console.log('\n✅ Password strength validation is working correctly!');
    return;
  }
  
  console.log('\n❌ Password strength validation is NOT working.');
  console.log('\n─────────────────────────────────────────────────────────────────');
  console.log('   APPLYING FIX...');
  console.log('─────────────────────────────────────────────────────────────────\n');
  
  if (accessToken) {
    // Try to apply via Management API
    const applied = await applyFixViaManagementAPI();
    
    if (applied) {
      console.log('\n✅ Fix applied! Testing again...\n');
      await new Promise(r => setTimeout(r, 1000)); // Wait for propagation
      await testPasswordStrength();
      return;
    }
  }
  
  // If we get here, we need manual intervention
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('   MANUAL INTERVENTION REQUIRED');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  console.log('📋 Please apply the fix manually by following these steps:\n');
  
  console.log('1. Go to Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql\n');
  
  console.log('2. Copy and paste the following SQL:\n');
  console.log('   ' + sqlContent.replace(/\n/g, '\n   '));
  
  console.log('\n3. Click "Run" to execute the SQL\n');
  
  console.log('4. After running, come back here and run this script again to verify:\n');
  console.log('   node scripts/check-and-fix-password-strength.mjs\n');
  
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Also provide instructions for getting an access token
  console.log('💡 OPTIONAL: To apply fixes automatically in the future:\n');
  console.log('1. Get a Supabase Personal Access Token from:');
  console.log('   https://supabase.com/dashboard/account/tokens\n');
  console.log('2. Add it to your .env.local file:');
  console.log('   SUPABASE_ACCESS_TOKEN=your_token_here\n');
  console.log('3. Run this script again\n');
}

main().catch(console.error);