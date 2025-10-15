// src/app/services/page.tsx
"use client"

import React from 'react'
import Link from 'next/link'
import { useCurrency } from '@/contexts/CurrencyContext'
import { DiscountBanner } from '@/components/ui/DiscountBanner'
import { ContactCTA } from '@/components/ui/CTAButton'
import { SparklesIcon } from '@heroicons/react/24/outline'
import Breadcrumb from '@/components/ui/Breadcrumb'


export default function ServicesPage() {
  const { getLocalDiscountMessage, currentCurrency } = useCurrency()
  const discountMessage = getLocalDiscountMessage()

  return (
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

          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumb items={[{ label: 'Services' }]} />
          </div>


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
                  href: '/services/social-media-marketing',
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
              ].map((category, index) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="group block"
                >
                  <div className="card-enhanced rounded-2xl p-8 hover:scale-105 transition-all duration-300 text-center h-full">
                    <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-white text-2xl group-hover:scale-110 transition-transform`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {category.description}
                    </p>
                    <div className="inline-flex items-center text-primary font-semibold group-hover:text-secondary transition-colors">
                      <span>Browse Services</span>
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="mt-20 card-enhanced rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Choose from our specialized service categories or contact us for a custom solution tailored to your unique business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ContactCTA href="/contact" size="lg">
                Get Free Consultation
              </ContactCTA>
              <Link
                href="/portfolio"
                className="px-8 py-4 border-2 border-primary text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all duration-300"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
    </section>
  )
}