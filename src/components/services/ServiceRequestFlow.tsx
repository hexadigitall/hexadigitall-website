"use client"

import React from 'react'
import { useState } from 'react'
import { ServicePackageSelection, PaymentPlan } from './ServicePackageSelection'
import { ServiceRequestForm } from './ServiceRequestForm'
import { PaymentSummary } from './PaymentSummary'

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
}

export const ServiceRequestFlow: React.FC<ServiceRequestFlowProps> = ({
  serviceCategory,
  onClose
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

  const steps = [
    { number: 1, title: 'Select Package', description: 'Choose your service package' },
    { number: 2, title: 'Contact Details', description: 'Provide your information' },
    { number: 3, title: 'Payment', description: 'Complete your order' }
  ]

  const handlePackageSelect = (pkg: Package, addOns: AddOn[], paymentPlan: PaymentPlan) => {
    setSelectedPackage(pkg)
    setSelectedAddOns(addOns)
    setSelectedPaymentPlan(paymentPlan)
    // Set project title from package
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

  // Calculate total amount
  const calculateTotalAmount = () => {
    if (!selectedPackage) return 0
    const packagePrice = selectedPackage.price
    const addOnsPrice = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0)
    return packagePrice + addOnsPrice
  }

  // Define a type for payment data if known, otherwise use unknown
  type PaymentData = {
    transactionId?: string
    amount?: number
    currency?: string
    // Add other fields as needed
  }

  const handlePaymentSuccess = async (paymentData: unknown) => {
    try {
      const data = paymentData as PaymentData
      // Handle successful payment
      console.log('Payment successful:', data)
      
      // Close modal and show success message
      if (onClose) {
        onClose()
      }
      
      // You could also redirect to a success page or show a success modal
      // window.location.href = '/services/success'
    } catch (error) {
      console.error('Error handling payment success:', error)
    }
  }

  const handlePaymentError = (error: unknown) => {
    console.error('Payment error:', error)
    // You could show an error message to the user here
  }

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onClose) {
      onClose()
    }
  }

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
              <ServicePackageSelection
                serviceCategory={serviceCategory}
                onPackageSelect={handlePackageSelect}
              />
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