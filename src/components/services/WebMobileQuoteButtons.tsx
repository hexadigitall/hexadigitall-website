'use client'

import { useState, ReactNode } from 'react'
import EnhancedServiceWizard from './EnhancedServiceWizard'
import ConditionalContactForm from './ConditionalContactForm'
import SuccessModal from './SuccessModal'

interface WebMobileQuoteButtonsProps {
  children: (props: {
    onWebQuoteClick: () => void
    onMobileQuoteClick: () => void
    onCompleteQuoteClick: () => void
  }) => ReactNode
}

export default function WebMobileQuoteButtons({ children }: WebMobileQuoteButtonsProps) {
  const [showWizard, setShowWizard] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [wizardConfig, setWizardConfig] = useState<{ 
    serviceType?: string
    quoteType?: 'web' | 'mobile' | 'complete' | 'general' 
  }>({})
  const [quoteData, setQuoteData] = useState<any>(null)

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

  const handleWizardComplete = (data: any) => {
    console.log('Wizard completed:', data)
    setQuoteData(data)
    setShowWizard(false)
    setShowContactForm(true)
  }

  const handleContactFormSubmit = () => {
    setShowContactForm(false)
    setShowSuccess(true)
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

      {/* Contact Form Modal */}
      {showContactForm && (
        <ConditionalContactForm
          isOpen={showContactForm}
          onClose={() => setShowContactForm(false)}
          formType="quote"
          prefilledData={{
            projectType: wizardConfig.quoteType === 'web' ? 'Web Development' : 
                        wizardConfig.quoteType === 'mobile' ? 'Mobile App' : 
                        'Complete Solution',
            budget: quoteData?.estimate ? `$${quoteData.estimate}` : undefined,
            message: `Quote request for ${wizardConfig.quoteType} service.\n\nRequirements: ${quoteData?.requirements?.join(', ') || 'N/A'}\nUsage Scale: ${quoteData?.usage || 'N/A'}\nIntegrations: ${quoteData?.integrations?.join(', ') || 'N/A'}`
          }}
          onSubmit={handleContactFormSubmit}
        />
      )}

      {/* Success Modal */}
      {showSuccess && (
        <SuccessModal
          isOpen={showSuccess}
          onClose={() => {
            setShowSuccess(false)
            setQuoteData(null)
            setWizardConfig({})
          }}
          type="quote"
          orderNumber={`Q-${Date.now().toString().slice(-6)}`}
        />
      )}
    </>
  )
}
