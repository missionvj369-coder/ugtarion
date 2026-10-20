Scripts

D1 / Cloudflare (current):

- `scripts/migrate-d1.cjs`: applies the ordered `*.d1.sql` files in `migrations/`
  to the Cloudflare D1 database via `wrangler d1 execute`. Used by `npm run migrate:d1`
  (local) and `npm run migrate:d1:remote`.
- `scripts/test-d1-schema.mjs`: offline schema smoke test. Executes each `*.d1.sql` file
  against an in-memory SQLite database (node:sqlite) and verifies core tables + seed row.
  Used by `npm run test:d1`. No Cloudflare login required.
- `scripts/test-user-scenarios.mjs`: offline user + ranking scenario test (22 checks).
  Registers users across regions, verifies rows saved in `profiles`, duplicate
  email/phone rejection, login correct/wrong/unknown, verify by UID, universe /
  nation / state / district / city / pincode ranks, same-city rank-2 behavior,
  and the password-reset token lifecycle. Used by `npm run test:scenarios`.

API smoke tests (hit the Worker directly; run `npm run dev:worker` first):

- `scripts/testRegister.js`: simple one-shot test to POST /api/register and print response.
- `scripts/e2eTests.js`: full sequence: register, duplicate check, login (identifier + password), count, fetch profile.

Run locally:

```bash
# terminal 1: the Worker + D1 (wrangler dev, http://localhost:8787)
npm run dev:worker
# terminal 2: a smoke test
npm run test:api
# or the full flow
node scripts/e2eTests.js
```


