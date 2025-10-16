# Local vs Live Site Investigation Report

**Date:** October 15, 2025  
**Site:** Hexadigitall (https://hexadigitall.com)  
**Repository:** hexadigitall/hexadigitall-website

## Executive Summary

This document investigates the differences between the local development environment (`npm run dev`) and the live site deployed on Vercel at https://hexadigitall.com. The investigation covers environment variables, build configurations, data sources, caching strategies, and deployment settings.

---

## 1. Environment Variables Investigation

### 1.1 Required Environment Variables

Based on code analysis, the following environment variables are used in the application:

#### **Sanity CMS Configuration**
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Project ID for Sanity CMS (found hardcoded: `puzezel0`)
- `NEXT_PUBLIC_SANITY_DATASET` - Dataset name (default: `production`)
- `NEXT_PUBLIC_SANITY_API_VERSION` - API version (default: `2024-08-30`)
- `SANITY_API_TOKEN` - Write token for server-side operations
- `SANITY_API_READ_TOKEN` - Read token for accessing content

#### **Payment Processing (Stripe)**
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY` - Public Stripe API key
- `STRIPE_SECRET_KEY` - Secret Stripe API key

#### **Site Configuration**
- `NEXT_PUBLIC_SITE_URL` - Base URL of the site
- `NEXT_PUBLIC_GA_ID` - Google Analytics tracking ID

#### **Email Services**
- `RESEND_API_KEY` - API key for email service
- `FROM_EMAIL` - Sender email address
- `CONTACT_FORM_RECIPIENT_EMAIL` - Recipient for contact form submissions

### 1.2 Local Environment Setup

**Files:**
- `.env.example` - Template with placeholder values
- `.env.local` - Local development variables (not tracked in git)
- `.env*.local` - Ignored by git (per `.gitignore`)

**Current Status:**
- ⚠️ No `.env.local` file exists in the fresh clone
- ✅ `.env.example` provides documentation of required variables
- ⚠️ Application has fallback values hardcoded in `src/sanity/client.ts`

### 1.3 Production Environment (Vercel)

**Configuration Location:**
- Vercel Dashboard → Project Settings → Environment Variables
- Not visible in repository (managed through Vercel UI)

### 1.4 Key Differences & Findings

#### **Sanity Client Configuration** (`src/sanity/client.ts`)
```typescript
// Lines 52-63: Read-only client configuration
export const client = createClient({
  projectId: projectId || 'puzezel0', // Fallback to known project ID
  dataset: dataset || 'production',
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // ⚠️ CRITICAL DIFFERENCE
  perspective: 'published',
  stega: false,
  requestTagPrefix: 'hexadigitall',
  ignoreBrowserTokenWarning: true,
  allowReconfigure: false,
});
```

**CRITICAL FINDING:**
- **Local (development):** `useCdn: false` - Fetches fresh data directly from Sanity
- **Production (Vercel):** `useCdn: true` - Uses Sanity's CDN with caching
- **Impact:** Content updates may not appear immediately on production due to CDN caching

### 1.5 Recommendations

1. **Create `.env.local` for local development:**
   ```bash
   cp .env.example .env.local
   # Then populate with actual values
   ```

2. **Verify Vercel environment variables:**
   - Check all required variables are set in Vercel Dashboard
   - Ensure no typos in variable names (case-sensitive)
   - Verify values match expected format

3. **Consider environment-specific configuration:**
   - Add `.env.production` for production-specific overrides
   - Document which variables differ between environments

4. **Add environment variable validation:**
   - Create a startup script to validate all required variables
   - Fail early if critical variables are missing

---

## 2. Build Scripts and Package Versions

### 2.1 Build Scripts (`package.json`)

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

### 2.2 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^15.5.2 | Next.js framework |
| react | ^19.1.1 | React library |
| next-sanity | ^10.1.1 | Sanity integration |
| @sanity/client | ^7.11.0 | Sanity API client |
| stripe | ^18.5.0 | Payment processing |

### 2.3 Findings

#### **Development Server**
- Uses Turbopack (`--turbopack` flag) for faster builds
- Hot module replacement enabled
- Development-specific optimizations active

#### **Production Build**
- Standard Next.js production build
- Code minification and optimization
- Static page generation where possible
- Server-side rendering for dynamic content

#### **Potential Issues**
- ⚠️ Font loading from Google Fonts may fail in restricted networks
- ⚠️ Turbopack in development may behave differently than production webpack
- ✅ Version pinning appears consistent

### 2.4 Recommendations

1. **Test production build locally:**
   ```bash
   npm run build
   npm start
   ```

2. **Version lock critical dependencies:**
   - Consider removing `^` from critical packages to prevent unexpected updates
   - Document tested version combinations

3. **Add build validation:**
   - Implement pre-deployment build checks
   - Test critical paths after each build

---

## 3. Deployment Configuration

### 3.1 Vercel Configuration

**Status:** ❌ **No `vercel.json` file found**

This means Vercel uses default configuration:
- Auto-detects Next.js project
- Default build command: `next build`
- Default output directory: `.next`
- Automatic framework presets applied

### 3.2 Next.js Configuration (`next.config.ts`)

#### **Key Settings:**

**Image Optimization:**
```typescript
images: {
  remotePatterns: [
    { hostname: 'cdn.sanity.io' },
    { hostname: 'images.unsplash.com' },
    { hostname: 'puzezel0.apicdn.sanity.io' }
  ],
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 300, // 5 minutes
}
```

**Performance Optimizations:**
```typescript
experimental: {
  optimizeCss: true,
  webpackBuildWorker: true,
  ppr: false,
  optimizePackageImports: ['@heroicons/react', '@portabletext/react']
}
```

**Security Headers:**
- X-DNS-Prefetch-Control
- X-Content-Type-Options
- X-Frame-Options: DENY
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 3.3 Findings

#### **Turbopack Configuration Notice**
```
⚠ The config property `experimental.turbo` is deprecated
```
- Configuration exists but uses deprecated syntax
- May affect build behavior

#### **CDN & Caching**
- Images cached for 5 minutes minimum
- Sanity CDN enabled in production
- Next.js automatic CDN through Vercel

### 3.4 Recommendations

1. **Create `vercel.json` for explicit configuration:**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "framework": "nextjs",
     "env": {
       "NODE_ENV": "production"
     }
   }
   ```

2. **Update deprecated Turbopack configuration:**
   - Move `experimental.turbo` to `config.turbopack`
   - Run: `npx @next/codemod@latest next-experimental-turbo-to-turbopack .`

3. **Consider environment-specific Next.js configs:**
   - `next.config.dev.ts` for development overrides
   - `next.config.prod.ts` for production overrides

---

## 4. Branch and Deployment Alignment

### 4.1 Current Branch Status

**Local Repository:**
```
Current branch: copilot/investigate-local-vs-live-site
Base branch: Not visible (grafted history)
Remote: origin/copilot/investigate-local-vs-live-site
```

**Findings:**
- ⚠️ Repository has grafted history (limited commit history)
- ⚠️ No visible `main` or `master` branch in local clone
- ✅ Working branch is in sync with remote

### 4.2 Vercel Deployment Configuration

**Typical Vercel Setup:**
- Production deployments from `main` or `master` branch
- Preview deployments from pull requests
- Branch deployments for feature branches

**Questions to Verify:**
1. Which branch is connected to production deployment?
2. Are automatic deployments enabled?
3. Is preview deployment enabled for PRs?

### 4.3 Recommendations

1. **Verify production branch in Vercel:**
   - Go to Vercel Dashboard → Project Settings → Git
   - Confirm production branch setting
   - Check deployment history

2. **Document deployment workflow:**
   ```markdown
   ## Deployment Process
   - Development: Feature branches → Preview on Vercel
   - Staging: `staging` branch → staging.hexadigitall.com
   - Production: `main` branch → hexadigitall.com
   ```

3. **Check deployment logs:**
   - Compare local build output with Vercel build logs
   - Look for environment variable warnings
   - Check for failed build steps

4. **Verify git configuration:**
   ```bash
   git remote -v  # Verify remote URLs
   git branch -a  # List all branches
   git log --oneline -10  # Check recent commits
   ```

---

## 5. Caching and CDN Issues

### 5.1 Caching Layers Identified

#### **1. Sanity CDN (Production Only)**
- **Status:** Enabled in production (`useCdn: true`)
- **Cache Duration:** Varies by content type
- **Purge Method:** Webhook-based or manual
- **Impact:** Content updates may be delayed

#### **2. Next.js Image Optimization**
- **Status:** Active in all environments
- **Cache Duration:** 5 minutes minimum (`minimumCacheTTL: 300`)
- **Storage:** Vercel's image cache
- **Impact:** Image updates may be delayed

#### **3. Vercel Edge Network**
- **Status:** Automatic for all static assets
- **Cache Duration:** Based on Cache-Control headers
- **Scope:** Global CDN
- **Impact:** Static assets cached at edge locations

#### **4. Browser Caching**
- **Status:** Controlled by response headers
- **Configuration:** Set in `next.config.ts` headers
- **Impact:** User's browser may cache resources

### 5.2 Content Freshness Comparison

| Content Type | Local (Dev) | Production (Vercel) |
|--------------|-------------|---------------------|
| Sanity CMS Data | Real-time | CDN cached (~1-60 min) |
| Static Assets | Real-time | Edge cached |
| API Routes | Real-time | Real-time |
| Generated Pages | Real-time | Cached until revalidate |

### 5.3 Known Issues

#### **Issue 1: Stale Content After CMS Updates**
**Symptoms:**
- Content updated in Sanity Studio doesn't appear on live site
- Local development shows updated content immediately

**Root Cause:**
- Sanity CDN caching with `useCdn: true` in production
- No webhook configured to trigger revalidation

**Solution:**
1. Configure Sanity webhook to trigger ISR revalidation
2. Or disable CDN for time-sensitive content
3. Or add manual cache purge button in admin

#### **Issue 2: Image Caching**
**Symptoms:**
- Updated images don't reflect on live site
- Clearing browser cache temporarily fixes it

**Root Cause:**
- `minimumCacheTTL: 300` (5 minutes)
- Vercel's image optimization cache

**Solution:**
1. Add query parameter to image URLs to bust cache
2. Increase cache duration for stability
3. Use different filenames for new images

### 5.4 Recommendations

1. **Implement Sanity Webhook for ISR:**
   ```typescript
   // src/app/api/revalidate/route.ts
   export async function POST(request: Request) {
     const { path } = await request.json();
     await revalidatePath(path);
     return Response.json({ revalidated: true });
   }
   ```

2. **Add cache status indicators:**
   - Show "content freshness" timestamp
   - Add admin tools to manually purge cache

3. **Document cache clearing procedures:**
   ```markdown
   ## Clearing Caches
   1. Sanity CDN: Wait 60 minutes or use webhook
   2. Vercel: Redeploy or use purge API
   3. Browser: Hard refresh (Ctrl+Shift+R)
   ```

4. **Consider cache strategies by content type:**
   - News/Updates: Short cache (5 min)
   - Services/Pricing: Medium cache (1 hour)
   - About/Static: Long cache (24 hours)

---

## 6. Data Source Differences

### 6.1 Primary Data Sources

#### **Sanity CMS (Primary CMS)**
- **Content Types:**
  - Service Categories
  - Testimonials
  - Course Enrollments
  - FAQ Items
  - Blog Posts
  - Portfolio Projects

- **Configuration:**
  - Project ID: `puzezel0`
  - Dataset: `production`
  - Studio URL: `/studio` route in Next.js app

#### **Hardcoded Fallback Data**

**Files with Fallback Data:**

1. **`src/components/sections/Testimonials.tsx`**
   ```typescript
   const fallbackTestimonials: Testimonial[] = [
     { authorName: "Sarah Johnson", ... },
     { authorName: "Adebayo Okafor", ... },
     { authorName: "Fatima Al-Hassan", ... }
   ];
   ```

2. **`src/components/sections/ServicesOverview.tsx`**
   ```typescript
   const services = [
     { title: 'Business Plan & Logo', ... },
     { title: 'Web & Mobile Development', ... },
     // ... hardcoded services
   ];
   ```

3. **`src/data/serviceGroups.ts`**
   - Complete service pricing structure
   - Converted from `SERVICE_PRICING` constant

4. **`src/lib/currency.ts`**
   - Exchange rates (hardcoded)
   - Currency mappings
   - Pricing tiers

### 6.2 Data Fetching Patterns

#### **Pattern 1: Sanity with Fallback**
```typescript
// src/components/sections/Testimonials.tsx
let testimonials: Testimonial[] = fallbackTestimonials;

try {
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && 
      process.env.NEXT_PUBLIC_SANITY_DATASET) {
    const sanityTestimonials = await client.fetch(testimonialQuery);
    if (Array.isArray(sanityTestimonials) && sanityTestimonials.length > 0) {
      testimonials = sanityTestimonials;
    }
  }
} catch (error) {
  console.warn('Failed to fetch, using fallback');
}
```

**Impact:**
- Local may use fallback if Sanity env vars not set
- Production uses Sanity if configured correctly
- Different content shown in each environment

#### **Pattern 2: Purely Hardcoded**
```typescript
// src/components/sections/ServicesOverview.tsx
const services = [...]; // Always uses hardcoded data
```

**Impact:**
- Identical across all environments
- Cannot be updated via CMS
- Requires code deployment to change

#### **Pattern 3: Dynamic Pricing**
```typescript
// src/lib/currency.ts
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  NGN: 1650,
  // ... other rates
};
```

**Impact:**
- Exchange rates are static
- Same rates in dev and production
- Manual updates required for rate changes

### 6.3 Potential Discrepancies

#### **Scenario 1: Missing Sanity Configuration**
- **Local:** Uses fallback testimonials and services
- **Production:** Fetches from Sanity CMS
- **Result:** Different content displayed

#### **Scenario 2: Outdated Sanity Data**
- **Local:** Fresh data (no CDN)
- **Production:** Cached data (CDN enabled)
- **Result:** Content appears stale on production

#### **Scenario 3: Different Dataset**
- **Local:** May point to `development` dataset
- **Production:** Points to `production` dataset
- **Result:** Completely different content

### 6.4 Recommendations

1. **Standardize data sources:**
   - **Option A:** Migrate all hardcoded data to Sanity CMS
   - **Option B:** Document which content is CMS-managed vs hardcoded
   - **Recommended:** Create a data strategy document

2. **Implement data consistency checks:**
   ```typescript
   // src/lib/data-check.ts
   export async function verifyDataSources() {
     const checks = {
       sanityConnected: await checkSanityConnection(),
       testimonials: await checkTestimonials(),
       services: await checkServices(),
     };
     return checks;
   }
   ```

3. **Add data source indicators (dev mode):**
   ```typescript
   {process.env.NODE_ENV === 'development' && (
     <div className="data-source-badge">
       Source: {isFromSanity ? 'Sanity CMS' : 'Fallback'}
     </div>
   )}
   ```

4. **Create unified data layer:**
   ```typescript
   // src/lib/data/index.ts
   export async function getTestimonials(): Promise<Testimonial[]> {
     // Single source of truth for all environments
     // Handles fallbacks, caching, and error handling
   }
   ```

5. **Document content management workflow:**
   ```markdown
   ## Content Update Process
   
   ### CMS-Managed Content
   - Testimonials → Update in Sanity Studio
   - Blog Posts → Update in Sanity Studio
   - FAQs → Update in Sanity Studio
   
   ### Code-Managed Content
   - Services Overview → Update `ServicesOverview.tsx`
   - Pricing Tiers → Update `currency.ts`
   - Exchange Rates → Update `currency.ts`
   ```

---

## 7. Additional Findings

### 7.1 Font Loading Issues

**Issue:** Build fails when Google Fonts API is unreachable
```typescript
// src/app/layout.tsx
const montserrat = Montserrat({ subsets: ['latin'], ... });
const lato = Lato({ subsets: ['latin'], ... });
```

**Impact:**
- Build failures in restricted networks
- Potential FOUC (Flash of Unstyled Content) in production

**Recommendation:**
- Add font fallbacks
- Consider self-hosting fonts
- Implement progressive enhancement

### 7.2 TypeScript Configuration

**Status:** ✅ Properly configured
- `ignoreBuildErrors: false` - Type checking enforced
- Strict mode enabled
- No build errors found in codebase

### 7.3 Security Considerations

**Findings:**
- ✅ Comprehensive security headers configured
- ✅ No sensitive data in repository
- ✅ Environment variables properly excluded from git
- ⚠️ Hardcoded Sanity project ID in multiple files
- ⚠️ No rate limiting visible in API routes

**Recommendations:**
1. Implement API rate limiting
2. Add request validation middleware
3. Regular security audits

### 7.4 Performance Metrics

**Configuration:**
- Image optimization: ✅ Enabled
- Code splitting: ✅ Automatic
- CSS optimization: ✅ Enabled (`optimizeCss: true`)
- Bundle analysis: ✅ Available (`npm run build:analyze`)

**Recommendations:**
1. Run Lighthouse audits on both environments
2. Compare Web Vitals metrics
3. Monitor performance after deployments

---

## 8. Action Plan

### Immediate Actions (Critical)

1. **[ ] Create `.env.local` file**
   ```bash
   cp .env.example .env.local
   # Populate with actual values from team
   ```

2. **[ ] Verify Vercel environment variables**
   - Access Vercel Dashboard
   - Check all required variables are set
   - Test with Vercel CLI: `vercel env pull`

3. **[ ] Document current production branch**
   - Identify which branch is deployed
   - Update README with deployment info

4. **[ ] Test production build locally**
   ```bash
   npm run build
   npm start
   # Compare behavior with npm run dev
   ```

### Short-term Actions (High Priority)

5. **[ ] Fix Turbopack deprecation warning**
   ```bash
   npx @next/codemod@latest next-experimental-turbo-to-turbopack .
   ```

6. **[ ] Implement Sanity webhook for ISR**
   - Create `/api/revalidate` endpoint
   - Configure webhook in Sanity Dashboard
   - Test content update flow

7. **[ ] Create `vercel.json` configuration**
   - Explicit build settings
   - Environment variable documentation
   - Deployment triggers

8. **[ ] Add data source consistency checks**
   - Create health check endpoint
   - Verify Sanity connection
   - Log data source usage

### Medium-term Actions (Improvements)

9. **[ ] Implement caching strategy documentation**
   - Document cache durations
   - Create cache purge procedures
   - Add cache status indicators

10. **[ ] Standardize data sources**
    - Audit hardcoded vs CMS content
    - Migrate appropriate content to Sanity
    - Document remaining hardcoded content

11. **[ ] Add monitoring and alerting**
    - Set up error tracking (e.g., Sentry)
    - Monitor build success rates
    - Track content freshness

12. **[ ] Performance optimization**
    - Run Lighthouse audits
    - Optimize images further
    - Implement service worker for offline support

### Long-term Actions (Strategic)

13. **[ ] Create staging environment**
    - Separate Vercel project for staging
    - Test deployments before production
    - Separate Sanity dataset

14. **[ ] Implement automated testing**
    - E2E tests for critical paths
    - Visual regression testing
    - Performance benchmarks

15. **[ ] Documentation overhaul**
    - Comprehensive deployment guide
    - Troubleshooting runbook
    - Architecture documentation

---

## 9. Conclusion

### Key Differences Identified

1. **CDN Usage:**
   - Local uses direct Sanity API (`useCdn: false`)
   - Production uses Sanity CDN (`useCdn: true`)
   - **Impact:** Content staleness in production

2. **Environment Variables:**
   - Local may be missing `.env.local` file
   - Production configured through Vercel Dashboard
   - **Impact:** Different behavior and fallback data usage

3. **Build Process:**
   - Local uses Turbopack for dev server
   - Production uses standard webpack build
   - **Impact:** Potential behavior differences

4. **Data Sources:**
   - Mix of Sanity CMS and hardcoded data
   - Fallback data when Sanity unavailable
   - **Impact:** Inconsistent content across environments

### Risk Assessment

| Risk | Severity | Likelihood | Mitigation Priority |
|------|----------|------------|---------------------|
| Stale content due to CDN | High | High | Critical |
| Missing env vars in local | Medium | High | Critical |
| Build configuration drift | Medium | Medium | High |
| Hardcoded data becoming outdated | Low | Medium | Medium |
| Font loading failures | Low | Low | Low |

### Success Criteria

To ensure local and production environments are aligned:

✅ Local development has all required environment variables  
✅ Content updates appear within 5 minutes on production  
✅ Build process completes successfully in both environments  
✅ No console errors related to missing configuration  
✅ Identical content displayed (when using same data source)  
✅ Performance metrics are comparable  

### Next Steps

1. Review this document with the development team
2. Prioritize action items based on business impact
3. Assign owners to each action item
4. Schedule follow-up investigation after changes
5. Update this document with findings from production testing

---

## Appendix

### A. Environment Variable Checklist

```bash
# Copy this checklist to verify your environment

# Sanity CMS
[ ] NEXT_PUBLIC_SANITY_PROJECT_ID
[ ] NEXT_PUBLIC_SANITY_DATASET
[ ] NEXT_PUBLIC_SANITY_API_VERSION
[ ] SANITY_API_TOKEN
[ ] SANITY_API_READ_TOKEN

# Stripe
[ ] NEXT_PUBLIC_STRIPE_PUBLIC_KEY
[ ] STRIPE_SECRET_KEY

# Site Config
[ ] NEXT_PUBLIC_SITE_URL
[ ] NEXT_PUBLIC_GA_ID

# Email
[ ] RESEND_API_KEY
[ ] FROM_EMAIL
[ ] CONTACT_FORM_RECIPIENT_EMAIL
```

### B. Useful Commands

```bash
# Check environment variables (safe - no values shown)
env | grep -E "(NEXT_PUBLIC|SANITY|STRIPE)" | cut -d= -f1

# Test build locally
npm run build && npm start

# Pull Vercel environment variables
vercel env pull .env.local

# Check Sanity connection
node check-sanity-content.js

# Analyze bundle size
npm run build:analyze

# Check for outdated dependencies
npm outdated
```

### C. Contact Points

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Sanity Studio (Local):** http://localhost:3000/studio
- **Sanity Studio (Production):** https://hexadigitall.com/studio
- **Live Site:** https://hexadigitall.com
- **Repository:** https://github.com/hexadigitall/hexadigitall-website

### D. Related Documentation

- `DEVELOPMENT_SETUP.md` - Local setup instructions
- `ERRORS_FIXED.md` - Common errors and solutions
- `SANITY_SETUP.md` - Sanity CMS configuration
- `ENV_SETUP.md` - Environment variables guide
- `.env.example` - Environment variable template

---

**Document Version:** 1.0  
**Last Updated:** October 15, 2025  
**Reviewed By:** GitHub Copilot Agent  
**Status:** ✅ Complete - Ready for Team Review
