/**
 * Confirm User Email Script
 * Manually confirms a user's email in Supabase Auth
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function confirmUser(email) {
  console.log(`\nConfirming user: ${email}`);
  
  try {
    // Update the user's email_confirmed_at field
    const { data, error } = await supabase
      .from('auth.users')
      .update({ 
        email_confirmed_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString()
      })
      .eq('email', email)
      .select();
    
    if (error) {
      console.log('Error confirming user:', error.message);
      
      // Try alternative approach using admin auth
      const { data: adminData, error: adminError } = await supabase.auth.admin.updateUserByEmail(email, {
        email_confirm: true
      });
      
      if (adminError) {
        console.log('Admin update also failed:', adminError.message);
        return false;
      }
      
      console.log('✓ User confirmed via admin API');
      return true;
    }
    
    console.log('✓ User confirmed successfully');
    console.log('  Data:', data);
    return true;
  } catch (e) {
    console.log('✗ Failed to confirm user:', e.message);
    return false;
  }
}

// Get email from command line or use default
const email = process.argv[2] || 'ugt_test_1784480330797@gmail.com';

confirmUser(email)
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(e => {
    console.error('Error:', e);
    process.exit(1);
  });