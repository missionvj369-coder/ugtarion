/**
 * Fix UID Function Script
 * Fixes the get_next_ugt_id function to return full UID
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixUidFunction() {
  console.log('🔧 Fixing get_next_ugt_id function...');
  
  // First, let's check the current function
  console.log('\n1. Checking current function definition...');
  const { data: checkData, error: checkError } = await supabase.rpc('get_next_ugt_id');
  console.log('Current function result:', checkData, checkError);
  
  // Drop and recreate the function using a direct SQL approach
  // We'll use the management API to execute raw SQL
  const fixSql = `
    DROP FUNCTION IF EXISTS public.get_next_ugt_id() CASCADE;
    
    CREATE OR REPLACE FUNCTION public.get_next_ugt_id()
    RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
    DECLARE
      next_num BIGINT;
    BEGIN
      next_num := nextval('public.ugt_id_seq');
      RETURN 'UGT-' || LPAD(next_num::TEXT, 6, '0');
    END;
    $$;
    
    GRANT EXECUTE ON FUNCTION public.get_next_ugt_id() TO anon, authenticated, service_role;
  `;
  
  // Try to execute via RPC if available
  try {
    const { error } = await supabase.rpc('exec_sql', { sql: fixSql });
    if (error) {
      console.log('RPC exec_sql not available, trying alternative...');
    } else {
      console.log('✅ Function fixed via RPC');
    }
  } catch (e) {
    console.log('RPC not available:', e.message);
  }
  
  // Test the function
  console.log('\n2. Testing fixed function...');
  const { data: testData, error: testError } = await supabase.rpc('get_next_ugt_id');
  console.log('Test result:', testData, testError);
  
  if (testData && testData.startsWith('UGT-')) {
    console.log('✅ UID function is working correctly!');
  } else {
    console.log('❌ UID function still not working');
  }
  
  // Check sequence status
  console.log('\n3. Checking sequence status...');
  const { data: seqData } = await supabase.from('profiles').select('universal_id').order('created_at', { ascending: false }).limit(1);
  if (seqData && seqData.length > 0) {
    console.log('Latest UID:', seqData[0].universal_id);
  }
}

fixUidFunction().catch(console.error);