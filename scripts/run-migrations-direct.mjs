import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load .env.server
const envPath = path.join(process.cwd(), '.env.server');
const envResult = dotenv.config({ path: envPath });
const env = { ...process.env, ...envResult.parsed };

const supabaseUrl = env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
let supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

// Validate key format
function validateKeyFormat(key) {
  if (!key) {
    return { valid: false, error: 'NO_KEY', message: 'SUPABASE_SERVICE_ROLE_KEY is not set' };
  }
  
  if (key.startsWith('sb_secret_')) {
    return { valid: true, type: 'sb_secret_xxx', message: 'Valid service_role secret key' };
  }
  
  if (key.startsWith('sb_publishable_')) {
    return { valid: false, type: 'sb_publishable_xxx', message: 'This is a publishable key, not a secret key. Use the sb_secret_xxx key instead.' };
  }
  
  if (key.startsWith('eyJ')) {
    return { valid: false, type: 'jwt', message: 'This is a JWT token. The REST API requires the sb_secret_xxx format key. JWTs only work for Auth API (Authorization: Bearer).' };
  }
  
  if (key.length > 20) {
    return { valid: true, type: 'custom', message: 'Key appears to be in correct format' };
  }
  
  return { valid: false, type: 'unknown', message: 'Unknown key format' };
}

const validation = validateKeyFormat(supabaseKey);

console.log('\n🔐 Universal Guard Trust - Supabase Migration Tool\n');
console.log('='.repeat(55));
console.log('📍 Project URL:', supabaseUrl);
console.log('🔑 Key validation:', validation.message);
console.log('='.repeat(55));

if (!validation.valid) {
  console.log('\n❌ MIGRATION BLOCKED: Invalid Key Format\n');
  console.log('The Supabase REST API requires the service_role SECRET KEY in sb_secret_xxx format.');
  console.log('The JWT or other format you provided will NOT work with REST API calls.');
  console.log('\n📋 TO FIX THIS:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/settings/api-keys');
  console.log('   2. Find the "service_role" secret key');
  console.log('   3. It will be in format: sb_secret_xxxxxxxx...');
  console.log('   4. Update the .env.server file with this key');
  console.log('   5. Re-run: node scripts/run-migrations-direct.mjs');
  console.log('\n💡 The JWT is only useful for Auth API (Authorization: Bearer header),');
  console.log('   not for REST API /pg or /rest/v1/ RPC calls.');
  process.exit(1);
}

// Now we have a valid key, proceed with migration
async function executeSQL(sql, endpoint = '/pg') {
  const response = await fetch(supabaseUrl + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': 'Bearer ' + supabaseKey
    },
    body: JSON.stringify({ query: sql })
  });
  
  const result = await response.json();
  return { ok: response.ok, result, status: response.status };
}

async function createExecSqlFunction() {
  console.log('\n🔧 Creating exec_sql function...');
  
  const sql = `
    CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$\n    BEGIN\n      EXECUTE sql;\n    END;\n    $$;\n  `;
  
  const { ok, result, status } = await executeSQL(sql, '/rest/v1/rpc/exec_sql');
  
  if (ok) {
    console.log('✅ exec_sql function created successfully');
    return true;
  } else {
    console.log('⚠️  exec_sql function creation failed (status:', status, ')');
    console.log('   This may be normal if the function already exists.');
    return false;
  }
}

async function runMigrationFile(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  
  console.log('\n📄 Running migration:', fileName);
  
  // Try to create exec_sql function first
  const _ = await createExecSqlFunction();
  
  // Execute via RPC
  const { ok, result, status } = await executeSQL(sql, '/rest/v1/rpc/exec_sql');
  
  if (ok) {
    console.log('✅ Success:', fileName);
    return true;
  } else {
    console.error('❌ Error (status:', status, '):', JSON.stringify(result).substring(0, 200));
    return false;
  }
}

async function main() {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  
  console.log('\n🚀 Starting migration...\n');
  console.log('Migrations to run:', files.length);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const success = await runMigrationFile(path.join(migrationsDir, file));
    if (success) successCount++;
    else errorCount++;
  }
  
  console.log('\n' + '='.repeat(55));
  console.log('📈 Migration Summary:');
  console.log('   ✅ Successful:', successCount);
  console.log('   ❌ Failed:', errorCount);
  console.log('='.repeat(55));
  
  if (errorCount === 0) {
    console.log('\n✅ All migrations applied successfully!');
  } else {
    console.log('\n⚠️  Some migrations failed. Check the errors above.');
  }
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
