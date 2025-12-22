'use client'

import React, { useState } from 'react'
import { ServiceCategory, IndividualService, ServiceStats } from '@/types/service'
import { useCurrency } from '@/contexts/CurrencyContext'
import { StartingAtPriceDisplay } from '@/components/ui/PriceDisplay'
import { ServiceRequestFlow, ServiceCategory as LegacyServiceCategory, AddOn, Package } from '@/components/services/ServiceRequestFlow'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { getWhatsAppLink } from '@/lib/whatsapp' // 👈 Import WhatsApp helper

interface DynamicServicePageProps {
  serviceCategory: ServiceCategory
  individualServices: IndividualService[]
  serviceStats: ServiceStats
}

export default function DynamicServicePage({ 
  serviceCategory, 
  individualServices,
  serviceStats 
}: DynamicServicePageProps) {
  const [selectedService, setSelectedService] = useState<LegacyServiceCategory | null>(null)
  const [showIndividualServices, setShowIndividualServices] = useState(false)
  const { currentCurrency, getLocalDiscountMessage, convertPrice } = useCurrency()
  const discountMessage = getLocalDiscountMessage()

  // Helper function to convert new ServiceCategory to legacy format
  const convertToLegacyServiceCategory = (service: ServiceCategory): LegacyServiceCategory => ({
    _id: service._id,
    title: service.title,
    slug: service.slug,
    description: service.description,
    icon: service.icon,
    featured: service.featured,
    serviceType: service.serviceType,
    packages: (service.packages ?? []).map(pkg => {
      const mapped: Package = {
        _key: pkg._key,
        name: pkg.name,
        tier: pkg.tier,
        price: pkg.price,
        currency: pkg.currency,
        billing: pkg.billing,
        deliveryTime: pkg.deliveryTime,
        features: pkg.features?.map(f => (typeof f === 'string' ? f : (f.title || f.description || JSON.stringify(f)))) || [],
        addOns: (pkg.addOns ?? []) as AddOn[],
        popular: pkg.popular ?? false
      }
      return mapped
    })
  })

  // ⚡ WhatsApp Click Handler
  const handleWhatsAppClick = (message: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    window.open(getWhatsAppLink(message), '_blank');
  };

  // Helper to format price for WhatsApp message
  const getFormattedPrice = (price: number) => {
    const val = convertPrice(price, currentCurrency.code);
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currentCurrency.code, 
      maximumFractionDigits: 0 
    }).format(val);
  }

  // Get service type specific styling and copy
  const getServiceTypeConfig = (serviceType: string) => {
    const configs = {
      'business': {
        badge: 'Business Foundation Services',
        gradientFrom: 'from-blue-600/10',
        gradientVia: 'via-indigo-600/10', 
        gradientTo: 'to-purple-600/10',
        accentColor: 'blue',
        individualTitle: 'Need Just One Service?',
        individualDescription: 'Get individual business services without packages. Perfect for specific needs and tight budgets.',
        packageTitle: 'Complete Business Packages',
        packageDescription: 'Comprehensive packages that combine business planning with brand identity for a complete business foundation.',
        statsTitle: 'Why Choose Our Business Services?'
      },
      'marketing': {
        badge: 'Digital Marketing Services',
        gradientFrom: 'from-green-600/10',
        gradientVia: 'via-blue-600/10',
        gradientTo: 'to-purple-600/10',
        accentColor: 'green',
        individualTitle: 'Individual Marketing Services',
        individualDescription: 'Target specific marketing needs with our individual service offerings.',
        packageTitle: 'Complete Marketing Packages',
        packageDescription: 'Comprehensive marketing solutions to grow your brand and engage your audience.',
        statsTitle: 'Why Choose Our Marketing Services?'
      },
      'consulting': {
        badge: 'Professional Consulting Services',
        gradientFrom: 'from-purple-600/10',
        gradientVia: 'via-indigo-600/10',
        gradientTo: 'to-blue-600/10',
        accentColor: 'purple',
        individualTitle: 'Individual Consulting Sessions',
        individualDescription: 'Get focused consulting for specific business challenges and opportunities.',
        packageTitle: 'Complete Consulting Packages',
        packageDescription: 'Comprehensive consulting solutions to accelerate your business growth and success.',
        statsTitle: 'Why Choose Our Consulting Services?'
      },
      'web': {
        badge: 'Web & Mobile Development Services',
        gradientFrom: 'from-indigo-600/10',
        gradientVia: 'via-blue-600/10',
        gradientTo: 'to-cyan-600/10',
        accentColor: 'indigo',
        individualTitle: 'Individual Development Services',
        individualDescription: 'Get specific web or mobile development services tailored to your needs.',
        packageTitle: 'Complete Development Packages',
        packageDescription: 'Comprehensive web and mobile development solutions to bring your digital ideas to life.',
        statsTitle: 'Why Choose Our Development Services?'
      },
      'profile': {
        badge: 'Portfolio & Profile Services',
        gradientFrom: 'from-orange-600/10',
        gradientVia: 'via-red-600/10',
        gradientTo: 'to-pink-600/10',
        accentColor: 'orange',
        individualTitle: 'Individual Profile Services',
        individualDescription: 'Build specific aspects of your professional presence with targeted services.',
        packageTitle: 'Complete Profile Packages',
        packageDescription: 'Comprehensive portfolio and personal branding services to showcase your work.',
        statsTitle: 'Why Choose Our Profile Services?'
      }
    }
    // ensure the serviceType is a valid key of configs, fallback to 'business'
    type ConfigKey = keyof typeof configs
    const key = (serviceType as ConfigKey)
    return configs[key] ?? configs['business']
  }

  const config = getServiceTypeConfig(serviceCategory.serviceType)

  // Get stats display data
  const getStatsData = () => [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      title: `${serviceStats.fundingSuccessRate}% Success Rate`,
      description: serviceCategory.serviceType === 'business' 
        ? 'Our business plans help secure funding 3x more than industry average'
        : 'Exceptional success rate across all our professional services',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: `${serviceStats.totalFundingRaised} Value`,
      description: `Total value generated for our clients across all ${serviceCategory.serviceType} services`,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: `${serviceStats.averageRevenueGrowth}% Growth`,
      description: 'Average improvement in performance within 12 months of service delivery',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: `${serviceStats.averageDeliveryTime} Delivery`,
      description: 'Fast, professional service delivery that exceeds industry standards',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb items={[
            { label: 'Services', href: '/services' },
            { label: serviceCategory.title }
          ]} />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${config.gradientFrom} ${config.gradientVia} ${config.gradientTo}`}></div>
          <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-${config.accentColor}-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse`} style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            {/* Special Offer Banner */}
            {discountMessage && (
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg animate-bounce">
                  <span>🎉</span>
                  <span>NIGERIAN LAUNCH SPECIAL - 50% OFF ALL PACKAGES!</span>
                  <span>🚀</span>
                </div>
              </div>
            )}
            
            <div className={`inline-flex items-center space-x-2 bg-gradient-to-r from-${config.accentColor}-100 to-indigo-100 px-4 py-2 rounded-full text-sm font-medium text-${config.accentColor}-800 mb-6`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>{config.badge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
              {serviceCategory.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {serviceCategory.description}
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
          {individualServices.length > 0 && (
            <div className="mb-16">
              <div className="card-enhanced rounded-2xl p-8 text-center">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">{config.individualTitle}</h2>
                  <p className="text-gray-600">
                    {config.individualDescription}
                  </p>
                </div>
                
                {!showIndividualServices ? (
                  <button
                    onClick={() => setShowIndividualServices(true)}
                    className={`inline-flex items-center px-8 py-4 bg-gradient-to-r from-${config.accentColor}-500 to-indigo-500 text-white font-semibold rounded-xl hover:from-${config.accentColor}-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    View Individual Services
                  </button>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {individualServices.map((service) => (
                        <div key={service.id} className={`bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-${config.accentColor}-400 hover:shadow-lg transition-all duration-300 flex flex-col h-full`}>
                          <h3 className="font-bold text-gray-900 mb-2">{service.name}</h3>
                          <p className="text-sm text-gray-600 mb-4 flex-grow">{service.description}</p>
                          
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
                                <svg className={`w-3 h-3 text-${config.accentColor}-500 mr-2 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>

                          {/* ⚡ TWO BUTTONS for Individual Services */}
                          <div className="grid grid-cols-2 gap-2 mt-auto">
                            <button
                              onClick={(e) => handleWhatsAppClick(`Hello, I'm interested in the individual service: *${service.name}* (${getFormattedPrice(service.price)}).`, e)}
                              className="flex items-center justify-center px-2 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium text-xs"
                            >
                              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                              Chat
                            </button>
                            <button 
                              onClick={() => setSelectedService(convertToLegacyServiceCategory({
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
                              }))}
                              className={`bg-${config.accentColor}-500 text-white py-2 px-4 rounded-lg hover:bg-${config.accentColor}-600 transition-colors font-medium text-xs`}
                            >
                              Select
                            </button>
                          </div>
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
          )}

          {/* Service Packages */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{config.packageTitle}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {config.packageDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(serviceCategory.packages ?? []).map((pkg) => (
                <div 
                  key={pkg._key}
                  className={`card-enhanced rounded-2xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col h-full ${
                    pkg.popular ? `ring-2 ring-${config.accentColor}-500 ring-opacity-50` : ''
                  }`}
                  onClick={() => setSelectedService(convertToLegacyServiceCategory(serviceCategory))}
                >
                  {pkg.popular && (
                    <div className={`bg-gradient-to-r from-${config.accentColor}-500 to-indigo-500 text-white px-4 py-2 rounded-full text-sm font-bold text-center mb-6`}>
                      Most Popular
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <StartingAtPriceDisplay 
                      price={pkg.price} 
                      size="lg" 
                      showDiscount={true}
                    />
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {(pkg.features || []).slice(0, 8).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <svg className={`w-5 h-5 text-${config.accentColor}-500 mt-0.5 mr-3 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">{typeof feature === 'string' ? feature : (feature.title ?? feature.description ?? JSON.stringify(feature))}</span>
                      </li>
                    ))}
                    {(pkg.features?.length ?? 0) > 8 && (
                      <li className="text-sm text-gray-500 italic pl-8">
                        +{(pkg.features?.length ?? 0) - 8} more features...
                      </li>
                    )}
                  </ul>

                  {/* ⚡ TWO BUTTONS: WhatsApp + Get Started */}
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                      onClick={(e) => handleWhatsAppClick(`Hello Hexadigitall, I am interested in the *${pkg.name}* package for ${serviceCategory.title} (${getFormattedPrice(pkg.price)}).`, e)}
                      className="flex items-center justify-center px-3 py-3 border-2 border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-bold text-sm"
                    >
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Chat
                    </button>
                    <button className={`w-full bg-gradient-to-r from-${config.accentColor}-500 to-indigo-500 text-white py-3 px-2 rounded-xl font-semibold hover:from-${config.accentColor}-600 hover:to-indigo-600 transition-colors text-sm`}>
                      Get Started
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">{config.statsTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {getStatsData().map((stat) => (
                <div key={stat.title} className="card-enhanced rounded-xl p-6 text-center">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center ${stat.textColor} mx-auto mb-4`}>
                    {stat.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{stat.title}</h4>
                  <p className="text-gray-600 text-sm">{stat.description}</p>
                </div>
              ))}
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