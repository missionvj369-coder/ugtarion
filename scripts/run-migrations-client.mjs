import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://mgrdamgdpnbtxgxdxwbs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ncmRhbWdkcG5idHhneGR4d2JzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzU3MjY0MiwiZXhwIjoyMDk5MTQ4NjQyfQ.boLH5sgyFBTgrV0SfDBedgwjNv_qiNymMpUNO3Qtz7o';

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSQL(sql) {
  // Use the rpc function to execute SQL
  const { data, error } = await supabase.rpc('exec_sql', { sql });
  return { ok: !error, result: data, error };
}

async function runMigrations() {
  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
  const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
  
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    console.log('Running migration:', file);
    try {
      const { ok, result, error } = await executeSQL(sql);
      if (ok) {
        console.log('Success:', file);
      } else {
        console.error('Error:', error);
      }
    } catch (e) {
      console.error('Exception running', file, ':', e.message);
    }
  }
}

runMigrations();