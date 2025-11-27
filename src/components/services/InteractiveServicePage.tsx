//src/components/services/InteractiveServicePage.tsx
"use client"

import { useState } from 'react'
import Link from 'next/link'
import ServicePaymentModal from '@/components/services/ServicePaymentModal'
import { useCurrency } from '@/contexts/CurrencyContext'
import { PortableText } from '@portabletext/react'
import { ServiceCategory, ServicePackage, ServicePackageGroup, ServicePackageTier } from '@/types/service'
import ServiceTestimonials from './ServiceTestimonials'
import ServiceCaseStudies from './ServiceCaseStudies'
import ServiceStatistics from './ServiceStatistics'

type InteractiveService = ServiceCategory & {
  overview?: string
  mainContent?: unknown
  packages?: ServicePackage[]
}

export default function InteractiveServicePage({ service, relatedServices }: { service: InteractiveService; relatedServices?: ServiceCategory[] }) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedGroupTiers, setSelectedGroupTiers] = useState<ServicePackageTier[] | null>(null)
  const { formatPrice } = useCurrency()

  if (!service) return null

  const openPaymentModal = () => {
    setShowPaymentModal(true)
  }

  const openGroupModal = (group: ServicePackageGroup) => {
    const tiers = Array.isArray(group.tiers) ? group.tiers : []
    setSelectedGroupTiers(tiers as ServicePackageTier[])
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
            {/* If packageGroups exist, render group cards; otherwise keep legacy CTA */}
            {service.packageGroups && service.packageGroups.length > 0 ? (
              service.packageGroups.map((group) => {
                const tiers = Array.isArray(group.tiers) ? (group.tiers as ServicePackageTier[]) : []
                const standard = tiers.find((t) => t.tier === 'standard')
                const minPrice = tiers.reduce((min, t) => {
                  const p = typeof t.price === 'number' ? t.price : Infinity
                  return p < min ? p : min
                }, Infinity)
                const starting = standard && standard.price ? standard.price : (isFinite(minPrice) ? minPrice : 0)
                return (
                  <button
                    key={group.key?.current || group.name}
                    className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
                    onClick={() => openGroupModal(group)}
                  >
                    {group.name} — Starting at {formatPrice(starting)}
                  </button>
                )
              })
            ) : (
              <>
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
              </>
            )}
            
            <button
              className="px-6 py-3 bg-white border border-green-500 text-green-700 rounded-lg font-semibold hover:bg-green-50"
              onClick={() => window.location.assign('/services/custom-build')}
            >
              Build a Custom Solution
            </button>
          </div>

          {/* Payment Modal */}
          <ServicePaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false)
              // Clear any selected group tiers when modal closes
              setSelectedGroupTiers(null)
            }}
            serviceTitle={service.title}
            serviceSlug={service.slug?.current || ''}
            packages={
              // If a group was selected, map its tiers into the modal package shape
              selectedGroupTiers && selectedGroupTiers.length > 0
                ? selectedGroupTiers.map((t: ServicePackageTier) => ({
                    id: t._key ?? t.name ?? `${t.tier}`,
                    name: t.name ?? `${t.tier}`,
                    price: typeof t.price === 'number' ? t.price : 0,
                    description: (((t as unknown) as Record<string, unknown>).description as string) ?? '',
                    features: Array.isArray(t.features)
                      ? t.features.map((f) => (typeof f === 'string' ? f : (f.title ?? f.description ?? '')))
                      : [],
                    popular: !!t.popular,
                    deliveryTime: t.deliveryTime ?? ''
                  }))
                : (service.packages ?? []).map(((p) => {
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
                  }))
            }
          />

          {/* Dynamic service features (testimonials, stats, case studies) */}
          <div className="mt-10">
            <ServiceStatistics statistics={service.statistics} />
            <ServiceTestimonials testimonials={service.testimonials} />
            <ServiceCaseStudies caseStudies={service.caseStudies} />
          </div>
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