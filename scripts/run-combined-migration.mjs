/**
 * Run Combined Migration
 * Executes the combined-auth-migration.sql on Supabase
 * 
 * Usage: node scripts/run-combined-migration.mjs
 */

import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

async function runMigration() {
  console.log('🚀 Running Combined Auth Migration...\n');
  
  // Read the migration file
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', 'combined-auth-migration.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log('📄 Migration file loaded:', migrationPath);
  console.log('📏 SQL length:', sql.length, 'characters');
  console.log('\n⚠️  Note: To run this migration, you need to:');
  console.log('   1. Go to Supabase Dashboard: https://supabase.com/dashboard');
  console.log('   2. Select project: mgrdamgdpnbtxgxdxwbs');
  console.log('   3. Go to SQL Editor');
  console.log('   4. Copy the contents of supabase/migrations/combined-auth-migration.sql');
  console.log('   5. Paste and click Run\n');
  
  // Try to use the management API
  try {
    // Try using Supabase Management API via REST
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': 'Bearer ' + supabaseKey,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ query: sql })
    });
    
    console.log('Response status:', response.status);
    
    // If that doesn't work, try another approach
    if (!response.ok) {
      console.log('\n⚠️  Direct SQL execution via REST API is not available.');
      console.log('   Please run the migration manually in Supabase SQL Editor.');
    }
  } catch (error) {
    console.log('\n⚠️  Could not execute SQL directly.');
    console.log('   Error:', error.message);
    console.log('\n   Please run the migration manually:');
    console.log('   1. Go to https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
    console.log('   2. Copy contents of combined-auth-migration.sql');
    console.log('   3. Click Run');
  }
  
  console.log('\n📋 Migration SQL Preview (first 500 chars):');
  console.log('-'.repeat(50));
  console.log(sql.substring(0, 500) + '...');
  console.log('-'.repeat(50));
}

runMigration().catch(console.error);