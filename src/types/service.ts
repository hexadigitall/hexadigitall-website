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
  required?: boolean
}

export interface CustomizableService {
  _key: string
  name: string
  basePrice: number
  currency: string
  billing: 'one_time' | 'monthly' | 'hourly' | 'project'
  deliveryTime?: string
  description?: string
  addOns: ServiceAddOn[]
  defaultAddOns?: string[] // keys of default selected add-ons
}

export interface IndividualServiceItem {
  _key: string
  name: string
  price: number
  currency: string
  billing: 'one_time' | 'monthly' | 'hourly' | 'project'
  deliveryTime?: string
  description?: string
  features?: Array<string | { title?: string; description?: string }>
  popular?: boolean
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
  // Optional: package groups with per-package tiers from Sanity
  packageGroups?: ServicePackageGroup[]
  testimonials?: Array<{ _id?: string; client?: string; role?: string; testimonial?: string; company?: string; image?: { asset?: { url?: string } }; rating?: number }>
  caseStudies?: Array<{ _id?: string; title?: string; client?: { name?: string; industry?: string }; challenge?: string; slug?: { current?: string }; featured?: boolean }>
  statistics?: ServiceStats | { metrics?: { projectsCompleted?: number; clientSatisfaction?: number; averageDeliveryTime?: string; teamSize?: number } }
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

// Request cart item (combines selection with quantity/customization)
export interface ServiceRequestItem {
  serviceId: string
  serviceName: string
  serviceType: 'tiered' | 'individual' | 'customizable'
  tier?: ServicePackageTier // if tiered
  basePrice: number
  addOns?: { _key: string; name: string; price: number }[]
  quantity?: number
  total: number
}

// Props for service page components
export interface ServicePageProps {
  serviceCategory: ServiceCategory
  individualServices?: IndividualService[]
  relatedServices?: ServiceCategory[]
}

// For stats/metrics display
export interface ServiceStats {
  // Allow legacy and new shapes coming from Sanity. Keep optional fields to
  // accommodate different documents without causing type errors.
  _id?: string
  fundingSuccessRate?: number
  totalFundingRaised?: string
  averageRevenueGrowth?: number
  averageDeliveryTime?: string
  // Newer shape nests metrics under `metrics`.
  metrics?: {
    projectsCompleted?: number
    clientSatisfaction?: number
    averageDeliveryTime?: string
    teamSize?: number
    [key: string]: unknown
  }
  lastUpdated?: string
  [key: string]: unknown
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

// Optional Sanity package groups with tiers (for scoped modal selection)
export interface ServicePackageTier {
  _key: string
  name: string
  subtitle?: string
  tier: 'basic' | 'standard' | 'premium' | 'enterprise'
  price: number
  currency: string
  billing: 'one_time' | 'monthly' | 'hourly' | 'project'
  deliveryTime?: string
  features?: Array<string | { title?: string; description?: string }>
  popular?: boolean
  addOns?: ServiceAddOn[]
}

export interface ServicePackageGroup {
  key?: { current: string }
  name: string
  description?: string
  tiers: ServicePackageTier[]
}
