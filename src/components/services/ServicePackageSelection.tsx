"use client"

import React, { useState } from 'react'
import { ServiceCategory, Package, AddOn } from './ServiceRequestFlow'

interface ServicePackageSelectionProps {
  serviceCategory: ServiceCategory
  onPackageSelect: (pkg: Package, addOns: AddOn[]) => void
}

export const ServicePackageSelection: React.FC<ServicePackageSelectionProps> = ({
  serviceCategory,
  onPackageSelect
}) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'border-blue-200 bg-blue-50'
      case 'standard':
        return 'border-green-200 bg-green-50'
      case 'premium':
        return 'border-purple-200 bg-purple-50 ring-2 ring-purple-200'
      case 'enterprise':
        return 'border-orange-200 bg-orange-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case 'basic':
        return 'bg-blue-100 text-blue-800'
      case 'standard':
        return 'bg-green-100 text-green-800'
      case 'premium':
        return 'bg-purple-100 text-purple-800'
      case 'enterprise':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const handleAddOnToggle = (addOn: AddOn) => {
    setSelectedAddOns(prev => {
      const exists = prev.find(item => item._key === addOn._key)
      if (exists) {
        return prev.filter(item => item._key !== addOn._key)
      } else {
        return [...prev, addOn]
      }
    })
  }

  const handleContinue = () => {
    if (selectedPackage) {
      onPackageSelect(selectedPackage, selectedAddOns)
    }
  }

  const calculateTotal = () => {
    const packagePrice = selectedPackage?.price || 0
    const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0)
    return packagePrice + addOnTotal
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Package</h3>
        <p className="text-gray-600">Select the service package that best fits your needs.</p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {serviceCategory.packages.map((pkg) => (
          <div
            key={pkg._key}
            className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedPackage?._key === pkg._key
                ? 'border-primary shadow-lg bg-primary/5'
                : getTierColor(pkg.tier)
            }`}
            onClick={() => setSelectedPackage(pkg)}
          >
            {pkg.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-bold text-gray-900">{pkg.name}</h4>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTierBadgeColor(pkg.tier)}`}>
                {pkg.tier.charAt(0).toUpperCase() + pkg.tier.slice(1)}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(pkg.price, pkg.currency)}
                </span>
                <span className="ml-2 text-gray-600">
                  {pkg.billing === 'one_time' && '/one-time'}
                  {pkg.billing === 'monthly' && '/month'}
                  {pkg.billing === 'hourly' && '/hour'}
                  {pkg.billing === 'project' && '/project'}
                </span>
              </div>
              {pkg.deliveryTime && (
                <p className="text-sm text-gray-600 mt-1">
                  Delivery: {pkg.deliveryTime}
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-6">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            {selectedPackage?._key === pkg._key && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add-ons Section */}
      {selectedPackage?.addOns && selectedPackage.addOns.length > 0 && (
        <div className="mb-8">
          <h4 className="text-xl font-bold text-gray-900 mb-4">Available Add-ons</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedPackage.addOns.map((addOn) => (
              <div
                key={addOn._key}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                  selectedAddOns.find(item => item._key === addOn._key)
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleAddOnToggle(addOn)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h5 className="font-semibold text-gray-900">{addOn.name}</h5>
                      <span className="ml-2 font-bold text-primary">
                        +{formatPrice(addOn.price, selectedPackage.currency)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{addOn.description}</p>
                  </div>
                  <div className="ml-3">
                    <div className={`w-5 h-5 rounded border-2 transition-colors ${
                      selectedAddOns.find(item => item._key === addOn._key)
                        ? 'bg-primary border-primary'
                        : 'border-gray-300'
                    }`}>
                      {selectedAddOns.find(item => item._key === addOn._key) && (
                        <svg className="w-3 h-3 text-white m-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary and Continue */}
      {selectedPackage && (
        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Package Summary</h4>
              <p className="text-gray-600">
                {selectedPackage.name} 
                {selectedAddOns.length > 0 && ` + ${selectedAddOns.length} add-on${selectedAddOns.length > 1 ? 's' : ''}`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(calculateTotal(), selectedPackage.currency)}
              </div>
              <div className="text-sm text-gray-600">
                {selectedPackage.billing === 'one_time' && 'One-time payment'}
                {selectedPackage.billing === 'monthly' && 'Per month'}
                {selectedPackage.billing === 'hourly' && 'Per hour'}
                {selectedPackage.billing === 'project' && 'Per project'}
              </div>
            </div>
          </div>
          <button
            onClick={handleContinue}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Continue to Project Details
          </button>
        </div>
      )}
    </div>
  )
}
