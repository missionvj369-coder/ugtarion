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
  console.log('Dropping old function...');
  
  const dropSql = 'DROP FUNCTION IF EXISTS public.register_user_with_password(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);';
  
  const dropResult = await executeSQL(dropSql);
  console.log('Drop Response status:', dropResult.status);
  console.log('Drop Response:', dropResult.text);
  
  // Now apply the full fix
  const sql = fs.readFileSync('supabase/critical-auth-fixes-v2.sql', 'utf8');
  
  console.log('Applying critical-auth-fixes-v2.sql...');
  
  const applyResult = await executeSQL(sql);
  console.log('Apply Response status:', applyResult.status);
  console.log('Apply Response:', applyResult.text);
}

applyFix();