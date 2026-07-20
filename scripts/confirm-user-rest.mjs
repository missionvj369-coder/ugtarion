/**
 * Confirm User Email via REST API
 * Uses Supabase REST API to update user confirmation
 */

const SUPABASE_URL = 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

async function confirmUser(email) {
  console.log(`\nConfirming user: ${email}`);
  
  try {
    // First, get the user ID by email
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.log('Error fetching users:', data);
      return false;
    }
    
    const user = data.users?.find(u => u.email === email);
    
    if (!user) {
      console.log('User not found:', email);
      return false;
    }
    
    console.log('Found user:', user.id);
    
    // Update user to confirm email
    const updateResponse = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_confirm: true
      })
    });
    
    const updateData = await updateResponse.json();
    
    if (!updateResponse.ok) {
      console.log('Error updating user:', updateData);
      return false;
    }
    
    console.log('✓ User confirmed successfully');
    console.log('  User ID:', user.id);
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