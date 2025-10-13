'use client'

import { useState } from 'react'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useCurrency } from '@/contexts/CurrencyContext'
import { PriceDisplay } from '@/components/ui/PriceDisplay'

interface Package {
  id: string
  name: string
  tier: 'basic' | 'standard' | 'premium' | 'enterprise'
  price: number
  description: string
  features: string[]
  popular?: boolean
  notIncluded?: string[]
}

interface PackageComparisonProps {
  packages: Package[]
  onSelectPackage?: (pkg: Package) => void
  showComparison?: boolean
}

export default function PackageComparison({
  packages,
  onSelectPackage,
  showComparison = false
}: PackageComparisonProps) {
  const [compareMode, setCompareMode] = useState(showComparison)
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const { formatPrice } = useCurrency()

  const toggleCompare = (packageId: string) => {
    setSelectedPackages(prev =>
      prev.includes(packageId)
        ? prev.filter(id => id !== packageId)
        : prev.length < 3
        ? [...prev, packageId]
        : prev
    )
  }

  const packagesToCompare = compareMode
    ? packages.filter(pkg => selectedPackages.includes(pkg.id))
    : packages

  const allFeatures = Array.from(
    new Set(
      packagesToCompare.flatMap(pkg => [
        ...pkg.features,
        ...(pkg.notIncluded || [])
      ])
    )
  )

  const hasFeature = (pkg: Package, feature: string): boolean | 'not-included' => {
    if (pkg.features.includes(feature)) return true
    if (pkg.notIncluded?.includes(feature)) return 'not-included'
    return false
  }

  return (
    <div className="space-y-6">
      {/* Compare Mode Toggle */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Choose Your Package</h3>
        <button
          onClick={() => setCompareMode(!compareMode)}
          className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
        >
          {compareMode ? 'Exit Compare Mode' : 'Compare Packages'}
        </button>
      </div>

      {/* Package Selection for Compare Mode */}
      {compareMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-gray-700 mb-3">
            Select up to 3 packages to compare (
            <span className="font-semibold">{selectedPackages.length}/3</span> selected)
          </p>
          <div className="flex flex-wrap gap-2">
            {packages.map(pkg => (
              <button
                key={pkg.id}
                onClick={() => toggleCompare(pkg.id)}
                disabled={!selectedPackages.includes(pkg.id) && selectedPackages.length >= 3}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPackages.includes(pkg.id)
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {pkg.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Package Cards (Grid View) */}
      {!compareMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className={`relative bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${
                pkg.popular ? 'border-primary' : 'border-gray-200'
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-xs font-semibold rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}

              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h4>
                <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    <PriceDisplay price={pkg.price} size="lg" />
                  </div>
                  <p className="text-sm text-gray-500">One-time payment</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                  {pkg.features.length > 5 && (
                    <li className="text-sm text-gray-500 italic">
                      +{pkg.features.length - 5} more features
                    </li>
                  )}
                </ul>

                <button
                  onClick={() => onSelectPackage?.(pkg)}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                    pkg.popular
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Select Package
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Comparison Table */}
      {compareMode && selectedPackages.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Feature
                </th>
                {packagesToCompare.map(pkg => (
                  <th
                    key={pkg.id}
                    className={`px-6 py-4 text-center ${
                      pkg.popular ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="font-bold text-gray-900">{pkg.name}</div>
                    <div className="text-2xl font-bold text-primary mt-2">
                      {formatPrice(pkg.price)}
                    </div>
                    {pkg.popular && (
                      <div className="inline-block mt-2 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                        Popular
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allFeatures.map((feature, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{feature}</td>
                  {packagesToCompare.map(pkg => {
                    const status = hasFeature(pkg, feature)
                    return (
                      <td
                        key={pkg.id}
                        className={`px-6 py-4 text-center ${
                          pkg.popular ? 'bg-primary/5' : ''
                        }`}
                      >
                        {status === true && (
                          <CheckIcon className="h-6 w-6 text-green-600 mx-auto" />
                        )}
                        {status === 'not-included' && (
                          <XMarkIcon className="h-6 w-6 text-gray-300 mx-auto" />
                        )}
                        {status === false && (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-6 py-4 font-semibold text-gray-900">Select Package</td>
                {packagesToCompare.map(pkg => (
                  <td key={pkg.id} className="px-6 py-4 text-center">
                    <button
                      onClick={() => onSelectPackage?.(pkg)}
                      className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                        pkg.popular
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                      }`}
                    >
                      Select
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {compareMode && selectedPackages.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Select packages above to compare features</p>
        </div>
      )}
    </div>
  )
}
