"use client"

 
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { ServicePackageSelection, PaymentPlan } from './ServicePackageSelection'
import { ServiceRequestForm } from './ServiceRequestForm'
import { PaymentSummary } from './PaymentSummary'
import dynamic from 'next/dynamic'
import { getWhatsAppLink } from '@/lib/whatsapp' // 👈 Import WhatsApp helper

const FunnelOnboarding = dynamic(() => import('@/components/marketing/FunnelOnboarding'), { ssr: false })

export interface ServiceCategory {
  _id: string
  title: string
  slug: { current: string }
  description: string
  icon: string
  featured?: boolean
  packages: Package[]
  requirements?: string[]
  faq?: FAQ[]
  serviceType?: string
}

export interface Package {
  _key: string
  name: string
  tier: 'basic' | 'standard' | 'premium' | 'enterprise'
  price: number
  currency: string
  billing: 'one_time' | 'monthly' | 'hourly' | 'project'
  deliveryTime: string
  features: Array<string | { title?: string; description?: string }>
  addOns?: AddOn[]
  popular?: boolean
}

export interface AddOn {
  _key: string
  name: string
  price: number
  description: string
}

export interface FAQ {
  _key: string
  question: string
  answer: string
}

export interface ClientInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  address: string
}

export interface ProjectDetails {
  title: string
  description: string
  requirements: string
  timeline: string
  budget: string
  attachments?: File[]
  // Service-specific fields
  brandStyle?: string
  industry?: string
  marketingGoals?: string
  targetAudience?: string
  specificRequirements?: string
  notes?: string
}

interface ServiceRequestFlowProps {
  serviceCategory: ServiceCategory
  onClose?: () => void
  initialPackageKey?: string | null
}

export const ServiceRequestFlow: React.FC<ServiceRequestFlowProps> = ({
  serviceCategory,
  onClose,
  initialPackageKey = null
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([])
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<PaymentPlan | null>(null)
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: ''
  })
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>({
    title: '',
    description: '',
    requirements: '',
    timeline: '',
    budget: '',
    notes: ''
  })
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    if (initialPackageKey) {
      const found = serviceCategory.packages.find((p) => p._key === initialPackageKey)
      if (found) setSelectedPackage(found)
    }
    try {
      const raw = sessionStorage.getItem('funnel.arrival')
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed && parsed.ts && typeof parsed.funnel === 'string') {
        const age = Date.now() - parsed.ts
        if (age < 1000 * 60 * 5) {
          setShowOnboarding(true)
        }
      }
      sessionStorage.removeItem('funnel.arrival')
    } catch {
      // ignore
    }
  }, [])

  const steps = [
    { number: 1, title: 'Select Package', description: 'Choose your service package' },
    { number: 2, title: 'Contact Details', description: 'Provide your information' },
    { number: 3, title: 'Payment', description: 'Complete your order' }
  ]

  const handlePackageSelect = (pkg: Package, addOns: AddOn[], paymentPlan: PaymentPlan) => {
    setSelectedPackage(pkg)
    setSelectedAddOns(addOns)
    setSelectedPaymentPlan(paymentPlan)
    setProjectDetails(prev => ({ 
      ...prev, 
      title: `${pkg.name} - ${serviceCategory.title}`,
      description: `Selected package: ${pkg.name} (${pkg.tier}) - ${serviceCategory.description}`
    }))
    setCurrentStep(2)
  }

  const handleFormSubmit = (details: ProjectDetails, client: ClientInfo) => {
    setProjectDetails(details)
    setClientInfo(client)
    setCurrentStep(3)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateTotalAmount = () => {
    if (!selectedPackage) return 0
    const packagePrice = selectedPackage.price
    const addOnsPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0)
    return packagePrice + addOnsPrice
  }

  type PaymentData = {
    transactionId?: string
    amount?: number
    currency?: string
  }

  const handlePaymentSuccess = async (paymentData: unknown) => {
    try {
      const data = paymentData as PaymentData
      console.log('Payment successful:', data)
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Error handling payment success:', error)
    }
  }

  const handlePaymentError = (error: unknown) => {
    console.error('Payment error:', error)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

  // ⚡ WhatsApp Helper
  const handleWhatsAppHelp = () => {
    const message = `Hello Hexadigitall, I'm looking at the *${serviceCategory.title}* packages but I'm not sure which one to pick. Can you help me choose?`;
    window.open(getWhatsAppLink(message), '_blank');
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-4xl sm:max-w-5xl lg:max-w-6xl h-full flex items-center justify-center">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full h-[90vh] max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{serviceCategory.title}</h2>
              <p className="text-sm text-gray-600 mt-1 hidden sm:block truncate">{serviceCategory.description}</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-center space-x-4 max-w-2xl mx-auto">
              {steps.map((step, index) => (
                <React.Fragment key={step.number}>
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                      currentStep >= step.number
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step.number}
                    </div>
                    <div className="ml-2 hidden sm:block">
                      <div className={`text-sm font-medium transition-colors ${
                        currentStep >= step.number ? 'text-primary' : 'text-gray-600'
                      }`}>{step.title}</div>
                      <div className="text-xs text-gray-400 truncate">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-px flex-shrink-0 transition-colors ${
                      currentStep > step.number ? 'bg-primary' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 min-h-0 overflow-y-auto px-2 sm:px-4 py-4">
            {currentStep === 1 && (
              <>
                {showOnboarding && <FunnelOnboarding onClose={() => setShowOnboarding(false)} />}
                
                {/* ⚡ NEW: WhatsApp Help Link ⚡ */}
                <div className="flex justify-end px-2 mb-4">
                  <button 
                    onClick={handleWhatsAppHelp}
                    className="flex items-center space-x-2 text-green-600 hover:text-green-700 bg-green-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span>Not sure which package? Chat with us</span>
                  </button>
                </div>

                <ServicePackageSelection
                  serviceCategory={serviceCategory}
                  onPackageSelect={handlePackageSelect}
                />
              </>
            )}

            {currentStep === 2 && selectedPackage && (
              <ServiceRequestForm
                serviceCategory={serviceCategory}
                selectedPackage={selectedPackage}
                clientInfo={clientInfo}
                projectDetails={projectDetails}
                onSubmit={handleFormSubmit}
                onBack={handleBack}
              />
            )}

            {currentStep === 3 && selectedPackage && selectedPaymentPlan && (
              <PaymentSummary
                serviceCategory={serviceCategory}
                selectedPackage={selectedPackage}
                selectedAddOns={selectedAddOns}
                selectedPaymentPlan={selectedPaymentPlan}
                clientInfo={clientInfo}
                projectDetails={projectDetails}
                totalAmount={calculateTotalAmount()}
                onBack={handleBack}
                onSubmit={async () => {
                  // This will be handled in PaymentSummary component
                }}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}