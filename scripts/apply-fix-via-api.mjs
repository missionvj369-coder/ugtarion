/**
 * Apply Fix via Supabase Management API
 * Uses the Management API to execute SQL directly
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

if (!accessToken) {
  console.error('❌ Missing SUPABASE_ACCESS_TOKEN');
  console.log('Get your access token from: https://supabase.com/dashboard/account/tokens');
  process.exit(1);
}

const projectRef = 'mgrdamgdpnbtxgxdxwbs';

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: path,
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

async function applyFix() {
  console.log('🔧 Applying password strength fix via Management API...\n');
  
  // Read the SQL file
  const sqlFilePath = path.join(process.cwd(), 'supabase', 'fix-password-strength.sql');
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  
  try {
    // Execute the SQL
    const result = await makeRequest('POST', `/v1/projects/${projectRef}/database/query`, {
      query: sqlContent
    });
    
    console.log('✅ SQL executed successfully!');
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Error executing SQL:', error.message);
    console.log('\n📋 Please run this SQL manually in Supabase SQL Editor:');
    console.log('https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
  }
}

applyFix().catch(console.error);