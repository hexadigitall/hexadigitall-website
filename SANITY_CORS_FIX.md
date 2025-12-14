# Sanity CORS and Authentication Fix

## Problem
The production website was experiencing:
1. **CORS 403 Forbidden errors** when trying to fetch data from Sanity
2. **"Missing SANITY_API_TOKEN" warnings** in browser console
3. **"hasToken: false"** in Sanity configuration logs
4. **Services failing to load** in the Header navigation

## Root Cause
The Sanity client was making unauthenticated requests from the browser, which Sanity's API was rejecting due to CORS policies.

## Solution
Added a public read token for client-side Sanity queries:

### Changes Made

1. **Updated `/src/sanity/client.ts`**:
   - Added `NEXT_PUBLIC_SANITY_READ_TOKEN` constant
   - Configured the client-side Sanity client to use this token
   - Enabled CDN for better performance on read operations
   - Added `hasReadToken` to configuration logs

2. **Updated `/src/hooks/useServices.ts`**:
   - Removed redundant client-side environment variable checks
   - Simplified error handling to rely on token authentication

3. **Updated `.env.local`**:
   - Added `NEXT_PUBLIC_SANITY_READ_TOKEN` variable

4. **Created `.env.production`**:
   - Complete production environment configuration
   - Includes all necessary Sanity, Paystack, and email service variables

5. **Updated Vercel Environment Variables**:
   - Added `NEXT_PUBLIC_SANITY_READ_TOKEN` to production environment

## Environment Variables Required

### Client-Side (Public - Safe to Expose)
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=puzezel0
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-08-30
NEXT_PUBLIC_SANITY_READ_TOKEN=sk...  # Public read token
```

### Server-Side (Private - Never Expose)
```bash
SANITY_API_TOKEN=sk...  # Write token with editor permissions
SANITY_API_READ_TOKEN=sk...  # Legacy, can be removed
```

## Token Differences

| Token | Permissions | Usage | Exposed in Browser? |
|-------|-------------|-------|---------------------|
| `NEXT_PUBLIC_SANITY_READ_TOKEN` | Read-only | Client-side queries | ✅ Yes (safe) |
| `SANITY_API_TOKEN` | Read + Write | Server-side operations | ❌ No (sensitive) |

## How to Get Tokens

1. Go to https://www.sanity.io/manage
2. Select your project (`puzezel0`)
3. Go to **API** → **Tokens**
4. For public read token:
   - Click "Add API token"
   - Name: "Public Read Token"
   - Permissions: **Viewer** (read-only)
   - Click "Add token"

## Verification

After deployment, check:
1. ✅ No more CORS errors in browser console
2. ✅ `hasReadToken: true` in Sanity config logs
3. ✅ Services load correctly in Header navigation
4. ✅ No "Missing SANITY_API_TOKEN" warnings

## Deployment Steps

```bash
# 1. Build locally to verify
npm run build

# 2. Commit changes
git add -A
git commit -m "Fix: Add public read token for client-side Sanity queries"
git push origin main

# 3. Add environment variable to Vercel
vercel env add NEXT_PUBLIC_SANITY_READ_TOKEN production

# 4. Deploy with new environment variable
vercel --prod --force
```

## Latest Deployment
- **URL**: https://hexadigitall-website-5v2u9rjxr-hexadigitall-s-projects.vercel.app
- **Date**: December 14, 2024
- **Commit**: 8a98ada
- **Status**: ✅ Build successful, zero errors

## Next Steps
1. Monitor browser console for any remaining errors
2. Verify all pages load correctly
3. Test form submissions to ensure write operations still work
4. Consider setting up proper CORS allowlist in Sanity dashboard

## Resources
- [Sanity Authentication Docs](https://www.sanity.io/docs/http-auth)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
