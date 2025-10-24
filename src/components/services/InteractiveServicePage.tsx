//src/components/services/InteractiveServicePage.tsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import ServicePaymentModal from '@/components/services/ServicePaymentModal'
import { PortableText } from '@portabletext/react'
import { ServiceCategory, ServicePackage } from '@/types/service'

type InteractiveService = ServiceCategory & {
  overview?: string
  mainContent?: unknown
  packages?: ServicePackage[]
}

export default function InteractiveServicePage({ service, relatedServices }: { service: InteractiveService; relatedServices?: ServiceCategory[] }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  if (!service) return null

  const openPaymentModal = () => {
    setShowPaymentModal(true)
  }

  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold font-heading !text-white mb-4">
            {service.title}
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl leading-relaxed">
            {service.overview}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="prose lg:prose-xl max-w-none">
            <PortableText value={service.mainContent as Record<string, unknown>[]} />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-3 mt-12 justify-center">
            <button
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
              onClick={openPaymentModal}
            >
              Purchase Service
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              onClick={openPaymentModal}
            >
              Request Service
            </button>
            <button
              className="px-6 py-3 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800"
              onClick={openPaymentModal}
            >
              Get Quote
            </button>
          </div>

          {/* Payment Modal */}
          <ServicePaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            serviceTitle={service.title}
            serviceSlug={service.slug?.current || ''}
            packages={(service.packages ?? []).map(((p) => {
              type InputPackage = ServicePackage & { id?: string; description?: string }
              const pkg = p as InputPackage
              return {
                id: pkg.id ?? pkg._key ?? pkg.name,
                name: pkg.name,
                price: pkg.price,
                description: pkg.description ?? '',
                features: (pkg.features || []).map(f => typeof f === 'string' ? f : (f.title || f.description || JSON.stringify(f))),
                popular: pkg.popular ?? false,
                deliveryTime: pkg.deliveryTime || ''
              }
            }))}
          
          />
        </div>
      </div>

      {/* Related Services */}
      {relatedServices && relatedServices.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-2">Related Services</h2>
              <p className="text-center text-gray-600 mb-12">
                Explore our other professional services that might interest you
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedServices.map((relatedService) => (
                  <Link
                    key={relatedService.slug.current}
                    href={`/services/${relatedService.slug.current}`}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 group border border-gray-100"
                  >
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors mb-3">
                      {relatedService.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {relatedService.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary text-sm font-medium">
                      Learn More
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}