# Hexadigitall Deployment Guide

## Overview

This guide explains how to deploy the Hexadigitall website and resolve differences between local development and production environments.

## Critical Fixes Implemented

### 1. ✅ Sanity CDN Staleness Issue - FIXED

**Problem:** Content updates in Sanity Studio took 1-60 minutes to appear on production due to CDN caching.

**Solution:** Implemented ISR (Incremental Static Regeneration) webhook endpoint.

**Setup Instructions:**

1. Add environment variable to Vercel:
   ```
   SANITY_REVALIDATE_SECRET=<generate-random-secret>
   ```

2. Configure webhook in Sanity Dashboard:
   - Go to: Sanity Dashboard → API → Webhooks
   - Create new webhook:
     - **Name:** Hexadigitall Production Revalidation
     - **URL:** `https://hexadigitall.com/api/revalidate?secret=<your-secret>`
     - **HTTP method:** POST
     - **Dataset:** production
     - **Trigger on:** Create, Update, Delete
     - **Filter:** Leave empty (or customize per document type)

3. Test the webhook:
   ```bash
   curl -X POST "https://hexadigitall.com/api/revalidate?secret=<your-secret>" \
     -H "Content-Type: application/json" \
     -d '{"_type":"testimonial"}'
   ```

**Result:** Content updates now appear within seconds instead of minutes/hours.

---

### 2. ✅ Turbopack Deprecation Warning - FIXED

**Problem:** Build showed deprecation warning for `experimental.turbo` configuration.

**Solution:** Migrated configuration from `experimental.turbo` to `turbopack` in `next.config.ts`.

**Changes Made:**
```typescript
// Before (deprecated):
experimental: {
  turbo: { rules: {...} }
}

// After (current):
turbopack: {
  rules: {...}
}
```

**Result:** No more deprecation warnings during builds.

---

### 3. ✅ Missing Vercel Configuration - FIXED

**Problem:** No explicit `vercel.json` file, relying on auto-detection.

**Solution:** Created `vercel.json` with explicit configuration.

**Features:**
- Explicit build commands
- Environment variable references
- Security headers
- Deployment triggers

**Note:** Environment variables in `vercel.json` use Vercel's secret system (`@secret_name`). Actual values must be set in Vercel Dashboard.

---

### 4. ✅ Local Environment Setup - IMPROVED

**Problem:** No clear guide for setting up local development environment.

**Solution:** Created `.env.local.template` with comprehensive instructions.

**Quick Start:**
```bash
# 1. Copy the template
cp .env.local.template .env.local

# 2. The app works with defaults - optional to add real tokens

# 3. Install and run
npm install
npm run dev
```

**Features:**
- Clear documentation of each variable
- Default values that work for basic testing
- Instructions for full functionality

---

## Environment Variable Setup

### Local Development (.env.local)

```bash
# Minimal setup (app works with fallback data)
NEXT_PUBLIC_SANITY_PROJECT_ID=puzezel0
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Full setup (requires team credentials)
SANITY_API_READ_TOKEN=<from-sanity-dashboard>
SANITY_API_TOKEN=<from-sanity-dashboard>
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=<from-stripe>
STRIPE_SECRET_KEY=<from-stripe>
RESEND_API_KEY=<from-resend>
```

### Production (Vercel Dashboard)

All environment variables must be set in Vercel Dashboard:

1. Go to: Vercel Dashboard → Project → Settings → Environment Variables

2. Add all variables from `.env.example`

3. **Critical Variables for Production:**
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `puzezel0`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `SANITY_API_TOKEN` = (get from Sanity Dashboard)
   - `SANITY_REVALIDATE_SECRET` = (generate random string)
   - `NEXT_PUBLIC_SITE_URL` = `https://hexadigitall.com`

---

## Deployment Workflow

### Automatic Deployments

Vercel automatically deploys:
- **Production:** Commits to `main` branch → https://hexadigitall.com
- **Preview:** Pull requests → unique preview URL

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Testing the Deployment

### 1. Test Local Build

```bash
# Build production version locally
npm run build

# Run production server
npm start

# Visit: http://localhost:3000
```

### 2. Test Revalidation Endpoint

```bash
# Test manually (replace <secret> with actual secret)
curl "http://localhost:3000/api/revalidate?secret=<secret>&path=/"

# Or via webhook simulation
curl -X POST "http://localhost:3000/api/revalidate?secret=<secret>" \
  -H "Content-Type: application/json" \
  -d '{"_type":"testimonial","slug":{"current":"test"}}'
```

### 3. Verify Environment Variables

```bash
# Check which env vars are loaded
curl http://localhost:3000/api/health

# Should show:
# {
#   "status": "OK",
#   "env": {
#     "hasStripeSecret": true/false,
#     "hasSiteUrl": true,
#     "nodeEnv": "production"
#   }
# }
```

---

## Troubleshooting

### Content Not Updating on Production

**Symptoms:**
- Changes in Sanity Studio don't appear on live site
- Content is stale

**Solutions:**
1. Verify webhook is configured in Sanity Dashboard
2. Check `SANITY_REVALIDATE_SECRET` is set in Vercel
3. Test webhook manually (see Testing section above)
4. Check Vercel logs for revalidation errors

### Build Failures

**Symptom:** Build fails with Google Fonts error

**Solution:** Network issue - Vercel will retry automatically. If persistent, check Vercel status page.

**Symptom:** TypeScript errors

**Solution:**
```bash
# Check locally first
npm run build

# Fix any TypeScript errors
# Then commit and push
```

### Environment Variable Issues

**Symptom:** Features not working (payments, email, etc.)

**Solutions:**
1. Check variables are set in Vercel Dashboard
2. Verify variable names are exact (case-sensitive)
3. Redeploy after adding variables
4. Check browser console for errors

---

## Content Freshness Strategy

### Development (Local)
- Direct Sanity API connection
- No CDN caching
- Immediate content updates
- Uses `useCdn: false`

### Production (Vercel)
- Sanity CDN enabled for performance
- ISR revalidation via webhook
- Updates within seconds of Sanity changes
- Uses `useCdn: true` + revalidation

### Cache Layers

1. **Sanity CDN:** Bypassed by ISR revalidation
2. **Next.js Image Cache:** 5 minutes minimum
3. **Vercel Edge Cache:** Invalidated on deployment
4. **Browser Cache:** Controlled by response headers

---

## Monitoring & Maintenance

### Check Deployment Status

- Vercel Dashboard → Deployments
- Recent deployments list
- Build logs and errors

### Monitor Webhooks

- Sanity Dashboard → API → Webhooks
- View delivery history
- Check for failed deliveries

### Performance Monitoring

```bash
# Run Lighthouse audit
npm run build
# Use Chrome DevTools Lighthouse tab

# Analyze bundle size
npm run build:analyze
```

---

## Next Steps

1. ✅ Turbopack deprecation - FIXED
2. ✅ ISR revalidation endpoint - IMPLEMENTED
3. ✅ Vercel.json configuration - CREATED
4. ✅ Local environment setup - IMPROVED
5. ⏳ Configure Sanity webhook (requires Sanity Dashboard access)
6. ⏳ Set SANITY_REVALIDATE_SECRET in Vercel
7. ⏳ Test content update flow end-to-end

---

## Support & Documentation

- **Investigation Report:** `INVESTIGATION.md`
- **Development Setup:** `DEVELOPMENT_SETUP.md`
- **Environment Setup:** `.env.local.template`
- **Vercel Config:** `vercel.json`
- **Revalidation API:** `src/app/api/revalidate/route.ts`

For questions or issues, refer to the investigation report or contact the development team.
