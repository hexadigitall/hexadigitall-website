//src/components/services/ServicePackageSelection.tsx
"use client"

import { useState } from 'react'
import { ServiceCategory, Package, AddOn } from './ServiceRequestFlow'
import { useCurrency } from '@/contexts/CurrencyContext'
import { featureToText } from '@/lib/utils'

export type PaymentPlan = {
  id: string
  name: string
  description: string
  installments: number
  downPayment: number // percentage (0-100)
  processingFee: number // flat fee in USD
}

interface ServicePackageSelectionProps {
  serviceCategory: ServiceCategory
  onPackageSelect: (pkg: Package, addOns: AddOn[], paymentPlan: PaymentPlan) => void
}

// Available payment plans - Nigerian-friendly options
const PAYMENT_PLANS: PaymentPlan[] = [
  {
    id: 'full',
    name: 'Full Payment',
    description: 'Pay the full amount upfront',
    installments: 1,
    downPayment: 100,
    processingFee: 0,
  },
  {
    id: 'split_2',
    name: 'Split Payment',
    description: '40% down, 60% on delivery',
    installments: 2,
    downPayment: 40,
    processingFee: 15,
  },
  {
    id: 'monthly_3',
    name: '3-Month Plan',
    description: '25% down, then 2 easy payments',
    installments: 3,
    downPayment: 25,
    processingFee: 30,
  },
  {
    id: 'monthly_6',
    name: '6-Month Plan',
    description: 'Just 15% down, then 5 monthly payments',
    installments: 6,
    downPayment: 15,
    processingFee: 50,
  },
]

export const ServicePackageSelection: React.FC<ServicePackageSelectionProps> = ({
  serviceCategory,
  onPackageSelect,
}: ServicePackageSelectionProps) => {
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<PaymentPlan>(PAYMENT_PLANS[0])
  const { formatPrice: formatCurrencyPrice } = useCurrency()

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

  const formatPrice = (price: number, originalCurrency: string = 'USD') => {
    // All prices in Sanity are now stored as USD, so format them with the currency context
    // The originalCurrency parameter allows us to respect the stored currency if needed
    return formatCurrencyPrice(price, { 
      currency: originalCurrency === 'USD' ? undefined : originalCurrency, // Use context currency if USD, otherwise use specified
      applyNigerianDiscount: true 
    });
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
      onPackageSelect(selectedPackage, selectedAddOns, selectedPaymentPlan)
    }
  }

  const calculateTotal = () => {
    const packagePrice = selectedPackage?.price || 0
    const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0)
    return packagePrice + addOnTotal
  }

  const calculatePaymentBreakdown = () => {
    // Convert service pricing to USD for calculation consistency
    const subtotalInUSD = selectedPackage?.currency === 'NGN' 
      ? calculateTotal() / 1650  // Convert NGN to USD
      : calculateTotal() // Already in USD
    
    const processingFeeUSD = selectedPaymentPlan.processingFee
    const totalWithFeeInUSD = subtotalInUSD + processingFeeUSD
    
    // Calculate down payment as percentage of the SUBTOTAL, then add processing fee to down payment
    const downPaymentFromSubtotalUSD = (subtotalInUSD * selectedPaymentPlan.downPayment) / 100
    const downPaymentAmountUSD = downPaymentFromSubtotalUSD + processingFeeUSD
    
    // Remaining amount is what's left from the subtotal (not including processing fee)
    const remainingAmountUSD = subtotalInUSD - downPaymentFromSubtotalUSD
    const monthlyPaymentUSD = selectedPaymentPlan.installments > 1 
      ? remainingAmountUSD / (selectedPaymentPlan.installments - 1)
      : 0

    return {
      subtotalUSD: subtotalInUSD,
      processingFeeUSD,
      totalWithFeeUSD: totalWithFeeInUSD,
      downPaymentAmountUSD,
      monthlyPaymentUSD,
      remainingAmountUSD,
    }
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
                  <span className="text-gray-700">{featureToText(feature as string | { title?: string; description?: string } | undefined)}</span>
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

      {/* Payment Plan Selection */}
      {selectedPackage && (
        <div className="mb-8">
          <h4 className="text-xl font-bold text-gray-900 mb-4">Choose Your Payment Plan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {PAYMENT_PLANS.map((plan) => {
              const isSelected = selectedPaymentPlan.id === plan.id
              const total = calculateTotal()
              const showPlan = plan.id === 'full' || total >= 500 // Only show payment plans for orders $500+
              
              if (!showPlan) return null
              
              return (
                <div
                  key={plan.id}
                  className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md transform scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedPaymentPlan(plan)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPaymentPlan(plan);
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900">{plan.name}</h5>
                    {plan.processingFee > 0 && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        +{formatPrice(plan.processingFee)} fee
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                  
                  {plan.installments > 1 && (
                    <div className="text-xs text-gray-500">
                      <div>Down: {plan.downPayment}%</div>
                      <div>{plan.installments - 1} payments</div>
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Payment Breakdown */}
          {selectedPaymentPlan.installments > 1 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-300">
              <h5 className="font-semibold text-blue-900 mb-3 flex items-center">
                <span className="mr-2">💰</span>
                Payment Breakdown
              </h5>
              {(() => {
                const breakdown = calculatePaymentBreakdown()
                return (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Service Total:</span>
                      <span className="font-medium">{formatPrice(breakdown.subtotalUSD)}</span>
                    </div>
                    {breakdown.processingFeeUSD > 0 && (
                      <div className="flex justify-between">
                        <span className="text-blue-700">Processing Fee:</span>
                        <span className="font-medium">{formatPrice(breakdown.processingFeeUSD)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-blue-200 pt-2">
                      <span className="text-blue-700 font-medium">Grand Total:</span>
                      <span className="font-bold">{formatPrice(breakdown.totalWithFeeUSD)}</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-blue-200 bg-blue-100 rounded p-2">
                      <div className="text-xs text-blue-600 mb-2 font-medium">Payment Schedule:</div>
                      <div className="flex justify-between">
                        <span className="text-blue-700 font-medium">1st Payment (Today):</span>
                        <span className="font-bold text-green-600">{formatPrice(breakdown.downPaymentAmountUSD)}</span>
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        Includes {selectedPaymentPlan.downPayment}% of service + processing fee
                      </div>
                      {breakdown.monthlyPaymentUSD > 0 && (
                        <div>
                          <div className="flex justify-between mt-2">
                            <span className="text-blue-700">Remaining {selectedPaymentPlan.installments - 1} payments:</span>
                            <span className="font-medium">{formatPrice(breakdown.monthlyPaymentUSD)} each</span>
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            Total remaining: {formatPrice(breakdown.remainingAmountUSD)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
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
              <p className="text-sm text-primary font-medium mt-1">
                Payment: {selectedPaymentPlan.name}
              </p>
            </div>
            <div className="text-right">
              {selectedPaymentPlan.installments === 1 ? (
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {formatPrice(calculatePaymentBreakdown().totalWithFeeUSD)}
                  </div>
                  <div className="text-sm text-gray-600">Full payment</div>
                </div>
              ) : (
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {formatPrice(calculatePaymentBreakdown().downPaymentAmountUSD)}
                  </div>
                  <div className="text-sm text-gray-600">Down payment</div>
                  {calculatePaymentBreakdown().monthlyPaymentUSD > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      Then {formatPrice(calculatePaymentBreakdown().monthlyPaymentUSD)}/month
                    </div>
                  )}
                </div>
              )}
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
