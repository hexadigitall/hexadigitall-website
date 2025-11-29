// src/app/services/page.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCurrency } from '@/contexts/CurrencyContext'
import { SERVICE_PRICING } from '@/lib/currency'
import { DiscountBanner } from '@/components/ui/DiscountBanner'
import { ContactCTA } from '@/components/ui/CTAButton'
import { StartingAtPriceDisplay } from '@/components/ui/PriceDisplay'
import { ServiceRequestFlow, ServiceCategory } from '@/components/services/ServiceRequestFlow'
import { SparklesIcon } from '@heroicons/react/24/outline'
import Breadcrumb from '@/components/ui/Breadcrumb'
import StartupFunnel from '@/components/marketing/StartupFunnel'


export default function ServicesPage() {
  const { getLocalDiscountMessage, currentCurrency } = useCurrency()
  const discountMessage = getLocalDiscountMessage()
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const router = useRouter()
  
  // Featured packages from different categories
  const featuredPackages = [
    {
      ...SERVICE_PRICING['business-plan'][1], // Growth Plan - popular
      category: 'Business Plan & Logo Design',
      categorySlug: 'business-plan-and-logo-design',
      serviceType: 'business' as const,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      ...SERVICE_PRICING['web-development'][1], // Business Website - popular
      category: 'Web & Mobile Development', 
      categorySlug: 'web-and-mobile-software-development',
      serviceType: 'web' as const,
      color: 'from-green-500 to-teal-500'
    },
    {
      ...SERVICE_PRICING['digital-marketing'][1], // Marketing Pro - popular
      category: 'Social Media Marketing',
      categorySlug: 'social-media-advertising-and-marketing',
      serviceType: 'marketing' as const,
      color: 'from-pink-500 to-red-500'
    }
  ]

  const openPackageModal = (pkg: typeof featuredPackages[0]) => {
    const serviceCategory: ServiceCategory = {
      _id: pkg.categorySlug,
      title: pkg.category,
      slug: { current: pkg.categorySlug },
      description: pkg.description,
      icon: 'star',
      featured: true,
      packages: [{
        _key: pkg.id,
        name: pkg.name,
        tier: pkg.popular ? 'standard' as const : 'basic' as const,
        price: pkg.basePrice,
        currency: 'USD',
        billing: 'one_time' as const,
        deliveryTime: pkg.features.find(f => f.includes('delivery'))?.replace(/^.*?(\d+-?\d*-?day).*$/i, '$1') || '5-7 days',
        features: pkg.features,
        popular: pkg.popular || false
      }],
      serviceType: pkg.serviceType
    }
    setSelectedService(serviceCategory)
  }

  // If arriving with a funnel query param, open the relevant package modal or redirect
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const f = params.get('funnel')
    if (!f) return

    if (f === 'want-to-learn') {
      // Send user to courses index - early return to prevent double navigation
      router.replace('/courses')
      return
    }

    // Handle modal opens
    if (f === 'have-an-idea') {
      openPackageModal(featuredPackages[0])
    } else if (f === 'ready-to-build') {
      openPackageModal(featuredPackages[1])
    } else if (f === 'need-customers') {
      openPackageModal(featuredPackages[2])
    }

    // Remove funnel param to avoid re-triggering (only for modal cases)
    const url = new URL(window.location.href)
    url.searchParams.delete('funnel')
    router.replace(url.pathname + url.search, { scroll: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumb Navigation - Move to top */}
          <div className="mb-6">
            <Breadcrumb items={[{ label: 'Services' }]} />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900">Our Services</h1>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
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
              <div className="flex items-center space-x-2 text-sm text-gray-600" role="status" aria-live="polite">
                <span>Prices shown in:</span>
                <span className="font-semibold text-primary">{currentCurrency.flag} {currentCurrency.code}</span>
              </div>

              {discountMessage && (
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium" role="status" aria-live="polite">
                  <SparklesIcon className="h-4 w-4" aria-hidden="true" />
                  <span>{discountMessage}</span>
                </div>
              )}
            </div>
          </div>


          {/* Startup Funnel (stage-based entry) */}
          <StartupFunnel className="mb-12" />

          {/* Direct Service Category Links */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-4">Browse Service Categories</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Explore our specialized service categories with detailed packages and pricing.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Business Plan & Logo Design',
                  description: 'Complete business planning, branding, and strategic consulting services',
                  href: '/services/business-plan-and-logo-design',
                  icon: '📋',
                  color: 'from-blue-500 to-indigo-500'
                },
                {
                  title: 'Web & Mobile Development',
                  description: 'Professional websites, mobile apps, and digital solutions',
                  href: '/services/web-and-mobile-software-development', 
                  icon: '🌐',
                  color: 'from-green-500 to-teal-500'
                },
                {
                  title: 'Social Media Marketing',
                  description: 'Digital marketing, SEO, and social media management',
                  href: '/services/social-media-advertising-and-marketing',
                  icon: '📈', 
                  color: 'from-pink-500 to-red-500'
                },
                {
                  title: 'Profile & Portfolio Building',
                  description: 'Professional portfolios, CV design, and personal branding',
                  href: '/services/profile-and-portfolio-building',
                  icon: '👤',
                  color: 'from-purple-500 to-violet-500'
                },
                {
                  title: 'Mentoring & Consulting',
                  description: 'Strategic consulting, mentorship, and business guidance', 
                  href: '/services/mentoring-and-consulting',
                  icon: '🎯',
                  color: 'from-orange-500 to-amber-500'
                }
              ].map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group block"
                  aria-label={`Explore ${category.title} services`}
                >
                  <article className="card-enhanced rounded-2xl p-8 hover:scale-105 transition-all duration-300 text-center h-full focus:ring-2 focus:ring-primary focus:outline-none">
                    <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl group-hover:scale-110 transition-transform`} aria-hidden="true">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>
                    <div className="inline-flex items-center text-primary font-semibold group-hover:text-secondary transition-colors" aria-hidden="true">
                      <span>Browse Services</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Packages Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Packages</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Popular packages from our top service categories. Get started quickly with these proven solutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPackages.map((pkg) => (
                <article 
                  key={pkg.id}
                  className="card-enhanced rounded-2xl p-8 hover:scale-105 transition-all duration-300 relative overflow-hidden focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold" role="status" aria-label="Most popular package">
                      POPULAR
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${pkg.color} bg-opacity-10 px-3 py-1 rounded-full text-xs font-medium mb-4`}>
                    <div className={`w-2 h-2 bg-gradient-to-r ${pkg.color} rounded-full`}></div>
                    <span className="text-gray-700">{pkg.category}</span>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                    <StartingAtPriceDisplay 
                      price={pkg.basePrice} 
                      size="lg" 
                      showDiscount={true}
                    />
                  </div>

                  <ul className="space-y-2 mb-6" role="list" aria-label="Package features">
                    {pkg.features.slice(0, 4).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600" role="listitem">
                        <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 4 && (
                      <li className="text-sm text-gray-500 pl-6">
                        +{pkg.features.length - 4} more features...
                      </li>
                    )}
                  </ul>

                  <div className="flex flex-col space-y-3">
                    <button 
                      className={`w-full bg-gradient-to-r ${pkg.color} text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:outline-none`}
                      aria-label={`${pkg.cta} - ${pkg.name} package`}
                      onClick={() => openPackageModal(pkg)}
                    >
                      {pkg.cta}
                    </button>
                    <Link 
                      href={`/services/${pkg.categorySlug}`}
                      className="text-center text-sm text-gray-600 hover:text-primary transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View all {pkg.category.toLowerCase()} services →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Call to Action Section */}
          <section className="mt-20 card-enhanced rounded-2xl p-8 md:p-12 text-center" aria-labelledby="cta-heading">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose from our specialized service categories or contact us for a custom solution tailored to your unique business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactCTA href="/contact" size="lg" aria-label="Contact us for a free consultation">
                Get Free Consultation
              </ContactCTA>
              <Link
                href="/portfolio"
                className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:outline-none"
                aria-label="View our portfolio of completed work"
              >
                View Our Work
              </Link>
            </div>
          </section>
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