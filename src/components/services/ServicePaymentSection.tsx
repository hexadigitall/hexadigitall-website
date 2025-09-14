'use client'

import { useState } from 'react'
import Link from 'next/link'
import ServicePaymentModal from './ServicePaymentModal'
import { useCurrency } from '@/contexts/CurrencyContext'

interface ServicePaymentSectionProps {
  serviceTitle: string
  serviceSlug: string
  serviceDescription: string
}

export default function ServicePaymentSection({
  serviceTitle,
  serviceSlug
}: ServicePaymentSectionProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const { formatPrice, getLocalDiscountMessage } = useCurrency()

  const discountMessage = getLocalDiscountMessage()

  // Get starting price based on service type
  const getStartingPrice = () => {
    if (serviceSlug.includes('mobile') || serviceSlug.includes('app')) {
      return 499
    } else if (serviceSlug.includes('web') || serviceSlug.includes('website')) {
      return 199
    } else {
      return 199
    }
  }

  const startingPrice = getStartingPrice()

  const handlePurchaseClick = () => {
    setShowPaymentModal(true)
  }

  return (
    <>
      {/* Call to Action with Payment Options */}
      <div className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-8">
        
        {/* Nigerian Launch Special Banner */}
        {discountMessage && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-4 animate-pulse shadow-lg">
              <span>🇳🇬</span>
              <span>NIGERIAN LAUNCH SPECIAL: 50% OFF!</span>
              <span>🔥</span>
            </div>
            <p className="text-green-800 font-medium">
              Limited time offer for Nigerian clients - ends January 31, 2026
            </p>
          </div>
        )}

        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-lg">
            Choose your package and get started with {serviceTitle} today. 
            Professional service with transparent pricing and guaranteed delivery.
          </p>
          
          {/* Pricing Preview */}
          <div className="bg-white rounded-2xl p-6 max-w-md mx-auto mb-8 shadow-sm border">
            <div className="text-center">
              <p className="text-gray-600 mb-2">Starting from</p>
              <div className="text-4xl font-bold text-primary mb-2">
                {formatPrice(startingPrice, { applyNigerianDiscount: true })}
              </div>
              {discountMessage && (
                <div className="text-sm text-gray-500 line-through mb-2">
                  Regular: {formatPrice(startingPrice)}
                </div>
              )}
              <div className="text-sm text-gray-600">
                Multiple packages available
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
          <button
            onClick={handlePurchaseClick}
            className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h15M17 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            Purchase Service
          </button>
          
          <Link 
            href="/contact" 
            className="flex-1 inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Free Consultation
          </Link>
        </div>

        {/* Features List */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="flex items-center space-x-3 bg-white/50 rounded-lg p-4">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Money-back guarantee</span>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/50 rounded-lg p-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">Fast delivery</span>
          </div>
          
          <div className="flex items-center space-x-3 bg-white/50 rounded-lg p-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-gray-700 font-medium">24/7 support</span>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
            <Link 
              href="/services" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              ← View All Services
            </Link>
            <span className="hidden sm:inline text-gray-400">•</span>
            <Link 
              href="/portfolio" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View Our Work
            </Link>
            <span className="hidden sm:inline text-gray-400">•</span>
            <Link 
              href="/about" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              About Our Team
            </Link>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <ServicePaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        serviceTitle={serviceTitle}
        serviceSlug={serviceSlug}
        packages={[]} // Will use default packages from the modal
      />
    </>
  )
}