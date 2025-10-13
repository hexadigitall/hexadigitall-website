"use client"

import { useState, useRef } from 'react'
import { ServiceRequestFlow, ServiceCategory, Package } from '@/components/services/ServiceRequestFlow'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CompactPriceDisplay } from '@/components/ui/PriceDisplay'
import { RequestServiceCTA, ContactCTA } from '@/components/ui/CTAButton'
import { SparklesIcon, CheckIcon } from '@heroicons/react/24/outline'
import Breadcrumb from '@/components/ui/Breadcrumb'

// Package group types
interface PackageGroup {
  id: string
  title: string
  description: string
  icon: string
  color: string
  packages: Package[]
}

export default function WebAndMobileSoftwareDevelopmentPage() {
  const [selectedPackageGroup, setSelectedPackageGroup] = useState<ServiceCategory | null>(null)
  const { getLocalDiscountMessage, currentCurrency } = useCurrency()
  const heroRef = useRef<HTMLDivElement>(null)
  const packagesRef = useRef<HTMLDivElement>(null)

  const discountMessage = getLocalDiscountMessage()

  // Define package groups with proper pricing alignment
  const packageGroups: PackageGroup[] = [
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Modern, responsive websites and web applications',
      icon: '🌐',
      color: 'from-blue-500 to-cyan-500',
      packages: [
        {
          _key: 'landing-page',
          name: 'Landing Page',
          tier: 'basic' as const,
          price: 299,
          currency: 'USD',
          billing: 'one_time' as const,
          deliveryTime: '3-5 business days',
          features: [
            'Single responsive page design',
            'Mobile-optimized layout',
            'Contact form integration',
            'Basic SEO optimization',
            'Social media links',
            '2 rounds of revisions',
            '30-day support included'
          ]
        },
        {
          _key: 'business-website',
          name: 'Business Website',
          tier: 'standard' as const,
          price: 799,
          currency: 'USD',
          billing: 'one_time' as const,
          deliveryTime: '7-10 business days',
          popular: true,
          features: [
            'Up to 8 custom pages',
            'Professional responsive design',
            'Content Management System',
            'Advanced SEO optimization',
            'Contact forms & analytics',
            'Social media integration',
            'Blog functionality',
            'SSL certificate setup',
            '90-day support & maintenance'
          ]
        },
        {
          _key: 'ecommerce-website',
          name: 'E-commerce Store',
          tier: 'premium' as const,
          price: 1599,
          currency: 'USD',
          billing: 'one_time' as const,
          deliveryTime: '14-21 business days',
          features: [
            'Full e-commerce functionality',
            'Payment gateway integration',
            'Inventory management system',
            'Customer account portal',
            'Order tracking system',
            'Admin dashboard',
            'Security & SSL certification',
            'SEO & performance optimization',
            'Email marketing integration',
            '6-month support & updates'
          ]
        }
      ]
    },
    {
      id: 'mobile-app-development',
      title: 'Mobile App Development',
      description: 'Native and cross-platform mobile applications',
      icon: '📱',
      color: 'from-purple-500 to-pink-500',
      packages: [
        {
          _key: 'simple-mobile-app',
          name: 'Simple Mobile App',
          tier: 'basic' as const,
          price: 999,
          currency: 'USD',
          billing: 'one_time' as const,
          deliveryTime: '2-3 weeks',
          features: [
            'iOS OR Android platform',
            'Up to 5 core screens',
            'Basic functionality & features',
            'Simple user authentication',
            'App store submission',
            'Basic UI/UX design',
            'Push notifications',
            '60-day support included'
          ]
        },
        {
          _key: 'business-app',
          name: 'Business App',
          tier: 'standard' as const,
          price: 2499,
          currency: 'USD',
          billing: 'one_time' as const,
          deliveryTime: '4-6 weeks',
          popular: true,
          features: [
            'iOS AND Android platforms',
            'Up to 10 feature-rich screens',
            'Advanced functionality',
            'User authentication & profiles',
            'Database integration',
            'Custom UI/UX design',
            'Push notifications & analytics',
            'API integrations',
            'App store optimization',
            '90-day support & updates'
          ]
        },
        {
          _key: 'enterprise-app',
          name: 'Enterprise App',
          tier: 'premium' as const,
          price: 4999,
          currency: 'USD',
          billing: 'one_time' as const,
          deliveryTime: '8-12 weeks',
          features: [
            'Full-featured mobile application',
            'Custom backend API development',
            'Admin dashboard & analytics',
            'Advanced security features',
            'Third-party service integrations',
            'Real-time synchronization',
            'Offline functionality',
            'Multi-language support',
            'Enterprise-grade security',
            '6-month support & maintenance'
          ]
        }
      ]
    },
    {
      id: 'combined-packages',
      title: 'Web & Mobile Combo',
      description: 'Integrated web and mobile solutions',
      icon: '🚀',
      color: 'from-green-500 to-teal-500',
      packages: [
        {
          _key: 'startup-combo',
          name: 'Startup Combo',
          tier: 'standard' as const,
          price: 1799,
          currency: 'USD',
          billing: 'one_time' as const,
          deliveryTime: '6-8 weeks',
          popular: true,
          features: [
            'Landing page website',
            'Simple mobile app (iOS OR Android)',
            'Shared branding & design',
            'Basic admin panel',
            'Contact & analytics integration',
            'App store submission',
            'Social media setup',
            '90-day support included'
          ]
        },
        {
          _key: 'business-combo',
          name: 'Business Combo',
          tier: 'premium' as const,
          price: 2999,
          currency: 'USD',
          billing: 'one_time' as const,
          deliveryTime: '8-12 weeks',
          features: [
            'Full business website',
            'Cross-platform mobile app',
            'Unified user authentication',
            'Shared database & backend',
            'Advanced admin dashboard',
            'E-commerce capabilities',
            'Push notifications & analytics',
            'SEO & app store optimization',
            '6-month support & maintenance'
          ]
        },
        {
          _key: 'enterprise-combo',
          name: 'Enterprise Combo',
          tier: 'premium' as const,
          price: 5999,
          currency: 'USD',
          billing: 'one_time' as const,
          deliveryTime: '12-16 weeks',
          features: [
            'Enterprise website solution',
            'Full-featured mobile app',
            'Custom API & backend system',
            'Advanced admin & analytics',
            'Multi-platform deployment',
            'Third-party integrations',
            'Advanced security features',
            'Performance optimization',
            'Priority support & training',
            '1-year support & updates'
          ]
        }
      ]
    }
  ]

  const openPackageModal = (groupId: string) => {
    const group = packageGroups.find(g => g.id === groupId)
    if (!group) return

    const serviceCategory: ServiceCategory = {
      _id: `web-mobile-${groupId}`,
      title: group.title,
      slug: { current: 'web-and-mobile-software-development' },
      description: group.description,
      icon: 'code',
      featured: false,
      packages: group.packages,
      serviceType: groupId.includes('web') ? 'web' : groupId.includes('mobile') ? 'mobile' : 'software'
    }

    setSelectedPackageGroup(serviceCategory)
  }

  const scrollToPackages = () => {
    packagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-teal-900 text-white py-20 md:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/20 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="relative container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 leading-tight">
              Web & Mobile Software Development
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
              Complete digital solutions that work seamlessly across all platforms
            </p>

            {/* Launch Special Banner */}
            {discountMessage && (
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/80 to-green-600/80 backdrop-blur-sm border border-green-400/50 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg">
                  <span>🇳🇬</span>
                  <span>NIGERIAN LAUNCH SPECIAL - 50% OFF ALL PACKAGES!</span>
                  <span>🔥</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={scrollToPackages}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Explore Our Packages
              </button>
              <ContactCTA href="/contact" size="lg">
                Get Custom Quote
              </ContactCTA>
            </div>

            {/* Key Benefits */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌐</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
                <p className="text-gray-300">Perfect on all devices</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cross-Platform</h3>
                <p className="text-gray-300">iOS & Android compatible</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-300">Quick turnaround times</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Breadcrumb items={[
              { label: 'Services', href: '/services' },
              { label: 'Web & Mobile Development' }
            ]} />
          </div>

          {/* Currency Info */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-600 mb-4">
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

          {/* Package Groups */}
          <div ref={packagesRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {packageGroups.map((group) => {
              const startingPrice = Math.min(...group.packages.map(pkg => pkg.price))
              
              return (
                <div
                  key={group.id}
                  className="bg-white border-2 border-gray-200 hover:border-primary/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                  onClick={() => openPackageModal(group.id)}
                >
                  <div className={`bg-gradient-to-r ${group.color} p-6 text-white text-center`}>
                    <div className="text-4xl mb-3">{group.icon}</div>
                    <h3 className="text-2xl font-bold mb-2">{group.title}</h3>
                    <p className="text-white/90 text-sm">{group.description}</p>
                  </div>

                  <div className="p-6">
                    <div className="text-center mb-6">
                      <p className="text-gray-600 text-sm mb-2">Starting from</p>
                      <CompactPriceDisplay
                        price={startingPrice}
                        showDiscount={true}
                        className="justify-center text-2xl font-bold"
                      />
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="text-sm text-gray-600 text-center">
                        {group.packages.length} package{group.packages.length !== 1 ? 's' : ''} available:
                      </div>
                      {group.packages.map((pkg) => (
                        <div key={pkg._key} className="flex items-center text-sm text-gray-700">
                          <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          <span>{pkg.name}</span>
                          {pkg.popular && (
                            <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">Popular</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <RequestServiceCTA
                      size="md"
                      className="w-full group-hover:bg-primary/90 transition-colors"
                      onClick={() => openPackageModal(group.id)}
                    >
                      View {group.title} Packages
                    </RequestServiceCTA>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 md:p-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Development Services?</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                We deliver cutting-edge solutions that drive business growth and user engagement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: '🎯', title: 'Results-Driven', desc: 'Focused on your business goals' },
                { icon: '⚡', title: 'Fast Delivery', desc: 'Quick turnaround without compromising quality' },
                { icon: '🔒', title: 'Secure & Scalable', desc: 'Built with security and growth in mind' },
                { icon: '🎨', title: 'Modern Design', desc: 'Beautiful, user-friendly interfaces' }
              ].map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary/10 via-white to-primary/10 border border-primary/20 shadow-lg rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Ready to Start Your Project?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss your requirements and create a solution that perfectly fits your needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactCTA href="/contact" size="lg">
                Get Free Consultation
              </ContactCTA>
              <button
                onClick={scrollToPackages}
                className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all duration-300"
              >
                Compare Packages
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Request Modal */}
      {selectedPackageGroup && (
        <ServiceRequestFlow
          serviceCategory={selectedPackageGroup}
          onClose={() => setSelectedPackageGroup(null)}
        />
      )}
    </>
  )
}