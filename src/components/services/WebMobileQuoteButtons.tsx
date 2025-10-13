'use client'

import { useState, useEffect } from 'react'
import EnhancedServiceWizard from './EnhancedServiceWizard'
import ServicePaymentModal from './ServicePaymentModal'
import SuccessModal from './SuccessModal'

interface ServicePackage {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
  deliveryTime: string
}

interface WizardRecommendation {
  id: string
  name: string
  totalPrice: number
  description: string
  features?: string[]
  popular?: boolean
  timeline?: string
}

interface WizardCompletionData {
  selectedRecommendation?: WizardRecommendation
  recommendations?: WizardRecommendation[]
  requirements?: string[]
  usage?: string
  integrations?: string[]
  estimate?: number
}

export default function WebMobileQuoteButtons() {
  const [showWizard, setShowWizard] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [wizardConfig, setWizardConfig] = useState<{ 
    serviceType?: string
    quoteType?: 'web' | 'mobile' | 'complete' | 'general' 
  }>({})
  const [recommendedPackages, setRecommendedPackages] = useState<ServicePackage[]>([])

  // Listen for custom events from buttons
  useEffect(() => {
    const handleWebQuote = () => {
      setWizardConfig({ serviceType: 'web', quoteType: 'web' })
      setShowWizard(true)
    }

    const handleMobileQuote = () => {
      setWizardConfig({ serviceType: 'mobile', quoteType: 'mobile' })
      setShowWizard(true)
    }

    const handleCompleteQuote = () => {
      setWizardConfig({ quoteType: 'complete' })
      setShowWizard(true)
    }

    const handleDirectPayment = (event: Event) => {
      const customEvent = event as CustomEvent
      const { packageName, packagePrice, packageFeatures, serviceTitle, deliveryTime } = customEvent.detail
      
      // Create package for payment modal
      const directPackage: ServicePackage = {
        id: packageName.toLowerCase().replace(/\s+/g, '-'),
        name: packageName,
        price: packagePrice,
        description: serviceTitle,
        features: packageFeatures,
        deliveryTime: deliveryTime || '2-4 weeks'
      }
      
      setRecommendedPackages([directPackage])
      setShowPaymentModal(true)
    }

    // Add event listeners
    window.addEventListener('openWebQuote', handleWebQuote)
    window.addEventListener('openMobileQuote', handleMobileQuote)
    window.addEventListener('openCompleteQuote', handleCompleteQuote)
    window.addEventListener('openDirectPayment', handleDirectPayment as EventListener)

    return () => {
      window.removeEventListener('openWebQuote', handleWebQuote)
      window.removeEventListener('openMobileQuote', handleMobileQuote)
      window.removeEventListener('openCompleteQuote', handleCompleteQuote)
      window.removeEventListener('openDirectPayment', handleDirectPayment as EventListener)
    }
  }, [])

  const handleWizardComplete = (data: WizardCompletionData) => {
    console.log('Wizard completed:', data)
    
    // Extract recommended packages from wizard data
    const packages: ServicePackage[] = []
    
    if (data.selectedRecommendation) {
      // Use the selected recommendation from wizard
      packages.push({
        id: data.selectedRecommendation.id,
        name: data.selectedRecommendation.name,
        price: data.selectedRecommendation.totalPrice,
        description: data.selectedRecommendation.description,
        features: data.selectedRecommendation.features || [],
        popular: data.selectedRecommendation.popular,
        deliveryTime: data.selectedRecommendation.timeline || '2-4 weeks'
      })
    }
    
    // Add other recommendations if available
    if (data.recommendations && Array.isArray(data.recommendations)) {
      data.recommendations.forEach((rec: WizardRecommendation) => {
        if (rec.id !== data.selectedRecommendation?.id) {
          packages.push({
            id: rec.id,
            name: rec.name,
            price: rec.totalPrice,
            description: rec.description,
            features: rec.features || [],
            popular: rec.popular,
            deliveryTime: rec.timeline || '2-4 weeks'
          })
        }
      })
    }
    
    setRecommendedPackages(packages)
    setShowWizard(false)
    setShowPaymentModal(true)
  }

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false)
    // Optionally show success modal or redirect handled by payment modal
    setShowSuccess(true)
  }

  const getServiceTitle = () => {
    if (wizardConfig.quoteType === 'web') return 'Web Development Service'
    if (wizardConfig.quoteType === 'mobile') return 'Mobile App Development Service'
    if (wizardConfig.quoteType === 'complete') return 'Complete Solution Package'
    return 'Software Development Service'
  }

  const getServiceSlug = () => {
    if (wizardConfig.quoteType === 'web') return 'web-development'
    if (wizardConfig.quoteType === 'mobile') return 'mobile-app-development'
    if (wizardConfig.quoteType === 'complete') return 'complete-solution'
    return 'web-and-mobile-software-development'
  }

  return (
    <>
      {/* This component only renders modals, not the buttons themselves */}
      {/* The buttons in the page trigger these via custom window events */}
      
      {/* Enhanced Service Wizard Modal */}
      {showWizard && (
        <EnhancedServiceWizard
          onClose={() => {
            setShowWizard(false)
            setWizardConfig({})
          }}
          onComplete={handleWizardComplete}
          initialServiceType={wizardConfig.serviceType}
          quoteType={wizardConfig.quoteType}
        />
      )}

      {/* Payment Modal - Shows packages and handles payment */}
      {showPaymentModal && recommendedPackages.length > 0 && (
        <ServicePaymentModal
          isOpen={showPaymentModal}
          onClose={handlePaymentModalClose}
          serviceTitle={getServiceTitle()}
          serviceSlug={getServiceSlug()}
          packages={recommendedPackages}
        />
      )}

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false)
            setWizardConfig({})
            setRecommendedPackages([])
          }}
          type="payment"
          orderNumber={`ORD-${Date.now().toString().slice(-6)}`}
        />
      )}
    </>
  )
}
