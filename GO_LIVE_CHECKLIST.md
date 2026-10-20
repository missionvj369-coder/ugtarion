# Go-Live Checklist - Universal Guard Trust

## Completed Items (Verified)

- [x] Sentry Error Tracking configured
- [x] HealthCheck component added
- [x] ErrorBoundary component in place
- [x] D1 migrations ready (migrations/*.d1.sql)
- [x] Worker API implemented (register, login, profile, count, verify, password reset)
- [x] Database connection verified
- [x] Login authentication verified
- [x] Password reset endpoints at /auth/password/* on the Worker
- [x] Brand Guidelines document created
- [x] Privacy Policy page implemented
- [x] Terms of Service page implemented
- [x] FAQ/Help page implemented
- [x] SEO setup (sitemap.xml, robots.txt)
- [x] Header navigation with legal links

---

## Pre-Launch Checklist

### 1. Database & Backend - VERIFIED
- [x] D1 migrations applied (`npm run migrate:d1:remote`)
- [x] Worker deployed (`npm run deploy`)
- [x] D1 database connection verified

### 2. Secrets - ACTION REQUIRED
- [ ] `npx wrangler secret put BREVO_API_KEY` (password-reset emails;
      without it the reset link is only logged to the Worker console)

### 3. Security - VERIFIED
- [x] Data access isolated behind the Cloudflare Worker (no direct DB access from client)
- [x] No exposed API keys in frontend code
- [x] Server-only secrets (Brevo, Cloudflare tokens) kept out of the client bundle

### 4. Performance - VERIFIED
- [x] Build configuration ready
- [x] ErrorBoundary for graceful error handling
- [x] Circuit breaker pattern implemented
- [x] Retry logic with exponential backoff

### 5. Monitoring - VERIFIED
- [x] Sentry configured
- [x] ErrorBoundary component in place
- [x] HealthCheck component available (/api/health, /api/health/database, /api/health/auth)

### 6. Domain & SSL
- [ ] Attach custom domain (ugtglobal.space) to the Worker/Pages project
- [ ] SSL is automatic on Cloudflare - verify the certificate
- [ ] Configure custom email domain in Brevo (optional)

### 7. Testing
- [x] Login/logout flow works
- [x] Password change works
- [x] User authentication works
- [ ] Test on mobile devices
- [ ] Test across browsers

### 8. Legal & Compliance
- [x] Privacy Policy page
- [x] Terms of Service page
- [ ] Cookie consent banner
- [ ] GDPR compliance (if EU users)

### 9. Backup & Recovery
- [x] D1 Time Travel enabled (30-day point-in-time restore on Cloudflare plans that support it)

### 10. Launch
- [ ] Deploy to production (`npm run deploy`)
- [ ] Verify all features work
- [ ] Announce launch

---

## Quick Commands

```bash
# Build for production
npm run build

# Deploy
npm run deploy

# Smoke tests against the Worker (dev)
npm run dev:worker   # then, in another terminal:
npm run test:api
```

---

## Support Setup - COMPLETED

- [x] Create FAQ/Help page
- [ ] Set up support email (support@ugtglobal.space)
- [ ] Set up status page (statuspage.io)

---

## Production Verification Results

```
Database connected (D1 via Worker)
POST /api/register works
POST /api/login works
GET  /api/profile/:uid works
GET  /api/count works
GET  /api/verify/:uid works
POST /auth/password/reset-request works
POST /auth/password/reset-confirm works
GET  /api/health works
```

**STATUS: READY FOR PRODUCTION** (pending BREVO_API_KEY secret + custom domain)
