// src/hooks/useAnalytics.ts
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AnalyticsEvent {
  eventType: string;
  eventName?: string;
  page: string;
  eventData?: Record<string, unknown>;
  deviceType?: string;
  browser?: string;
  timestamp: string;
}

// Client-side analytics helper
export function sendAnalyticsEvent(event: Omit<AnalyticsEvent, 'timestamp' | 'page' | 'deviceType' | 'browser'>) {
  if (typeof window === 'undefined') return;

  const deviceType = /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
  const browser = navigator.userAgent.match(/(Chrome|Safari|Firefox|Edge|Opera)/)?.[1] || 'Unknown';

  const analyticsEvent: AnalyticsEvent = {
    ...event,
    page: window.location.pathname,
    deviceType,
    browser,
    timestamp: new Date().toISOString(),
  };

  // Send to our analytics API (non-blocking)
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(analyticsEvent),
  }).catch((err) => console.debug('Analytics error:', err));

  // Also send to Google Analytics if available
  if (window.gtag) {
    window.gtag('event', event.eventType, {
      event_category: event.eventType,
      event_label: event.eventName,
      ...event.eventData,
    });
  }
}

// Hook to track page views automatically
export function usePageViewTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    sendAnalyticsEvent({
      eventType: 'page_view',
      eventName: `Page View: ${pathname}`,
      eventData: {
        path: pathname,
        title: document.title,
      },
    });
  }, [pathname]);
}

// Hook for tracking specific events
export function useAnalytics() {
  return {
    trackEvent: sendAnalyticsEvent,
    trackServiceView: (serviceName: string, serviceData?: Record<string, unknown>) => {
      sendAnalyticsEvent({
        eventType: 'service_view',
        eventName: `Service View: ${serviceName}`,
        eventData: { serviceName, ...serviceData },
      });
    },
    trackCourseView: (courseName: string, courseData?: Record<string, unknown>) => {
      sendAnalyticsEvent({
        eventType: 'course_view',
        eventName: `Course View: ${courseName}`,
        eventData: { courseName, ...courseData },
      });
    },
    trackButtonClick: (buttonName: string, context?: string) => {
      sendAnalyticsEvent({
        eventType: 'button_click',
        eventName: `Button Click: ${buttonName}`,
        eventData: { buttonName, context },
      });
    },
    trackFormStart: (formName: string) => {
      sendAnalyticsEvent({
        eventType: 'form_start',
        eventName: `Form Start: ${formName}`,
        eventData: { formName },
      });
    },
    trackFormSubmit: (formName: string, success: boolean) => {
      sendAnalyticsEvent({
        eventType: 'form_submit',
        eventName: `Form Submit: ${formName}`,
        eventData: { formName, success },
      });
    },
  };
}
