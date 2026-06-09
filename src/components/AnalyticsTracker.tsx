// src/components/AnalyticsTracker.tsx
'use client';

import { usePageViewTracking } from '@/hooks/useAnalytics';

/**
 * Client-side analytics tracker component
 * Automatically tracks page views when the route changes
 */
export default function AnalyticsTracker() {
  usePageViewTracking();
  return null;
}
