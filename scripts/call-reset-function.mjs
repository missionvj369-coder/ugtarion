/**
 * Script to create and call the reset_profiles_sequence function
 * Run with: node scripts/call-reset-function.mjs
 */

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

async function createAndCallFunction() {
  console.log('🔄 Creating reset_profiles_sequence function and calling it...\n');

  try {
    // First, create the function via SQL
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION reset_profiles_sequence()
      RETURNS void
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      BEGIN
        PERFORM setval('profiles_id_seq', 1, false);
      END;
      $$;
    `;

    // Use Supabase REST API to execute raw SQL via pg function
    // First, let's try to call the function directly
    const callResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/reset_profiles_sequence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({})
    });

    if (callResponse.ok) {
      console.log('✅ reset_profiles_sequence() called successfully!');
      console.log('✅ ID counter is now reset to 1');
    } else {
      const errorText = await callResponse.text();
      console.log('⚠️  Function not found or error:', errorText);
      console.log('\n📝 Please run this SQL in Supabase SQL Editor:');
      console.log('');
      console.log('   -- First create the function:');
      console.log('   CREATE OR REPLACE FUNCTION reset_profiles_sequence()');
      console.log('   RETURNS void');
      console.log('   LANGUAGE plpgsql');
      console.log('   SECURITY DEFINER AS $$');
      console.log('   BEGIN');
      console.log('     PERFORM setval(\'profiles_id_seq\', 1, false);');
      console.log('   END; $$;');
      console.log('');
      console.log('   -- Then call it:');
      console.log('   SELECT reset_profiles_sequence();');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n📝 Please run this SQL in Supabase SQL Editor:');
    console.log('   SELECT setval(\'profiles_id_seq\', 1, false);');
  }
}

createAndCallFunction();