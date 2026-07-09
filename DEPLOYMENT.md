Deployment Guide

1) Set production environment variables (example `.env.production` on the server):

```
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-public-anon-key>
VITE_API_BASE_URL=https://api.yourdomain.com

SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret>
API_PORT=4000
DEV_ORIGIN=https://your-frontend-domain.com
```

- `VITE_SUPABASE_ANON_KEY` is public and used by the browser bundle.
- `SUPABASE_SERVICE_ROLE_KEY` is secret and must be stored only on the backend host or in a secret manager.

2) Start the backend API (on server):

```bash
# from project root
npm install --production
npm run start:api
```

3) Build and deploy the frontend (on CI or build server):

```bash
# locally or CI
npm ci
npm run build
# deploy the `dist/` static files to your CDN or static host
```

4) Run as a systemd service (example):

```
[Unit]
Description=Universal Guard Trust API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/universal-guard-trust
Environment="SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret>"
Environment="API_PORT=4000"
ExecStart=/usr/bin/node server/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

5) Notes:
- Use HTTPS and secure CORS policies for `VITE_API_BASE_URL`.
- Use a secret manager (AWS Secrets Manager, Vault) if possible instead of plain `.env` files.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is never published to the client or committed to git.
