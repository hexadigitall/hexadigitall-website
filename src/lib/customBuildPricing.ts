// src/lib/customBuildPricing.ts
// Custom Build Wizard Pricing Structure
// Following the "Shawarma Model": Bread (Platform) + Fillings (Features) + Sides (Services)

export interface PlatformBase {
  id: string
  name: string
  basePrice: number // USD
  description: string
  coreFeatures: string[]
  deliveryTime: string
}

export interface TechFeature {
  id: string
  name: string
  price: number // USD
  description: string
  category: 'authentication' | 'payments' | 'communication' | 'ai' | 'mobile' | 'analytics'
  icon?: string
}

export interface ServiceAddon {
  id: string
  name: string
  price: number // USD (or per month)
  description: string
  billing?: 'one_time' | 'monthly'
  category: 'branding' | 'marketing' | 'support' | 'content'
}

// THE "BREAD" - Platform Foundation
export const PLATFORM_BASES: PlatformBase[] = [
  {
    id: 'web',
    name: 'Web Application',
    basePrice: 1500,
    description: 'Professional web application foundation',
    deliveryTime: '14-21 days',
    coreFeatures: [
      'Custom Next.js + React Architecture',
      'Responsive UI/UX Design (Mobile, Tablet, Desktop)',
      'Content Management System (Sanity CMS)',
      'SSL Security & Secure Headers',
      'Performance Optimization (<2s load time)',
      'Hosting Setup & Domain Connection (Vercel/Netlify)',
      '30 Days Post-Launch Support'
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile App',
    basePrice: 2500,
    description: 'Native mobile app for iOS & Android',
    deliveryTime: '21-28 days',
    coreFeatures: [
      'Cross-Platform React Native Setup (iOS & Android)',
      'Professional Tab & Stack Navigation',
      'App Store Configuration (Icons, Splash Screens)',
      'Permission Handling (Camera, Location, Notifications)',
      'Responsive Design for All Screen Sizes',
      'App Store Submission Assistance',
      '30 Days Post-Launch Support'
    ]
  },
  {
    id: 'web-mobile',
    name: 'Web + Mobile',
    basePrice: 3500,
    description: 'Complete cross-platform solution',
    deliveryTime: '28-35 days',
    coreFeatures: [
      'Everything in Web Application',
      'Everything in Mobile App',
      'Shared Backend & API',
      'Unified Design System',
      'Cross-Platform Data Sync',
      '30 Days Post-Launch Support'
    ]
  }
]

// THE "FILLINGS" - Tech Features (Additive Pricing)
export const TECH_FEATURES: TechFeature[] = [
  {
    id: 'user-auth',
    name: 'User Accounts & Authentication',
    price: 350,
    description: 'Email, phone, or social login (Google, Facebook, Apple)',
    category: 'authentication',
    icon: '🔐'
  },
  {
    id: 'payments',
    name: 'Payments & Subscriptions',
    price: 450,
    description: 'Accept payments via Paystack, Flutterwave, or other gateways',
    category: 'payments',
    icon: '💳'
  },
  {
    id: 'chat',
    name: 'In-App Chat & Messaging',
    price: 600,
    description: '1:1 or group messaging with real-time sync',
    category: 'communication',
    icon: '💬'
  },
  {
    id: 'ai-features',
    name: 'AI-Powered Features',
    price: 800,
    description: 'Recommendations, content generation, smart assistants',
    category: 'ai',
    icon: '🤖'
  },
  {
    id: 'push-notifications',
    name: 'Push Notifications',
    price: 300,
    description: 'Send alerts and updates to users (Web & Mobile)',
    category: 'mobile',
    icon: '🔔'
  },
  {
    id: 'analytics',
    name: 'Analytics & Tracking',
    price: 250,
    description: 'User behavior tracking, conversion funnels, dashboards',
    category: 'analytics',
    icon: '📊'
  },
  {
    id: 'file-uploads',
    name: 'File Upload & Storage',
    price: 300,
    description: 'Upload images, documents, videos with cloud storage',
    category: 'communication',
    icon: '📁'
  },
  {
    id: 'booking-scheduling',
    name: 'Booking & Scheduling',
    price: 500,
    description: 'Appointment booking, calendar integration, reminders',
    category: 'communication',
    icon: '📅'
  },
  {
    id: 'multi-language',
    name: 'Multi-Language Support',
    price: 400,
    description: 'Internationalization (i18n) for global audiences',
    category: 'communication',
    icon: '🌍'
  },
  {
    id: 'admin-dashboard',
    name: 'Advanced Admin Dashboard',
    price: 600,
    description: 'Manage users, content, analytics, and settings',
    category: 'analytics',
    icon: '⚙️'
  }
]

// THE "SIDES" - Service Add-ons
export const SERVICE_ADDONS: ServiceAddon[] = [
  {
    id: 'logo-design',
    name: 'Professional Logo Design',
    price: 400,
    description: '3 concepts, unlimited revisions, vector files',
    billing: 'one_time',
    category: 'branding'
  },
  {
    id: 'seo-setup',
    name: 'SEO Setup & Optimization',
    price: 350,
    description: 'Meta tags, sitemap, schema markup, Google indexing',
    billing: 'one_time',
    category: 'marketing'
  },
  {
    id: 'maintenance-3mo',
    name: '3-Month Maintenance Plan',
    price: 500,
    description: 'Bug fixes, updates, and priority support',
    billing: 'monthly',
    category: 'support'
  },
  {
    id: 'content-writing',
    name: 'Content Writing (5 Pages)',
    price: 300,
    description: 'SEO-optimized, professionally written content',
    billing: 'one_time',
    category: 'content'
  },
  {
    id: 'social-media-setup',
    name: 'Social Media Setup',
    price: 250,
    description: 'Branded profiles on 3 platforms with initial posts',
    billing: 'one_time',
    category: 'marketing'
  },
  {
    id: 'video-tutorial',
    name: 'Admin Training Video',
    price: 200,
    description: 'Screen recording walkthrough of your dashboard',
    billing: 'one_time',
    category: 'support'
  }
]

// Price Calculator
export interface CustomBuildSelection {
  platform: string // Platform ID
  techFeatures: string[] // Array of feature IDs
  serviceAddons: string[] // Array of addon IDs
}

export function calculateCustomBuildPrice(selection: CustomBuildSelection): {
  platformCost: number
  featuresCost: number
  addonsCost: number
  total: number
  breakdown: {
    platform: PlatformBase | undefined
    features: TechFeature[]
    addons: ServiceAddon[]
  }
} {
  const platform = PLATFORM_BASES.find(p => p.id === selection.platform)
  const features = TECH_FEATURES.filter(f => selection.techFeatures.includes(f.id))
  const addons = SERVICE_ADDONS.filter(a => selection.serviceAddons.includes(a.id))

  const platformCost = platform?.basePrice || 0
  const featuresCost = features.reduce((sum, f) => sum + f.price, 0)
  const addonsCost = addons.reduce((sum, a) => sum + a.price, 0)

  return {
    platformCost,
    featuresCost,
    addonsCost,
    total: platformCost + featuresCost + addonsCost,
    breakdown: {
      platform,
      features,
      addons
    }
  }
}
