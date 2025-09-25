// src/app/services/page.tsx
"use client"

import * as React from 'react'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { ServiceRequestFlow, ServiceCategory, Package } from '@/components/services/ServiceRequestFlow'
import { useCurrency } from '@/contexts/CurrencyContext'
import { DiscountBanner } from '@/components/ui/DiscountBanner'
import { CompactPriceDisplay } from '@/components/ui/PriceDisplay'
import { RequestServiceCTA, ContactCTA } from '@/components/ui/CTAButton'
import { SparklesIcon } from '@heroicons/react/24/outline'
import { SearchParamsHandler } from '@/components/services/SearchParamsHandler'

interface Service {
  _id: string
  title: string
  slug: {
    current: string
  }
  overview: string
}

// Queries moved to API routes for better performance

// Function to convert Service to ServiceCategory for the ServiceRequestFlow modal
const mapServiceToServiceCategory = (service: Service): ServiceCategory => {
  // Generate packages similar to ServicePaymentModal's getDefaultPackages
  const generatePackages = (serviceSlug: string): Package[] => {
    const basePackages = [
      {
        _key: `basic-${service._id}`,
        name: 'Basic Package',
        tier: 'basic' as const,
        price: serviceSlug.includes('mobile') || serviceSlug.includes('app') ? 499 : 199,
        currency: 'USD',
        billing: 'one_time' as const,
        deliveryTime: '5-7 business days',
        features: serviceSlug.includes('web') || serviceSlug.includes('website') ? [
          'Responsive design',
          'Up to 5 pages',
          'Contact form',
          'Basic SEO',
          '30-day support'
        ] : serviceSlug.includes('mobile') || serviceSlug.includes('app') ? [
          'Basic app design',
          'Core functionality',
          'iOS or Android',
          'App store submission',
          '30-day support'
        ] : [
          'Initial consultation',
          'Basic implementation',
          'Email support',
          '30-day warranty'
        ]
      },
      {
        _key: `standard-${service._id}`,
        name: 'Professional Package',
        tier: 'standard' as const,
        price: serviceSlug.includes('mobile') || serviceSlug.includes('app') ? 999 : 399,
        currency: 'USD',
        billing: 'one_time' as const,
        deliveryTime: '7-10 business days',
        popular: true,
        features: serviceSlug.includes('web') || serviceSlug.includes('website') ? [
          'Custom design',
          'Up to 10 pages',
          'Advanced forms',
          'SEO optimization',
          'Analytics setup',
          '90-day support'
        ] : serviceSlug.includes('mobile') || serviceSlug.includes('app') ? [
          'Custom app design',
          'Advanced functionality',
          'iOS and Android',
          'Push notifications',
          'App store optimization',
          '90-day support'
        ] : [
          'Detailed consultation',
          'Professional implementation',
          'Priority support',
          'Custom features',
          '90-day warranty',
          'Training included'
        ]
      },
      {
        _key: `premium-${service._id}`,
        name: 'Premium Package',
        tier: 'premium' as const,
        price: serviceSlug.includes('mobile') || serviceSlug.includes('app') ? 1999 : 699,
        currency: 'USD',
        billing: 'one_time' as const,
        deliveryTime: '10-14 business days',
        features: serviceSlug.includes('web') || serviceSlug.includes('website') ? [
          'Premium custom design',
          'Unlimited pages',
          'E-commerce integration',
          'Advanced SEO',
          'Analytics & tracking',
          'CMS integration',
          '1-year support'
        ] : serviceSlug.includes('mobile') || serviceSlug.includes('app') ? [
          'Premium app design',
          'Full feature set',
          'iOS and Android',
          'Backend integration',
          'Admin dashboard',
          'Analytics integration',
          '1-year support'
        ] : [
          'In-depth consultation',
          'Premium implementation',
          '24/7 priority support',
          'Custom development',
          'Advanced features',
          '1-year warranty',
          'Training & documentation',
          '3 months free maintenance'
        ]
      }
    ]
    
    return basePackages
  }

  return {
    _id: service._id,
    title: service.title,
    slug: service.slug,
    description: service.overview,
    icon: 'default', // Use default icon since Service doesn't have icon field
    featured: false,
    packages: generatePackages(service.slug.current)
  }
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([])
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [focusService, setFocusService] = useState<string | null>(null)
  const { getLocalDiscountMessage, currentCurrency, formatPrice } = useCurrency()
  
  const discountMessage = getLocalDiscountMessage()

  // Handle focus parameter changes from SearchParamsHandler
  const handleFocusChange = (focus: string | null) => {
    setFocusService(focus)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        console.log('🔍 [API] Fetching services and categories via API route...')
        
        const response = await fetch('/api/service-categories')
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }
        
        const apiData = await response.json()
        console.log('🎆 [API] Service data response:', apiData)
        
        if (!apiData.success) {
          throw new Error(apiData.error || 'API returned error status')
        }
        
        console.log('🛠️ [API] Services data:', apiData.services)
        console.log('📊 [API] Categories data:', apiData.serviceCategories)
        
        setServices(apiData.services || [])
        setServiceCategories(apiData.serviceCategories || [])
        
        if (!apiData.services?.length && !apiData.serviceCategories?.length) {
          setError('No services found. Please check API configuration.')
        }
      } catch (error) {
        console.error('💥 Error fetching services data:', error)
        
        let errorMessage = 'Failed to load services. Please try again later.'
        
        if (error instanceof Error) {
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
          })
          
          if (error.message.includes('projectId')) {
            errorMessage = 'Sanity configuration error. Please check environment variables.'
          } else if (error.message.includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.'
          }
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getServiceIcon = (iconName: string): React.ReactElement => {
    const icons: Record<string, React.ReactElement> = {
      'code': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      'server': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
        </svg>
      ),
      'monitor': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      'mobile': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
        </svg>
      ),
      'chart': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      'settings': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      'network': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
        </svg>
      ),
      'default': (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
    
  return icons[iconName] || icons['default']
  }

  const getLowestPrice = (packages: { price?: number }[]) => {
    type Package = { price?: number }
    if (!packages || packages.length === 0) return null
    const prices = (packages as Package[]).map(pkg => pkg.price).filter(price => price != null)
    return prices.length > 0 ? Math.min(...prices as number[]) : null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Services</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Search params handler wrapped in Suspense to prevent SSR issues */}
      <Suspense fallback={null}>
        <SearchParamsHandler onFocusChange={handleFocusChange} />
      </Suspense>
      
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Services</h1>
            <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
              We offer a complete suite of services to transform your ideas into successful digital realities.
            </p>
            
            {/* Launch Special Banner */}
            <DiscountBanner 
              size="md" 
              showCountdown={true} 
              showSpots={true}
              className="mt-6 mb-8"
            />

            {/* Currency and Discount Message */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Prices shown in:</span>
                <span className="font-semibold text-primary">{currentCurrency.flag} {currentCurrency.code}</span>
              </div>
              
              {discountMessage && (
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  <SparklesIcon className="h-4 w-4" />
                  <span>{discountMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Service Request Packages */}
          {serviceCategories.length > 0 && (
            <>
              <div className="mb-16" id="service-packages">
                <h2 className="text-3xl font-bold text-center mb-2">
                  {focusService ? (
                    focusService === 'web-development' ? 'Web Development Services' :
                    focusService === 'mobile-development' ? 'Mobile App Development Services' :
                    'Service Packages'
                  ) : 'Service Packages'}
                </h2>
                <p className="text-center text-gray-600 mb-8">
                  {focusService ? (
                    focusService === 'web-development' ? 'Build modern, responsive websites and web applications' :
                    focusService === 'mobile-development' ? 'Create powerful mobile apps for iOS and Android' :
                    'Professional IT services with transparent pricing and guaranteed delivery'
                  ) : 'Professional IT services with transparent pricing and guaranteed delivery'}
                </p>
                
                {focusService && (
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                      <SparklesIcon className="h-4 w-4" />
                      <span>Specialized {focusService === 'web-development' ? 'Web Development' : 'Mobile App'} packages below</span>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button 
                        onClick={() => setFocusService(null)}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        View all services
                      </button>
                      <span className="hidden sm:inline text-gray-400">•</span>
                      <Link 
                        href="/services/web-and-mobile-software-development"
                        className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Learn about our complete Web & Mobile solutions
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {serviceCategories.map((service) => {
                    const lowestPrice = getLowestPrice(service.packages)
                    
                    return (
                      <div
                        key={service._id}
                        className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border min-h-[400px] flex flex-col ${
                          service.featured ? 'border-primary ring-2 ring-primary ring-opacity-20' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedService(service)}
                      >
                        {service.featured && (
                          <div className="bg-primary text-white text-center py-3 text-sm font-medium">
                            ⭐ Featured Service
                          </div>
                        )}
                        
                        <div className="p-6 sm:p-8 flex flex-col flex-grow">
                          <div className="flex items-start mb-6">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-xl flex items-center justify-center text-primary mr-4 flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                              {getServiceIcon(service.icon)}
                            </div>
                            <div className="flex-grow">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-primary transition-colors leading-tight mb-2">
                                {service.title}
                              </h3>
                              {lowestPrice && (
                                <div className="mt-2">
                                  <CompactPriceDisplay 
                                    price={lowestPrice} 
                                    showDiscount={true} 
                                    className="justify-start"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base flex-grow">
                            {service.description}
                          </p>
                          
                          <div className="space-y-4 mt-auto">
                            <div className="text-xs sm:text-sm text-gray-500 text-center">
                              {service.packages?.length || 0} package{service.packages?.length !== 1 ? 's' : ''} available
                            </div>
                            <div className="flex justify-center">
                              <RequestServiceCTA 
                                size="md" 
                                className="w-full max-w-[200px] text-sm sm:text-base"
                                onClick={() => setSelectedService(service)}
                              >
                                Request Service
                              </RequestServiceCTA>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Simple CTA to Web & Mobile Development */}
              <div className="mt-16 mb-8 text-center">
                <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-primary/20 rounded-2xl p-8">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span>Need Web or Mobile Development?</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Specialized Development Solutions</h3>
                  <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed mb-6">
                    Our Web & Mobile Development service offers comprehensive solutions for both platforms, 
                    with customizable packages and integrated approaches.
                  </p>
                  <Link 
                    href="/services/web-and-mobile-software-development"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Explore Web & Mobile Solutions
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </>
          )}
          
          {/* Traditional Services */}
          {services.length > 0 && (
            <>
              <div className="border-t pt-16">
                <h2 className="text-3xl font-bold text-center mb-2">Additional Services</h2>
                <p className="text-center text-gray-600 mb-8">Explore our comprehensive range of digital transformation services</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {services.map((service) => {
                    const startingPrice = service.slug.current.includes('mobile') || service.slug.current.includes('app') ? 499 : 199
                    return (
                      <div 
                        key={service._id} 
                        className="bg-lightGray p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 min-h-[280px] flex flex-col justify-between"
                      >
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold font-heading mb-3 leading-tight">{service.title}</h2>
                          <p className="text-darkText text-sm sm:text-base leading-relaxed mb-4">{service.overview}</p>
                          
                          {/* Starting price preview */}
                          <div className="mb-4">
                            <p className="text-gray-600 text-sm mb-1">Starting from</p>
                            <div className="text-2xl font-bold text-primary">
                              {formatPrice(startingPrice, { applyNigerianDiscount: true })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <button
                            onClick={() => setSelectedService(mapServiceToServiceCategory(service))}
                            className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                            Purchase Service
                          </button>
                          
                          <Link 
                            href={`/services/${service.slug.current}`}
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary/5 transition-colors text-sm"
                          >
                            Learn More
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* Call to Action - Improved Design */}
          <div className="mt-20 bg-gradient-to-r from-primary/10 via-white to-primary/10 border border-primary/20 shadow-lg rounded-2xl p-8 md:p-12 flex flex-col items-center text-center">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-10 h-10 text-primary mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-0">Need Custom Solutions?</h2>
            </div>
            <p className="text-gray-700 text-lg mb-8 max-w-2xl mx-auto">
              Don&apos;t see exactly what you need? <span className="font-semibold text-primary">We specialize in creating custom IT solutions</span> tailored to your unique business requirements.
            </p>
            <ContactCTA href="/contact" size="lg">
              Contact Us for Custom Quote
            </ContactCTA>
          </div>
        </div>
      </section>

      {/* Service Request Modal */}
      {selectedService && (
        <ServiceRequestFlow
          serviceCategory={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  )
}