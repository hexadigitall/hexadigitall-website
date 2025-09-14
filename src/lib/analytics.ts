// src/lib/analytics.ts

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

interface EventProperties {
  event_category?: string;
  event_label?: string;
  value?: number;
  currency?: string;
  [key: string]: any;
}

export const trackEvent = (eventName: string, properties?: EventProperties) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: properties?.event_category || 'engagement',
      event_label: properties?.event_label,
      value: properties?.value,
      ...properties,
    });
  }
};

// Predefined event tracking functions
export const analytics = {
  // Page tracking
  trackPageView: (pagePath: string, pageTitle?: string) => {
    trackEvent('page_view', {
      page_path: pagePath,
      page_title: pageTitle || document.title,
    });
  },

  // Course events
  trackCourseView: (courseName: string, coursePrice: number) => {
    trackEvent('view_item', {
      event_category: 'courses',
      event_label: courseName,
      currency: 'USD',
      value: coursePrice,
      item_category: 'course',
      item_name: courseName,
    });
  },

  trackCourseEnrollmentStart: (courseName: string, coursePrice: number) => {
    trackEvent('begin_checkout', {
      event_category: 'courses',
      event_label: courseName,
      currency: 'USD',
      value: coursePrice,
      item_category: 'course',
      item_name: courseName,
    });
  },

  trackCourseEnrollment: (courseName: string, coursePrice: number, enrollmentId?: string) => {
    trackEvent('purchase', {
      event_category: 'courses',
      event_label: courseName,
      currency: 'USD',
      value: coursePrice,
      transaction_id: enrollmentId,
      item_category: 'course',
      item_name: courseName,
    });
  },

  // Service events
  trackServiceView: (serviceName: string, packageName: string) => {
    trackEvent('view_item', {
      event_category: 'services',
      event_label: `${serviceName} - ${packageName}`,
      item_category: 'service',
      item_name: serviceName,
      item_variant: packageName,
    });
  },

  trackServiceInquiry: (serviceName: string, packagePrice: number, inquiryId?: string) => {
    trackEvent('generate_lead', {
      event_category: 'services',
      event_label: serviceName,
      currency: 'USD',
      value: packagePrice,
      lead_id: inquiryId,
    });
  },

  trackServicePurchase: (serviceName: string, packageName: string, packagePrice: number, requestId?: string) => {
    trackEvent('purchase', {
      event_category: 'services',
      event_label: `${serviceName} - ${packageName}`,
      currency: 'USD',
      value: packagePrice,
      transaction_id: requestId,
      item_category: 'service',
      item_name: serviceName,
      item_variant: packageName,
    });
  },

  // Contact & engagement events
  trackContactFormSubmission: (source: string = 'contact_page') => {
    trackEvent('contact_form_submit', {
      event_category: 'engagement',
      event_label: source,
    });
  },

  trackNewsletterSignup: (source: string = 'footer') => {
    trackEvent('sign_up', {
      event_category: 'engagement',
      event_label: source,
      method: 'newsletter',
    });
  },

  trackFileDownload: (fileName: string, fileType: string = 'pdf') => {
    trackEvent('file_download', {
      event_category: 'engagement',
      event_label: fileName,
      file_extension: fileType,
    });
  },

  trackOutboundLink: (url: string, linkText?: string) => {
    trackEvent('click', {
      event_category: 'outbound_links',
      event_label: url,
      link_text: linkText,
    });
  },

  // User engagement
  trackScrollDepth: (percentage: number) => {
    trackEvent('scroll', {
      event_category: 'engagement',
      event_label: `${percentage}%`,
      value: percentage,
    });
  },

  trackVideoPlay: (videoTitle: string, videoLength?: number) => {
    trackEvent('video_play', {
      event_category: 'engagement',
      event_label: videoTitle,
      value: videoLength,
    });
  },

  // Search events
  trackSiteSearch: (searchTerm: string, resultsCount?: number) => {
    trackEvent('search', {
      event_category: 'engagement',
      search_term: searchTerm,
      event_label: searchTerm,
      value: resultsCount,
    });
  },

  // Performance events
  trackPageLoadTime: (loadTime: number, pageName: string) => {
    trackEvent('timing_complete', {
      event_category: 'performance',
      event_label: pageName,
      value: Math.round(loadTime),
      name: 'page_load_time',
    });
  },

  // Error tracking
  trackError: (errorMessage: string, errorLocation?: string) => {
    trackEvent('exception', {
      event_category: 'errors',
      event_label: errorMessage,
      description: errorMessage,
      fatal: false,
      error_location: errorLocation,
    });
  },
};

// Enhanced ecommerce tracking for multiple items
export const trackPurchase = (transactionId: string, items: Array<{
  item_name: string;
  item_category: string;
  item_variant?: string;
  price: number;
  quantity: number;
}>, totalValue: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: totalValue,
      currency: 'USD',
      items: items.map(item => ({
        item_id: item.item_name.toLowerCase().replace(/\s+/g, '_'),
        item_name: item.item_name,
        item_category: item.item_category,
        item_variant: item.item_variant,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }
};