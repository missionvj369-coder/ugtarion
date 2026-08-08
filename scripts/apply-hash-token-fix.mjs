/**
 * Script to apply the hash_token consistency fix
 * Run this after deploying to ensure the hash_token function is consistent
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: '.env.local' });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function applyHashTokenFix() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('Applying hash_token consistency fix...');

  const sql = readFileSync(join(__dirname, '..', 'supabase', 'fix-hash-token-consistency.sql'), 'utf8');

  try {
    const { error } = await supabase.rpc('exec', { sql_query: sql });
    
    // If RPC doesn't exist, try direct SQL
    if (error) {
      console.log('RPC method not available, trying direct SQL...');
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({ sql_query: sql })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    }
    
    console.log('✅ hash_token fix applied successfully!');
    
    // Verify the fix
    const testResult = await supabase.rpc('public.hash_token', { token: 'test_token' });
    if (testResult.data) {
      console.log('✅ hash_token function verified working');
    }
    
  } catch (err) {
    console.error('❌ Failed to apply fix:', err.message);
    console.log('\nPlease run this SQL in your Supabase SQL Editor:');
    console.log(readFileSync(join(__dirname, '..', 'supabase', 'fix-hash-token-consistency.sql'), 'utf8'));
    process.exit(1);
  }
}

applyHashTokenFix();