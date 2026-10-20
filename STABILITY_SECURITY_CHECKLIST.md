# Universal Guard Trust - Website Stability, Security & Performance Checklist

## Architecture (current)

Cloudflare-only: one Worker serves the built site (dist/ static assets) and
the D1-backed registry API from a single origin. Password-reset emails are
sent by the Worker via Brevo. There is no other backend.

---

## CRITICAL - Must Do Before Production

### 1. Worker Secrets
Set with `wrangler secret put` (never in env files or the repo):

| Secret | Required | Purpose |
|--------|----------|---------|
| `BREVO_API_KEY` | yes (for reset emails) | Brevo API - without it the reset link is logged to the Worker console |
| `BREVO_TEMPLATE_ID` | no (default 1) | Brevo reset template |
| `BREVO_SENDER_EMAIL` | no | Verified sender in Brevo |
| `BREVO_SENDER_NAME` | no | Sender display name |

Frontend build env: none required (site and API share one origin).
`VITE_API_BASE_URL` and `VITE_SENTRY_DSN` are optional overrides.

### 2. Database Migrations
```bash
npm run migrate:d1          # local (wrangler dev state)
npm run migrate:d1:remote   # production D1
```

### 3. Brevo Email Template Setup
1. Login to Brevo > Templates > Create New
2. Create template with:
   - Subject: "Reset Your Universal Guard Trust Password"
   - Add button/link: `{{ params.RESET_URL }}`
3. Note the Template ID and set `BREVO_TEMPLATE_ID` as a Worker secret

### 4. Test Complete Auth Flow
```bash
# terminal 1: start the Worker + D1
npm run dev:worker
# terminal 2: run the API smoke tests
npm run test:api
node scripts/e2eTests.js
```

---

## HIGH PRIORITY - Should Implement

### Performance Optimization
- [ ] **Bundle Analysis**: Run `npm run build` and check for large JS files
- [ ] **Image Optimization**: Convert images to WebP/AVIF
- [ ] **Cache-Control Headers**: Configure Cache-Control for static assets (Cloudflare dashboard or a Worker rule)
- [ ] **Service Worker**: Add offline support
- [ ] **Font Subsetting**: Only load needed characters
- [ ] **Critical CSS Inlining**: Inline critical styles
- [ ] **Preconnect/Prefetch**: Add resource hints

### Security Hardening
- [ ] **Input Validation**: Review validation on all Worker API endpoints
- [ ] **Request Size Limits**: Enforce body-size limits in the Worker
- [ ] **API Versioning**: Add /v1/ prefix for future-proofing
- [ ] **Penetration Testing**: Run security scans
- [ ] **Dependency Audit**: `npm audit`

### Monitoring & Logging
- [ ] **Sentry Configuration**: Set `VITE_SENTRY_DSN` at build time
- [ ] **Uptime Monitoring**: Use Better Uptime or similar
- [ ] **Log Aggregation**: Cloudflare Workers Logs / Datadog
- [ ] **Alerting**: Configure alerts for errors/downtime

---

## NICE TO HAVE - Future Improvements

### SEO & Accessibility
- [ ] Meta tags (title, description, OG tags)
- [ ] Structured data (JSON-LD)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] WCAG 2.1 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Color contrast compliance

### Testing
- [ ] Unit tests (Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright)
- [ ] Load testing (k6/Artillery)
- [ ] Security scanning (SAST/DAST)

### CI/CD
- [x] Build on push (GitHub Actions)
- [ ] Automated D1 migration check in CI (`npm run test:d1`)
- [ ] Code quality checks (lint, format)
- [ ] Automated deployments
- [ ] Rollback strategy
- [ ] Feature flags

### Database
- [x] D1 Time Travel (point-in-time restore)
- [ ] Automated exports / backups

---

## QUICK VERIFICATION COMMANDS

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Offline D1 schema smoke test
npm run test:d1

# Check for exposed secrets
grep -rn "password\|secret\|api_key" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules .

# Check bundle size
npm run build && ls -la dist/assets/*.js

# Audit dependencies
npm audit

# API smoke tests (Worker must be running)
npm run test:api
```

---

## IMMEDIATE ACTION ITEMS (Do These First)

1. **Run Database Migrations** (`npm run migrate:d1:remote`)
2. **Deploy the Worker** (`npm run deploy`)
3. **Set BREVO_API_KEY** (`npx wrangler secret put BREVO_API_KEY`)
4. **Configure Brevo Email Template** with `{{ params.RESET_URL }}`
5. **Test Registration** on production site
6. **Test Password Reset** flow
7. **Set up Sentry** with your DSN
8. **Configure Uptime Monitoring**

---

## Core Web Vitals Targets

| Metric | Target | Current Status |
|--------|--------|----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Needs testing |
| FID (First Input Delay) | < 100ms | Needs testing |
| CLS (Cumulative Layout Shift) | < 0.1 | Needs testing |

---

## Emergency Contacts

| Service | Contact |
|---------|---------|
| Hosting (Cloudflare) | https://support.cloudflare.com |
| Email (Brevo) | https://help.brevo.com |
| Security Issues | security@ugtglobal.space |

---

*Last Updated: 2026-10-19*
*Version: 2.0 (Cloudflare-only)*
