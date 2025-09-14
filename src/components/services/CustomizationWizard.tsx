"use client"

import { useState } from 'react'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { useCurrency } from '@/contexts/CurrencyContext'
import Link from 'next/link'

interface WebFeature {
  id: string
  name: string
  description: string
  basePrice: number
  icon: string
}

interface MobileFeature {
  id: string
  name: string
  description: string
  basePrice: number
  icon: string
}

interface IntegrationOption {
  id: string
  name: string
  description: string
  additionalCost: number
  icon: string
}

interface PackageRecommendation {
  id: string
  name: string
  description: string
  totalPrice: number
  savings: number
  timeline: string
  features: string[]
  webFeatures: string[]
  mobileFeatures: string[]
  integrationFeatures: string[]
  popular?: boolean
}

const WEB_FEATURES: WebFeature[] = [
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Single-page website perfect for showcasing your business',
    basePrice: 149,
    icon: '🌟'
  },
  {
    id: 'business-site',
    name: 'Multi-page Website',
    description: 'Professional website with multiple pages and content management',
    basePrice: 349,
    icon: '🏢'
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Store',
    description: 'Online store with payment processing and inventory management',
    basePrice: 649,
    icon: '🛒'
  },
  {
    id: 'web-app',
    name: 'Web Application',
    description: 'Complex web application with custom functionality',
    basePrice: 999,
    icon: '⚡'
  }
]

const MOBILE_FEATURES: MobileFeature[] = [
  {
    id: 'simple-app',
    name: 'Simple Mobile App',
    description: 'Basic mobile app for iOS or Android with core features',
    basePrice: 299,
    icon: '📱'
  },
  {
    id: 'business-app',
    name: 'Business App',
    description: 'Professional cross-platform app with advanced features',
    basePrice: 699,
    icon: '💼'
  },
  {
    id: 'ecommerce-app',
    name: 'E-commerce Mobile App',
    description: 'Mobile shopping app with payment integration',
    basePrice: 899,
    icon: '📲'
  },
  {
    id: 'enterprise-app',
    name: 'Enterprise App',
    description: 'Complex mobile solution with custom integrations',
    basePrice: 1299,
    icon: '🏛️'
  }
]

const INTEGRATION_OPTIONS: IntegrationOption[] = [
  {
    id: 'basic',
    name: 'Basic Integration',
    description: 'Shared branding and design consistency',
    additionalCost: 0,
    icon: '🔗'
  },
  {
    id: 'unified',
    name: 'Unified User Accounts',
    description: 'Single login system across web and mobile',
    additionalCost: 299,
    icon: '👤'
  },
  {
    id: 'synchronized',
    name: 'Data Synchronization',
    description: 'Real-time data sync between platforms',
    additionalCost: 499,
    icon: '🔄'
  },
  {
    id: 'advanced',
    name: 'Advanced Integration',
    description: 'Full ecosystem with cross-platform features',
    additionalCost: 799,
    icon: '🚀'
  }
]

type WizardStep = 'web' | 'mobile' | 'integration' | 'recommendations'

export default function CustomizationWizard() {
  const [currentStep, setCurrentStep] = useState<WizardStep>('web')
  const [selectedWebFeatures, setSelectedWebFeatures] = useState<string[]>([])
  const [selectedMobileFeatures, setSelectedMobileFeatures] = useState<string[]>([])
  const [selectedIntegration, setSelectedIntegration] = useState<string>('basic')
  const { isLocalCurrency } = useCurrency()

  const toggleWebFeature = (featureId: string) => {
    setSelectedWebFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const toggleMobileFeature = (featureId: string) => {
    setSelectedMobileFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    )
  }

  const generateRecommendations = (): PackageRecommendation[] => {
    const webTotal = selectedWebFeatures.reduce((sum, featureId) => {
      const feature = WEB_FEATURES.find(f => f.id === featureId)
      return sum + (feature?.basePrice || 0)
    }, 0)

    const mobileTotal = selectedMobileFeatures.reduce((sum, featureId) => {
      const feature = MOBILE_FEATURES.find(f => f.id === featureId)
      return sum + (feature?.basePrice || 0)
    }, 0)

    const integrationCost = INTEGRATION_OPTIONS.find(i => i.id === selectedIntegration)?.additionalCost || 0
    const subtotal = webTotal + mobileTotal + integrationCost

    const recommendations: PackageRecommendation[] = [
      {
        id: 'standard',
        name: 'Standard Bundle',
        description: 'Perfect balance of features and value',
        totalPrice: subtotal,
        savings: Math.round(subtotal * 0.15),
        timeline: '3-4 weeks',
        features: [...selectedWebFeatures, ...selectedMobileFeatures],
        webFeatures: selectedWebFeatures.map(id => WEB_FEATURES.find(f => f.id === id)?.name || ''),
        mobileFeatures: selectedMobileFeatures.map(id => MOBILE_FEATURES.find(f => f.id === id)?.name || ''),
        integrationFeatures: [INTEGRATION_OPTIONS.find(i => i.id === selectedIntegration)?.name || ''],
        popular: true
      }
    ]

    // Add premium option with additional features
    if (subtotal > 500) {
      recommendations.push({
        id: 'premium',
        name: 'Premium Bundle',
        description: 'Enhanced with premium features and priority support',
        totalPrice: subtotal + 399,
        savings: Math.round((subtotal + 399) * 0.2),
        timeline: '4-5 weeks',
        features: [...selectedWebFeatures, ...selectedMobileFeatures],
        webFeatures: selectedWebFeatures.map(id => WEB_FEATURES.find(f => f.id === id)?.name || ''),
        mobileFeatures: selectedMobileFeatures.map(id => MOBILE_FEATURES.find(f => f.id === id)?.name || ''),
        integrationFeatures: [
          INTEGRATION_OPTIONS.find(i => i.id === selectedIntegration)?.name || '',
          'Priority Support',
          'Advanced Analytics',
          'Performance Optimization'
        ]
      })
    }

    return recommendations
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 'web': return 'Step 1: Choose Your Web Features'
      case 'mobile': return 'Step 2: Choose Your Mobile Features'
      case 'integration': return 'Step 3: Select Integration Level'
      case 'recommendations': return 'Step 4: Your Custom Recommendations'
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'web': return selectedWebFeatures.length > 0
      case 'mobile': return selectedMobileFeatures.length > 0
      case 'integration': return selectedIntegration !== ''
      default: return true
    }
  }

  const nextStep = () => {
    switch (currentStep) {
      case 'web': setCurrentStep('mobile'); break
      case 'mobile': setCurrentStep('integration'); break
      case 'integration': setCurrentStep('recommendations'); break
    }
  }

  const prevStep = () => {
    switch (currentStep) {
      case 'mobile': setCurrentStep('web'); break
      case 'integration': setCurrentStep('mobile'); break
      case 'recommendations': setCurrentStep('integration'); break
    }
  }

  return (
    <div className="bg-white">
      {/* Progress Bar */}
      <div className="bg-gray-50 border-b px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Custom Solution Builder</h2>
            <div className="flex items-center space-x-2">
              {['web', 'mobile', 'integration', 'recommendations'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step 
                      ? 'bg-primary text-white' 
                      : currentStep === 'recommendations' || (currentStep === 'integration' && index < 2) || (currentStep === 'mobile' && index < 1)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep === step || (currentStep === 'recommendations' && index < 3) || (currentStep === 'integration' && index < 2) || (currentStep === 'mobile' && index < 1) ? '✓' : index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 ${
                      (currentStep === 'recommendations' && index < 3) || (currentStep === 'integration' && index < 2) || (currentStep === 'mobile' && index < 1)
                        ? 'bg-green-500' 
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">{getStepTitle()}</h3>
          {currentStep === 'web' && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select the web features you need. You can choose multiple options to create your perfect web presence.
            </p>
          )}
          {currentStep === 'mobile' && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              Now choose your mobile app requirements. Pick the features that match your business needs.
            </p>
          )}
          {currentStep === 'integration' && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              How integrated should your web and mobile solutions be? Choose the level that fits your needs.
            </p>
          )}
          {currentStep === 'recommendations' && (
            <p className="text-gray-600 max-w-2xl mx-auto">
              Based on your selections, here are our recommended packages tailored specifically for your needs.
            </p>
          )}
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 'web' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {WEB_FEATURES.map(feature => (
                <div 
                  key={feature.id}
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                    selectedWebFeatures.includes(feature.id)
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                  onClick={() => toggleWebFeature(feature.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                      <PriceDisplay 
                        price={feature.basePrice} 
                        showDiscount={true}
                        size="sm"
                      />
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedWebFeatures.includes(feature.id)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedWebFeatures.includes(feature.id) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 'mobile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOBILE_FEATURES.map(feature => (
                <div 
                  key={feature.id}
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                    selectedMobileFeatures.includes(feature.id)
                      ? 'border-purple-500 bg-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                  onClick={() => toggleMobileFeature(feature.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{feature.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{feature.description}</p>
                      <PriceDisplay 
                        price={feature.basePrice} 
                        showDiscount={true}
                        size="sm"
                      />
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedMobileFeatures.includes(feature.id)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedMobileFeatures.includes(feature.id) && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 'integration' && (
            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
              {INTEGRATION_OPTIONS.map(option => (
                <div 
                  key={option.id}
                  className={`border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 ${
                    selectedIntegration === option.id
                      ? 'border-green-500 bg-green-50 shadow-lg'
                      : 'border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedIntegration(option.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{option.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-2">{option.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                      {option.additionalCost > 0 ? (
                        <div className="text-sm">
                          <span className="text-green-600 font-medium">+</span>
                          <PriceDisplay 
                            price={option.additionalCost} 
                            showDiscount={true}
                            size="sm"
                          />
                        </div>
                      ) : (
                        <span className="text-green-600 font-medium text-sm">Included at no extra cost</span>
                      )}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedIntegration === option.id
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedIntegration === option.id && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentStep === 'recommendations' && (
            <div className="space-y-6">
              {/* Nigerian Discount Banner */}
              {isLocalCurrency() && (
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl p-6 text-center mb-8">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-2xl">🇳🇬</span>
                    <h3 className="text-xl font-bold">Nigerian Launch Special!</h3>
                    <span className="text-2xl">🔥</span>
                  </div>
                  <p className="text-green-100">
                    You qualify for our <strong>50% Nigerian discount</strong> on all custom packages!
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {generateRecommendations().map(recommendation => (
                  <div 
                    key={recommendation.id}
                    className={`border-2 rounded-3xl p-8 transition-all duration-300 hover:shadow-xl ${
                      recommendation.popular 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'border-gray-200 hover:border-primary/30'
                    }`}
                  >
                    {recommendation.popular && (
                      <div className="text-center mb-6">
                        <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                          ⭐ Recommended
                        </span>
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{recommendation.name}</h3>
                      <p className="text-gray-600 mb-4">{recommendation.description}</p>
                      <div className="space-y-2">
                        <PriceDisplay 
                          price={recommendation.totalPrice} 
                          showDiscount={true}
                          size="lg"
                        />
                        <p className="text-green-600 font-medium text-sm">
                          Save ${recommendation.savings} compared to separate purchases
                        </p>
                        <p className="text-gray-600 text-sm">Timeline: {recommendation.timeline}</p>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Web Features:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {recommendation.webFeatures.map(feature => (
                            <li key={feature} className="flex items-center">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Mobile Features:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {recommendation.mobileFeatures.map(feature => (
                            <li key={feature} className="flex items-center">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Integration & Extras:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {recommendation.integrationFeatures.map(feature => (
                            <li key={feature} className="flex items-center">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Link
                      href={`/contact?package=${recommendation.name.toLowerCase().replace(' ', '-')}&price=${recommendation.totalPrice}`}
                      className={`w-full inline-flex items-center justify-center px-8 py-4 font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                        recommendation.popular
                          ? 'bg-primary hover:bg-primary/90 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      Get {recommendation.name}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 'web'}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 'web'
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            ← Previous
          </button>

          {currentStep !== 'recommendations' && (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`px-8 py-3 rounded-lg font-bold transition-all ${
                canProceed()
                  ? 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === 'integration' ? 'View Recommendations' : 'Next Step'} →
            </button>
          )}

          {currentStep === 'recommendations' && (
            <Link
              href="/contact"
              className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Need Help Deciding? Contact Us
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}