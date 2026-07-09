Test scripts

- `scripts/testRegister.js`: simple one-shot test to POST /api/register and print response.
- `scripts/e2eTests.js`: full sequence: register, duplicate check, login (identifier), count, fetch profile.

Run locally:

```bash
# ensure server is running with .env.server present
npm run start:api
# in another terminal
node scripts/e2eTests.js
```
