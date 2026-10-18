#!/usr/bin/env node
/**
 * Key Format Validator for Supabase
 * ==================================
 * Checks if the provided key is in the correct format for REST API calls.
 * 
 * Supabase now uses:
 * - sb_secret_xxx format for service_role secret key (REST API apikey header)
 * - sb_publishable_xxx format for publishable key (client-side)
 * - JWT (eyJ...) for Auth API (Authorization: Bearer)
 * 
 * Usage: node scripts/check-key-format.mjs
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.server
const envPath = path.join(process.cwd(), '.env.server');
const envResult = dotenv.config({ path: envPath });
const env = { ...process.env, ...envResult.parsed };

const supabaseUrl = env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const key = env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🔐 Supabase Key Format Validator\n');
console.log('='.repeat(55));
console.log('📍 Project URL:', supabaseUrl);
console.log('🔑 Key Status:', key ? 'SET' : 'NOT SET');
console.log('='.repeat(55));

if (!key) {
  console.log('\n❌ No key provided');
  console.log('\n📋 To migrate the database:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/settings/api-keys');
  console.log('   2. Get the "service_role" secret key (sb_secret_xxx format)');
  console.log('   3. Update .env.server with this key');
  process.exit(1);
}

// Format detection
if (key.startsWith('sb_secret_')) {
  console.log('\n✅ CORRECT FORMAT: sb_secret_xxx (service_role secret key)');
  console.log('   This key can be used for REST API /pg and /rest/v1/ RPC calls.');
  console.log('   → Migration can proceed.');
} else if (key.startsWith('sb_publishable_')) {
  console.log('\n⚠️  WRONG FORMAT: sb_publishable_xxx (publishable key)');
  console.log('   This key is for client-side use only.');
  console.log('   → Use the service_role secret key instead.');
  console.log('   → Migration blocked.');
  process.exit(1);
} else if (key.startsWith('eyJ')) {
  console.log('\n⚠️  JWT DETECTED (starts with eyJ)');
  console.log('   This is an Auth API token (Authorization: Bearer), NOT for REST API.');
  console.log('   → The REST API requires the sb_secret_xxx format key.');
  console.log('   → Migration blocked.');
  process.exit(1);
} else {
  console.log('\n❓ UNKNOWN FORMAT');
  console.log('   The key does not match any known Supabase format.');
  console.log('   → Try getting the correct service_role secret key from the dashboard.');
  process.exit(1);
}

console.log('\n📖 Documentation:');
console.log('   https://supabase.com/docs/guides/getting-started/api-keys');
console.log('   https://supabase.com/docs/guides/platforms/supabase-cli#database-migrations');
console.log('='.repeat(55));
console.log('\n✅ Key format check complete.\n');
