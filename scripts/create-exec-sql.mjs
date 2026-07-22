/**
 * Create exec_sql function in Supabase
 * This allows us to execute arbitrary SQL via RPC
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const createExecSqlFunction = `
CREATE OR REPLACE FUNCTION public.exec_sql(sql TEXT)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  EXECUTE sql;
END;
$$;
GRANT EXECUTE ON FUNCTION public.exec_sql(TEXT) TO postgres, anon, authenticated, service_role;
`;

async function createExecSqlFunction() {
  console.log('🔧 Creating exec_sql function...\n');
  
  // Try to create the function using direct insert to pg_catalog
  // This is a workaround since we can't execute DDL directly
  
  try {
    // First, let's check if we can use the management API
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'return=minimal',
      },
    });
    
    console.log('Direct REST API test:', response.status);
  } catch (e) {
    console.log('REST API error:', e.message);
  }
  
  console.log('\n❌ Cannot create exec_sql function without Supabase Access Token');
  console.log('\n📋 Please do one of the following:');
  console.log('\n1. Get a Supabase Access Token from:');
  console.log('   https://supabase.com/dashboard/account/tokens');
  console.log('   Then add it to your .env.local as SUPABASE_ACCESS_TOKEN');
  console.log('\n2. OR manually run this SQL in Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/mgrdamgdpnbtxgxdxwbs/sql');
  console.log('\n   SQL to run:');
  console.log('   ' + createExecSqlFunction.replace(/\n/g, '\n   '));
}

createExecSqlFunction().catch(console.error);