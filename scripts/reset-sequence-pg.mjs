/**
 * Reset the profiles ID sequence using pg endpoint
 * Run with: node scripts/reset-sequence-pg.mjs
 */

const supabaseUrl = 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

const sql = `
-- Create function to reset sequence
CREATE OR REPLACE FUNCTION reset_profiles_sequence()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM setval('profiles_id_seq', 1, false);
END;
$$;

-- Call the function to reset the sequence
SELECT reset_profiles_sequence();
`;

async function resetSequence() {
  console.log('🔄 Resetting profiles ID sequence...\n');

  try {
    // Try pg endpoint
    console.log('📡 Trying pg endpoint...');
    const response = await fetch(`${supabaseUrl}/pg`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    const text = await response.text();
    console.log('Response status:', response.status);
    console.log('Response:', text.substring(0, 1000));

    if (response.ok) {
      console.log('\n✅ Sequence reset successfully!');
    } else {
      console.log('\n⚠️  pg endpoint not available');
      console.log('\n📝 Please run this SQL in Supabase SQL Editor:');
      console.log('');
      console.log('   -- Create function:');
      console.log('   CREATE OR REPLACE FUNCTION reset_profiles_sequence()');
      console.log('   RETURNS void');
      console.log('   LANGUAGE plpgsql');
      console.log('   SECURITY DEFINER');
      console.log('   SET search_path = public');
      console.log('   AS $$');
      console.log('   BEGIN');
      console.log('     PERFORM setval(\'profiles_id_seq\', 1, false);');
      console.log('   END; $$;');
      console.log('');
      console.log('   -- Call it:');
      console.log('   SELECT reset_profiles_sequence();');
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.log('\n📝 Please run this SQL in Supabase SQL Editor:');
    console.log('   SELECT setval(\'profiles_id_seq\', 1, false);');
  }
}

resetSequence();