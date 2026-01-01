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

interface ServicesPageClientProps {
  initialData?: {
    title?: string;
    description?: string;
    bannerImage?: string;
  }
}

export default function ServicesPageClient({ initialData }: ServicesPageClientProps) {
  const { getLocalDiscountMessage, currentCurrency, convertPrice } = useCurrency()
  const discountMessage = getLocalDiscountMessage()
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null)
  const router = useRouter()
  
  // 1. Resolve Banner Data
  const bannerImage = initialData?.bannerImage || '/assets/images/services/service-portfolio-website.jpg';
  const pageTitle = initialData?.title || 'Our Services';
  const pageDescription = initialData?.description || 'Choose your path: Complete project packages, custom builds, or individual tasks.';

  // Featured packages data
  const featuredPackages = [
    {
      ...SERVICE_PRICING['business-plan'][1],
      category: 'Business Plan & Logo Design',
      categorySlug: 'business-plan-and-logo-design',
      serviceType: 'business' as const,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      ...SERVICE_PRICING['web-development'][1],
      category: 'Web & Mobile Development', 
      categorySlug: 'web-and-mobile-software-development',
      serviceType: 'web' as const,
      color: 'from-green-500 to-teal-500'
    },
    {
      ...SERVICE_PRICING['digital-marketing'][1],
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
    <div className="bg-slate-50">
        
        {/* --- 1. BREADCRUMBS (Tightest Gap) --- */}
        {/* pt-24 provides space for fixed header, pb-0 pulls banner closer */}
        <div className="pt-20 pb-2 container mx-auto px-6">
           <Breadcrumb items={[{ label: 'Services' }]} className="text-gray-600" />
        </div>

        {/* --- 2. HERO SECTION (High Transparency Dark Glass) --- */}
        <div className="relative h-[500px] md:h-[400px] w-full overflow-hidden mb-12 flex items-center justify-center mt-2">
          {/* Background Image */}
          <div 
            className="absolute inset-0 w-full h-full z-0"
            style={{
              backgroundImage: `url('${bannerImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          />
          
          {/* Transparent Glass Card */}
          <div className="container mx-auto px-4 relative z-10 flex justify-center">
             <div className="max-w-4xl w-full bg-slate-900/30 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-10 text-center shadow-2xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-white drop-shadow-lg">
                  {pageTitle}
                </h1>
                <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
                  {pageDescription}
                </p>

                {/* Currency Info */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-200 font-medium">
                    <span>Prices shown in:</span>
                    <span className="font-bold text-white">{currentCurrency.flag} {currentCurrency.code}</span>
                  </div>
                  {discountMessage && (
                    <div className="inline-flex items-center space-x-2 bg-green-500/30 border border-green-400/50 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-md">
                      <SparklesIcon className="h-4 w-4" aria-hidden="true" />
                      <span>{discountMessage}</span>
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>

        <div className="container mx-auto px-6 pb-20">
          
          <DiscountBanner size="md" showCountdown={true} showSpots={true} className="mb-12 shadow-lg" />

          {/* --- 3. SERVICE PATH SELECTOR --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            <Link 
              href="#packages" 
              className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📦</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                Tiered Packages
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Complete solutions (Basic/Standard/Premium) for full projects like websites, business plans, or marketing campaigns.
              </p>
              <div className="mt-auto text-blue-600 font-bold text-sm flex items-center justify-center">
                Browse Packages <span className="ml-2">→</span>
              </div>
            </Link>

            <Link 
              href="/services/custom-build" 
              className="group p-8 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border border-indigo-100 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🧭</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                Custom Build Wizard
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Configure your platform, features, and services with live pricing. Perfect for unique software needs.
              </p>
              <div className="mt-auto text-indigo-600 font-bold text-sm flex items-center justify-center">
                Start Building <span className="ml-2">→</span>
              </div>
            </Link>

            <Link 
              href="/services/build-bundle" 
              className="group p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">🛒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                À La Carte Builder
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Pick individual services (logo, audit, SEO, support) from any category and bundle them your way.
              </p>
              <div className="mt-auto text-green-600 font-bold text-sm flex items-center justify-center">
                Build Your Bundle <span className="ml-2">→</span>
              </div>
            </Link>
          </div>

          <StartupFunnel className="mb-20" />

          {/* --- 4. CATEGORY CARDS --- */}
          <div className="mb-20" id="packages">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">📦 Tiered Package Categories</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse complete project packages organized by category. Each offers Basic, Standard, and Premium tiers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Business Plan & Logo Design', desc: 'Complete business planning, branding, and strategic consulting services', href: '/services/business-plan-and-logo-design', icon: '📋', color: 'from-blue-500 to-indigo-500' },
                { title: 'Web & Mobile Development', desc: 'Professional websites, mobile apps, and digital solutions', href: '/services/web-and-mobile-software-development', icon: '🌐', color: 'from-green-500 to-teal-500' },
                { title: 'Social Media Marketing', desc: 'Digital marketing, SEO, and social media management', href: '/services/social-media-advertising-and-marketing', icon: '📈', color: 'from-pink-500 to-red-500' },
                { title: 'Profile & Portfolio Building', desc: 'Professional portfolios, CV design, and personal branding', href: '/services/profile-and-portfolio-building', icon: '👤', color: 'from-purple-500 to-violet-500' },
                { title: 'Mentoring & Consulting', desc: 'Strategic consulting, mentorship, and business guidance', href: '/services/mentoring-and-consulting', icon: '🎯', color: 'from-orange-500 to-amber-500' }
              ].map((category) => (
                <article key={category.href} className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 text-center h-full flex flex-col border border-gray-100 hover:border-gray-200">
                   <Link href={category.href} className="absolute inset-0 z-0" aria-label={`Explore ${category.title}`} />
                   <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white text-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-md`}>
                      {category.icon}
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{category.title}</h3>
                   <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{category.desc}</p>
                   
                   <div className="flex items-center justify-between mt-auto relative z-10 pt-4 border-t border-gray-50">
                     <button 
                       onClick={(e) => handleWhatsAppClick(
                         `Hello Hexadigitall team,\n\nI am interested in learning more about your ${category.title} services. Could you please provide details?`, e)}
                       className="text-gray-400 hover:text-green-600 p-2 rounded-full hover:bg-green-50 transition-all flex items-center gap-1 text-sm font-medium"
                       title="Chat on WhatsApp"
                     >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Chat
                     </button>

                     <Link
                        href={category.href}
                        className="flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-white py-2 px-4 rounded-lg font-bold text-sm hover:from-primary hover:to-secondary transition-all shadow-md"
                        onClick={(e) => e.stopPropagation()}
                     >
                        Browse Options
                     </Link>
                   </div>
                </article>
              ))}
            </div>
          </div>

          {/* --- 5. FEATURED PACKAGES --- */}
          <div className="mb-20">
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
                  className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
                >
                  {pkg.popular && (
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-sm">
                      POPULAR
                    </div>
                  )}

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

                  <ul className="space-y-3 mb-8 flex-grow" role="list">
                    {pkg.features.slice(0, 4).map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                           <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                    {pkg.features.length > 4 && (
                      <li className="text-sm text-gray-500 pl-8 italic">+{pkg.features.length - 4} more features...</li>
                    )}
                  </ul>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <button
                      onClick={(e) => {
                         const priceVal = convertPrice(pkg.basePrice, currentCurrency.code);
                         const priceStr = new Intl.NumberFormat('en-US', { style: 'currency', currency: currentCurrency.code, maximumFractionDigits: 0 }).format(priceVal);
                         handleWhatsAppClick(`Hello Hexadigitall, I'm interested in the *${pkg.name}* package (${pkg.category}) starting at ${priceStr}. Could you provide more details?`, e)
                      }}
                      className="flex items-center justify-center px-4 py-3 border border-green-200 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors font-bold text-sm"
                    >
                       <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                       Chat
                    </button>
                    <button 
                      className={`flex items-center justify-center bg-gradient-to-r ${pkg.color} text-white py-3 px-2 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-md`}
                      onClick={() => openPackageModal(pkg)}
                    >
                      {pkg.cta}
                    </button>
                  </div>
                  
                  <Link 
                    href={`/services/${pkg.categorySlug}`}
                    className="text-center text-sm text-gray-500 hover:text-primary transition-colors mt-6 block"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View details & full comparison →
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <section className="mt-24 bg-white rounded-3xl p-8 md:p-12 text-center shadow-lg border border-gray-100">
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