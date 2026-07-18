import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

async function executeSQL(sql) {
  // Use the pg endpoint to execute raw SQL
  const response = await fetch(supabaseUrl + '/rest/v1/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': 'Bearer ' + supabaseKey,
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ query: sql })
  });
  
  const result = await response.json();
  return { ok: response.ok, result };
}

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log('Running migration:', file);
    try {
      const { ok, result } = await executeSQL(sql);
      if (ok) {
        console.log('Success:', file);
      } else {
        console.error('Error:', result);
      }
    } catch (e) {
      console.error('Exception running', file, ':', e.message);
    }
  }
}

runMigrations();