'use client'

import { useState } from 'react'
import { PaperClipIcon } from '@heroicons/react/24/outline'

type FormType = 'quote' | 'project' | 'callback' | 'general'

interface ConditionalContactFormProps {
  initialType?: FormType
  onSubmit?: (data: FormData) => void
  onClose?: () => void
}

export default function ConditionalContactForm({ 
  initialType = 'general',
  onSubmit,
  onClose 
}: ConditionalContactFormProps) {
  const [formType, setFormType] = useState<FormType>(initialType)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    message: '',
    preferredTime: '',
    files: [] as File[]
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...Array.from(e.target.files!)]
      }))
    }
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'files' && Array.isArray(value)) {
        value.forEach(file => data.append('files[]', file))
      } else {
        data.append(key, value as string)
      }
    })
    data.append('formType', formType)
    onSubmit?.(data)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>

      {/* Form Type Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
        <button
          onClick={() => setFormType('quote')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            formType === 'quote'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Get Quote
        </button>
        <button
          onClick={() => setFormType('project')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            formType === 'project'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Start Project
        </button>
        <button
          onClick={() => setFormType('callback')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            formType === 'callback'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Request Callback
        </button>
        <button
          onClick={() => setFormType('general')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            formType === 'general'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          General Inquiry
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Common Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company (Optional)
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Quote-specific fields */}
        {(formType === 'quote' || formType === 'project') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Type *
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => handleInputChange('projectType', e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a service...</option>
                <option value="web">Website Development</option>
                <option value="mobile">Mobile App</option>
                <option value="ecommerce">E-commerce</option>
                <option value="marketing">Digital Marketing</option>
                <option value="branding">Branding & Design</option>
                <option value="consulting">Consulting</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select budget...</option>
                  <option value="under-1000">Under $1,000</option>
                  <option value="1000-5000">$1,000 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000-plus">$10,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select timeline...</option>
                  <option value="urgent">ASAP (1-2 weeks)</option>
                  <option value="normal">Normal (2-4 weeks)</option>
                  <option value="flexible">Flexible (1-3 months)</option>
                </select>
              </div>
            </div>
          </>
        )}

        {/* Callback-specific fields */}
        {formType === 'callback' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Call Time
            </label>
            <select
              value={formData.preferredTime}
              onChange={(e) => handleInputChange('preferredTime', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Select preferred time...</option>
              <option value="morning">Morning (9 AM - 12 PM)</option>
              <option value="afternoon">Afternoon (12 PM - 3 PM)</option>
              <option value="evening">Evening (3 PM - 6 PM)</option>
            </select>
          </div>
        )}

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formType === 'quote' || formType === 'project' 
              ? 'Project Details *' 
              : 'Message *'}
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            placeholder={
              formType === 'quote' || formType === 'project'
                ? 'Describe your project requirements...'
                : 'How can we help you?'
            }
          />
        </div>

        {/* File Upload (for quote and project) */}
        {(formType === 'quote' || formType === 'project') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <PaperClipIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload files or drag and drop
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  PDF, DOC, JPG, PNG (max 10MB)
                </span>
              </label>
            </div>
            {formData.files.length > 0 && (
              <div className="mt-3 space-y-2">
                {formData.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-700 truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            {formType === 'quote' && 'Request Quote'}
            {formType === 'project' && 'Start Project'}
            {formType === 'callback' && 'Request Callback'}
            {formType === 'general' && 'Send Message'}
          </button>
        </div>
      </form>
    </div>
  )
}
