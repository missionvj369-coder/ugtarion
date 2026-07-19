# 🚀 Go-Live Checklist - Universal Guard Trust

## ✅ Completed Items

- [x] Sentry Error Tracking configured
- [x] HealthCheck component added
- [x] ErrorBoundary component in place
- [x] RLS policies migration ready

---

## 📋 Pre-Launch Checklist

### 1. Database & Backend
- [ ] Run RLS migration in Supabase SQL Editor
  - File: `supabase/migrations/007_rls_policies.sql`
- [ ] Verify all migrations have been applied
- [ ] Test API endpoints locally

### 2. Environment Variables
- [ ] Create production `.env` file with:
  ```
  VITE_SUPABASE_URL=https://your-project.supabase.co
  VITE_SUPABASE_ANON_KEY=your-production-anon-key
  VITE_API_BASE_URL=https://api.yourdomain.com
  VITE_SENTRY_DSN=your-production-sentry-dsn
  ```
- [ ] Set server-side secrets in Netlify/Vercel dashboard:
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `BREVO_API_KEY`

### 3. Security
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] Verify no exposed API keys in frontend code
- [ ] Enable CORS restrictions for production domains
- [ ] Set up rate limiting on API endpoints

### 4. Performance
- [ ] Run `npm run build` to verify no TypeScript errors
- [ ] Enable GZIP compression on hosting
- [ ] Set up CDN for static assets
- [ ] Configure caching headers

### 5. Monitoring
- [ ] Set up Sentry project for production
- [ ] Configure uptime monitoring (UptimeRobot, Pingdom)
- [ ] Set up log aggregation
- [ ] Configure alerts for errors

### 6. Domain & SSL
- [ ] Point domain DNS to hosting
- [ ] Enable SSL certificate (auto with Netlify/Vercel)
- [ ] Set up www to non-www redirect
- [ ] Configure custom email domain (optional)

### 7. Testing
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Test user registration flow
- [ ] Test login/logout flow
- [ ] Test password reset flow
- [ ] Test email verification
- [ ] Test on mobile devices
- [ ] Test across browsers (Chrome, Firefox, Safari, Edge)

### 8. Legal & Compliance
- [ ] Privacy Policy page
- [ ] Terms of Service page
- [ ] Cookie consent banner
- [ ] GDPR compliance (if EU users)

### 9. Backup & Recovery
- [ ] Enable database backups (Supabase has auto-backups)
- [ ] Document recovery procedures
- [ ] Set up disaster recovery plan

### 10. Launch
- [ ] Enable maintenance mode during deployment
- [ ] Deploy to production
- [ ] Verify all features work
- [ ] Disable maintenance mode
- [ ] Announce launch

---

## 🔧 Quick Commands

```bash
# Build for production
npm run build

# Run type check
npm run typecheck

# Run tests
npm run test

# Run E2E tests
npm run test:e2e
```

---

## 📞 Support Setup

- [ ] Set up support email (support@yourdomain.com)
- [ ] Create FAQ/Help page
- [ ] Set up status page (statuspage.io)