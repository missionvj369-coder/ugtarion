/**
 * Script to clean up test UIDs from the database
 * Run with: node scripts/cleanup-test-uids.mjs
 * 
 * Required environment variables in .env.local:
 * - VITE_SUPABASE_URL (already present)
 * - SUPABASE_SERVICE_ROLE_KEY (needs to be added for delete operations)
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing VITE_SUPABASE_URL in .env.local');
  console.log('\n📝 Add this to your .env.local file:');
  console.log('VITE_SUPABASE_URL=https://your-project.supabase.co');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.log('\n📝 Add this to your .env.local file:');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  console.log('\nYou can find your service role key at:');
  console.log('Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function cleanupTestUIDs() {
  console.log('🧹 Starting test UID cleanup...\n');
  console.log(`📡 Connected to: ${supabaseUrl}\n`);

  try {
    // Get all profiles
    console.log('📊 Fetching all profiles...');
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, name, email, phone, created_at')
      .order('created_at', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching profiles:', fetchError);
      return;
    }

    console.log(`✅ Found ${profiles?.length || 0} total profiles\n`);

    if (!profiles || profiles.length === 0) {
      console.log('✅ No profiles found in database.');
      return;
    }

    // Identify test profiles
    const testProfiles = profiles.filter(p => {
      const name = p.name?.toLowerCase() || '';
      const email = p.email?.toLowerCase() || '';
      const phone = p.phone || '';
      
      return (
        name.includes('test') ||
        name.includes('demo') ||
        name.includes('dummy') ||
        name.includes('fake') ||
        name.includes('sample') ||
        email.includes('test') ||
        email.includes('demo') ||
        email.includes('dummy') ||
        email.includes('fake') ||
        email.includes('sample') ||
        phone.includes('999999') ||
        phone.includes('000000')
      );
    });

    if (testProfiles.length === 0) {
      console.log('✅ No test profiles found to clean up.');
      console.log('\n📋 All profiles in database:');
      profiles.forEach((p, i) => {
        console.log(`  ${i + 1}. ${p.name} (${p.email}) - ID: ${p.id}`);
      });
      return;
    }

    console.log(`🔍 Found ${testProfiles.length} test profiles:\n`);
    testProfiles.forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} (${p.email}) - ID: ${p.id}`);
    });

    // Confirm before deletion
    console.log('\n⚠️  About to delete these test profiles...');
    
    // Delete test profiles
    const testIds = testProfiles.map(p => p.id);
    
    console.log('\n🗑️  Deleting test profiles from database...');
    
    // Delete from profiles table
    const { error: deleteProfileError } = await supabase
      .from('profiles')
      .delete()
      .in('id', testIds);

    if (deleteProfileError) {
      console.error('❌ Error deleting profiles:', deleteProfileError);
    } else {
      console.log(`✅ Successfully deleted ${testProfiles.length} test profiles`);
    }

    console.log('\n✨ Cleanup complete!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the cleanup
cleanupTestUIDs();