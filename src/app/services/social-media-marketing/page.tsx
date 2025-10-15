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
    id: 'social-media-audit',
    name: 'Social Media Audit',
    price: 79,
    description: 'Comprehensive analysis of your social media presence with actionable insights',
    deliveryTime: '3-5 days',
    features: [
      'Analysis of all social platforms',
      'Competitor benchmarking',
      'Content performance review',
      'Audience analysis report',
      'Detailed recommendations',
      'Strategy roadmap'
    ]
  },
  {
    id: 'content-package',
    name: 'Content Creation Package',
    price: 149,
    description: '20 professionally designed social media posts with captions',
    deliveryTime: '5-7 days',
    features: [
      '20 custom designed posts',
      'Platform-optimized sizes',
      'Engaging captions included',
      'Hashtag research & recommendations',
      'Brand-consistent design',
      '2 revision rounds'
    ]
  },
  {
    id: 'ad-campaign-setup',
    name: 'Ad Campaign Setup',
    price: 199,
    description: 'Professional setup and optimization of your first ad campaign',
    deliveryTime: '3-5 days',
    features: [
      'Facebook & Instagram ads setup',
      'Target audience research',
      'Ad creative design (3 variants)',
      'Campaign optimization',
      'Performance tracking setup',
      '2-week monitoring included'
    ]
  }
]

export default function SocialMediaMarketingPage() {
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const [showIndividualServices, setShowIndividualServices] = useState(false)
  const { currentCurrency, getLocalDiscountMessage } = useCurrency()
  const discountMessage = getLocalDiscountMessage()

  // Get service packages from centralized pricing
  const marketingPackages = SERVICE_PRICING['digital-marketing'] || []

  const serviceCategory = {
    _id: 'social-media-marketing',
    title: 'Social Media Marketing',
    slug: { current: 'social-media-marketing' },
    description: 'Comprehensive social media marketing services to grow your audience, increase engagement, and drive sales.',
    icon: 'chart',
    featured: false,
    packages: marketingPackages.map(pkg => ({
      _key: pkg.id,
      name: pkg.name,
      tier: 'standard' as const,
      price: pkg.basePrice,
      currency: 'USD',
      billing: pkg.billing?.includes('monthly') ? 'monthly' as const : 'one_time' as const,
      deliveryTime: pkg.billing || '1-2 weeks setup',
      features: pkg.features,
      popular: pkg.popular || false
    })),
    serviceType: 'marketing' as const
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-rose-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb items={[
            { label: 'Services', href: '/services' },
            { label: 'Social Media Marketing' }
          ]} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 via-red-600/10 to-orange-600/10"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
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
            
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-100 to-red-100 px-4 py-2 rounded-full text-sm font-medium text-red-800 mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Growth Marketing Services</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
              Social Media Marketing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Grow your audience, increase engagement, and drive sales with our comprehensive social media 
              marketing services. From content creation to paid advertising, we help you succeed online.
            </p>
            
            {/* Currency Info */}
            <div className="mt-8">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <span>Prices shown in:</span>
                <span className="font-semibold text-primary">{currentCurrency.flag} {currentCurrency.code}</span>
              </div>
            </div>
          </div>

          {/* Quick Individual Services Section - Make it prominent */}
          <div className="mb-16">
            <div className="card-enhanced rounded-2xl p-8 text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Just One Service?</h2>
                <p className="text-gray-600">
                  Get individual marketing services without monthly commitments. Perfect for one-time needs.
                </p>
              </div>
              
              {!showIndividualServices ? (
                <button
                  onClick={() => setShowIndividualServices(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-xl hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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
                      <div key={service.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-pink-400 hover:shadow-lg transition-all duration-300">
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
                              <svg className="w-3 h-3 text-pink-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
                          className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors font-medium"
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Monthly Marketing Packages</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Ongoing social media marketing services to consistently grow your online presence and drive results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {marketingPackages.map((pkg, index) => (
                <div 
                  key={pkg.id}
                  className={`card-enhanced rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer ${
                    pkg.popular ? 'ring-2 ring-red-500 ring-opacity-50' : ''
                  }`}
                  onClick={() => setSelectedService(serviceCategory)}
                >
                  {pkg.popular && (
                    <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold text-center mb-6">
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="flex items-center justify-center">
                      <StartingAtPriceDisplay 
                        price={pkg.basePrice} 
                        size="lg" 
                        showDiscount={true}
                      />
                      <span className="text-gray-500 text-sm ml-2">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {pkg.features.slice(0, 8).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className="w-5 h-5 text-pink-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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

                  <button className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-pink-600 hover:to-red-600 transition-colors">
                    {pkg.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Our Marketing Services?</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Proven Results</h4>
                <p className="text-gray-600 text-sm">Data-driven strategies that deliver measurable growth</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Expert Team</h4>
                <p className="text-gray-600 text-sm">Certified marketing specialists and content creators</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Detailed Reporting</h4>
                <p className="text-gray-600 text-sm">Monthly analytics and performance insights</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">24/7 Support</h4>
                <p className="text-gray-600 text-sm">Always available to help you succeed</p>
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