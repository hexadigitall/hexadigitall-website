"use client"

import React, { useMemo, useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { StartingAtPriceDisplay } from '@/components/ui/PriceDisplay'
import { ServiceRequestFlow } from '@/components/services/ServiceRequestFlow'
import Breadcrumb from '@/components/ui/Breadcrumb'
import Link from 'next/link'
import { SERVICE_PRICING } from '@/lib/currency'
import type { ServiceCategory as SanityServiceCategory, ServicePackageGroup, ServicePackageTier } from '@/types/service'
import ServiceTestimonials from './ServiceTestimonials'
import ServiceCaseStudies from './ServiceCaseStudies'
import ServiceStatistics from './ServiceStatistics'

// Individual service options for easy access (unchanged)
const INDIVIDUAL_SERVICES = [
  {
    id: 'landing-page-design',
    name: 'Landing Page Design',
    price: 79,
    description: 'High-converting single page website optimized for conversions',
    deliveryTime: '3-5 days',
    features: [
      'Single page responsive design',
      'Mobile & tablet optimized',
      'Contact form integration',
      'Basic SEO optimization',
      '2 revision rounds',
      'FREE stock images included'
    ]
  },
  {
    id: 'website-maintenance',
    name: 'Website Maintenance',
    price: 99,
    description: 'Monthly website updates, security, and performance optimization',
    deliveryTime: 'Ongoing monthly',
    features: [
      'Monthly content updates',
      'Security monitoring & fixes',
      'Backup management',
      'Performance optimization',
      'Up to 5 hours of changes',
      'Technical support included'
    ]
  },
  {
    id: 'mobile-app-design',
    name: 'Mobile App UI/UX',
    price: 199,
    description: 'Professional mobile app design with user experience focus',
    deliveryTime: '7-10 days',
    features: [
      'Complete app design (5-7 screens)',
      'User experience flow mapping',
      'Interactive prototype',
      'iOS & Android compatible',
      'Design system & style guide',
      '3 revision rounds included'
    ]
  }
]

// Compact shape for the page's package cards
interface DisplayPackage {
  id: string
  name: string
  description?: string
  basePrice: number
  features: string[]
  popular?: boolean
  billing?: string
  // If coming from Sanity, attach the exact tiers for modal
  sanityTiers?: ServicePackageTier[]
}

export default function WebMobileClient({
  sanityCategory
}: {
  sanityCategory?: SanityServiceCategory | null
}) {
  const [selectedService, setSelectedService] = useState<SanityServiceCategory | null>(null)
  const [showIndividualServices, setShowIndividualServices] = useState(false)
  const { currentCurrency, getLocalDiscountMessage } = useCurrency()
  const discountMessage = getLocalDiscountMessage()

  // Build display packages either from Sanity packageGroups (preferred) or fallback to SERVICE_PRICING
  const webPackages: DisplayPackage[] = useMemo(() => {
    // Prefer Sanity packageGroups when present
    const groups: ServicePackageGroup[] | undefined = sanityCategory?.packageGroups
    if (groups && Array.isArray(groups) && groups.length > 0) {
      return groups.map((group, idx) => {
        const tiers = Array.isArray(group.tiers) ? group.tiers : []
        // Choose a representative price: prefer 'standard', else lowest
        const standard = tiers.find(t => t.tier === 'standard')
        const minPrice = tiers.reduce((min, t) => (typeof t.price === 'number' && t.price < min ? t.price : min), Infinity)
        const basePrice = typeof standard?.price === 'number' ? standard!.price : (isFinite(minPrice) ? minPrice : 0)
        // Derive some features preview from the standard tier
        const stdFeatures = (standard?.features || []) as Array<string | { title?: string; description?: string }>
        const featuresPreview = stdFeatures
          .map(f => (typeof f === 'string' ? f : (f?.title || f?.description || '')))
          .filter(Boolean)
          .slice(0, 8) as string[]
        return {
          id: (group.key?.current || group.name || `group-${idx}`).toLowerCase().replace(/\s+/g, '-'),
          name: group.name || `Package ${idx + 1}`,
          description: group.description,
          basePrice,
          features: featuresPreview,
          sanityTiers: tiers
        }
      })
    }

    // Fallback to existing SERVICE_PRICING-derived packages
    const baseWebPackages = SERVICE_PRICING['web-development'] || []
    const landing = baseWebPackages.find(p => p.id === 'landing-page')
    const business = baseWebPackages.find(p => p.id === 'business-website')
    const ecommerce = baseWebPackages.find(p => p.id === 'ecommerce-website')
    const customAppTier = baseWebPackages.find(p => p.id === 'custom-web-app')
    const packages = [landing, business, ecommerce, customAppTier].filter(Boolean) as typeof baseWebPackages
    return packages.map(pkg => ({
      id: pkg.id,
      name: pkg.id === 'landing-page' ? 'Landing Page Package'
        : pkg.id === 'business-website' ? 'Business Website Package'
        : pkg.id === 'ecommerce-website' ? 'E-commerce Package'
        : pkg.id === 'custom-web-app' ? 'Custom Web App Package' : pkg.name,
      basePrice: pkg.basePrice,
      features: Array.isArray(pkg.features) ? pkg.features.slice(0, 8) : [],
      popular: pkg.popular,
      billing: pkg.billing
    }))
  }, [sanityCategory])

  // Build a mock serviceCategory for the modal header, description, etc.
  const modalServiceCategory = useMemo(() => {
    const base = sanityCategory || {
      _id: 'web-mobile-development',
      title: 'Web & Mobile Development',
      slug: { current: 'web-and-mobile-software-development' },
      description: 'Professional websites and mobile applications that drive business growth and user engagement.',
      icon: 'code',
      featured: false,
      packages: [],
      serviceType: 'web' as const
    }
    return base
  }, [sanityCategory])

  // Build per-package tiers for the modal
  const getTiersForPackage = (pkg: DisplayPackage) => {
    // If coming from Sanity, use exact tiers
    if (pkg.sanityTiers && pkg.sanityTiers.length > 0) {
      // Ensure mandatory fields and sensible defaults
      return pkg.sanityTiers.map((t, i) => ({
        _key: t._key || `${pkg.id}-${t.tier}-${i}`,
        name: t.name || `${pkg.name} — ${t.tier}`,
        tier: t.tier,
        price: typeof t.price === 'number' ? t.price : 0,
        currency: t.currency || 'USD',
        billing: t.billing || 'one_time',
        deliveryTime: t.deliveryTime || '',
        features: Array.isArray(t.features) ? t.features : [],
        popular: !!t.popular,
        addOns: Array.isArray(t.addOns) ? t.addOns : []
      }))
    }

    // Else, derive default tiers with CLEARLY DISTINCT features that justify price differences
    const defaults = {
      basic: Math.max(99, Math.round(pkg.basePrice)),
      standard: Math.max(149, Math.round(pkg.basePrice * 1.8)),
      premium: Math.max(249, Math.round(pkg.basePrice * 3.2))
    }

    // Build tiered feature sets with clear value progression
    const baseFeatures = Array.isArray(pkg.features) ? pkg.features : []
    
    // Define tier-specific enhancements
    const basicFeatures = [
      ...baseFeatures.slice(0, 3),
      'Basic responsive design',
      'Mobile-friendly layout',
      'Contact form integration',
      '1 revision round',
      '48-hour support response'
    ]

    const standardFeatures = [
      ...baseFeatures.slice(0, 5),
      'Advanced responsive design',
      'Cross-browser compatibility',
      'SEO optimization (on-page)',
      'Google Analytics integration',
      'Contact form + email notifications',
      'Social media integration',
      '3 revision rounds',
      'Priority email support',
      '24-hour support response',
      '30-day bug fixes included'
    ]

    const premiumFeatures = [
      ...baseFeatures,
      'Premium responsive design',
      'Performance optimization (<2s load)',
      'Advanced SEO (technical + on-page)',
      'Google Analytics + custom tracking',
      'Advanced forms with validation',
      'Full social media integration',
      'Content management system',
      'Security hardening & SSL',
      'Speed optimization (95+ PageSpeed)',
      'Unlimited revisions (30 days)',
      'Priority 24/7 support',
      '12-hour support response',
      '90-day maintenance included',
      'Free minor updates (3 months)',
      'Performance monitoring setup'
    ]

    return [
      {
        _key: `${pkg.id}-basic`,
        name: `${pkg.name} — Basic`,
        tier: 'basic' as const,
        price: defaults.basic,
        currency: 'USD',
        billing: 'one_time' as const,
        deliveryTime: '3-7 days',
        features: basicFeatures,
        popular: false
      },
      {
        _key: `${pkg.id}-standard`,
        name: `${pkg.name} — Standard`,
        tier: 'standard' as const,
        price: defaults.standard,
        currency: 'USD',
        billing: 'one_time' as const,
        deliveryTime: '7-14 days',
        features: standardFeatures,
        popular: true
      },
      {
        _key: `${pkg.id}-premium`,
        name: `${pkg.name} — Premium`,
        tier: 'premium' as const,
        price: defaults.premium,
        currency: 'USD',
        billing: 'one_time' as const,
        deliveryTime: '14-21 days',
        features: premiumFeatures,
        popular: false
      }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb items={[
            { label: 'Services', href: '/services' },
            { label: 'Web & Mobile Development' }
          ]} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 via-blue-600/10 to-teal-600/10"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-teal-400/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            {/* Special Offer Banner */}
            {discountMessage && (
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg animate-bounce">
                  <span>🇳🇬</span>
                  <span>NIGERIAN LAUNCH SPECIAL - 50% OFF ALL PACKAGES!</span>
                  <span>🔥</span>
                </div>
              </div>
            )}
            
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-green-800 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <span>Development & Technology Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
              Web & Mobile Development
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional websites and mobile applications built with modern technology. Fast, secure, 
              and optimized for business growth and exceptional user experience.
            </p>
            
            {/* Currency Info */}
            <div className="mt-8">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <span>Prices shown in:</span>
                <span className="font-semibold text-primary">{currentCurrency.flag} {currentCurrency.code}</span>
              </div>
            </div>
          </div>

          {/* Quick Individual Services Section */}
          <div className="mb-16">
            <div className="card-enhanced rounded-2xl p-8 text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Just One Service?</h2>
                <p className="text-gray-600">
                  Get individual development services without packages. Perfect for specific projects and budgets.
                </p>
              </div>
              
              {!showIndividualServices ? (
                <button
                  onClick={() => setShowIndividualServices(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  View Individual Services
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {INDIVIDUAL_SERVICES.map((service) => (
                      <div key={service.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-400 hover:shadow-lg transition-all duration-300">
                        <h3 className="font-bold text-gray-900 mb-2">{service.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                        
                        <div className="mb-4">
                          <StartingAtPriceDisplay 
                            price={service.price} 
                            size="md" 
                            showDiscount={true}
                          />
                          <p className="text-sm text-gray-500 mt-1">Delivery: {service.deliveryTime}</p>
                        </div>

                        <ul className="space-y-1 mb-6">
                          {service.features.slice(0, 4).map((feature, index) => (
                            <li key={index} className="flex items-center text-xs text-gray-600">
                              <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <button 
                          onClick={() => setSelectedService({
                            ...modalServiceCategory,
                            packages: [{
                              _key: service.id,
                              name: service.name,
                              tier: 'basic' as const,
                              price: service.price,
                              currency: 'USD',
                              billing: 'one_time' as const,
                              deliveryTime: service.deliveryTime,
                              features: service.features,
                              popular: false
                            }]
                          })}
                          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                        >
                          Select This Service
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setShowIndividualServices(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Hide Individual Services
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Service Packages */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Development Packages</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Professional websites and applications built with modern technology, responsive design, and optimized for performance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {webPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`card-enhanced rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer ${
                    pkg.popular ? 'ring-2 ring-green-500 ring-opacity-50' : ''
                  }`}
                  onClick={() => setSelectedService({
                    ...modalServiceCategory,
                    // Show only the tiers for the selected package
                    packages: getTiersForPackage(pkg)
                  })}
                >
                  {pkg.popular && (
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold text-center mb-6">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    {pkg.description && (
                      <p className="text-gray-600 mb-4">{pkg.description}</p>
                    )}
                    <StartingAtPriceDisplay 
                      price={pkg.basePrice} 
                      size="lg" 
                      showDiscount={true}
                    />
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.slice(0, 8).map((feature, featureIndex) => {
                      const featureObj = typeof feature === 'object' && feature !== null ? feature as { title?: string; description?: string } : null
                      const featureText = typeof feature === 'string' 
                        ? feature 
                        : featureObj?.title || featureObj?.description || ''
                      return (
                        <li key={featureIndex} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">{featureText}</span>
                        </li>
                      )
                    })}
                  </ul>

                  <button 
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedService({
                        ...modalServiceCategory,
                        packages: getTiersForPackage(pkg)
                      })
                    }}
                  >
                    Choose Your Scope
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Build CTA */}
            <div className="mt-10">
              <div className="card-enhanced rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Want a Custom Build?</h3>
                  <p className="text-gray-600 max-w-2xl">
                    Combine website + mobile app, add or remove features, and tailor everything to your exact needs. Get a transparent quote instantly.
                  </p>
                </div>
                <Link
                  href="/services/custom-build"
                  className="inline-flex items-center px-6 py-3 bg-white border-2 border-green-500 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition-colors"
                >
                  Build a Custom Solution
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Our Development Services?</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">42% Higher Conversions</h4>
                <p className="text-gray-600 text-sm">Our optimized websites convert visitors to customers better than average</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">&lt;2s Load Time</h4>
                <p className="text-gray-600 text-sm">Lightning-fast websites that keep users engaged and improve SEO</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">95+ PageSpeed Score</h4>
                <p className="text-gray-600 text-sm">Google-optimized for top search rankings and superior performance</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">100% Mobile Ready</h4>
                <p className="text-gray-600 text-sm">Perfect display and functionality across all devices and screen sizes</p>
              </div>
            </div>
          </div>
          {/* Dynamic features */}
          <div className="container mx-auto px-6">
            <ServiceStatistics statistics={sanityCategory?.statistics} />
            <ServiceTestimonials testimonials={sanityCategory?.testimonials} />
            <ServiceCaseStudies caseStudies={sanityCategory?.caseStudies} />
          </div>
        </div>
      </div>

      {/* Service Request Modal */}
      {selectedService && (
        <ServiceRequestFlow
          serviceCategory={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  )
}
