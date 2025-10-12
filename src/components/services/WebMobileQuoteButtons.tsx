'use client'

import { useState, ReactNode } from 'react'
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

interface WebMobileQuoteButtonsProps {
  children: (props: {
    onWebQuoteClick: () => void
    onMobileQuoteClick: () => void
    onCompleteQuoteClick: () => void
  }) => ReactNode
}

export default function WebMobileQuoteButtons({ children }: WebMobileQuoteButtonsProps) {
  const [showWizard, setShowWizard] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [wizardConfig, setWizardConfig] = useState<{ 
    serviceType?: string
    quoteType?: 'web' | 'mobile' | 'complete' | 'general' 
  }>({})
  const [recommendedPackages, setRecommendedPackages] = useState<ServicePackage[]>([])

  const handleWebQuoteClick = () => {
    setWizardConfig({ serviceType: 'web', quoteType: 'web' })
    setShowWizard(true)
  }

  const handleMobileQuoteClick = () => {
    setWizardConfig({ serviceType: 'mobile', quoteType: 'mobile' })
    setShowWizard(true)
  }

  const handleCompleteQuoteClick = () => {
    setWizardConfig({ quoteType: 'complete' })
    setShowWizard(true)
  }

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
      {children({
        onWebQuoteClick: handleWebQuoteClick,
        onMobileQuoteClick: handleMobileQuoteClick,
        onCompleteQuoteClick: handleCompleteQuoteClick,
      })}

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
