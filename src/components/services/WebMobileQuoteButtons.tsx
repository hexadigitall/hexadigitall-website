'use client'

import { useState } from 'react'
import EnhancedServiceWizard from './EnhancedServiceWizard'

export default function WebMobileQuoteButtons() {
  const [showWizard, setShowWizard] = useState(false)
  const [wizardConfig, setWizardConfig] = useState<{ 
    serviceType?: string
    quoteType?: 'web' | 'mobile' | 'complete' | 'general' 
  }>({})

  return (
    <>
      {/* Quote Flow Buttons Section */}
      <div className="my-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose your path and get a customized quote tailored to your specific needs
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Web Development Quote Button */}
          <button
            onClick={() => {
              setWizardConfig({ serviceType: 'web', quoteType: 'web' })
              setShowWizard(true)
            }}
            className="group relative px-6 py-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-5xl mb-2">🌐</div>
              <div className="text-xl font-bold">Get Web Development Quote</div>
              <div className="text-sm text-blue-100">Custom websites & web apps</div>
              <div className="mt-4 text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to start →
              </div>
            </div>
          </button>
          
          {/* Mobile App Quote Button */}
          <button
            onClick={() => {
              setWizardConfig({ serviceType: 'mobile', quoteType: 'mobile' })
              setShowWizard(true)
            }}
            className="group relative px-6 py-8 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-5xl mb-2">📱</div>
              <div className="text-xl font-bold">Get Mobile App Quote</div>
              <div className="text-sm text-purple-100">iOS & Android apps</div>
              <div className="mt-4 text-xs text-purple-200 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to start →
              </div>
            </div>
          </button>
          
          {/* Complete Solution Quote Button */}
          <button
            onClick={() => {
              setWizardConfig({ quoteType: 'complete' })
              setShowWizard(true)
            }}
            className="group relative px-6 py-8 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="text-5xl mb-2">🚀</div>
              <div className="text-xl font-bold">Get Complete Solution Quote</div>
              <div className="text-sm text-green-100">Web + Mobile + Marketing</div>
              <div className="mt-4 text-xs text-green-200 opacity-0 group-hover:opacity-100 transition-opacity">
                Click to start →
              </div>
            </div>
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Get instant pricing • No commitment required • Free consultation included</p>
        </div>
      </div>

      {/* Enhanced Service Wizard Modal */}
      {showWizard && (
        <EnhancedServiceWizard
          onClose={() => {
            setShowWizard(false)
            setWizardConfig({})
          }}
          onComplete={(data) => {
            console.log('Wizard completed:', data)
            setShowWizard(false)
            setWizardConfig({})
            // Here we could open a contact form or redirect
          }}
          initialServiceType={wizardConfig.serviceType}
          quoteType={wizardConfig.quoteType}
        />
      )}
    </>
  )
}
