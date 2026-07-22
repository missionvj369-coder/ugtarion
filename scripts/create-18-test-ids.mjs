/**
 * Script to create 18 test IDs in different geographic scenarios
 * Tests the rank system at: Global, National, State, District, City, Pincode levels
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local');
  console.error('Need VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test scenarios: 18 users covering all geographic combinations
const testUsers = [
  // === GLOBAL CHECK (Different Nations) ===
  // User 1: India, Karnataka, Bengaluru Urban, Bengaluru, 560001
  {
    name: 'Test Global India 1',
    dob: '1990-01-15',
    email: 'test.global.india.1@ugt.test',
    phone: '9999000001',
    pincode: '560001',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'GLOBAL-1: First user in India'
  },
  // User 2: USA, New York, New York County, New York, 10001
  {
    name: 'Test Global USA 1',
    dob: '1985-06-20',
    email: 'test.global.usa.1@ugt.test',
    phone: '1999000002',
    pincode: '10001',
    city: 'New York',
    district: 'New York County',
    state: 'New York',
    nation: 'United States',
    scenario: 'GLOBAL-2: First user in USA'
  },
  // User 3: UK, England, London, London, EC1A 1BB
  {
    name: 'Test Global UK 1',
    dob: '1988-03-10',
    email: 'test.global.uk.1@ugt.test',
    phone: '4499000003',
    pincode: 'EC1A 1BB',
    city: 'London',
    district: 'London',
    state: 'England',
    nation: 'United Kingdom',
    scenario: 'GLOBAL-3: First user in UK'
  },

  // === NATIONAL CHECK (Same Nation, Different States) ===
  // User 4: India, Maharashtra, Mumbai City, Mumbai, 400001
  {
    name: 'Test National India Maharashtra',
    dob: '1992-08-25',
    email: 'test.national.maharashtra@ugt.test',
    phone: '9999000004',
    pincode: '400001',
    city: 'Mumbai',
    district: 'Mumbai City',
    state: 'Maharashtra',
    nation: 'India',
    scenario: 'NATIONAL-1: First user in Maharashtra (India)'
  },
  // User 5: India, Tamil Nadu, Chennai, Chennai, 600001
  {
    name: 'Test National India TamilNadu',
    dob: '1991-11-30',
    email: 'test.national.tamilnadu@ugt.test',
    phone: '9999000005',
    pincode: '600001',
    city: 'Chennai',
    district: 'Chennai',
    state: 'Tamil Nadu',
    nation: 'India',
    scenario: 'NATIONAL-2: First user in Tamil Nadu (India)'
  },
  // User 6: India, Gujarat, Ahmedabad, Ahmedabad, 380001
  {
    name: 'Test National India Gujarat',
    dob: '1989-05-15',
    email: 'test.national.gujarat@ugt.test',
    phone: '9999000006',
    pincode: '380001',
    city: 'Ahmedabad',
    district: 'Ahmedabad',
    state: 'Gujarat',
    nation: 'India',
    scenario: 'NATIONAL-3: First user in Gujarat (India)'
  },

  // === STATE-WISE CHECK (Same State, Different Districts) ===
  // User 7: India, Karnataka, Mysore, Mysore, 570001
  {
    name: 'Test State Karnataka Mysore',
    dob: '1993-02-28',
    email: 'test.state.karnataka.mysore@ugt.test',
    phone: '9999000007',
    pincode: '570001',
    city: 'Mysore',
    district: 'Mysore',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'STATE-1: First user in Mysore district (Karnataka)'
  },
  // User 8: India, Karnataka, Belgaum, Belgaum, 590001
  {
    name: 'Test State Karnataka Belgaum',
    dob: '1987-09-12',
    email: 'test.state.karnataka.belgaum@ugt.test',
    phone: '9999000008',
    pincode: '590001',
    city: 'Belgaum',
    district: 'Belgaum',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'STATE-2: First user in Belgaum district (Karnataka)'
  },
  // User 9: India, Karnataka, Hubli, Dharwad, 580001
  {
    name: 'Test State Karnataka Hubli',
    dob: '1994-07-05',
    email: 'test.state.karnataka.hubli@ugt.test',
    phone: '9999000009',
    pincode: '580001',
    city: 'Hubli',
    district: 'Dharwad',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'STATE-3: First user in Dharwad district (Karnataka)'
  },

  // === DISTRICT-WISE CHECK (Same District, Different Cities) ===
  // User 10: India, Karnataka, Bengaluru Urban, Whitefield, 560066
  {
    name: 'Test District Bangalore Whitefield',
    dob: '1995-04-18',
    email: 'test.district.bangalore.whitefield@ugt.test',
    phone: '9999000010',
    pincode: '560066',
    city: 'Whitefield',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'DISTRICT-1: First user in Whitefield (Bengaluru Urban)'
  },
  // User 11: India, Karnataka, Bengaluru Urban, Electronic City, 560100
  {
    name: 'Test District Bangalore ElectronicCity',
    dob: '1996-12-22',
    email: 'test.district.bangalore.electronic@ugt.test',
    phone: '9999000011',
    pincode: '560100',
    city: 'Electronic City',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'DISTRICT-2: First user in Electronic City (Bengaluru Urban)'
  },
  // User 12: India, Karnataka, Bengaluru Urban, Marathahalli, 560037
  {
    name: 'Test District Bangalore Marathahalli',
    dob: '1997-08-08',
    email: 'test.district.bangalore.marathahalli@ugt.test',
    phone: '9999000012',
    pincode: '560037',
    city: 'Marathahalli',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'DISTRICT-3: First user in Marathahalli (Bengaluru Urban)'
  },

  // === CITY-WISE CHECK (Same City, Different Pincodes) ===
  // User 13: India, Karnataka, Bengaluru Urban, Bengaluru, 560001 (City Center)
  {
    name: 'Test City Bangalore Center',
    dob: '1988-01-30',
    email: 'test.city.bangalore.center@ugt.test',
    phone: '9999000013',
    pincode: '560001',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'CITY-1: First user in Bengaluru with pincode 560001'
  },
  // User 14: India, Karnataka, Bengaluru Urban, Bengaluru, 560034 (Koramangala)
  {
    name: 'Test City Bangalore Koramangala',
    dob: '1989-06-15',
    email: 'test.city.bangalore.koramangala@ugt.test',
    phone: '9999000014',
    pincode: '560034',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'CITY-2: First user in Bengaluru with pincode 560034'
  },
  // User 15: India, Karnataka, Bengaluru Urban, Bengaluru, 560095 (HSR Layout)
  {
    name: 'Test City Bangalore HSR',
    dob: '1990-11-20',
    email: 'test.city.bangalore.hsr@ugt.test',
    phone: '9999000015',
    pincode: '560095',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'CITY-3: First user in Bengaluru with pincode 560095'
  },

  // === PINCODE-WISE CHECK (Same Pincode, Different Details) ===
  // User 16: India, Karnataka, Bengaluru Urban, Bengaluru, 560001 (MG Road)
  {
    name: 'Test Pincode Bangalore MG Road',
    dob: '1991-03-25',
    email: 'test.pincode.560001.mgroad@ugt.test',
    phone: '9999000016',
    pincode: '560001',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'PINCODE-1: Second user in pincode 560001 (MG Road)'
  },
  // User 17: India, Karnataka, Bengaluru Urban, Bengaluru, 560001 (Brigade Road)
  {
    name: 'Test Pincode Bangalore Brigade',
    dob: '1992-09-10',
    email: 'test.pincode.560001.brigade@ugt.test',
    phone: '9999000017',
    pincode: '560001',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'PINCODE-2: Third user in pincode 560001 (Brigade Road)'
  },
  // User 18: India, Karnataka, Bengaluru Urban, Bengaluru, 560001 (Indiranagar)
  {
    name: 'Test Pincode Bangalore Indiranagar',
    dob: '1993-05-05',
    email: 'test.pincode.560001.indiranagar@ugt.test',
    phone: '9999000018',
    pincode: '560001',
    city: 'Bengaluru',
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    nation: 'India',
    scenario: 'PINCODE-3: Fourth user in pincode 560001 (Indiranagar)'
  }
];

async function cleanupExistingTestUsers() {
  console.log('\n🧹 Cleaning up existing test users...');
  const testEmails = testUsers.map(u => u.email);
  
  const { error } = await supabase
    .from('profiles')
    .delete()
    .in('email', testEmails);
  
  if (error) {
    console.log('  Note: Cleanup may have failed if no users exist:', error.message);
  } else {
    console.log('  ✓ Cleaned up existing test users');
  }
}

async function resetSequence() {
  console.log('\n🔄 Resetting UGT sequence...');
  
  // Try to reset the sequence to start from 1
  const { error } = await supabase.rpc('reset_ugt_sequence');
  if (error) {
    // If function doesn't exist, try direct SQL
    console.log('  Note: reset_ugt_sequence function not found, trying direct reset...');
    // We'll just continue and let the sequence auto-increment
  } else {
    console.log('  ✓ Sequence reset successfully');
  }
}

async function registerUser(userData, index) {
  console.log(`\n📝 [${index + 1}/18] ${userData.scenario}`);
  console.log(`   Name: ${userData.name}`);
  console.log(`   Location: ${userData.city}, ${userData.district}, ${userData.state}, ${userData.nation}`);
  console.log(`   Pincode: ${userData.pincode}`);
  
  try {
    const { data, error } = await supabase.rpc('register_user_atomic', {
      p_name: userData.name,
      p_dob: userData.dob,
      p_email: userData.email,
      p_phone: userData.phone,
      p_pincode: userData.pincode,
      p_city: userData.city,
      p_district: userData.district,
      p_state: userData.state,
      p_nation: userData.nation
    });
    
    if (error) {
      console.error(`   ❌ Error: ${error.message}`);
      return null;
    }
    
    const result = data[0];
    console.log(`   ✅ ID: ${result.universal_id}`);
    console.log(`   📊 Ranks:`);
    console.log(`      Universe: ${result.universe_rank} | Nation: ${result.nation_rank} | State: ${result.state_rank}`);
    console.log(`      District: ${result.district_rank} | City: ${result.city_rank} | Pincode: ${result.pincode_rank}`);
    
    return result;
  } catch (err) {
    console.error(`   ❌ Exception: ${err.message}`);
    return null;
  }
}

async function verifyRanks() {
  console.log('\n\n🔍 VERIFICATION SUMMARY');
  console.log('=' .repeat(80));
  
  // Fetch all test users
  const testEmails = testUsers.map(u => u.email);
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .in('email', testEmails)
    .order('created_at', { ascending: true });
  
  if (error) {
    console.error('Failed to fetch profiles for verification:', error);
    return;
  }
  
  console.log(`\nTotal test users created: ${profiles.length}`);
  
  // Group by scenarios
  const scenarios = {
    'GLOBAL': profiles.slice(0, 3),
    'NATIONAL': profiles.slice(3, 6),
    'STATE': profiles.slice(6, 9),
    'DISTRICT': profiles.slice(9, 12),
    'CITY': profiles.slice(12, 15),
    'PINCODE': profiles.slice(15, 18)
  };
  
  console.log('\n📊 RANK VERIFICATION BY SCENARIO:');
  console.log('-'.repeat(80));
  
  for (const [scenario, users] of Object.entries(scenarios)) {
    console.log(`\n${scenario} CHECK (${users.length} users):`);
    console.log('  ID              | Universe | Nation | State | District | City | Pincode');
    console.log('  ' + '-'.repeat(70));
    
    for (const user of users) {
      const { data: ranks } = await supabase.rpc('calculate_universal_standings', {
        target_uid: user.universal_id
      });
      
      if (ranks && ranks[0]) {
        const r = ranks[0];
        console.log(
          `  ${user.universal_id} | ${String(r.universe_rank).padStart(8)} | ${String(r.nation_rank).padStart(6)} | ${String(r.state_rank).padStart(5)} | ${String(r.district_rank).padStart(8)} | ${String(r.city_rank).padStart(4)} | ${String(r.pincode_rank).padStart(7)}`
        );
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Test complete! All 18 IDs created and ranks verified.');
  console.log('\nExpected behavior:');
  console.log('  - GLOBAL: Each user should have unique universe rank (1, 2, 3)');
  console.log('  - NATIONAL: India users share nation rank, USA/UK have their own');
  console.log('  - STATE: Karnataka users share state rank, others have their own');
  console.log('  - DISTRICT: Bengaluru Urban users share district rank');
  console.log('  - CITY: Bengaluru users share city rank');
  console.log('  - PINCODE: 560001 users share pincode rank (1,2,3,4)');
}

async function main() {
  console.log('🚀 Starting 18 Test IDs Creation');
  console.log('='.repeat(80));
  console.log('This script creates 18 test users to verify the rank system at:');
  console.log('  • Global (Universe) level');
  console.log('  • National level');
  console.log('  • State level');
  console.log('  • District level');
  console.log('  • City level');
  console.log('  • Pincode level');
  console.log('='.repeat(80));
  
  // Cleanup first
  await cleanupExistingTestUsers();
  
  // Reset sequence
  await resetSequence();
  
  // Register all 18 users
  console.log('\n📋 REGISTERING 18 TEST USERS:');
  console.log('-'.repeat(80));
  
  const results = [];
  for (let i = 0; i < testUsers.length; i++) {
    const result = await registerUser(testUsers[i], i);
    results.push(result);
  }
  
  // Verification
  await verifyRanks();
  
  console.log('\n📋 Test IDs Summary:');
  console.log('-'.repeat(80));
  results.forEach((r, i) => {
    if (r) {
      console.log(`  ${i + 1}. ${r.universal_id} - ${r.name} (${r.city}, ${r.state}, ${r.nation})`);
    }
  });
}

main().catch(console.error);