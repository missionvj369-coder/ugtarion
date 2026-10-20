// UGTARION D1 Migration runner (Cloudflare D1 / SQLite).
// Applies the ordered *.d1.sql files in migrations/ via wrangler.
// Usage:
//   node scripts/migrate-d1.cjs --local
//   node scripts/migrate-d1.cjs --remote
// Requires: npx wrangler login (for --remote), and database_id set in wrangler.toml.

const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');

const execFileAsync = promisify(execFile);

const DB_NAME = 'ugtarion';
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');
const MIGRATION_FILES = [
  '001_create_profiles_and_standings.d1.sql',
  '002_auth_system.d1.sql',
  '003_otp_and_tokens.d1.sql',
  '004_password_reset.d1.sql',
];

async function runWrangler(args, cwd) {
  return execFileAsync('npx', ['wrangler', ...args], { cwd, encoding: 'utf8' });
}

async function main() {
  const mode = process.argv.includes('--remote') ? '--remote' : '--local';
  console.log(`🚀 UGTARION D1 migration (${mode})...`);

  const missing = MIGRATION_FILES.filter(
    (f) => !fs.existsSync(path.join(MIGRATIONS_DIR, f)),
  );
  if (missing.length > 0) {
    console.error(`❌ Missing migration files: ${missing.join(', ')}`);
    process.exit(1);
  }

  for (const file of MIGRATION_FILES) {
    const full = path.join(MIGRATIONS_DIR, file);
    console.log(`📋 Applying ${file} ...`);
    try {
      const { stdout, stderr } = await runWrangler(
        ['d1', 'execute', DB_NAME, `--file=${full}`, mode],
        path.join(__dirname, '..'),
      );
      if (stdout) console.log(stdout);
      if (stderr && !/warn/i.test(stderr)) console.error(stderr);
      console.log(`✅ ${file}`);
    } catch (error) {
      console.error(`❌ Failed at ${file}: ${error.message}`);
      if (error.stdout) console.error(error.stdout);
      if (error.stderr) console.error(error.stderr);
      process.exit(1);
    }
  }

  console.log('\n✅ All D1 migrations applied.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

