"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import { ServiceCategory, Package, AddOn, ClientInfo, ProjectDetails } from './ServiceRequestFlow'
import { PaymentPlan } from './ServicePackageSelection'
import { useCurrency } from '@/contexts/CurrencyContext'

interface PaymentSummaryProps {
  serviceCategory: ServiceCategory
  selectedPackage: Package
  selectedAddOns: AddOn[]
  selectedPaymentPlan: PaymentPlan | null
  clientInfo: ClientInfo
  projectDetails: ProjectDetails
  totalAmount: number
  onBack: () => void
  onSubmit: () => Promise<void>
  onPaymentSuccess: (paymentData: unknown) => Promise<void>
  onPaymentError: (error: unknown) => void
}

export const PaymentSummary: React.FC<PaymentSummaryProps> = ({
  serviceCategory,
  selectedPackage,
  selectedAddOns,
  selectedPaymentPlan,
  clientInfo,
  projectDetails,
  totalAmount,
  onBack
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { formatPrice, currentCurrency, convertPrice, isLocalCurrency, isLaunchSpecialActive } = useCurrency()

  // Reset processing state when component becomes visible again (user returned from Paystack)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isProcessing) {
        // User came back to the page, reset processing state
        setIsProcessing(false)
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isProcessing])

  // Reset processing state when user clicks back
  const handleBack = () => {
    setIsProcessing(false)
    setError(null)
    onBack()
  }

  const calculatePaymentBreakdown = () => {
    if (!selectedPaymentPlan) return null

    const subtotal = totalAmount
    const processingFee = selectedPaymentPlan.processingFee || 0
    const totalWithFee = subtotal + processingFee
    
    // Calculate down payment as percentage of the SUBTOTAL, then add processing fee to down payment
    const downPaymentFromSubtotal = (subtotal * selectedPaymentPlan.downPayment) / 100
    const downPaymentAmount = downPaymentFromSubtotal + processingFee
    
    // Remaining amount is what's left from the subtotal (not including processing fee)
    const remainingAmount = subtotal - downPaymentFromSubtotal
    const monthlyPayment = selectedPaymentPlan.installments > 1 
      ? remainingAmount / (selectedPaymentPlan.installments - 1)
      : 0

    return {
      subtotal,
      processingFee,
      totalWithFee,
      downPaymentAmount,
      monthlyPayment,
      remainingAmount,
    }
  }

  const handlePayment = async () => {
    if (!selectedPaymentPlan) {
      setError('Payment plan not selected')
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // For display, formatPrice already applies the Nigerian discount
      // So totalAmount from props is the base USD price
      // We need to apply discount here too before sending to API
      let finalAmount = totalAmount
      if (isLocalCurrency() && currentCurrency.code === 'NGN' && isLaunchSpecialActive()) {
        finalAmount = totalAmount * 0.5 // 50% discount to match display
      }
      
      // Convert discounted amount to selected currency
      const convertedAmount = convertPrice(finalAmount, currentCurrency.code)
      
      const response = await fetch('/api/service-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceCategory,
          selectedPackage,
          selectedAddOns,
          selectedPaymentPlan,
          clientInfo,
          projectDetails,
          totalAmount: convertedAmount,
          currency: currentCurrency.code
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create service request')
      }

      // Redirect to Paystack Checkout (support both 'url' from Paystack and 'checkoutUrl' for backwards compatibility)
      const redirectUrl = data.url || data.checkoutUrl
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      console.error('Payment error:', err)
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const breakdown = calculatePaymentBreakdown()

  if (!selectedPaymentPlan || !breakdown) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-red-600">Payment plan not available. Please go back and select a package.</p>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Packages
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Review & Payment</h3>
          <p className="text-gray-600">Review your order details and proceed with payment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
              
              {/* Service Package */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h5 className="font-medium text-gray-900">{selectedPackage.name}</h5>
                  <p className="text-sm text-gray-600">{serviceCategory.title}</p>
                  <div className="flex items-center mt-1">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {selectedPackage.tier.charAt(0).toUpperCase() + selectedPackage.tier.slice(1)}
                    </span>
                    {selectedPackage.deliveryTime && (
                      <span className="ml-2 text-xs text-gray-500">
                        Delivery: {selectedPackage.deliveryTime}
                      </span>
                    )}
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  {formatPrice(selectedPackage.price, { applyNigerianDiscount: true })}
                </span>
              </div>

              {/* Add-ons */}
              {selectedAddOns.length > 0 && (
                <div className="border-t pt-4 mb-4">
                  <h6 className="font-medium text-gray-900 mb-2">Add-ons</h6>
                  {selectedAddOns.map((addOn) => (
                    <div key={addOn._key} className="flex justify-between items-center mb-2">
                      <div>
                        <span className="text-sm text-gray-900">{addOn.name}</span>
                        <p className="text-xs text-gray-600">{addOn.description}</p>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        +{formatPrice(addOn.price, { applyNigerianDiscount: true })}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Payment Plan & Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="text-sm font-medium">
                    {formatPrice(breakdown.subtotal, { applyNigerianDiscount: true })}
                  </span>
                </div>
                
                {breakdown.processingFee > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Processing Fee:</span>
                    <span className="text-sm font-medium">
                      {formatPrice(breakdown.processingFee, { applyNigerianDiscount: true })}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center border-t pt-2 mb-3">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(breakdown.totalWithFee, { applyNigerianDiscount: true })}
                  </span>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-blue-900">Payment Plan:</span>
                    <span className="text-sm text-blue-700">{selectedPaymentPlan.name}</span>
                  </div>
                  
                  {selectedPaymentPlan.installments === 1 ? (
                    <p className="text-sm text-blue-600">Full payment required upfront</p>
                  ) : (
                    <div className="space-y-2">
                      <div className="bg-blue-100 rounded p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-blue-700 font-medium">1st Payment (Today):</span>
                          <span className="text-sm font-bold text-green-600">
                            {formatPrice(breakdown.downPaymentAmount, { applyNigerianDiscount: true })}
                          </span>
                        </div>
                        <div className="text-xs text-blue-600 mt-1">
                          Includes {selectedPaymentPlan.downPayment}% of service + {formatPrice(breakdown.processingFee, { applyNigerianDiscount: true })} processing fee
                        </div>
                      </div>
                      {breakdown.monthlyPayment > 0 && (
                        <div className="flex justify-between">
                          <span className="text-sm text-blue-700">
                            Remaining {selectedPaymentPlan.installments - 1} payments:
                          </span>
                          <span className="text-sm font-medium text-blue-600">
                            {formatPrice(breakdown.monthlyPayment, { applyNigerianDiscount: true })} each
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Package Features Recap */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">What&apos;s Included</h4>
              <ul className="space-y-2">
                {selectedPackage.features.map((feature, index) => {
                  const text = typeof feature === 'string' ? feature : (feature.title || feature.description || JSON.stringify(feature))
                  return (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700 text-sm">{text}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Client & Project Details */}
          <div className="space-y-6">
            {/* Client Information */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Name:</span>
                  <p className="text-gray-900 mt-1">{clientInfo.firstName} {clientInfo.lastName}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <p className="text-gray-900 mt-1">{clientInfo.email}</p>
                </div>
                {clientInfo.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-gray-900 mt-1">{clientInfo.phone}</p>
                  </div>
                )}
                {clientInfo.company && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Company:</span>
                    <p className="text-gray-900 mt-1">{clientInfo.company}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Notes */}
            {projectDetails.notes && (
              <div className="bg-white border rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h4>
                <p className="text-gray-700 text-sm leading-relaxed">{projectDetails.notes}</p>
              </div>
            )}

            {/* Payment Security Notice */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h5 className="font-medium text-green-800">Secure Payment</h5>
                  <p className="text-sm text-green-700 mt-1">
                    Your payment is processed securely through Stripe. We don&apos;t store your payment information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h5 className="font-medium text-red-800">Payment Error</h5>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t">
          <button
            type="button"
            onClick={handleBack}
            disabled={isProcessing}
            className="sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Back to Details
          </button>
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="flex-1 sm:flex-none sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                Proceed to Payment
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Terms Notice */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          By proceeding with payment, you agree to our{' '}
          <a href="/terms-of-service" className="text-primary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>.
          You will be charged {formatPrice(breakdown.totalWithFee, { applyNigerianDiscount: true })} for this service.
        </p>
      </div>
    </div>
  )
}