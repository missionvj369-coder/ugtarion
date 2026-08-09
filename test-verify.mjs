import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkVerifyPassword() {
  const { data, error } = await supabase.rpc('verify_password', {
    password: 'TestPass123!',
    password_hash: '$2a$12$P40I7XjmAlgmqc9dq7RNOOYaKZtaLVthxpijOU03n6cEo0WBJkj4e'
  });
  
  if (error) {
    console.log('Error:', error.message);
  } else {
    console.log('Verify result:', data);
  }
}

checkVerifyPassword();