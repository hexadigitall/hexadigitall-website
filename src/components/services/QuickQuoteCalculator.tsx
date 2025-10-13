'use client'

import { useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { CheckIcon } from '@heroicons/react/24/outline'

interface QuickQuoteOption {
  id: string
  label: string
  basePrice: number
}

const serviceTypes: QuickQuoteOption[] = [
  { id: 'web', label: 'Website Development', basePrice: 500 },
  { id: 'mobile', label: 'Mobile App', basePrice: 1000 },
  { id: 'marketing', label: 'Digital Marketing', basePrice: 300 },
  { id: 'branding', label: 'Branding & Logo', basePrice: 200 },
  { id: 'consulting', label: 'Consulting', basePrice: 150 }
]

const complexityLevels: QuickQuoteOption[] = [
  { id: 'basic', label: 'Basic', basePrice: 1 },
  { id: 'standard', label: 'Standard', basePrice: 2 },
  { id: 'advanced', label: 'Advanced', basePrice: 3 },
  { id: 'enterprise', label: 'Enterprise', basePrice: 5 }
]

const addOns: QuickQuoteOption[] = [
  { id: 'seo', label: 'SEO Optimization', basePrice: 200 },
  { id: 'analytics', label: 'Analytics Setup', basePrice: 150 },
  { id: 'maintenance', label: 'Monthly Maintenance', basePrice: 300 },
  { id: 'support', label: 'Priority Support', basePrice: 250 }
]

interface QuickQuoteCalculatorProps {
  onGetQuote?: (estimate: number, details: object) => void
}

export default function QuickQuoteCalculator({ onGetQuote }: QuickQuoteCalculatorProps) {
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedComplexity, setSelectedComplexity] = useState<string>('')
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([])
  const { formatPrice } = useCurrency()

  const calculateEstimate = () => {
    if (!selectedService || !selectedComplexity) return 0

    const service = serviceTypes.find(s => s.id === selectedService)
    const complexity = complexityLevels.find(c => c.id === selectedComplexity)
    
    if (!service || !complexity) return 0

    let total = service.basePrice * complexity.basePrice
    
    selectedAddOns.forEach(addonId => {
      const addon = addOns.find(a => a.id === addonId)
      if (addon) total += addon.basePrice
    })

    return total
  }

  const toggleAddOn = (addonId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    )
  }

  const estimate = calculateEstimate()
  const isValid = selectedService && selectedComplexity

  const handleGetQuote = () => {
    if (onGetQuote && isValid) {
      onGetQuote(estimate, {
        service: selectedService,
        complexity: selectedComplexity,
        addOns: selectedAddOns
      })
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Quote Calculator</h3>
        <p className="text-gray-600">Get an instant estimate for your project</p>
      </div>

      {/* Service Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Service Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {serviceTypes.map((service) => (
            <button
              key={service.id}
              onClick={() => setSelectedService(service.id)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedService === service.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{service.label}</span>
                {selectedService === service.id && (
                  <CheckIcon className="h-5 w-5 text-primary" />
                )}
              </div>
              <span className="text-sm text-gray-500">
                Starting from {formatPrice(service.basePrice)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Complexity Level */}
      {selectedService && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Project Complexity
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {complexityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedComplexity(level.id)}
                className={`p-3 rounded-lg border-2 transition-all text-center ${
                  selectedComplexity === level.id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-primary/50'
                }`}
              >
                <div className="font-medium text-gray-900">{level.label}</div>
                {selectedComplexity === level.id && (
                  <CheckIcon className="h-4 w-4 text-primary mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add-ons */}
      {selectedComplexity && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Additional Services (Optional)
          </label>
          <div className="space-y-2">
            {addOns.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedAddOns.includes(addon.id)}
                  onChange={() => toggleAddOn(addon.id)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="ml-3 flex-1 text-gray-900">{addon.label}</span>
                <span className="text-sm text-gray-600">
                  +{formatPrice(addon.basePrice)}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Estimate Display */}
      {isValid && (
        <div className="border-t pt-6">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Estimated Project Cost</p>
            <div className="text-4xl font-bold text-gray-900 mb-4">
              <PriceDisplay price={estimate} size="lg" />
            </div>
            <button
              onClick={handleGetQuote}
              className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Get Detailed Quote
            </button>
            <p className="text-xs text-gray-500 mt-3">
              * This is an estimate. Final pricing may vary based on specific requirements.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
