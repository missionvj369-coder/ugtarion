/**
 * Execute Migration on Supabase
 * Uses Supabase Management API to run SQL migrations
 * 
 * Usage: node scripts/execute-migration.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';

const supabaseUrl = 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

// Read the migration file
const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', 'combined-auth-migration.sql');
const sql = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Universal Guard Trust - Migration Executor');
console.log('='.repeat(50));
console.log('📄 Migration file:', migrationPath);
console.log('📏 SQL length:', sql.length, 'characters');
console.log('='.repeat(50));

// Try to execute via Supabase REST API with pg endpoint
async function tryPgEndpoint() {
  console.log('\n📡 Trying pg endpoint...');
  
  try {
    // The pg endpoint allows raw SQL execution
    const response = await fetch(`${supabaseUrl}/pg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });
    
    const text = await response.text();
    console.log('Response:', response.status, text.substring(0, 500));
    return response.ok;
  } catch (e) {
    console.log('Error:', e.message);
    return false;
  }
}

// Try to execute via RPC if exec_sql function exists
async function tryRpcExec() {
  console.log('\n📡 Trying RPC exec_sql...');
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ sql })
    });
    
    const data = await response.json();
    console.log('Response:', response.status, JSON.stringify(data).substring(0, 500));
    return response.ok;
  } catch (e) {
    console.log('Error:', e.message);
    return false;
  }
}

// Try to execute via management API
async function tryManagementApi() {
  console.log('\n📡 Trying Management API...');
  
  // Note: This requires SUPABASE_ACCESS_TOKEN from https://app.supabase.com/account/tokens
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.log('⚠️  SUPABASE_ACCESS_TOKEN not set in environment');
    console.log('   Set it with: export SUPABASE_ACCESS_TOKEN=your_token');
    return false;
  }
  
  try {
    const projectRef = 'mgrdamgdpnbtxgxdxwbs';
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });
    
    const data = await response.json();
    console.log('Response:', response.status, JSON.stringify(data).substring(0, 500));
    return response.ok;
  } catch (e) {
    console.log('Error:', e.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('\n🔄 Attempting to run migration...\n');
  
  // Try different methods
  let success = await tryPgEndpoint();
  if (!success) {
    success = await tryRpcExec();
  }
  if (!success) {
    success = await tryManagementApi();
  }
  
  if (!success) {
    console.log('\n' + '='.repeat(50));
    console.log('❌ Could not execute migration automatically');
    console.log('='.repeat(50));
    console.log('\n📋 MANUAL INSTRUCTIONS:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
    console.log('   2. Copy the contents of: supabase/migrations/combined-auth-migration.sql');
    console.log('   3. Paste into the SQL Editor');
    console.log('   4. Click "Run" button');
    console.log('\n   After running, test with: node scripts/test-auth-flow.mjs');
    console.log('='.repeat(50));
  } else {
    console.log('\n✅ Migration executed successfully!');
    console.log('   Test with: node scripts/test-auth-flow.mjs');
  }
}

main().catch(console.error);