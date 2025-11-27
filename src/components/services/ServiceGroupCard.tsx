'use client'

import React from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import type { ServicePackageGroup } from '@/types/service'

interface ServiceGroupCardProps {
  group: ServicePackageGroup
  onViewOptions: (group: ServicePackageGroup) => void
}

/**
 * ServiceGroupCard
 * 
 * Displays a package group card with:
 * - Title and description
 * - Starting price (calculated from lowest tier)
 * - Feature count
 * - "View Options" CTA button
 * 
 * Design philosophy:
 * - Clean, scannable layout
 * - Emphasizes value proposition
 * - Draws user to tier selection modal
 */
export default function ServiceGroupCard({ group, onViewOptions }: ServiceGroupCardProps) {
  const { currentCurrency, convertPrice } = useCurrency()

  // Calculate starting price from the cheapest tier
  const startingPrice = Math.min(...(group.tiers || []).map(t => t.price))
  const convertedPrice = convertPrice(startingPrice, currentCurrency.code)

  // Count total unique features across all tiers (for visual interest)
  const allFeaturesSet = new Set<string>()
  group.tiers?.forEach(tier => {
    tier.features?.forEach(f => {
      const feature = typeof f === 'string' ? f : (f.title || f.description || '')
      allFeaturesSet.add(feature)
    })
  })
  const featureCount = allFeaturesSet.size

  // Find if any tier is marked as popular
  const hasPopularTier = group.tiers?.some(t => t.popular)

  return (
    <div className="group relative bg-white rounded-2xl border-2 border-gray-200 hover:border-primary/50 transition-all duration-300 hover:shadow-lg overflow-hidden">
      {/* Gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />

      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold font-heading text-gray-900 mb-2 group-hover:text-primary transition-colors">
            {group.name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {group.description}
          </p>
        </div>

        {/* Pricing highlight */}
        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
            Starting at
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary">
              {currentCurrency.symbol}
              {Math.round(convertedPrice).toLocaleString()}
            </span>
            <span className="text-sm text-gray-600">
              {group.tiers?.[0]?.billing === 'monthly' ? '/month' : ''}
            </span>
          </div>
        </div>

        {/* Feature count & tier indicator */}
        <div className="mb-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-4 h-4 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{featureCount} Features included</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM5 12a1 1 0 100 2h10a1 1 0 100-2H5z" clipRule="evenodd" />
            </svg>
            <span>{group.tiers?.length || 0} Tiers</span>
          </div>
        </div>

        {/* Popular indicator */}
        {hasPopularTier && (
          <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-secondary">
            <span className="inline-block w-2 h-2 rounded-full bg-secondary" />
            Most popular option available
          </div>
        )}

        {/* CTA Button */}
        <button
          onClick={() => onViewOptions(group)}
          className="w-full px-4 py-3 bg-gradient-to-r from-primary to-primary/80 text-white font-semibold rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-300 transform hover:scale-105 active:scale-95"
          aria-label={`View ${group.name} options`}
        >
          <span className="flex items-center justify-center gap-2">
            View All Options
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>

        {/* Delivery time info */}
        <p className="mt-4 text-center text-xs text-gray-500">
          📅 Delivery: {group.tiers?.[0]?.deliveryTime || 'Varies by tier'}
        </p>
      </div>
    </div>
  )
}
