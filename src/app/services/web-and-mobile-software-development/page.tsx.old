'use client'

import { useState } from 'react'
import { ServiceRequestFlow, ServiceCategory } from '@/components/services/ServiceRequestFlow'
import { useCurrency } from '@/contexts/CurrencyContext'
import { StartingAtPriceDisplay } from '@/components/ui/PriceDisplay'
import { ContactCTA } from '@/components/ui/CTAButton'
import { SERVICE_PRICING } from '@/lib/currency'
import Breadcrumb from '@/components/ui/Breadcrumb'

// Individual services for web development
const INDIVIDUAL_SERVICES = [
  {
    id: 'landing-page-design',
    name: 'Landing Page Design',
    description: 'High-converting single page website',
    price: 79,
    deliveryTime: '3-5 days',
    features: [
      'Single Page Design',
      'Mobile Responsive',
      'Contact Form Integration',
      'Basic SEO Setup',
      '2 Revision Rounds',
      'FREE Stock Images'
    ]
  },
  {
    id: 'website-maintenance',
    name: 'Website Maintenance',
    description: 'Monthly website updates and security',
    price: 99,
    deliveryTime: 'Monthly',
    features: [
      'Monthly Updates',
      'Security Monitoring',
      'Backup Management',
      'Performance Optimization',
      'Content Updates (up to 5 hours)',
      'Technical Support'
    ]
  },
  {
    id: 'mobile-app-design',
    name: 'Mobile App UI/UX',
    description: 'Professional mobile app design',
    price: 199,
    deliveryTime: '7-10 days',
    features: [
      'Complete App Design (5-7 screens)',
      'User Experience Flow',
      'Interactive Prototype',
      'iOS & Android Compatible',
      'Design System Guide',
      '3 Revision Rounds'
    ]
  }
]

export default function WebAndMobileSoftwareDevelopmentPage() {
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const [showIndividualServices, setShowIndividualServices] = useState(false)
  const { getLocalDiscountMessage, currentCurrency } = useCurrency()

  const discountMessage = getLocalDiscountMessage()

  // Get web development packages from SERVICE_PRICING
  const webDevelopmentPackages = SERVICE_PRICING['web-development']
  
  // Create service category from SERVICE_PRICING data
  const serviceCategory: ServiceCategory = {
    _id: 'web-development',
    title: 'Web & Mobile Development',
    slug: { current: 'web-and-mobile-software-development' },
    description: 'Modern websites and mobile applications that drive business growth',
    icon: 'code',
    featured: true,
    packages: webDevelopmentPackages.map(pkg => ({
      _key: pkg.id,
      name: pkg.name,
      tier: pkg.popular ? 'standard' as const : 'basic' as const,
      price: pkg.basePrice,
      currency: 'USD',
      billing: 'one_time' as const,
      deliveryTime: pkg.features.find(f => f.includes('delivery'))?.replace(/^.*?(\d+-?\d*-?day).*$/i, '$1') || '5-7 days',
      features: pkg.features,
      popular: pkg.popular || false
    })),
    serviceType: 'software'
  }


  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-teal-900 text-white py-16 md:py-24 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Special Offer Banner */}
            {discountMessage && (
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 rounded-full text-sm font-bold shadow-lg animate-bounce">
                  <span>🇳🇬</span>
                  <span>NIGERIAN LAUNCH SPECIAL - 50% OFF ALL PACKAGES!</span>
                  <span>🔥</span>
                </div>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Web & Mobile Development
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed max-w-3xl mx-auto">
              Professional websites and mobile applications that drive business growth and user engagement
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <ContactCTA href="/contact" size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Get Custom Quote
              </ContactCTA>
              <button
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                View Packages
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold mb-2">200+</div>
                <div className="text-gray-300">Websites Delivered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold mb-2">50+</div>
                <div className="text-gray-300">Mobile Apps Built</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-2xl font-bold mb-2">98%</div>
                <div className="text-gray-300">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="mb-12" aria-label="Breadcrumb navigation">
            <Breadcrumb items={[
              { label: 'Services', href: '/services' },
              { label: 'Web & Mobile Development' }
            ]} />
          </nav>

          {/* Currency Info */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-600 mb-4">
              <span>Prices shown in:</span>
              <span className="font-semibold text-primary">{currentCurrency.flag} {currentCurrency.code}</span>
            </div>
            {discountMessage && (
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-6 py-3 rounded-full text-sm font-bold shadow-md">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                </svg>
                <span>{discountMessage}</span>
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Fast 5-Day Delivery</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>SSL & Security Included</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>200+ Happy Clients</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Quick Individual Services Section */}
          <div className="mb-16">
            <div className="card-enhanced rounded-2xl p-8 text-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Need Just One Service?</h2>
                <p className="text-gray-600">
                  Get individual development services without packages. Perfect for specific needs and tight budgets.
                </p>
              </div>
              
              {!showIndividualServices ? (
                <button
                  onClick={() => setShowIndividualServices(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
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

          {/* Main Web Development Packages */}
          <div id="packages" className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Complete Web Development Packages</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Professional websites built with modern technology, responsive design, and optimized for business growth.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {webDevelopmentPackages.map((pkg, index) => (
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

          {/* Performance-Driven Development Results */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Proven Web Development Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">42% Higher Conversions</h4>
                <p className="text-gray-600 text-sm">Our optimized websites convert visitors to customers better</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">&lt;2s Load Time</h4>
                <p className="text-gray-600 text-sm">Lightning-fast websites that keep users engaged</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">95+ PageSpeed Score</h4>
                <p className="text-gray-600 text-sm">Google-optimized for top search rankings and performance</p>
              </div>
              
              <div className="card-enhanced rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">100% Mobile Ready</h4>
                <p className="text-gray-600 text-sm">Perfect display across all devices and screen sizes</p>
              </div>
            </div>
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
    </main>
  )
}