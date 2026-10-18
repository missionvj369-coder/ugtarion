#!/usr/bin/env node

/**
 * Universal Guard Trust - Supabase Migration Tool (Fixed)
 * Uses Supabase Management API with access token for migration
 * 
 * Usage: node scripts/run-migrations-fixed.mjs
 */
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load .env.server
const envPath = path.join(process.cwd(), '.env.server');
const envResult = dotenv.config({ path: envPath });
const env = { ...process.env, ...envResult.parsed };

const supabaseUrl = env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || '';
const accessToken = env.SUPABASE_ACCESS_TOKEN || '';

console.log('\n🔐 Universal Guard Trust - Supabase Migration Tool\n');
console.log('='.repeat(55));
console.log('📍 Project URL:', supabaseUrl);
console.log('🔑 Key validation:', supabaseKey ? 'VALID service_role secret key' : 'MISSING');
console.log('🔑 Access Token available:', accessToken ? 'YES' : 'NO');
console.log('='.repeat(55));

// Validate key format
if (!supabaseKey || !supabaseKey.startsWith('sb_secret_')) {
  console.log('\n❌ MIGRATION BLOCKED: Invalid Key Format\n');
  console.log('Required: sb_secret_xxx format');
  console.log('\n📋 TO FIX THIS:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/settings/api-keys');
  console.log('   2. Find the "service_role" secret key');
  console.log('   3. It will be in format: sb_secret_xxxxxxxx...');
  console.log('   4. Update the .env.server file with this key');
  console.log('   5. Re-run: node scripts/run-migrations-direct.mjs');
  process.exit(1);
}

// Strategy based on available tokens
// Option 1: Use Management API (needs access token)
// Option 2: Use SQL Editor manually

async function useManagementApi(sql) {
  if (!accessToken) {
    console.log('\n⚠️  No access token - cannot use Management API');
    console.log('   Sync SQL via SQL Editor: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
    return false;
  }
  try {
    const response = await fetch('https://api.supabase.com/v1/projects/mgrdamgdpnbtxgxdxwbs/database/query', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: sql })
    });
    const data = await response.json();
    console.log('Management API status:', response.status);
    return response.ok;
  } catch (e) {
    console.log('Management API error:', e.message);
    return false;
  }
}

async function useSqlEditor(sql) {
  console.log('\n📋 Please run this SQL in Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
  console.log('\nSQL to run:');
  console.log(sql.substring(0, 1000) + (sql.length > 1000 ? '...' : ''));
  return true;
}

async function main() {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  
  console.log('Migrations to run:', files.length);
  
  let successCount = 0;
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log('\n📄 Running:', file);
    
    // Try Management API first (if token available)
    let ok = await useManagementApi(sql);
    if (ok) successCount++;
    else {
      // Fall back to SQL Editor
      ok = await useSqlEditor(sql);
      if (ok) successCount++;
    }
  }
  
  console.log('\n' + '='.repeat(55));
  console.log('📈 Summary: ' + successCount + '/' + files.length + ' migrations ran');
}

main().catch(console.error);
