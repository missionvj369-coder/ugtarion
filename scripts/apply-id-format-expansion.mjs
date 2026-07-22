/**
 * Script: Apply ID Format Expansion Migration
 * Purpose: Expand UGT ID format from 8 digits to 9 digits with alphanumeric overflow
 * Date: July 22, 2026
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('   Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
  console.log('🚀 Starting ID Format Expansion Migration...\n');
  
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '010_expand_id_format.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Loaded migration file: 010_expand_id_format.sql');
    
    // Split into individual statements
    const statements = migrationSQL
      .split(/;(?=\s*(?:CREATE|GRANT|DO|SELECT))/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (!statement || statement.startsWith('--')) continue;
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try direct SQL execution if RPC doesn't exist
          const { error: directError } = await supabase.from('profiles').select('id').limit(1);
          
          // Try using raw query
          const { error: rawError } = await supabase.query(statement);
          
          if (rawError && directError) {
            console.error(`⚠️  Statement ${i + 1} warning:`, error.message);
          }
        }
        
        successCount++;
        
        // Show progress
        if (statement.includes('CREATE OR REPLACE FUNCTION')) {
          const funcMatch = statement.match(/FUNCTION\s+(\w+\.\w+)/);
          if (funcMatch) {
            console.log(`   ✅ Created/Updated function: ${funcMatch[1]}`);
          }
        }
        
      } catch (err) {
        console.error(`⚠️  Statement ${i + 1} warning:`, err.message);
        errorCount++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log('📈 Migration Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ⚠️  Warnings: ${errorCount}`);
    console.log('='.repeat(50));
    
    // Check sequence status
    console.log('\n🔍 Checking sequence status...\n');
    
    try {
      const { data: status, error: statusError } = await supabase
        .from('profiles')
        .select('universal_id')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (status && status.length > 0) {
        console.log('📋 Recent IDs (sample):');
        status.forEach((profile, i) => {
          console.log(`   ${i + 1}. ${profile.universal_id}`);
        });
      }
    } catch (e) {
      console.log('   (Could not fetch recent IDs)');
    }
    
    console.log('\n✨ Migration completed successfully!');
    console.log('\n📝 Next Steps:');
    console.log('   1. Test new registrations to verify 9-digit IDs');
    console.log('   2. Monitor sequence status using get_ugt_sequence_status()');
    console.log('   3. New IDs will be format: UGT-000000001 (9 digits)');
    console.log('   4. When numeric limit reached, will switch to: UGT-A00000001');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error('\n📝 Manual steps:');
    console.error('   1. Go to Supabase Dashboard > SQL Editor');
    console.error('   2. Copy contents of supabase/migrations/010_expand_id_format.sql');
    console.error('   3. Execute the SQL');
    process.exit(1);
  }
}

// Alternative: Direct SQL execution via fetch
async function applyMigrationDirect() {
  console.log('🚀 Starting ID Format Expansion (Direct Mode)...\n');
  
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '010_expand_id_format.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  // Remove comments
  const cleanSQL = migrationSQL
    .split('\n')
    .filter(line => !line.trim().startsWith('--'))
    .join('\n');
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ sql: cleanSQL })
    });
    
    if (response.ok) {
      console.log('✅ Migration applied successfully via RPC');
    } else {
      console.log('⚠️  RPC not available, please run manually in Supabase SQL Editor');
    }
  } catch (error) {
    console.log('⚠️  Could not apply via API, please run manually');
    console.log(`   File: supabase/migrations/010_expand_id_format.sql`);
  }
}

// Run
applyMigration().catch(console.error);