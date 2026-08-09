import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.server' });

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_SERVICE_KEY || !SUPABASE_ACCESS_TOKEN) {
  console.error('❌ Missing required environment variables in .env.server');
  process.exit(1);
}

async function executeSQL(sql) {
  const response = await fetch('https://api.supabase.com/v1/projects/mgrdamgdpnbtxgxdxwbs/database/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SUPABASE_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query: sql }),
  });
  
  const text = await response.text();
  return { status: response.status, text };
}

async function applyFix() {
  console.log('Applying RLS fix...');
  
  const sql = fs.readFileSync('supabase/fix-registration-rls.sql', 'utf8');
  
  console.log('Applying fix-registration-rls.sql...');
  
  const applyResult = await executeSQL(sql);
  console.log('Apply Response status:', applyResult.status);
  console.log('Apply Response:', applyResult.text);
}

applyFix();