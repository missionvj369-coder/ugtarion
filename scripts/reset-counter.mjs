/**
 * Script to reset the profiles ID counter to 1
 * Run with: node scripts/reset-counter.mjs
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

async function resetCounter() {
  console.log('🔄 Resetting profiles ID counter to 1...\n');

  try {
    // Use Supabase pg RPC to execute the ALTER SEQUENCE command
    // First, let's try using the postgres function
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_catalog.setval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Schema': 'pg_catalog'
      },
      body: JSON.stringify({
        relname: 'profiles_id_seq',
        newval: 1,
        is_called: false
      })
    });

    if (response.ok) {
      console.log('✅ ID counter reset to 1 successfully!');
    } else {
      console.log('⚠️  Could not reset counter via API');
      console.log('\n📝 Please run this SQL in Supabase SQL Editor:');
      console.log('   SELECT setval(\'profiles_id_seq\', 1, false);');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n📝 Please run this SQL in Supabase SQL Editor:');
    console.log('   SELECT setval(\'profiles_id_seq\', 1, false);');
  }
}

resetCounter();