'use client'

import React, { useState } from 'react'
import { ServiceGroupModal, ServiceGroupCard } from './ServiceGroupModal'
import { SERVICE_GROUPS, INDIVIDUAL_SERVICES, SERVICE_BUNDLES, GroupPackage, IndividualService } from '@/data/serviceGroups'
import { Package } from './ServiceRequestFlow'
import { StartingAtPriceDisplay } from '@/components/ui/PriceDisplay'

interface CustomPackage {
  id: string
  name: string
  services: (GroupPackage | IndividualService)[]
  totalPrice: number
  estimatedDelivery: string
}

export const ServiceGroupSelector: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [customPackage, setCustomPackage] = useState<CustomPackage | null>(null)
  const [showCustomBuilder, setShowCustomBuilder] = useState(false)
  const [selectedServices, setSelectedServices] = useState<(GroupPackage | IndividualService)[]>([])

  const activeGroup = selectedGroup ? SERVICE_GROUPS.find(g => g.id === selectedGroup) : null

  const handlePackageSelect = (pkg: Package | GroupPackage) => {
    // Handle package selection - could open a checkout flow
    console.log('Selected package:', pkg)
    setSelectedGroup(null)
  }

  const handleAddToCustomPackage = (service: GroupPackage | IndividualService) => {
    const isAlreadySelected = selectedServices.some(s => 
      ('_key' in s ? s._key : s.id) === ('_key' in service ? service._key : service.id)
    )
    
    if (isAlreadySelected) {
      setSelectedServices(selectedServices.filter(s => 
        ('_key' in s ? s._key : s.id) !== ('_key' in service ? service._key : service.id)
      ))
    } else {
      setSelectedServices([...selectedServices, service])
    }
  }

  const buildCustomPackage = () => {
    if (selectedServices.length === 0) return

    const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)
    const maxDelivery = selectedServices.reduce((max, service) => {
      const delivery = service.deliveryTime
      // Simple delivery time comparison (this could be more sophisticated)
      return delivery.includes('21') ? '21 days' : 
             delivery.includes('14') ? '14 days' :
             delivery.includes('10') ? '10 days' :
             delivery.includes('7') ? '7 days' : max
    }, '5 days')

    const customPkg: CustomPackage = {
      id: 'custom-' + Date.now(),
      name: 'Custom Package',
      services: selectedServices,
      totalPrice,
      estimatedDelivery: maxDelivery
    }

    setCustomPackage(customPkg)
    setShowCustomBuilder(false)
  }

  return (
    <div className="w-full">
      {/* Service Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {SERVICE_GROUPS.map((group) => (
          <ServiceGroupCard
            key={group.id}
            group={group}
            onClick={() => setSelectedGroup(group.id)}
          />
        ))}
      </div>

      {/* Custom Package Builder CTA */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-12 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Need Something Different?
        </h3>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          Mix and match individual services to create your perfect custom package. 
          Build exactly what your business needs with transparent pricing.
        </p>
        <button
          onClick={() => setShowCustomBuilder(true)}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
        >
          Build Custom Package
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Recommended Bundles */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Popular Bundle Packages
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICE_BUNDLES.map((bundle) => (
            <div
              key={bundle.id}
              className="relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-indigo-300 hover:shadow-lg transition-all duration-300"
            >
              {bundle.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h4 className="text-xl font-bold text-gray-900 mb-2">{bundle.name}</h4>
              <p className="text-gray-600 mb-6">{bundle.description}</p>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <StartingAtPriceDisplay price={bundle.bundlePrice} size="md" showDiscount={true} />
                    <span className="text-sm text-gray-500 line-through">
                      ${bundle.originalPrice}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 font-medium">
                    Save ${bundle.savings} ({Math.round(bundle.savings / bundle.originalPrice * 100)}% off)
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2 mb-8">
                {bundle.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start text-sm">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                Select Bundle
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Package Display */}
      {customPackage && (
        <div className="bg-green-50 rounded-2xl p-8 mb-12 border-2 border-green-200">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Your Custom Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Selected Services:</h4>
              <ul className="space-y-2">
                {customPackage.services.map((service, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-gray-700">{service.name}</span>
                    <span className="font-semibold">${service.price}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-center md:text-right">
              <div className="mb-4">
                <div className="text-2xl font-bold text-green-600">
                  Total: ${customPackage.totalPrice}
                </div>
                <div className="text-sm text-gray-600">
                  Estimated Delivery: {customPackage.estimatedDelivery}
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                  Proceed to Checkout
                </button>
                <button 
                  onClick={() => setCustomPackage(null)}
                  className="w-full md:w-auto bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors ml-0 md:ml-3"
                >
                  Modify Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Group Modal */}
      {activeGroup && (
        <ServiceGroupModal
          group={activeGroup}
          isOpen={true}
          onClose={() => setSelectedGroup(null)}
          onPackageSelect={handlePackageSelect}
        />
      )}

      {/* Custom Builder Modal */}
      {showCustomBuilder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Build Your Custom Package</h2>
                <p className="text-gray-600">Select individual services to create your perfect package</p>
              </div>
              <button
                onClick={() => setShowCustomBuilder(false)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {INDIVIDUAL_SERVICES.map((service) => {
                  const isSelected = selectedServices.some(s => 
                    ('id' in s ? s.id : s._key) === service.id
                  )
                  
                  return (
                    <div
                      key={service.id}
                      className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'border-indigo-500 bg-indigo-50 shadow-lg' 
                          : 'border-gray-200 hover:border-indigo-300 hover:shadow-md'
                      }`}
                      onClick={() => handleAddToCustomPackage(service)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2">{service.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ml-3 ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-500 text-white' 
                            : 'border-gray-300'
                        }`}>
                          {isSelected && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <StartingAtPriceDisplay price={service.price} size="sm" showDiscount={true} />
                        <span className="text-sm text-gray-500">{service.deliveryTime}</span>
                      </div>
                      
                      <ul className="space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center text-xs text-gray-600">
                            <svg className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>

            {selectedServices.length > 0 && (
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      Total: ${selectedServices.reduce((sum, s) => sum + s.price, 0)}
                    </p>
                  </div>
                  <div className="space-x-3">
                    <button
                      onClick={() => setSelectedServices([])}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={buildCustomPackage}
                      className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors font-semibold"
                    >
                      Create Package
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}