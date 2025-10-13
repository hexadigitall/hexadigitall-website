// src/data/serviceGroups.ts

import React from 'react';
import { SERVICE_PRICING, PricingTier } from '@/lib/currency';

export interface ServiceGroup {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  packages: GroupPackage[];
  backgroundImage?: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface GroupPackage {
  _key: string;
  name: string;
  tier: 'basic' | 'standard' | 'premium' | 'enterprise';
  price: number;
  currency: string;
  billing: 'one_time' | 'monthly' | 'hourly' | 'project';
  deliveryTime: string;
  features: string[];
  addOns?: AddOn[];
  popular?: boolean;
  serviceType: keyof typeof SERVICE_PRICING;
  originalTier: PricingTier;
}

export interface AddOn {
  _key: string;
  name: string;
  price: number;
  description: string;
}

// Convert SERVICE_PRICING to GroupPackages
const convertToGroupPackages = (serviceType: keyof typeof SERVICE_PRICING): GroupPackage[] => {
  return SERVICE_PRICING[serviceType].map((tier, index) => ({
    _key: `${serviceType}-${tier.id}`,
    name: tier.name,
    tier: index === 0 ? 'basic' : index === 1 ? 'standard' : index === 2 ? 'premium' : 'enterprise',
    price: tier.basePrice,
    currency: 'USD',
    billing: 'one_time' as const,
    deliveryTime: tier.billing || 'Standard delivery',
    features: tier.features,
    popular: tier.popular || false,
    serviceType,
    originalTier: tier
  }));
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: 'business-strategy',
    name: 'Business Strategy & Planning',
    description: 'Complete business planning, strategic consulting, and mentorship services to launch and grow your business.',
    icon: React.createElement('svg', {
      className: 'w-8 h-8',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: 2,
      d: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
    })),
    packages: [
      ...convertToGroupPackages('business-plan'),
      ...convertToGroupPackages('consulting')
    ],
    backgroundImage: '/assets/images/services/business-strategy.jpg',
    colorTheme: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa'
    }
  },
  {
    id: 'digital-presence',
    name: 'Digital Presence & Development',
    description: 'Professional websites, portfolios, and digital solutions to establish your online presence.',
    icon: React.createElement('svg', {
      className: 'w-8 h-8',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: 2,
      d: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    })),
    packages: [
      ...convertToGroupPackages('web-development'),
      ...convertToGroupPackages('portfolio')
    ],
    backgroundImage: '/assets/images/services/web-development.jpg',
    colorTheme: {
      primary: '#059669',
      secondary: '#10b981',
      accent: '#34d399'
    }
  },
  {
    id: 'marketing-growth',
    name: 'Marketing & Growth',
    description: 'Comprehensive marketing solutions to grow your audience, increase engagement, and drive sales.',
    icon: React.createElement('svg', {
      className: 'w-8 h-8',
      fill: 'none',
      stroke: 'currentColor',
      viewBox: '0 0 24 24'
    }, React.createElement('path', {
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeWidth: 2,
      d: 'M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
    })),
    packages: [
      ...convertToGroupPackages('digital-marketing')
    ],
    backgroundImage: '/assets/images/services/digital-marketing.jpg',
    colorTheme: {
      primary: '#dc2626',
      secondary: '#ef4444',
      accent: '#f87171'
    }
  }
];

// Individual services that can be purchased separately
export interface IndividualService {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  deliveryTime: string;
  features: string[];
}

export const INDIVIDUAL_SERVICES: IndividualService[] = [
  // Logo Design Services
  {
    id: 'logo-design-basic',
    name: 'Basic Logo Design',
    description: 'Simple, professional logo with 3 concepts and 2 revisions',
    price: 49,
    category: 'branding',
    deliveryTime: '3-5 days',
    features: [
      '3 Logo concepts',
      '2 Revision rounds',
      'High-resolution files (PNG, JPG)',
      'Basic brand colors',
      '3-5 day delivery'
    ]
  },
  {
    id: 'logo-design-premium',
    name: 'Premium Logo Design',
    description: 'Complete logo package with variations and brand guidelines',
    price: 99,
    category: 'branding',
    deliveryTime: '5-7 days',
    features: [
      '5 Logo concepts',
      'Unlimited revisions',
      'All file formats (SVG, EPS, PDF, PNG, JPG)',
      'Logo variations (horizontal, vertical, icon)',
      'Brand color palette',
      'Basic brand guidelines',
      '5-7 day delivery'
    ]
  },
  
  // Web Development Services
  {
    id: 'single-webpage',
    name: 'Single Web Page',
    description: 'Professional single page design (landing page, about page, etc.)',
    price: 79,
    category: 'web-development',
    deliveryTime: '3-5 days',
    features: [
      'Custom page design',
      'Mobile responsive',
      'Basic SEO setup',
      'Contact form integration',
      '2 revision rounds',
      '3-5 day delivery'
    ]
  },
  {
    id: 'website-redesign',
    name: 'Website Redesign',
    description: 'Complete redesign of existing website with modern look',
    price: 299,
    category: 'web-development',
    deliveryTime: '7-10 days',
    features: [
      'Complete visual redesign',
      'Mobile optimization',
      'Speed optimization',
      'SEO improvements',
      'Content migration',
      '3 revision rounds',
      '7-10 day delivery'
    ]
  },
  
  // Marketing Services
  {
    id: 'social-media-audit',
    name: 'Social Media Audit',
    description: 'Comprehensive analysis of your social media presence',
    price: 99,
    category: 'marketing',
    deliveryTime: '3-5 days',
    features: [
      'Analysis of all social platforms',
      'Competitor benchmarking',
      'Content performance review',
      'Audience analysis',
      'Detailed report with recommendations',
      '3-5 day delivery'
    ]
  },
  {
    id: 'content-creation',
    name: 'Social Media Content Package',
    description: '10 professionally designed social media posts',
    price: 149,
    category: 'marketing',
    deliveryTime: '5-7 days',
    features: [
      '10 Custom designed posts',
      'Platform-optimized sizes',
      'Brand-consistent design',
      'Hashtag recommendations',
      'Posting schedule suggestions',
      '2 revision rounds',
      '5-7 day delivery'
    ]
  },
  
  // Consulting Services
  {
    id: 'quick-consultation',
    name: '1-Hour Business Consultation',
    description: 'Focused consultation call for specific business challenges',
    price: 79,
    category: 'consulting',
    deliveryTime: 'Same day booking',
    features: [
      '60-minute video call',
      'Business challenge analysis',
      'Strategic recommendations',
      'Action plan outline',
      'Follow-up summary email',
      'Same day booking available'
    ]
  },
  {
    id: 'business-audit',
    name: 'Business Process Audit',
    description: 'Comprehensive review of your business operations',
    price: 399,
    category: 'consulting',
    deliveryTime: '7-10 days',
    features: [
      'Complete process mapping',
      'Efficiency analysis',
      'Bottleneck identification',
      'Improvement recommendations',
      'Implementation roadmap',
      'Detailed audit report',
      '7-10 day delivery'
    ]
  }
];

// Bundle combinations with volume discounts
export interface ServiceBundle {
  id: string;
  name: string;
  description: string;
  services: string[];
  originalPrice: number;
  bundlePrice: number;
  savings: number;
  popular?: boolean;
  features: string[];
}

export const SERVICE_BUNDLES: ServiceBundle[] = [
  {
    id: 'startup-essentials',
    name: 'Startup Essentials Bundle',
    description: 'Everything you need to launch your business online',
    services: ['logo-design-premium', 'single-webpage', 'social-media-audit'],
    originalPrice: 277, // $99 + $79 + $99
    bundlePrice: 199,
    savings: 78,
    popular: true,
    features: [
      'Premium logo design package',
      'Professional landing page',
      'Social media strategy audit',
      'Brand consistency across all assets',
      'Combined 7-10 day delivery'
    ]
  },
  {
    id: 'business-growth',
    name: 'Business Growth Bundle',
    description: 'Accelerate your business growth with comprehensive support',
    services: ['business-audit', 'website-redesign', 'content-creation'],
    originalPrice: 847, // $399 + $299 + $149
    bundlePrice: 649,
    savings: 198,
    features: [
      'Complete business process audit',
      'Website redesign and optimization',
      'Professional content creation',
      'Growth strategy recommendations',
      'Priority support and coordination'
    ]
  }
];