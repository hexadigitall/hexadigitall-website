# Analytics & Admin Data Tracking Fix – Dec 14, 2025

## Problem Identified
Admin dashboard shows no analytics or submission data because:
1. **Analytics Events**: Google Analytics is set up, but events aren't being saved to Sanity database (which admin dashboard reads from)
2. **Submissions**: These ARE working - contact forms save to `formSubmission` documents in Sanity
3. **Page Views**: Only tracked in Google Analytics, not in Sanity's `analyticsEvent` collection

## Root Cause
- `/api/analytics POST` endpoint exists to save events to Sanity
- BUT: No client-side code actually calls this endpoint
- Analytics tracking (`trackEvent`, `trackPageView`, etc.) only sends to Google Analytics
- Admin dashboard queries Sanity for `analyticsEvent` documents - finds nothing

## Solution Implemented
Created comprehensive analytics tracking system:

### 1. New Custom Hook (`src/hooks/useAnalytics.ts`)
- `usePageViewTracking()` - Auto-tracks page views on route changes
- `useAnalytics()` - Returns helper functions:
  - `trackServiceView()`
  - `trackCourseView()`
  - `trackButtonClick()`
  - `trackFormStart()` / `trackFormSubmit()`
- Sends events to BOTH:
  - `/api/analytics` (saves to Sanity for admin dashboard)
  - Google Analytics (gtag)

### 2. Analytics Tracker Component (`src/components/AnalyticsTracker.tsx`)
- Client component that calls `usePageViewTracking()`
- Auto-tracks every page view across the site
- Captures: pathname, title, device type, browser

### 3. What Gets Tracked Now
- **Page Views**: Every route change
- **Device Type**: Mobile vs Desktop
- **Browser**: Chrome, Safari, Firefox, Edge, etc.
- **Timestamp**: ISO format
- **Path & Title**: Current page info

## Next Steps to Complete Integration

### Add to Layout
```tsx
// src/app/layout.tsx
import AnalyticsTracker from '@/components/AnalyticsTracker';

// Inside <body>, add after GoogleAnalytics:
<GoogleAnalytics />
<AnalyticsTracker />
```

### Add to Service/Course Pages
```tsx
import { useAnalytics } from '@/hooks/useAnalytics';

function ServicePage() {
  const { trackServiceView } = useAnalytics();
  
  useEffect(() => {
    trackServiceView('Web Development', { package: 'Premium' });
  }, []);
}
```

### Add to Forms
```tsx
const { trackFormStart, trackFormSubmit } = useAnalytics();

// On form focus/start
<form onFocus={() => trackFormStart('Contact Form')}>

// On submit
const handleSubmit = async (e) => {
  // ... your logic
  trackFormSubmit('Contact Form', success);
};
```

## Testing Checklist
- [ ] Add AnalyticsTracker to layout.tsx
- [ ] Visit 5-10 pages on the site
- [ ] Wait 1 minute for events to process
- [ ] Open Admin > Analytics
- [ ] Should see:
  - Page view counts in "Popular Pages"
  - Recent events table populated
  - Device types and browsers

## Why Submissions Work But Analytics Don't
- Contact form (`/api/contact/route.ts`) DOES create `formSubmission` documents
- BUT: No analytics events were being created in Sanity
- Admin submissions page queries `formSubmission` - works ✅
- Admin analytics page queries `analyticsEvent` - empty until now ❌

## Environment Check
Make sure these exist:
- `.env.local`: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
- Sanity Studio: `analyticsEvent` schema is deployed
- Sanity Client: Has write permissions

## Files Created
1. `src/hooks/useAnalytics.ts` - Core tracking logic
2. `src/components/AnalyticsTracker.tsx` - Auto page view tracker
3. This document

## Files to Update
1. `src/app/layout.tsx` - Import and add <AnalyticsTracker />
2. Service/course pages - Add view tracking
3. Forms - Add start/submit tracking
