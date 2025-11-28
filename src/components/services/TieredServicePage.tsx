'use client'

import React, { useState } from 'react'
import ServiceGroupCard from '@/components/services/ServiceGroupCard'
import TierSelectionModal from '@/components/services/TierSelectionModal'
import JourneyHeader from '@/components/services/JourneyHeader'
import { ServiceRequestFlow, ServiceCategory as LegacyServiceCategory } from '@/components/services/ServiceRequestFlow'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { useCurrency } from '@/contexts/CurrencyContext'
import type { ServicePackageGroup, ServicePackageTier } from '@/types/service'

interface TieredServicePageProps {
  title: string
  description: string
  journeyStage: 'idea' | 'build' | 'grow'
  packageGroups: ServicePackageGroup[]
  breadcrumbs: { label: string; href?: string }[]
}

/**
 * TieredServicePage
 * 
 * A new component that presents services using the tier system:
 * 1. Shows groups as cards with "View Options" button
 * 2. Opens modal with 3-tier comparison
 * 3. Converts selected tier to ServiceRequestFlow for checkout
 * 
 * This replaces the need for BusinessServicePage complexity
 * and provides a consistent experience across all services.
 */
export default function TieredServicePage({
  title,
  description,
  journeyStage,
  packageGroups,
  breadcrumbs,
}: TieredServicePageProps) {
  const { currentCurrency, getLocalDiscountMessage } = useCurrency()
  const [selectedGroup, setSelectedGroup] = useState<ServicePackageGroup | null>(null)
  const [selectedTier, setSelectedTier] = useState<ServicePackageTier | null>(null)
  const [showRequestFlow, setShowRequestFlow] = useState(false)

  const discountMessage = getLocalDiscountMessage()

  const handleTierSelect = (tier: ServicePackageTier) => {
    setSelectedTier(tier)
    setSelectedGroup(null)
    setShowRequestFlow(true)
  }

  // Convert tier to legacy service category for ServiceRequestFlow
  const createServiceCategoryFromTier = (): LegacyServiceCategory | null => {
    if (!selectedTier || !selectedGroup) return null

    return {
      _id: selectedGroup.key?.current || 'tier-service',
      title: selectedGroup.name,
      slug: { current: selectedGroup.key?.current || '' },
      description: selectedGroup.description || 'Service package',
      icon: '📦',
      featured: true,
      serviceType: 'general',
      packages: [
        {
          _key: selectedTier._key,
          name: selectedTier.name,
          tier: selectedTier.tier,
          price: selectedTier.price,
          currency: selectedTier.currency,
          billing: selectedTier.billing,
          deliveryTime: selectedTier.deliveryTime || '7-14 days',
          features: selectedTier.features || [],
          popular: selectedTier.popular || false
        }
      ]
    }
  }

  const serviceCategory = showRequestFlow ? createServiceCategoryFromTier() : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      {/* Journey Navigation */}
      <JourneyHeader currentStage={journeyStage} />

      {/* Breadcrumb */}
      <div className="bg-white border-b sticky top-[80px] z-20">
        <div className="container mx-auto px-6 py-4">
          <Breadcrumb items={breadcrumbs} />
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl">
            {/* Discount Banner */}
            {discountMessage && (
              <div className="mb-8 flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 rounded-full text-sm font-bold text-white shadow-lg">
                  <span>🇳🇬</span>
                  <span>NIGERIAN LAUNCH SPECIAL - 50% OFF ALL PACKAGES!</span>
                  <span>🔥</span>
                </div>
              </div>
            )}

            {/* Category badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full text-sm font-medium text-blue-800 mb-6">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.364 3.05a.5.5 0 01.672 0l2.832 2.805a.5.5 0 01.154.336l.39 1.951h1.951a.5.5 0 01.336.154l2.805 2.832a.5.5 0 010 .672l-2.805 2.832a.5.5 0 01-.336.154h-1.951l-.39 1.951a.5.5 0 01-.154.336l-2.832 2.805a.5.5 0 01-.672 0l-2.832-2.805a.5.5 0 01-.154-.336l-.39-1.951H4.5a.5.5 0 01-.336-.154L1.368 10.5a.5.5 0 010-.672l2.805-2.832a.5.5 0 01.336-.154h1.951l.39-1.951a.5.5 0 01.154-.336L9.364 3.05z" clipRule="evenodd" />
              </svg>
              <span>{journeyStage === 'idea' ? '💡 Idea Stage' : journeyStage === 'build' ? '🏗️ Build Stage' : '📈 Grow Stage'}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-6">
              {title}
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed mb-4">
              {description}
            </p>

            {/* Currency indicator */}
            <div className="mt-8">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                <span>Prices shown in:</span>
                <span className="font-semibold text-primary">
                  {currentCurrency.flag} {currentCurrency.code}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Groups Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-gray-900 mb-4">
              Choose Your Package
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each package includes three tiers: Basic for essentials, Standard for most needs, and Premium for advanced features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packageGroups.map((group) => (
              <ServiceGroupCard
                key={group.key?.current}
                group={group}
                onViewOptions={setSelectedGroup}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tier Selection Modal */}
      {selectedGroup && (
        <TierSelectionModal
          packageGroup={selectedGroup}
          onTierSelect={handleTierSelect}
          onClose={() => setSelectedGroup(null)}
        />
      )}

      {/* Service Request Flow */}
      {showRequestFlow && serviceCategory && (
        <ServiceRequestFlow
          serviceCategory={serviceCategory}
          onClose={() => {
            setShowRequestFlow(false)
            setSelectedTier(null)
          }}
        />
      )}
    </div>
  )
}
