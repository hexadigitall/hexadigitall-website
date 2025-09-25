"use client"

import * as React from 'react'
import { useState } from 'react'
import { ServiceCategory, Package, ClientInfo, ProjectDetails } from './ServiceRequestFlow'
import { useCurrency } from '@/contexts/CurrencyContext'

interface ServiceRequestFormProps {
  serviceCategory: ServiceCategory
  selectedPackage: Package
  clientInfo: ClientInfo
  projectDetails: ProjectDetails
  onSubmit: (details: ProjectDetails, client: ClientInfo) => void
  onBack: () => void
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  serviceCategory,
  selectedPackage,
  clientInfo: initialClientInfo,
  projectDetails: initialProjectDetails,
  onSubmit,
  onBack
}) => {
  const [clientInfo, setClientInfo] = useState<ClientInfo>(initialClientInfo)
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>(initialProjectDetails)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { formatPrice } = useCurrency()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Client info validation
    if (!clientInfo.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!clientInfo.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!clientInfo.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientInfo.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(projectDetails, clientInfo)
    }
  }

  const handleClientInfoChange = (field: keyof ClientInfo, value: string) => {
    setClientInfo(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }))
    }
  }

  const handleProjectDetailsChange = (field: keyof ProjectDetails, value: string) => {
    setProjectDetails((prev: ProjectDetails) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h3>
          <p className="text-gray-600">Provide your contact details to proceed with your order.</p>
        </div>

        {/* Selected Package Summary */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <h4 className="font-semibold text-gray-900 mb-2">Selected Package</h4>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-900">{selectedPackage.name}</span>
              <span className="text-sm text-gray-600 ml-2">({selectedPackage.tier})</span>
            </div>
            <span className="font-bold text-primary">
              {formatPrice(selectedPackage.price, { applyNigerianDiscount: true })}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  value={clientInfo.firstName}
                  onChange={(e) => handleClientInfoChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={clientInfo.lastName}
                  onChange={(e) => handleClientInfoChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => handleClientInfoChange('email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={clientInfo.phone}
                  onChange={(e) => handleClientInfoChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your phone number (optional)"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company/Organization
                </label>
                <input
                  type="text"
                  value={clientInfo.company}
                  onChange={(e) => handleClientInfoChange('company', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your company or organization name (optional)"
                />
              </div>
            </div>
          </div>

          {/* Optional Project Notes */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h4>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requests or Notes
              </label>
              <textarea
                value={projectDetails.notes || ''}
                onChange={(e) => handleProjectDetailsChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Any special requests, preferences, or additional information you'd like us to know? (optional)"
              />
              <p className="text-sm text-gray-500 mt-1">
                This information will help us better understand your needs and provide a more tailored service.
              </p>
            </div>
          </div>

          {/* Service Requirements Info */}
          {serviceCategory.requirements && serviceCategory.requirements.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                What We&apos;ll Need From You
              </h4>
              <ul className="space-y-2">
                {serviceCategory.requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{requirement}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-600 mt-4">
                Don&apos;t worry - we&apos;ll guide you through providing these after your order is confirmed.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onBack}
              className="sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Packages
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center justify-center"
            >
              Continue to Payment
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}