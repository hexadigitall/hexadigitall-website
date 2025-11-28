"use client"

import React, { useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import type { ServicePackageGroup, ServicePackageTier } from '@/types/service'

interface TierSelectionModalProps {
  packageGroup: ServicePackageGroup
  onTierSelect: (tier: ServicePackageTier) => void
  onClose: () => void
}

export default function TierSelectionModal({
  packageGroup,
  onTierSelect,
  onClose
}: TierSelectionModalProps) {
  const { currentCurrency, convertPrice } = useCurrency()
  const [selectedTierKey, setSelectedTierKey] = useState<string | null>(
    packageGroup.tiers?.find(t => t.popular)?._key || packageGroup.tiers?.[0]?._key || null
  )

  const tiers = packageGroup.tiers || []

  if (!tiers || tiers.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-gray-600 mb-4">No pricing tiers available for this package.</p>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-6xl w-full p-6 md:p-8 relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {packageGroup.name}
          </h2>
          {packageGroup.description && (
            <p className="text-gray-600 text-lg">
              {packageGroup.description}
            </p>
          )}
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier) => {
            const isSelected = selectedTierKey === tier._key
            const convertedPrice = convertPrice(tier.price, currentCurrency.code)

            return (
              <div
                key={tier._key}
                onClick={() => setSelectedTierKey(tier._key)}
                role="radio"
                aria-checked={isSelected}
                className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 border-2 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-xl scale-105'
                    : 'border-gray-200 hover:border-primary/50 hover:shadow-lg'
                } ${tier.popular ? 'ring-2 ring-secondary ring-offset-2' : ''}`}
              >
                {/* Popular Badge */}
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-secondary to-secondary/80 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md">
                      ⭐ Most Popular
                    </span>
                  </div>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-md">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}

                {/* Tier Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 pr-10">
                  {tier.name}
                </h3>

                {/* Subtitle - Best For */}
                {tier.subtitle && (
                  <p className="text-sm text-gray-600 mb-3 italic leading-snug pr-8">
                    {tier.subtitle}
                  </p>
                )}

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-primary leading-tight">
                    {currentCurrency.symbol}
                    {Math.round(convertedPrice).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 font-medium">
                    {tier.billing === 'one_time' && 'One-time payment'}
                    {tier.billing === 'monthly' && 'Per month (recurring)'}
                    {tier.billing === 'hourly' && 'Per hour'}
                    {tier.billing === 'project' && 'Per project'}
                  </p>
                </div>

                {/* Delivery Time */}
                {tier.deliveryTime && (
                  <div className="mb-6 p-3 bg-blue-50 rounded-lg border border-blue-100 flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 mr-2.5 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">Delivery: {tier.deliveryTime}</span>
                  </div>
                )}

                {/* Features highlight */}
                {tier.features && tier.features.length > 0 && (
                  <ul className="space-y-2.5 mb-6">
                    {tier.features.slice(0, 5).map((feature, idx) => {
                      const featureText = typeof feature === 'string' 
                        ? feature 
                        : (feature && typeof feature === 'object' ? (feature.title || feature.description || '') : '')
                      return (
                        <li key={idx} className="flex items-start text-sm text-gray-700 leading-snug">
                          <svg className="w-4 h-4 text-secondary mr-2.5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{featureText}</span>
                        </li>
                      )
                    })}
                    {(tier.features?.length || 0) > 5 && (
                      <li className="flex items-start text-xs text-gray-500 italic pt-1">
                        + {(tier.features?.length || 0) - 5} more features
                      </li>
                    )}
                  </ul>
                )}

                {/* Selection button for clarity */}
                <div className={`p-3 rounded-lg text-center text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {isSelected ? '✓ Selected' : 'Select Plan'}
                </div>
              </div>
            )
          })}
        </div>

        {/* Feature Comparison Table */}
        {tiers.length > 1 && (
          <div className="mb-12 overflow-x-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Compare Features</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-900">Feature</th>
                  {tiers.map(tier => {
                    const isSelected = selectedTierKey === tier._key
                    return (
                      <th 
                        key={tier._key} 
                        className={`text-center py-3 px-4 font-bold transition-all ${
                          isSelected 
                            ? 'text-primary bg-primary/10 border-l-4 border-r-4 border-primary' 
                            : 'text-gray-900'
                        }`}
                      >
                        {tier.name}
                        {isSelected && (
                          <div className="text-xs font-normal text-primary mt-1">✓ Selected</div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Collect all unique features */}
                {Array.from(
                  new Set(
                    tiers.flatMap(t => 
                      (t.features || []).map(f => typeof f === 'string' ? f : (f.title || f.description || ''))
                    )
                  )
                ).slice(0, 8).map((feature, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4 text-gray-700 font-medium">{feature}</td>
                    {tiers.map(tier => {
                      const isSelected = selectedTierKey === tier._key
                      const hasFeature = (tier.features || []).some(f => (typeof f === 'string' ? f : (f.title || f.description || '')) === feature)
                      return (
                        <td 
                          key={tier._key} 
                          className={`text-center py-3 px-4 transition-all ${
                            isSelected ? 'bg-primary/5 border-l-4 border-r-4 border-primary' : ''
                          }`}
                        >
                          {hasFeature && (
                            <svg 
                              className={`w-5 h-5 mx-auto ${
                                isSelected ? 'text-primary' : 'text-green-600'
                              }`} 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={() => {
              const selectedTier = tiers.find(t => t._key === selectedTierKey)
              if (selectedTier) {
                onTierSelect(selectedTier)
              }
            }}
            disabled={!selectedTierKey}
            className="flex-1 bg-gradient-to-r from-primary to-primary/80 text-white py-3 px-6 rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue with Selected Tier
          </button>
          <button
            onClick={onClose}
            className="flex-1 md:flex-auto border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-400 transition-colors"
          >
            Back
          </button>
        </div>

        {/* Currency Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Prices shown in {currentCurrency.flag} {currentCurrency.code}
        </div>
      </div>
    </div>
  )
}
