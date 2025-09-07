"use client"

import React, { useState } from 'react'
import { ServiceCategory, Package, ClientInfo, ProjectDetails } from './ServiceRequestFlow'

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

    // Project details validation
    if (!projectDetails.title.trim()) newErrors.projectTitle = 'Project title is required'
    if (!projectDetails.description.trim()) newErrors.projectDescription = 'Project description is required'
    if (projectDetails.description.length < 50) {
      newErrors.projectDescription = 'Please provide at least 50 characters describing your project'
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
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleProjectDetailsChange = (field: keyof ProjectDetails, value: string) => {
    setProjectDetails(prev => ({ ...prev, [field]: value }))
    if (errors[`project${field.charAt(0).toUpperCase() + field.slice(1)}`]) {
      setErrors(prev => ({ ...prev, [`project${field.charAt(0).toUpperCase() + field.slice(1)}`]: '' }))
    }
  }

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Project Details & Contact Information</h3>
        <p className="text-gray-600">Tell us about your project and provide your contact details.</p>
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
            {formatPrice(selectedPackage.price, selectedPackage.currency)}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Project Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                id="projectTitle"
                value={projectDetails.title}
                onChange={(e) => handleProjectDetailsChange('title', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.projectTitle ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your project title"
              />
              {errors.projectTitle && <p className="text-red-600 text-sm mt-1">{errors.projectTitle}</p>}
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                id="projectDescription"
                value={projectDetails.description}
                onChange={(e) => handleProjectDetailsChange('description', e.target.value)}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.projectDescription ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe your project in detail. What are your goals, target audience, and key requirements?"
              />
              <div className="flex justify-between items-center mt-1">
                {errors.projectDescription ? (
                  <p className="text-red-600 text-sm">{errors.projectDescription}</p>
                ) : (
                  <p className="text-gray-500 text-sm">
                    {projectDetails.description.length}/50 characters minimum
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Timeline
              </label>
              <select
                id="timeline"
                value={projectDetails.timeline}
                onChange={(e) => handleProjectDetailsChange('timeline', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select timeline</option>
                <option value="asap">As soon as possible</option>
                <option value="1-2-weeks">1-2 weeks</option>
                <option value="1-month">Within 1 month</option>
                <option value="2-3-months">2-3 months</option>
                <option value="flexible">I'm flexible</option>
              </select>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <select
                id="budget"
                value={projectDetails.budget}
                onChange={(e) => handleProjectDetailsChange('budget', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select budget range</option>
                <option value="exact-package">Exactly as quoted in package</option>
                <option value="flexible-10">Up to 10% more if needed</option>
                <option value="flexible-25">Up to 25% more if needed</option>
                <option value="flexible-50">Up to 50% more if needed</option>
                <option value="open">Open to discussion</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Specific Requirements
              </label>
              <textarea
                id="requirements"
                value={projectDetails.requirements}
                onChange={(e) => handleProjectDetailsChange('requirements', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Any specific technical requirements, preferences, or constraints we should know about?"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                value={clientInfo.firstName}
                onChange={(e) => handleClientInfoChange('firstName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your first name"
              />
              {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                value={clientInfo.lastName}
                onChange={(e) => handleClientInfoChange('lastName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Your last name"
              />
              {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={clientInfo.email}
                onChange={(e) => handleClientInfoChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={clientInfo.phone}
                onChange={(e) => handleClientInfoChange('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                id="company"
                value={clientInfo.company}
                onChange={(e) => handleClientInfoChange('company', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your company name (optional)"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                id="address"
                value={clientInfo.address}
                onChange={(e) => handleClientInfoChange('address', e.target.value)}
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Your address (optional)"
              />
            </div>
          </div>
        </div>

        {/* General Requirements */}
        {serviceCategory.requirements && serviceCategory.requirements.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              What You'll Need to Provide
            </h4>
            <ul className="space-y-2">
              {serviceCategory.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Packages
          </button>
          <button
            type="submit"
            className="flex-1 sm:flex-none sm:w-auto px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  )
}
