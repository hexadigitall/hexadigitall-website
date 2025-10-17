'use client'

import React, { useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { StartingAtPriceDisplay } from '@/components/ui/PriceDisplay'
import { ServiceRequestFlow, ServiceCategory } from '@/components/services/ServiceRequestFlow'
import { SERVICE_PRICING } from '@/lib/currency'
import Breadcrumb from '@/components/ui/Breadcrumb'

// Individual service options for easy access
const INDIVIDUAL_SERVICES = [
  {
    id: 'logo-design-only',
    name: 'Logo Design Only',
    price: 39,
    description: 'Professional logo design with 3 concepts and unlimited revisions',
    deliveryTime: '3-5 days',
    features: [
      '3 unique logo concepts',
      'Unlimited revisions',
      'High-resolution files (PNG, JPG, SVG)',
      'Brand color palette',
      'Commercial usage rights',
      'Source files included'
    ]
  },
  {
    id: 'business-plan-only',
    name: 'Business Plan Only',
    price: 89,
    description: 'Comprehensive business plan for startups and funding applications',
    deliveryTime: '5-7 days',
    features: [
      'Executive summary',
      'Market analysis & research',
      'Financial projections (3 years)',
      'Business model canvas',
      'Competitive analysis',
      'Investor-ready presentation'
    ]
  },
  {
    id: 'pitch-deck-only',
    name: 'Pitch Deck Only',
    price: 149,
    description: 'Compelling pitch deck designed to secure funding from investors',
    deliveryTime: '3-5 days',
    features: [
      '10-12 professional slides',
      'Investor-focused storytelling',
      'Financial highlights',
      'Market opportunity analysis',
      'Team & traction showcase',
      'Editable PowerPoint format'
    ]
  }
]

export default function BusinessPlanLogoPage() {
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const [showIndividualServices, setShowIndividualServices] = useState(false)
  const { currentCurrency, getLocalDiscountMessage } = useCurrency()
  const discountMessage = getLocalDiscountMessage()

  // Get service packages from centralized pricing
  const businessPackages = SERVICE_PRICING['business-plan'] || []

  const serviceCategory = {
    _id: 'business-plan-logo-design',
    title: 'Business Plan & Logo Design',
    slug: { current: 'business-plan-and-logo-design' },
    description: 'Complete business planning and brand identity services to launch your business with confidence.',
    icon: 'chart',
    featured: false,
    packages: businessPackages.map(pkg => ({
      _key: pkg.id,
      name: pkg.name,
      tier: 'standard' as const,
      price: pkg.basePrice,
      currency: 'USD',
      billing: 'one_time' as const,
      deliveryTime: pkg.billing || '5-10 days',
      features: pkg.features,
      popular: pkg.popular || false
    })),
    serviceType: 'business' as const
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb items={[
            { label: 'Services', href: '/services' },
            { label: 'Business Plan & Logo Design' }
          ]} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
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
            
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full text-sm font-medium text-blue-800 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>Business Foundation Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
              Business Plan & Logo Design
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Launch your business with confidence. Professional business plans, stunning logos, and complete 
              brand packages that establish credibility and attract investors.
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
                  Get individual business services without packages. Perfect for specific needs and tight budgets.
                </p>
              </div>
              
              {!showIndividualServices ? (
                <button
                  onClick={() => setShowIndividualServices(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                      <div key={service.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all duration-300">
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
                              <svg className="w-3 h-3 text-blue-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-medium"
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
              {businessPackages.map((pkg, index) => (
                <div 
                  key={pkg.id}
                  className={`card-enhanced rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer ${
                    pkg.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                  onClick={() => setSelectedService(serviceCategory)}
                >
                  {pkg.popular && (
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold text-center mb-6">
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
                        <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-600 transition-colors">
                    {pkg.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Our Business Services?</h3>
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