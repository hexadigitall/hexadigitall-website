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
import { getWhatsAppLink } from '@/lib/whatsapp' 

export default function ServicesPageClient() {
  const { getLocalDiscountMessage, currentCurrency, convertPrice } = useCurrency()
  const discountMessage = getLocalDiscountMessage()
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const router = useRouter()
  
  // Featured packages from different categories
  const featuredPackages = [
    {
      ...SERVICE_PRICING['business-plan'][1], // Growth Plan
      category: 'Business Plan & Logo Design',
      categorySlug: 'business-plan-and-logo-design',
      serviceType: 'business' as const,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      ...SERVICE_PRICING['web-development'][1], // Business Website
      category: 'Web & Mobile Development', 
      categorySlug: 'web-and-mobile-software-development',
      serviceType: 'web' as const,
      color: 'from-green-500 to-teal-500'
    },
    {
      ...SERVICE_PRICING['digital-marketing'][1], // Marketing Pro
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

  // ⚡ WhatsApp Helper
  const handleWhatsAppClick = (message: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(getWhatsAppLink(message), '_blank');
  };

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const f = params.get('funnel')
    if (!f) return

    if (f === 'want-to-learn') {
      router.replace('/courses')
      return
    }

    if (f === 'have-an-idea') openPackageModal(featuredPackages[0])
    else if (f === 'ready-to-build') openPackageModal(featuredPackages[1])
    else if (f === 'need-customers') openPackageModal(featuredPackages[2])

    const url = new URL(window.location.href)
    url.searchParams.delete('funnel')
    router.replace(url.pathname + url.search, { scroll: false })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <Breadcrumb items={[{ label: 'Services' }]} />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900">Our Services</h1>
            <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto">
              Choose your path: Complete project packages, custom builds, or individual tasks.
            </p>

            <DiscountBanner size="md" showCountdown={true} showSpots={true} className="mt-6 mb-8" />

            {/* Service Path Selector */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              <Link 
                href="#packages" 
                className="group p-6 bg-white rounded-xl border-2 border-blue-200 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-2">📦</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600">
                  Tiered Packages
                </h3>
                <p className="text-sm text-gray-600">
                  Complete solutions (Basic/Standard/Premium) for full projects like websites, business plans, or marketing campaigns.
                </p>
                <div className="mt-3 text-blue-600 font-semibold text-sm">
                  Browse Packages →
                </div>
              </Link>

              <Link 
                href="/services/custom-build" 
                className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-indigo-300 hover:border-indigo-500 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-2">🧭</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600">
                  Custom Build Wizard
                </h3>
                <p className="text-sm text-gray-600">
                  Configure your platform, features, and services with live pricing. Perfect for unique software needs.
                </p>
                <div className="mt-3 text-indigo-600 font-semibold text-sm">
                  Start Building →
                </div>
              </Link>

              <Link 
                href="/services/build-bundle" 
                className="group p-6 bg-white rounded-xl border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-2">🛒</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600">
                  À La Carte Builder
                </h3>
                <p className="text-sm text-gray-600">
                  Pick individual services (logo, audit, SEO, support) from any category and bundle them your way.
                </p>
                <div className="mt-3 text-green-600 font-semibold text-sm">
                  Build Your Bundle →
                </div>
              </Link>
            </div>

            {/* Currency Info */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Prices shown in:</span>
                <span className="font-semibold text-primary">{currentCurrency.flag} {currentCurrency.code}</span>
              </div>
              {discountMessage && (
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                  <SparklesIcon className="h-4 w-4" aria-hidden="true" />
                  <span>{discountMessage}</span>
                </div>
              )}
            </div>
          </div>

          <StartupFunnel className="mb-16" />

          {/* Category Cards */}
          <div className="mb-16" id="packages">
            <h2 className="text-3xl font-bold text-center mb-4">📦 Tiered Package Categories</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Browse complete project packages organized by category. Each offers Basic, Standard, and Premium tiers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Business Plan & Logo Design', desc: 'Complete business planning, branding, and strategic consulting services', href: '/services/business-plan-and-logo-design', icon: '📋', color: 'from-blue-500 to-indigo-500' },
                { title: 'Web & Mobile Development', desc: 'Professional websites, mobile apps, and digital solutions', href: '/services/web-and-mobile-software-development', icon: '🌐', color: 'from-green-500 to-teal-500' },
                { title: 'Social Media Marketing', desc: 'Digital marketing, SEO, and social media management', href: '/services/social-media-advertising-and-marketing', icon: '📈', color: 'from-pink-500 to-red-500' },
                { title: 'Profile & Portfolio Building', desc: 'Professional portfolios, CV design, and personal branding', href: '/services/profile-and-portfolio-building', icon: '👤', color: 'from-purple-500 to-violet-500' },
                { title: 'Mentoring & Consulting', desc: 'Strategic consulting, mentorship, and business guidance', href: '/services/mentoring-and-consulting', icon: '🎯', color: 'from-orange-500 to-amber-500' }
              ].map((category) => (
                <article key={category.href} className="group relative card-enhanced rounded-2xl p-8 hover:scale-105 transition-all duration-300 text-center h-full flex flex-col">
                   <Link href={category.href} className="absolute inset-0 z-0" aria-label={`Explore ${category.title}`} />
                   <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl group-hover:scale-110 transition-transform`}>
                      {category.icon}
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{category.title}</h3>
                   <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">{category.desc}</p>
                   <div className="flex items-center justify-between mt-auto relative z-10">
                     <span className="text-primary font-semibold group-hover:text-secondary transition-colors inline-flex items-center">
                       Browse Services
                       <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                     </span>
                     <button 
                       onClick={(e) => handleWhatsAppClick(
                         `Hello Hexadigitall team,\n\nI am interested in learning more about your ${category.title} services. Could you please provide details on how your team can help me achieve my goals in this area, and what the next steps would be to get started?\n\nThank you.`, e)}
                       className="text-gray-400 hover:text-green-600 p-2 rounded-full hover:bg-green-50 transition-all"
                       title="Chat on WhatsApp"
                     >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                     </button>
                   </div>
                </article>
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
                  className="card-enhanced rounded-2xl p-8 hover:scale-105 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                >
                  {/* Popular Badge */}
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                      POPULAR
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${pkg.color} bg-opacity-10 px-3 py-1 rounded-full text-xs font-medium mb-4 w-fit`}>
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

                  <ul className="space-y-2 mb-6 flex-grow" role="list">
                    {pkg.features.slice(0, 4).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 4 && (
                      <li className="text-sm text-gray-500 pl-6">+{pkg.features.length - 4} more features...</li>
                    )}
                  </ul>

                  {/* ⚡ TWO BUTTONS: WhatsApp + CTA ⚡ */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={(e) => {
                         const priceVal = convertPrice(pkg.basePrice, currentCurrency.code);
                         const priceStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: currentCurrency.code, maximumFractionDigits: 0 }).format(priceVal);
                         handleWhatsAppClick(`Hello Hexadigitall, I'm interested in the *${pkg.name}* package (${pkg.category}) starting at ${priceStr}. Could you provide more details?`, e)
                      }}
                      className="flex items-center justify-center px-2 py-3 border-2 border-green-500 text-green-600 rounded-xl hover:bg-green-50 transition-colors font-bold text-sm"
                    >
                       <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                       Chat
                    </button>
                    <button 
                      className={`flex items-center justify-center bg-gradient-to-r ${pkg.color} text-white py-3 px-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity`}
                      onClick={() => openPackageModal(pkg)}
                    >
                      {pkg.cta}
                    </button>
                  </div>
                  
                  <Link 
                    href={`/services/${pkg.categorySlug}`}
                    className="text-center text-sm text-gray-600 hover:text-primary transition-colors mt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View details →
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <section className="mt-20 card-enhanced rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose from our specialized service categories or contact us for a custom solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactCTA href="/contact" size="lg">Get Free Consultation</ContactCTA>
              <Link
                href="/portfolio"
                className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all duration-300"
              >
                View Our Work
              </Link>
            </div>
          </section>
        </div>

        {selectedService && (
          <ServiceRequestFlow
            serviceCategory={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
    </div>
  )
}