'use client'

import React, { useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { StartingAtPriceDisplay } from '@/components/ui/PriceDisplay'
import { ServiceRequestFlow, ServiceCategory } from '@/components/services/ServiceRequestFlow'
import { SERVICE_PRICING } from '@/lib/currency'
import Breadcrumb from '@/components/ui/Breadcrumb'

const INDIVIDUAL_SERVICES = [
  {
    id: 'logo-design-only',
    name: 'Logo Design Only',
    price: 39,
    description: 'Professional logo design with 3 concepts and 2 revisions',
    deliveryTime: '3-5 days',
    features: [
      '3 Logo concepts',
      '2 Revision rounds',
      'High-resolution files (PNG, JPG, SVG)',
      'Basic brand colors',
      '3-5 day delivery',
      'Commercial usage rights'
    ]
  },
  {
    id: 'business-plan-only',
    name: 'Business Plan Only',
    price: 59,
    description: 'Essential business plan for startups and entrepreneurs',
    deliveryTime: '5-7 days',
    features: [
      'Executive summary (2 pages)',
      'Market analysis',
      'Financial projections (1 year)',
      'Business model canvas',
      'SWOT analysis',
      '1 revision round'
    ]
  },
  {
    id: 'pitch-deck-only',
    name: 'Pitch Deck Only',
    price: 89,
    description: 'Investor-ready pitch deck to secure funding',
    deliveryTime: '3-5 days',
    features: [
      '8-10 professional slides',
      'Compelling story flow',
      'Financial highlights',
      'Market opportunity focus',
      'Team & traction slides',
      '2 revision rounds'
    ]
  }
]

export default function BusinessPlanLogoPage() {
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const [showIndividualServices, setShowIndividualServices] = useState(false)
  const { currentCurrency, getLocalDiscountMessage } = useCurrency()
  const discountMessage = getLocalDiscountMessage()

  const businessPlanPackages = SERVICE_PRICING['business-plan'] || []

  const serviceCategory = {
    _id: 'business-plan-logo-design',
    title: 'Business Plan & Logo Design',
    slug: { current: 'business-plan-and-logo-design' },
    description: 'Complete business planning and brand identity services to launch your business with confidence.',
    icon: 'chart',
    featured: false,
    packages: businessPlanPackages.map(pkg => ({
      _key: pkg.id,
      name: pkg.name,
      tier: pkg.id === 'starter-plan' ? 'basic' as const : pkg.id === 'growth-plan' ? 'standard' as const : 'premium' as const,
      price: pkg.basePrice,
      currency: 'USD',
      billing: 'one_time' as const,
      deliveryTime: pkg.id === 'starter-plan' ? '5-Day Delivery' : pkg.id === 'growth-plan' ? '7-Day Delivery' : '10-Day Delivery',
      features: pkg.features,
      popular: pkg.popular || false
    })),
    serviceType: 'branding' as const
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Breadcrumb */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-40" aria-label="Breadcrumb navigation">
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb items={[
            { label: 'Services', href: '/services' },
            { label: 'Business Plan & Logo Design' }
          ]} />
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative py-16 overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-300/10 to-indigo-300/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            {/* Special Offer Banner */}
            {discountMessage && (
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg animate-bounce" role="status" aria-live="polite">
                  <span>🇳🇬</span>
                  <span>NIGERIAN LAUNCH SPECIAL - 50% OFF ALL PACKAGES!</span>
                  <span>🔥</span>
                </div>
              </div>
            )}
            
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-blue-200 px-4 py-2 rounded-full text-sm font-semibold text-blue-700 mb-6 shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>Business Foundation Services</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Business Plan &<br className="hidden md:block" /> Logo Design
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
              Launch your business with a solid foundation. Professional business plans, stunning logos, 
              and complete brand packages that establish credibility and attract investors.
            </p>
            
            {/* Currency Info */}
            <div className="mt-8">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-600 mb-4" role="status" aria-live="polite">
                <span>Prices shown in:</span>
                <span className="font-semibold text-primary">{currentCurrency.flag} {currentCurrency.code}</span>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                </svg>
                <span>5-10 Day Delivery</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                <span>Investor-Ready</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>500+ Happy Clients</span>
              </div>
            </div>
          </div>

          {/* Quick Individual Services Section - Make it prominent */}
          <div className="mb-16">
            <div className="card-enhanced rounded-2xl p-8 text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Just One Service?</h2>
                <p className="text-gray-600">
                  Get individual services without packages. Perfect for specific needs and tight budgets.
                </p>
              </div>
              
              {!showIndividualServices ? (
                <button
                  onClick={() => setShowIndividualServices(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                            ...serviceCategory,
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Business Packages</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Comprehensive packages that combine business planning with brand identity for a complete business foundation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {businessPlanPackages.map((pkg, index) => (
                <div 
                  key={pkg.id}
                  className={`card-enhanced rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer ${
                    pkg.popular ? 'ring-2 ring-primary ring-opacity-50' : ''
                  }`}
                  onClick={() => setSelectedService(serviceCategory)}
                >
                  {pkg.popular && (
                    <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold text-center mb-6">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <StartingAtPriceDisplay 
                      price={pkg.basePrice} 
                      size="lg" 
                      showDiscount={true}
                    />
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.slice(0, 8).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                    {pkg.features.length > 8 && (
                      <li className="text-sm text-gray-500 italic pl-8">
                        +{pkg.features.length - 8} more features...
                      </li>
                    )}
                  </ul>

                  <button className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                    {pkg.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Our Business Planning Services */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Entrepreneurs Choose Our Business Planning Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">78% Funding Success</h4>
                <p className="text-gray-600 text-sm">Our business plans help secure funding 3x more than industry average</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">₦2.8B+ Raised</h4>
                <p className="text-gray-600 text-sm">Total funding raised by our clients across 150+ startups</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">85% Revenue Growth</h4>
                <p className="text-gray-600 text-sm">Average revenue increase within 12 months of plan implementation</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">5-Day Delivery</h4>
                <p className="text-gray-600 text-sm">Comprehensive business plans delivered faster than traditional consultants</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Service Request Modal */}
      {selectedService && (
        <ServiceRequestFlow
          serviceCategory={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </main>
  )
}
