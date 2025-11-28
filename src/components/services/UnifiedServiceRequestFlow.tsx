'use client'

import React, { useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import type { ServicePackageTier, ServiceAddOn, ServiceRequestItem } from '@/types/service'

type ServiceType = 'tiered' | 'individual' | 'customizable'
type FlowStep = 'review' | 'details' | 'addons' | 'payment'

interface UnifiedServiceRequestFlowProps {
  serviceId: string
  serviceName: string
  serviceType: ServiceType
  tier?: ServicePackageTier // for tiered services
  basePrice: number
  currency?: string // optional, uses context
  availableAddOns?: ServiceAddOn[]
  onClose: () => void
  onSuccess?: (item: ServiceRequestItem) => void
}

export default function UnifiedServiceRequestFlow({
  serviceId,
  serviceName,
  serviceType,
  tier,
  basePrice,
  availableAddOns = [],
  onClose,
  onSuccess
}: UnifiedServiceRequestFlowProps) {
  const { currentCurrency, convertPrice } = useCurrency()
  const [currentStep, setCurrentStep] = useState<FlowStep>('review')
  const [selectedAddOns, setSelectedAddOns] = useState<Set<string>>(new Set())
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    details: ''
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const convertedPrice = convertPrice(basePrice, currentCurrency.code)
  const addOnsTotal = Array.from(selectedAddOns).reduce((sum, key) => {
    const addon = availableAddOns.find(a => a._key === key)
    return sum + (addon ? convertPrice(addon.price, currentCurrency.code) : 0)
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
  }

  const handleBack = () => {
    if (currentStep === 'details') {
      if (serviceType !== 'tiered' && availableAddOns.length > 0) {
        setCurrentStep('addons')
      } else {
        setCurrentStep('review')
      }
    } else if (currentStep === 'addons') {
      setCurrentStep('review')
    }
  }

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

    if (onSuccess) {
      onSuccess(item)
    }

    // TODO: Redirect to payment or send to backend
    console.log('Service Request Item:', item)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-hidden">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 relative my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Selection</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customize Your Service</h2>
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
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Details</h2>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary & Payment</h2>
            
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
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep !== 'review' && (
            <button
              onClick={handleBack}
              className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:border-gray-400 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={currentStep === 'payment' ? handleSubmit : handleContinue}
            className={`flex-1 text-white py-3 px-6 rounded-xl font-semibold transition-colors ${
              currentStep === 'payment'
                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
            }`}
          >
            {currentStep === 'payment' ? 'Complete Payment' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}
