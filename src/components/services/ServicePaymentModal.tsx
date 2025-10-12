'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { useCurrency } from '@/contexts/CurrencyContext'
import { CheckIcon } from '@heroicons/react/24/outline'

interface ServicePackage {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
  deliveryTime: string
}

export default ServicePaymentModal

// Payment plan options for services
type PaymentPlan = {
  id: string
  name: string
  description: string
  installments: number
  downPayment: number // percentage (0-100)
  processingFee: number // flat fee in USD
}

interface ServicePaymentModalProps {
  isOpen: boolean
  onClose: () => void
  serviceTitle: string
  serviceSlug: string
  packages: ServicePackage[]
}

// Default service packages for services that don't have custom packages
const getDefaultPackages = (serviceSlug: string): ServicePackage[] => {
  const basePackages = [
    {
      id: 'basic',
      name: 'Basic Package',
      price: 199,
      description: 'Essential service package with core features',
      features: [
        'Initial consultation',
        'Basic implementation',
        'Email support',
        '30-day warranty'
      ],
      deliveryTime: '5-7 business days'
    },
    {
      id: 'professional',
      name: 'Professional Package',
      price: 399,
      description: 'Comprehensive service with advanced features',
      features: [
        'Detailed consultation',
        'Professional implementation',
        'Priority support',
        'Custom features',
        '90-day warranty',
        'Training included'
      ],
      popular: true,
      deliveryTime: '7-10 business days'
    },
    {
      id: 'premium',
      name: 'Premium Package',
      price: 699,
      description: 'Complete solution with premium features and ongoing support',
      features: [
        'In-depth consultation',
        'Premium implementation',
        '24/7 priority support',
        'Custom development',
        'Advanced features',
        '1-year warranty',
        'Training & documentation',
        '3 months free maintenance'
      ],
      deliveryTime: '10-14 business days'
    }
  ]

  // Customize packages based on service type
  if (serviceSlug.includes('web') || serviceSlug.includes('website')) {
    basePackages[0].features = [
      'Responsive design',
      'Up to 5 pages',
      'Contact form',
      'Basic SEO',
      '30-day support'
    ]
    basePackages[1].features = [
      'Custom design',
      'Up to 10 pages',
      'Advanced forms',
      'SEO optimization',
      'Analytics setup',
      '90-day support'
    ]
    basePackages[2].features = [
      'Premium custom design',
      'Unlimited pages',
      'E-commerce integration',
      'Advanced SEO',
      'Analytics & tracking',
      'CMS integration',
      '1-year support'
    ]
  } else if (serviceSlug.includes('mobile') || serviceSlug.includes('app')) {
    basePackages[0].price = 499
    basePackages[1].price = 999
    basePackages[2].price = 1999
    basePackages[0].features = [
      'Basic app design',
      'Core functionality',
      'iOS or Android',
      'Basic testing',
      '30-day support'
    ]
    basePackages[1].features = [
      'Custom app design',
      'Advanced features',
      'iOS & Android',
      'Comprehensive testing',
      'App store submission',
      '90-day support'
    ]
    basePackages[2].features = [
      'Premium app design',
      'Complex functionality',
      'Cross-platform',
      'Advanced testing',
      'App store optimization',
      'Backend integration',
      '1-year support'
    ]
  }

  return basePackages
}

// Available payment plans - same as service packages
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

function ServicePaymentModal({
  isOpen,
  onClose,
  serviceTitle,
  serviceSlug,
  packages: customPackages
}: ServicePaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { formatPrice, currency, currentCurrency, getLocalDiscountMessage } = useCurrency()
  const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null)
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<PaymentPlan>(PAYMENT_PLANS[0])

  // Use custom packages if provided, otherwise use default packages
  const packages = customPackages.length > 0 ? customPackages : getDefaultPackages(serviceSlug)
  const discountMessage = getLocalDiscountMessage()

  // Auto-select popular package if none selected
  if (!selectedPackage && packages.length > 0) {
    const popularPackage = packages.find(pkg => pkg.popular) || packages[1] || packages[0]
    setSelectedPackage(popularPackage)
  }

  const handlePackageSelect = (pkg: ServicePackage) => {
    setSelectedPackage(pkg)
  }

  // Helper function to calculate payment amounts
  const getPaymentAmounts = (plan?: PaymentPlan) => {
    const planToUse = plan || selectedPaymentPlan
    if (!selectedPackage) return { downPayment: 0, remaining: 0 }
    return {
      downPayment: (selectedPackage.price * planToUse.downPayment / 100) + planToUse.processingFee,
      remaining: (selectedPackage.price * (100 - planToUse.downPayment) / 100) / (planToUse.installments - 1)
    }
  }

  // Check if service qualifies for installments (above $300 threshold)
  const qualifiesForInstallments = selectedPackage && selectedPackage.price >= 300

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Purchase ${serviceTitle}`}
      size="xl"
      className="max-h-[90vh]"
    >
      <div className="space-y-6">
        {/* Nigerian discount banner */}
        {discountMessage && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <span>🇳🇬</span>
              <span className="font-medium">Nigerian Launch Special: 50% OFF!</span>
              <span>🔥</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Special pricing for Nigerian clients - limited time offer!
            </p>
          </div>
        )}

        {/* Package Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Choose Your Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative border rounded-xl p-6 cursor-pointer transition-all duration-200 ${
                  selectedPackage?.id === pkg.id
                    ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                } ${pkg.popular ? 'ring-2 ring-orange-200 border-orange-300' : ''}`}
                onClick={() => handlePackageSelect(pkg)}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{pkg.name}</h4>
                  <div className="text-3xl font-bold text-primary mb-2">
                    {formatPrice(pkg.price, { applyNigerianDiscount: true })}
                  </div>
                  {currentCurrency.code !== 'NGN' && (
                    <div className="text-sm text-gray-500">
                      ≈ ₦{(pkg.price * 500 * 0.5).toLocaleString()}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
                  <div className="text-xs text-blue-600 font-medium">
                    Delivery: {pkg.deliveryTime}
                  </div>
                </div>

                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <CheckIcon className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Plan Selection - Only for services above $300 */}
        {qualifiesForInstallments && (
          <div className="space-y-4">
  
                export default ServicePaymentModal
            <h3 className="text-lg font-semibold text-gray-900">Choose Payment Plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAYMENT_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    selectedPaymentPlan.id === plan.id
                      ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPaymentPlan(plan)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                    {plan.id === 'split_2' && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{plan.description}</p>
                  
                  {selectedPackage && plan.installments > 1 && (() => {
                    const amounts = getPaymentAmounts(plan)
                    return (
                      <div className="text-xs text-gray-500">
                        Today: {formatPrice(amounts.downPayment, { applyNigerianDiscount: true })}
                        {plan.installments > 1 && (
                          <span className="block">
                            Then: {plan.installments - 1} × {formatPrice(amounts.remaining, { applyNigerianDiscount: true })}
                          </span>
                        )}
                      </div>
                    )
                  })()}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Package Summary */}
        {selectedPackage && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h5 className="font-medium text-gray-900">{serviceTitle}</h5>
                <p className="text-sm text-gray-600">{selectedPackage.name}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary">
                  {formatPrice(selectedPackage.price, { applyNigerianDiscount: true })}
                </div>
                {currentCurrency.code !== 'NGN' && discountMessage && (
                  <div className="text-sm text-gray-500">
                    Regular: {formatPrice(selectedPackage.price)}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              {qualifiesForInstallments && selectedPaymentPlan.installments > 1 ? (
                // Show installment breakdown
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedPackage.price, { applyNigerianDiscount: true })}</span>
                  </div>
                  
                  {selectedPaymentPlan.processingFee > 0 && (
                    <div className="flex justify-between items-center text-sm">
                      <span>Processing Fee:</span>
                      <span>{formatPrice(selectedPaymentPlan.processingFee, { applyNigerianDiscount: true })}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center border-t pt-2 mb-3">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-xl font-bold text-primary">
                      {formatPrice((selectedPackage.price + selectedPaymentPlan.processingFee), { applyNigerianDiscount: true })}
                    </span>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Payment Plan:</span>
                      <span className="text-sm text-blue-700">{selectedPaymentPlan.name}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="bg-blue-100 rounded p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700 font-medium">1st Payment (Today):</span>
                          <span className="text-sm font-bold text-green-600">
                            {formatPrice(getPaymentAmounts().downPayment, { applyNigerianDiscount: true })}
                          </span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Includes {selectedPaymentPlan.downPayment}% of service + processing fee
                        </div>
                      </div>
                      
                      {selectedPaymentPlan.installments > 1 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">
                            Remaining {selectedPaymentPlan.installments - 1} payments:
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {formatPrice(getPaymentAmounts().remaining, { applyNigerianDiscount: true })} each
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Show regular total for full payment or services under $300
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(selectedPackage.price, { applyNigerianDiscount: true })}
                    </span>
                  </div>
                  {discountMessage && (
                    <div className="text-sm text-green-600 text-right mt-1">
                      You save {formatPrice(selectedPackage.price * 0.5)}!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          
          {selectedPackage && (
            <button
              onClick={async () => {
                // Create Stripe checkout session
                setIsProcessing(true)
                try {
                  const response = await fetch('/api/create-checkout-session', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      serviceTitle,
                      packageName: selectedPackage.name,
                      packagePrice: selectedPackage.price,
                      paymentPlan: qualifiesForInstallments && selectedPaymentPlan ? selectedPaymentPlan.id : 'full',
                      downPayment: qualifiesForInstallments && selectedPaymentPlan.installments > 1 
                        ? getPaymentAmounts().downPayment 
                        : selectedPackage.price,
                      installments: qualifiesForInstallments && selectedPaymentPlan ? selectedPaymentPlan.installments : 1,
                      currency: currency
                    })
                  })

                  const data = await response.json()
                  
                  if (data.url) {
                    // Redirect to Stripe checkout
                    window.location.href = data.url
                  } else {
                    throw new Error('No checkout URL received')
                  }
                } catch (error) {
                  console.error('Error creating checkout session:', error)
                  alert('Failed to create checkout session. Please try again or contact support.')
                  setIsProcessing(false)
                }
              }}
              disabled={isProcessing}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Purchase Service'}
            </button>
          )}
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckIcon className="h-3 w-3 text-white" />
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What happens after purchase?</p>
              <ul className="space-y-1 text-blue-700">
                <li>• You&apos;ll receive an email confirmation immediately</li>
                <li>• Our team will contact you within 24 hours to discuss your project</li>
                <li>• We&apos;ll begin work after finalizing the project requirements</li>
                <li>• Regular updates throughout the development process</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}