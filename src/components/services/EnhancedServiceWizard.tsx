'use client'

import { useState } from 'react'
import { useCurrency } from '@/contexts/CurrencyContext'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

type WizardStep = 'service-type' | 'requirements' | 'usage' | 'integrations' | 'recommendations' | 'quotation'

interface ServiceType {
  id: string
  name: string
  icon: string
  description: string
  basePrice: number
}

interface Requirement {
  id: string
  label: string
  category: 'essential' | 'optional'
}

interface UsageLevel {
  id: string
  name: string
  description: string
  multiplier: number
}

interface Integration {
  id: string
  name: string
  description: string
  price: number
}

interface Recommendation {
  id: string
  name: string
  description: string
  totalPrice: number
  timeline: string
  features: string[]
  recommended?: boolean
}

const serviceTypes: ServiceType[] = [
  { id: 'web', name: 'Website Development', icon: '🌐', description: 'Professional websites and web applications', basePrice: 500 },
  { id: 'mobile', name: 'Mobile App', icon: '📱', description: 'Native and cross-platform mobile applications', basePrice: 1000 },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒', description: 'Online stores with payment processing', basePrice: 800 },
  { id: 'marketing', name: 'Digital Marketing', icon: '📢', description: 'SEO, social media, and online advertising', basePrice: 300 },
  { id: 'branding', name: 'Branding & Design', icon: '🎨', description: 'Logo, brand identity, and visual design', basePrice: 200 },
  { id: 'consulting', name: 'Business Consulting', icon: '💼', description: 'Strategy and business planning', basePrice: 150 }
]

const requirements: Record<string, Requirement[]> = {
  web: [
    { id: 'responsive', label: 'Responsive Design', category: 'essential' },
    { id: 'cms', label: 'Content Management System', category: 'optional' },
    { id: 'seo', label: 'SEO Optimization', category: 'optional' },
    { id: 'analytics', label: 'Analytics Integration', category: 'optional' },
    { id: 'forms', label: 'Advanced Forms', category: 'optional' }
  ],
  mobile: [
    { id: 'ios', label: 'iOS Platform', category: 'essential' },
    { id: 'android', label: 'Android Platform', category: 'essential' },
    { id: 'offline', label: 'Offline Functionality', category: 'optional' },
    { id: 'push', label: 'Push Notifications', category: 'optional' },
    { id: 'auth', label: 'User Authentication', category: 'optional' }
  ],
  ecommerce: [
    { id: 'products', label: 'Product Catalog', category: 'essential' },
    { id: 'cart', label: 'Shopping Cart', category: 'essential' },
    { id: 'payment', label: 'Payment Gateway', category: 'essential' },
    { id: 'shipping', label: 'Shipping Integration', category: 'optional' },
    { id: 'inventory', label: 'Inventory Management', category: 'optional' }
  ],
  complete: [
    { id: 'web-platform', label: 'Website/Web App', category: 'essential' },
    { id: 'mobile-ios', label: 'iOS Mobile App', category: 'essential' },
    { id: 'mobile-android', label: 'Android Mobile App', category: 'essential' },
    { id: 'marketing', label: 'Digital Marketing Package', category: 'optional' },
    { id: 'branding', label: 'Branding & Logo Design', category: 'optional' },
    { id: 'seo', label: 'SEO Optimization', category: 'optional' },
    { id: 'analytics', label: 'Comprehensive Analytics', category: 'optional' },
    { id: 'maintenance', label: 'Ongoing Maintenance & Support', category: 'optional' }
  ]
}

const usageLevels: UsageLevel[] = [
  { id: 'small', name: 'Small Scale', description: 'Up to 1,000 users/month', multiplier: 1 },
  { id: 'medium', name: 'Medium Scale', description: 'Up to 10,000 users/month', multiplier: 1.5 },
  { id: 'large', name: 'Large Scale', description: 'Up to 100,000 users/month', multiplier: 2 },
  { id: 'enterprise', name: 'Enterprise', description: '100,000+ users/month', multiplier: 3 }
]

const integrations: Integration[] = [
  { id: 'crm', name: 'CRM Integration', description: 'Salesforce, HubSpot, etc.', price: 200 },
  { id: 'payment', name: 'Payment Processors', description: 'Stripe, PayPal, etc.', price: 150 },
  { id: 'email', name: 'Email Marketing', description: 'Mailchimp, SendGrid, etc.', price: 100 },
  { id: 'analytics', name: 'Analytics Tools', description: 'Google Analytics, Mixpanel, etc.', price: 100 },
  { id: 'social', name: 'Social Media', description: 'Facebook, Twitter, Instagram APIs', price: 150 }
]

interface EnhancedServiceWizardProps {
  onClose?: () => void
  onComplete?: (data: object) => void
  initialServiceType?: string // Pre-configure for specific service type
  quoteType?: 'web' | 'mobile' | 'complete' | 'general' // Specify quote flow type
}

export default function EnhancedServiceWizard({ onClose, onComplete, initialServiceType, quoteType = 'general' }: EnhancedServiceWizardProps) {
  // For complete solution, use 'complete' as the service type
  const effectiveServiceType = quoteType === 'complete' ? 'complete' : initialServiceType
  const [currentStep, setCurrentStep] = useState<WizardStep>(effectiveServiceType ? 'requirements' : 'service-type')
  const [selectedService, setSelectedService] = useState<string>(effectiveServiceType || '')
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([])
  const [selectedUsage, setSelectedUsage] = useState<string>('')
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([])
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('')
  const { formatPrice } = useCurrency()

  // Adjust steps based on whether service type is pre-selected
  const allSteps: { id: WizardStep; title: string; number: number }[] = [
    { id: 'service-type', title: 'Service Type', number: 1 },
    { id: 'requirements', title: 'Requirements', number: 2 },
    { id: 'usage', title: 'Usage Scale', number: 3 },
    { id: 'integrations', title: 'Integrations', number: 4 },
    { id: 'recommendations', title: 'Recommendations', number: 5 },
    { id: 'quotation', title: 'Quotation', number: 6 }
  ]

  // Skip service-type step if effectiveServiceType is provided
  const steps = effectiveServiceType 
    ? allSteps.filter(s => s.id !== 'service-type').map((s, i) => ({ ...s, number: i + 1 }))
    : allSteps

  const currentStepIndex = steps.findIndex(s => s.id === currentStep)

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id)
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id)
    }
  }

  const toggleRequirement = (reqId: string) => {
    setSelectedRequirements(prev =>
      prev.includes(reqId) ? prev.filter(id => id !== reqId) : [...prev, reqId]
    )
  }

  const toggleIntegration = (integrationId: string) => {
    setSelectedIntegrations(prev =>
      prev.includes(integrationId) ? prev.filter(id => id !== integrationId) : [...prev, integrationId]
    )
  }

  const calculateEstimate = (): number => {
    const usage = usageLevels.find(u => u.id === selectedUsage)
    
    if (!usage) return 0

    // Special handling for complete solution
    if (selectedService === 'complete') {
      // Base price for complete solution (web + mobile bundle)
      let total = 2500 * usage.multiplier
      
      // Add cost for optional requirements
      const optionalReqs = selectedRequirements.filter(reqId => {
        const req = requirements['complete']?.find(r => r.id === reqId)
        return req?.category === 'optional'
      })
      total += optionalReqs.length * 200
      
      // Add integrations
      selectedIntegrations.forEach(intId => {
        const integration = integrations.find(i => i.id === intId)
        if (integration) total += integration.price
      })
      
      return total
    }

    const service = serviceTypes.find(s => s.id === selectedService)
    if (!service) return 0

    let total = service.basePrice * usage.multiplier
    
    selectedIntegrations.forEach(intId => {
      const integration = integrations.find(i => i.id === intId)
      if (integration) total += integration.price
    })

    // Add cost for optional requirements
    const optionalReqs = selectedRequirements.filter(reqId => {
      const req = requirements[selectedService]?.find(r => r.id === reqId)
      return req?.category === 'optional'
    })
    total += optionalReqs.length * 100

    return total
  }

  const generateRecommendations = (): Recommendation[] => {
    const estimate = calculateEstimate()
    const service = serviceTypes.find(s => s.id === selectedService)
    
    if (!service) return []

    return [
      {
        id: 'standard',
        name: 'Standard Package',
        description: 'Best for most projects',
        totalPrice: estimate,
        timeline: '2-4 weeks',
        features: selectedRequirements.map(id => 
          requirements[selectedService]?.find(r => r.id === id)?.label || ''
        ).filter(Boolean),
        recommended: true
      },
      {
        id: 'premium',
        name: 'Premium Package',
        description: 'Enhanced with extra features',
        totalPrice: estimate * 1.5,
        timeline: '4-6 weeks',
        features: [
          ...selectedRequirements.map(id => 
            requirements[selectedService]?.find(r => r.id === id)?.label || ''
          ).filter(Boolean),
          'Priority Support',
          'Advanced Features',
          'Extended Warranty'
        ]
      }
    ]
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'service-type': return selectedService !== ''
      case 'requirements': return selectedRequirements.length > 0
      case 'usage': return selectedUsage !== ''
      case 'integrations': return true // Optional step
      case 'recommendations': return selectedRecommendation !== ''
      default: return true
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {quoteType === 'web' ? 'Get Web Development Quote' :
             quoteType === 'mobile' ? 'Get Mobile App Quote' :
             quoteType === 'complete' ? 'Get Complete Solution Quote' :
             'Service Configuration Wizard'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center ${index < currentStepIndex ? 'text-green-600' : index === currentStepIndex ? 'text-primary' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index < currentStepIndex ? 'bg-green-600 border-green-600' :
                    index === currentStepIndex ? 'bg-primary border-primary' :
                    'bg-white border-gray-300'
                  }`}>
                    {index < currentStepIndex ? (
                      <CheckIcon className="h-5 w-5 text-white" />
                    ) : (
                      <span className={index === currentStepIndex ? 'text-white font-semibold' : 'text-gray-500'}>
                        {step.number}
                      </span>
                    )}
                  </div>
                  <span className="ml-2 hidden sm:inline text-sm font-medium">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 ${index < currentStepIndex ? 'bg-green-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Service Type Selection */}
          {currentStep === 'service-type' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Select Your Service Type</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceTypes.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedService === service.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{service.icon}</div>
                    <h4 className="font-bold text-gray-900 mb-2">{service.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                    <p className="text-sm font-semibold text-primary">
                      From {formatPrice(service.basePrice)}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {currentStep === 'requirements' && selectedService && (
            <div>
              <h3 className="text-xl font-bold mb-4">
                {quoteType === 'web' ? 'Web Development Requirements' :
                 quoteType === 'mobile' ? 'Mobile App Requirements' :
                 quoteType === 'complete' ? 'Project Requirements' :
                 'Select Your Requirements'}
              </h3>
              <div className="space-y-3">
                {requirements[selectedService]?.map(req => (
                  <label
                    key={req.id}
                    className="flex items-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRequirements.includes(req.id)}
                      onChange={() => toggleRequirement(req.id)}
                      className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-3 flex-1 font-medium text-gray-900">{req.label}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      req.category === 'essential' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {req.category}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Usage Scale */}
          {currentStep === 'usage' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Expected Usage Scale</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {usageLevels.map(level => (
                  <button
                    key={level.id}
                    onClick={() => setSelectedUsage(level.id)}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      selectedUsage === level.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <h4 className="font-bold text-gray-900 mb-2">{level.name}</h4>
                    <p className="text-sm text-gray-600">{level.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Integrations */}
          {currentStep === 'integrations' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Additional Integrations</h3>
              <p className="text-gray-600 mb-6">Select any third-party services you need to integrate (optional)</p>
              <div className="space-y-3">
                {integrations.map(integration => (
                  <label
                    key={integration.id}
                    className="flex items-start p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedIntegrations.includes(integration.id)}
                      onChange={() => toggleIntegration(integration.id)}
                      className="h-5 w-5 mt-0.5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <div className="ml-3 flex-1">
                      <div className="font-medium text-gray-900">{integration.name}</div>
                      <div className="text-sm text-gray-600">{integration.description}</div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      +{formatPrice(integration.price)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {currentStep === 'recommendations' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Recommended Packages</h3>
              <p className="text-gray-600 mb-6">Select the package that best fits your needs:</p>
              <div className="space-y-4">
                {generateRecommendations().map(rec => (
                  <div
                    key={rec.id}
                    onClick={() => setSelectedRecommendation(rec.id)}
                    className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedRecommendation === rec.id 
                        ? 'border-primary bg-primary/10 ring-2 ring-primary' 
                        : rec.recommended 
                          ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {rec.recommended && (
                          <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-2">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedRecommendation === rec.id 
                          ? 'border-primary bg-primary' 
                          : 'border-gray-300'
                      }`}>
                        {selectedRecommendation === rec.id && (
                          <CheckIcon className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{rec.name}</h4>
                    <p className="text-gray-600 mb-4">{rec.description}</p>
                    <div className="flex items-baseline gap-4 mb-4">
                      <div className="text-3xl font-bold text-gray-900">
                        <PriceDisplay price={rec.totalPrice} size="lg" />
                      </div>
                      <div className="text-sm text-gray-600">
                        Timeline: {rec.timeline}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-900">Includes:</p>
                      <ul className="space-y-1">
                        {rec.features.map((feature, idx) => (
                          <li key={idx} className="text-sm text-gray-600 flex items-center">
                            <CheckIcon className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Quotation */}
          {currentStep === 'quotation' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Your Custom Quotation</h3>
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8">
                {/* Selected Package Info */}
                {selectedRecommendation && (
                  <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-2">Selected Package:</p>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                      {generateRecommendations().find(r => r.id === selectedRecommendation)?.name}
                    </h4>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <p className="text-gray-600 mb-2">Estimated Project Cost</p>
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    <PriceDisplay price={
                      generateRecommendations().find(r => r.id === selectedRecommendation)?.totalPrice || calculateEstimate()
                    } size="lg" />
                  </div>
                  <p className="text-sm text-gray-500">
                    Timeline: {generateRecommendations().find(r => r.id === selectedRecommendation)?.timeline || 'TBD'}
                  </p>
                </div>

                {/* What happens next */}
                <div className="bg-white rounded-lg p-4 mb-6 text-left">
                  <p className="font-semibold text-gray-900 mb-2">What happens next?</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Fill out a quick contact form with your details</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Our team will review your requirements within 24 hours</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Schedule a free consultation call to discuss your project</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Receive a detailed proposal with payment options</span>
                    </li>
                  </ul>
                </div>
                
                <button
                  onClick={() => {
                    const allRecommendations = generateRecommendations()
                    const selectedPackage = allRecommendations.find(r => r.id === selectedRecommendation)
                    onComplete?.({
                      service: selectedService,
                      requirements: selectedRequirements,
                      usage: selectedUsage,
                      integrations: selectedIntegrations,
                      selectedRecommendation: selectedPackage,
                      recommendations: allRecommendations,
                      estimate: selectedPackage?.totalPrice || calculateEstimate()
                    })
                  }}
                  className="w-full bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary/90 transition-colors font-semibold text-lg"
                >
                  Continue to Payment →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={!canProceed() || currentStepIndex === steps.length - 1}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStepIndex === steps.length - 2 ? 'View Quotation' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
