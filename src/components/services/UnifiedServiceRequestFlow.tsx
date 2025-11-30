"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import type { ServicePackageTier, ServiceAddOn, ServiceRequestItem } from '@/types/service'

type ServiceType = 'tiered' | 'individual' | 'customizable'
type FlowStep = 'review' | 'details' | 'addons' | 'payment'

interface UnifiedServiceRequestFlowProps {
  serviceId: string
  serviceName: string
  serviceType: ServiceType
  tier?: ServicePackageTier // for tiered services
  onClose: () => void
}

export default function UnifiedServiceRequestFlow({
  serviceId,
  serviceName,
  serviceType,
  tier,
  onClose
}: UnifiedServiceRequestFlowProps) {
  // Extract basePrice from tier if available
  const basePrice = tier?.price || 0
  // Get available add-ons - tier packages typically don't have addOns property
  // For tiered services, we skip the addons step
  const availableAddOns: ServiceAddOn[] = []
  const { currentCurrency, convertPrice, isLocalCurrency, isLaunchSpecialActive } = useCurrency()
  const dialogRef = useRef<HTMLDivElement>(null)
  const stepHeadingRef = useRef<HTMLHeadingElement>(null)
  const priceLiveRegionRef = useRef<HTMLDivElement>(null)
  const [currentStep, setCurrentStep] = useState<FlowStep>('review')
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    details: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Apply Nigerian launch special discount (50% off) if applicable - for NGN users only
  const discountedBasePrice = (isLocalCurrency() && currentCurrency.code === 'NGN' && isLaunchSpecialActive()) 
    ? basePrice * 0.5 
    : basePrice
  
  const convertedPrice = convertPrice(discountedBasePrice, currentCurrency.code)
  const addOnsTotal = Array.from(selectedAddOns).reduce((sum, key) => {
    const addon = availableAddOns.find(a => a._key === key)
    const addonPrice = addon?.price || 0
    // Apply discount to add-ons as well for NGN users
    const discountedAddonPrice = (isLocalCurrency() && currentCurrency.code === 'NGN' && isLaunchSpecialActive())
      ? addonPrice * 0.5
      : addonPrice
    return sum + convertPrice(discountedAddonPrice, currentCurrency.code)
  }, 0)
  const totalPrice = convertedPrice + addOnsTotal

  const toggleAddOn = (addOnKey: string) => {
    const updated = new Set(selectedAddOns)
    if (updated.has(addOnKey)) {
      updated.delete(addOnKey)
    } else {
      updated.add(addOnKey)
    }
    setSelectedAddOns(updated)
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!formData.name.trim()) errors.name = 'Name is required'
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Valid email is required'
    }
    if (!formData.phone.trim()) errors.phone = 'Phone is required'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleContinue = () => {
    if (currentStep === 'review') {
      if (serviceType === 'tiered' || availableAddOns.length === 0) {
        setCurrentStep('details')
      } else {
        setCurrentStep('addons')
      }
    } else if (currentStep === 'addons') {
      setCurrentStep('details')
    } else if (currentStep === 'details') {
      if (validateForm()) {
        setCurrentStep('payment')
      }
    }
    // After step change, focus on heading for accessibility
    setTimeout(() => {
      stepHeadingRef.current?.focus()
    }, 50)
  }

  const handleBack = () => {
    // Reset processing state when going back (in case user returned from Paystack without completing)
    setIsProcessing(false)
    setFormErrors({})
    
    if (currentStep === 'payment') {
      setCurrentStep('details')
    } else if (currentStep === 'details') {
      if (serviceType !== 'tiered' && availableAddOns.length > 0) {
        setCurrentStep('addons')
      } else {
        setCurrentStep('review')
      }
    } else if (currentStep === 'addons') {
      setCurrentStep('review')
    }
    setTimeout(() => {
      stepHeadingRef.current?.focus()
    }, 50)
  }

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

  const handleSubmit = async () => {
    const selectedAddOnDetails = Array.from(selectedAddOns).map(key => {
      const addon = availableAddOns.find(a => a._key === key)
      return addon ? { _key: addon._key, name: addon.name, price: addon.price } : null
    }).filter(Boolean) as { _key: string; name: string; price: number }[]

    const item: ServiceRequestItem = {
      serviceId,
      serviceName,
      serviceType,
      tier,
      basePrice: convertedPrice,
      addOns: selectedAddOnDetails,
      total: totalPrice
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/service-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...item,
          customerInfo: formData,
          currency: currentCurrency.code,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Checkout failed')
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setFormErrors({
        submit: error instanceof Error ? error.message : 'Payment failed. Please try again.'
      })
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 overflow-y-hidden" onClick={onClose}>
      <div ref={dialogRef} tabIndex={-1} aria-modal="true" role="dialog" aria-label={`Service request flow for ${serviceName}`} className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 relative my-8 max-h-[90vh] overflow-y-auto outline-none" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {(['review', 'addons', 'details', 'payment'] as FlowStep[]).map((step, idx) => {
              const steps: FlowStep[] = (['review', 'addons', 'details', 'payment']).filter(
                s => !(serviceType === 'tiered' && s === 'addons') && 
                      !(serviceType !== 'customizable' && s === 'addons')
              ) as FlowStep[]
              
              const isActive = currentStep === step
              const isPast = steps.indexOf(currentStep) > steps.indexOf(step)
              const isVisible = steps.includes(step)
              
              if (!isVisible) return null

              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    isActive ? 'bg-primary text-white' :
                    isPast ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {isPast ? '✓' : idx + 1}
                  </div>
                  <p className="text-xs font-semibold text-gray-600 mt-2 capitalize">{step}</p>
                </div>
              )
            })}
          </div>
          <div className="h-1 bg-gray-200 rounded-full">
            <div className="h-full bg-primary rounded-full transition-all" style={{
              width: currentStep === 'review' ? '25%' :
                     currentStep === 'addons' ? '50%' :
                     currentStep === 'details' ? '75%' : '100%'
            }} />
          </div>
        </div>

        {/* Review Step */}
        {currentStep === 'review' && (
          <div>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="text-2xl font-bold text-gray-900 mb-6 focus:outline-none">Review Your Selection</h2>
            <div className="bg-blue-50 border-l-4 border-primary p-4 rounded mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{serviceName}</h3>
              <p className="text-sm text-gray-700 mb-3">{serviceType === 'tiered' ? `Tier: ${tier?.name}` : 'Individual Service'}</p>
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-primary">
                  {currentCurrency.symbol}{Math.round(convertedPrice).toLocaleString()}
                </span>
                <span className="text-xs text-gray-600">{tier?.deliveryTime || '7-14 days'}</span>
              </div>
            </div>

            {tier?.features && tier.features.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Included Features</h4>
                <ul className="space-y-2">
                  {tier.features.slice(0, 5).map((feature, idx) => {
                    const featureText = typeof feature === 'string' ? feature : feature?.title || ''
                    return (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{featureText}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Add-Ons Step (for customizable services) */}
        {currentStep === 'addons' && availableAddOns.length > 0 && (
          <div>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="text-2xl font-bold text-gray-900 mb-6 focus:outline-none">Customize Your Service</h2>
            <div className="space-y-3 mb-6">
              {availableAddOns.map(addon => {
                const convertedAddonPrice = convertPrice(addon.price, currentCurrency.code)
                const isSelected = selectedAddOns.has(addon._key)
                return (
                  <label key={addon._key} className="flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all" style={{
                    borderColor: isSelected ? 'rgb(59, 130, 246)' : 'rgb(229, 231, 235)',
                    backgroundColor: isSelected ? 'rgb(239, 246, 255)' : 'transparent'
                  }}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAddOn(addon._key)}
                      className="w-5 h-5 text-primary rounded mt-1 mr-3 flex-shrink-0 cursor-pointer"
                      aria-label={`Add ${addon.name}`}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{addon.name}</p>
                      <p className="text-sm text-gray-600">{addon.description}</p>
                    </div>
                    <span className="text-lg font-bold text-primary ml-4 flex-shrink-0">
                      +{currentCurrency.symbol}{Math.round(convertedAddonPrice).toLocaleString()}
                    </span>
                  </label>
                )
              })}
            </div>

            {/* Price Summary */}
            <div ref={priceLiveRegionRef} aria-live="polite" className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Base Price:</span>
                <span className="font-semibold">{currentCurrency.symbol}{Math.round(convertedPrice).toLocaleString()}</span>
              </div>
              {addOnsTotal > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Add-Ons:</span>
                  <span className="font-semibold">+{currentCurrency.symbol}{Math.round(addOnsTotal).toLocaleString()}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="font-bold text-primary text-lg">{currentCurrency.symbol}{Math.round(convertedPrice + addOnsTotal).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Details Step */}
        {currentStep === 'details' && (
          <div>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="text-2xl font-bold text-gray-900 mb-6 focus:outline-none">Your Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="Full name"
                />
                {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="Email address"
                />
                {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-label="Phone number"
                />
                {formErrors.phone && <p className="text-red-500 text-sm mt-1">{formErrors.phone}</p>}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-1">
                  Company / Business Name
                </label>
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  aria-label="Company name"
                />
              </div>

              <div>
                <label htmlFor="details" className="block text-sm font-semibold text-gray-700 mb-1">
                  Additional Details / Requirements
                </label>
                <textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us more about your project..."
                  aria-label="Additional details"
                />
              </div>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {currentStep === 'payment' && (
          <div>
            <h2 ref={stepHeadingRef} tabIndex={-1} className="text-2xl font-bold text-gray-900 mb-6 focus:outline-none">Order Summary & Payment</h2>
            
            {/* Order Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Details</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">{serviceName}</span>
                  <span className="font-semibold">{currentCurrency.symbol}{Math.round(convertedPrice).toLocaleString()}</span>
                </div>
                {selectedAddOns.size > 0 && (
                  <div className="ml-4 space-y-1">
                    {Array.from(selectedAddOns).map(key => {
                      const addon = availableAddOns.find(a => a._key === key)
                      const convertedAddonPrice = convertPrice(addon?.price || 0, currentCurrency.code)
                      return (
                        <div key={key} className="flex justify-between text-sm text-gray-600">
                          <span>+ {addon?.name}</span>
                          <span>+{currentCurrency.symbol}{Math.round(convertedAddonPrice).toLocaleString()}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-gray-900">Total Amount:</span>
                <span className="font-bold text-primary text-lg">{currentCurrency.symbol}{Math.round(totalPrice).toLocaleString()}</span>
              </div>
            </div>

            {/* Customer Info Review */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
              <p className="text-sm text-gray-700 mb-2"><strong>Contact:</strong> {formData.name} ({formData.email})</p>
              {formData.company && <p className="text-sm text-gray-700 mb-2"><strong>Company:</strong> {formData.company}</p>}
              <p className="text-sm text-gray-700"><strong>Phone:</strong> {formData.phone}</p>
            </div>

            <p className="text-xs text-gray-600 mb-6">
              By clicking &quot;Complete Payment&quot; you agree to our Terms of Service and will be redirected to secure payment.
            </p>

            {formErrors.submit && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
                <p className="text-red-700 text-sm">{formErrors.submit}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep !== 'review' && (
            <button
              onClick={handleBack}
              className="flex-1 min-h-[44px] border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-400 active:scale-95 transition-all"
            >
              Back
            </button>
          )}
          <button
            onClick={currentStep === 'payment' ? handleSubmit : handleContinue}
            disabled={isProcessing}
            className={`flex-1 min-h-[44px] text-white py-3 px-6 rounded-xl font-semibold active:scale-95 transition-all ${
              currentStep === 'payment'
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-green-300 disabled:to-green-400'
                : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : currentStep === 'payment' ? 'Complete Payment' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
