"use client"

import React, { useState } from 'react'
import { ServicePackageSelection } from './ServicePackageSelection'
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
}

export interface Package {
  _key: string
  name: string
  tier: 'basic' | 'standard' | 'premium' | 'enterprise'
  price: number
  currency: string
  billing: 'one_time' | 'monthly' | 'hourly' | 'project'
  deliveryTime: string
  features: string[]
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
    budget: ''
  })

  const steps = [
    { number: 1, title: 'Select Package', description: 'Choose your service package' },
    { number: 2, title: 'Project Details', description: 'Tell us about your project' },
    { number: 3, title: 'Payment', description: 'Review and pay' }
  ]

  const handlePackageSelect = (pkg: Package, addOns: AddOn[]) => {
    setSelectedPackage(pkg)
    setSelectedAddOns(addOns)
    setCurrentStep(2)
  }

  const handleProjectDetailsSubmit = (details: ProjectDetails, client: ClientInfo) => {
    setProjectDetails(details)
    setClientInfo(client)
    setCurrentStep(3)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const calculateTotal = () => {
    const packagePrice = selectedPackage?.price || 0
    const addOnTotal = selectedAddOns.reduce((sum, addOn) => sum + addOn.price, 0)
    return packagePrice + addOnTotal
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">{serviceCategory.title}</h2>
              <p className="text-primary-100">{serviceCategory.description}</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:text-primary-200 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'bg-accent text-white' 
                    : 'bg-primary-200 text-primary-600'
                }`}>
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-white">{step.title}</div>
                  <div className="text-xs text-primary-200">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`ml-4 w-8 h-px ${
                    currentStep > step.number ? 'bg-accent' : 'bg-primary-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[70vh]">
          {currentStep === 1 && (
            <ServicePackageSelection
              serviceCategory={serviceCategory}
              onPackageSelect={handlePackageSelect}
            />
          )}

          {currentStep === 2 && (
            <ServiceRequestForm
              serviceCategory={serviceCategory}
              selectedPackage={selectedPackage!}
              clientInfo={clientInfo}
              projectDetails={projectDetails}
              onSubmit={handleProjectDetailsSubmit}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <PaymentSummary
              serviceCategory={serviceCategory}
              selectedPackage={selectedPackage!}
              selectedAddOns={selectedAddOns}
              clientInfo={clientInfo}
              projectDetails={projectDetails}
              totalAmount={calculateTotal()}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  )
}
