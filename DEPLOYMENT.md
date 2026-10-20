Deployment Guide

Everything runs on Cloudflare: the Worker serves the built site (dist/ as
static assets) and the D1-backed API from one origin. There is no other
backend to deploy.

1) One-time setup:

```bash
npx wrangler login
npm run migrate:d1          # apply migrations to local D1
npm run migrate:d1:remote   # apply migrations to production D1
```

2) Build and deploy:

```bash
npm ci
npm run build
npm run deploy              # npx wrangler deploy
```

In the Cloudflare dashboard, set the Deploy command to `npm run deploy`
(Workers) or `npx wrangler pages deploy dist` (Pages). Both serve the same
dist/ output.

3) Secrets (optional - only for features that need them):

```bash
# Password-reset emails (Brevo). Without this secret the Worker logs the
# reset link to its console instead of emailing it.
npx wrangler secret put BREVO_API_KEY
npx wrangler secret put BREVO_TEMPLATE_ID    # optional, default 1
npx wrangler secret put BREVO_SENDER_EMAIL   # optional
npx wrangler secret put BREVO_SENDER_NAME    # optional
```

Frontend environment variables: none required. The site and API share one
origin. `VITE_API_BASE_URL` exists only as an override for split-origin setups
(set it at build time if ever needed).

4) Local development:

```bash
npm run dev:worker    # Worker + D1 at http://localhost:8787
npm run dev           # Vite at http://localhost:3000 (proxies /api and /auth to :8787)
```

5) Notes:

- Use HTTPS (Cloudflare terminates TLS automatically).
- The Worker is the single source of truth for all registry data; never grant
  clients direct D1 access.
- Keep secrets (Brevo keys, Cloudflare API tokens) out of the client bundle
  and out of git. Worker secrets are stored with `wrangler secret put`.
