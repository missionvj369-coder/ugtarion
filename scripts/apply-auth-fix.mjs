/**
 * Apply Auth Fix to Supabase
 * 
 * This script will:
 * 1. Read the fix-auth-functions.sql file
 * 2. Execute it against Supabase using the pg endpoint
 * 
 * Usage: node scripts/apply-auth-fix.mjs
 */

import fs from 'fs';
import path from 'path';

const SUPABASE_URL = 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

async function executeSQL(sql) {
  // Use the pg endpoint to execute raw SQL
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/pg_execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`
    },
    body: JSON.stringify({ query: sql })
  });
  
  const result = await response.json();
  return { ok: response.ok, result };
}

async function main() {
  console.log('🚀 Applying Auth Fix to Supabase');
  console.log('='.repeat(50));
  
  // Read the SQL file
  const sqlPath = path.join(process.cwd(), 'supabase', 'fix-auth-functions.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  
  console.log('📄 SQL file loaded:', sqlPath);
  console.log('SQL length:', sql.length, 'characters');
  
  // Try to execute via RPC first
  try {
    console.log('\n📋 Attempting to execute SQL via RPC...');
    const { ok, result } = await executeSQL(sql);
    
    if (ok) {
      console.log('✅ SQL executed successfully!');
      console.log('Result:', JSON.stringify(result, null, 2));
    } else {
      console.log('⚠️  RPC execution failed:', result);
    }
  } catch (err) {
    console.log('❌ Error:', err.message);
  }
  
  console.log('\n📋 Manual Steps Required:');
  console.log('='.repeat(50));
  console.log('1. Go to: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
  console.log('2. Copy the contents of: supabase/fix-auth-functions.sql');
  console.log('3. Paste into the SQL Editor');
  console.log('4. Click "Run" to execute');
  console.log('='.repeat(50));
}

main().catch(console.error);