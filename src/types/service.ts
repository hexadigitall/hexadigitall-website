// src/types/service.ts

export interface ServicePackage {
  _key: string
  name: string
  tier: 'basic' | 'standard' | 'premium' | 'enterprise'
  price: number
  currency: string
  billing: 'one_time' | 'monthly' | 'hourly' | 'project'
  deliveryTime: string
  description?: string
  originalPrice?: number
  features: Array<string | { title?: string; description?: string }>
  popular?: boolean
  addOns?: ServiceAddOn[]
}

export interface ServiceAddOn {
  _key: string
  name: string
  price: number
  description: string
}

export interface ServiceFAQ {
  _key: string
  question: string
  answer: string
}

export interface ServiceCategory {
  _id: string
  title: string
  slug: { current: string }
  description: string
  serviceType: 'web' | 'mobile' | 'marketing' | 'cloud' | 'consulting' | 'software' | 'branding' | 'profile' | 'business' | 'general'
  icon: string
  featured: boolean
  packages: ServicePackage[]
  requirements?: string[]
  faq?: ServiceFAQ[]
  features?: Array<string | { title?: string; description?: string }>
  processSteps?: Array<{ title?: string; description?: string }>
  deliverables?: Array<{ title?: string; description?: string }>
  additionalServices?: Array<{ title?: string; description?: string }>
  heroImage?: {
    url: string
    alt?: string
  }
  mainImage?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
    alt?: string
    hotspot?: object
  }
}

// Individual service for quick access (like $39 Logo, $89 Business Plan, etc.)
export interface IndividualService {
  id: string
  name: string
  price: number
  description: string
  deliveryTime: string
  features: string[]
  category?: string
}

// Props for service page components
export interface ServicePageProps {
  serviceCategory: ServiceCategory
  individualServices?: IndividualService[]
  relatedServices?: ServiceCategory[]
}

// For stats/metrics display
export interface ServiceStats {
  fundingSuccessRate: number
  totalFundingRaised: string
  averageRevenueGrowth: number
  averageDeliveryTime: string
}

// Legacy types for backwards compatibility
export interface LegacyServicePackage {
  _key: string
  _type: 'servicePackage'
  name: string
  description?: string
  price: number
  currency: string
  popular?: boolean
  features: string[]
  deliveryTime?: string
}

export interface LegacyIndividualService {
  _key: string
  _type: 'individualService'
  name: string
  description: string
  price: number
  currency: string
  deliveryTime: string
  features: string[]
}

export interface LegacyService {
  _id: string
  title: string
  slug: {
    current: string
  }
  description: string
  shortDescription?: string
  longDescription?: string
  packages?: LegacyServicePackage[]
  individualServices?: LegacyIndividualService[]
  category?: ServiceCategory
}

// For backwards compatibility with existing components
export interface LegacyServiceCategory {
  _id: string
  title: string
  slug: { current: string }
  description: string
  icon: string
  featured: boolean
  packages: Array<{
    _key: string
    name: string
    tier: 'basic' | 'standard' | 'premium'
    price: number
    currency: string
    billing: 'one_time' | 'monthly' | 'yearly'
    deliveryTime: string
    features: string[]
    popular: boolean
  }>
  serviceType: 'business' | 'technical' | 'creative' | 'consulting'
}
