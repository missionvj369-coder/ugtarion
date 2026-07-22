/**
 * Script to DELETE ALL profiles and reset the database counter
 * WARNING: This will delete ALL profiles from the database!
 * Run with: node scripts/reset-all-profiles.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function resetAllProfiles() {
  console.log('⚠️  WARNING: This will DELETE ALL profiles from the database!\n');

  try {
    // First, get all profiles to show what will be deleted
    console.log('📊 Fetching all profiles...');
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, name, email, phone, created_at')
      .order('id', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching profiles:', fetchError);
      return;
    }

    console.log(`✅ Found ${profiles?.length || 0} total profiles\n`);

    if (profiles && profiles.length > 0) {
      console.log('📋 Profiles to be deleted:');
      profiles.forEach((p, i) => {
        console.log(`  ${i + 1}. ID ${p.id}: ${p.name} (${p.email})`);
      });

      // Delete all profiles
      console.log('\n🗑️  Deleting all profiles...');
      const { error: deleteError } = await supabase
        .from('profiles')
        .delete()
        .neq('id', 0); // Delete all (condition that's always true)

      if (deleteError) {
        console.error('❌ Error deleting profiles:', deleteError);
      } else {
        console.log(`✅ Successfully deleted ${profiles.length} profiles`);
      }
    } else {
      console.log('✅ No profiles to delete');
    }

    // Reset the auto-increment counter
    console.log('\n🔄 Resetting ID counter...');
    
    // Use raw SQL to reset the sequence
    const { error: resetError } = await supabase.rpc('exec', {
      query: "ALTER SEQUENCE profiles_id_seq RESTART WITH 1;"
    }).catch(() => null);

    if (resetError) {
      console.log('⚠️  Could not reset sequence via RPC, trying direct SQL...');
      
      // Alternative: Try using the REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/reset_sequence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`
        },
        body: JSON.stringify({ sequence_name: 'profiles_id_seq', new_value: 1 })
      });

      if (!response.ok) {
        console.log('⚠️  Could not reset sequence automatically');
        console.log('\n📝 Please run this SQL in Supabase SQL Editor:');
        console.log('   ALTER SEQUENCE profiles_id_seq RESTART WITH 1;');
      }
    } else {
      console.log('✅ ID counter reset to 1');
    }

    console.log('\n✨ Database reset complete!');
    console.log('\n📝 Next steps:');
    console.log('   1. The next new user will get UID: UGT-000001');
    console.log('   2. Rankings will start from 1 for each category');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the reset
resetAllProfiles();