// src/components/GoogleAnalytics.tsx
"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    gtag: (command: string, ...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

const GoogleAnalytics = () => {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && gaId) {
      const url = pathname + (searchParams ? `?${searchParams}` : '');
      window.gtag('config', gaId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, gaId]);

  if (!gaId) {
    console.warn('Google Analytics ID not found');
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
              // Enhanced ecommerce
              currency: 'USD',
              // Privacy settings
              anonymize_ip: true,
              // Performance
              sample_rate: 100
            });

            // Track custom events
            gtag('event', 'page_view', {
              page_title: document.title,
              page_location: window.location.href,
              page_path: window.location.pathname
            });
          `,
        }}
      />
    </>
  );
};

export default GoogleAnalytics;