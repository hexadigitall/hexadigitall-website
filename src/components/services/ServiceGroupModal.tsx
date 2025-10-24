'use client'

import React from 'react';
import Link from 'next/link'
import { Package } from './ServiceRequestFlow'
import { featureToText } from '@/lib/utils'
import { StartingAtPriceDisplay } from '@/components/ui/PriceDisplay'

interface ServiceGroup {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  packages: Package[]
  backgroundImage?: string
  colorTheme: {
    primary: string
    secondary: string
    accent: string
  }
}

interface ServiceGroupModalProps {
  group: ServiceGroup
  isOpen: boolean
  onClose: () => void
  onPackageSelect: (pkg: Package) => void
}

export const ServiceGroupModal: React.FC<ServiceGroupModalProps> = ({
  group,
  isOpen,
  onClose,
  onPackageSelect
}) => {
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header with Background */}
        <div 
          className="relative p-8 text-white"
          style={{
            background: `linear-gradient(135deg, ${group.colorTheme.primary}, ${group.colorTheme.secondary})`,
          }}
        >
          {/* Background Image if provided */}
          {group.backgroundImage && (
            <div className="absolute inset-0">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
                style={{ backgroundImage: `url('${group.backgroundImage}')` }}
              />
            </div>
          )}
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Header Content */}
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                {group.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold">{group.name}</h2>
                <p className="text-white/80">Choose the perfect package for your needs</p>
              </div>
            </div>
            <p className="text-lg text-white/90 max-w-2xl">{group.description}</p>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="p-8 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.packages.map((pkg) => (
              <div
                key={pkg._key}
                className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
              >
                {/* Popular Badge */}
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Package Header */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <StartingAtPriceDisplay 
                      price={pkg.price} 
                      size="md"
                      showDiscount={true}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Delivery: {pkg.deliveryTime}
                  </p>
                </div>

                {/* Features List */}
                <div className="mb-6">
                  <ul className="space-y-2">
                    {pkg.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{featureToText(feature)}</span>
                      </li>
                    ))}
                    {pkg.features.length > 5 && (
                      <li className="text-sm text-gray-500 italic">
                        +{pkg.features.length - 5} more features...
                      </li>
                    )}
                  </ul>
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => onPackageSelect(pkg)}
                  className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl font-semibold hover:from-secondary hover:to-accent transition-all duration-300 transform hover:scale-105"
                >
                  Select This Package
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Service Group Card Component
interface ServiceGroupCardProps {
  group: ServiceGroup
  onClick: () => void
}

export const ServiceGroupCard: React.FC<ServiceGroupCardProps> = ({ group, onClick }) => {
  const lowestPrice = Math.min(...group.packages.map(pkg => pkg.price))
  
  // Map service group IDs to their corresponding category page URLs
  const getCategoryPageUrl = (groupId: string): string => {
    const urlMap: Record<string, string> = {
      'business-strategy': '/services/business-plan-and-logo-design',
      'digital-presence': '/services/web-and-mobile-software-development',
      'marketing-growth': '/services/social-media-marketing',
      'profile-portfolio': '/services/profile-and-portfolio-building',
      'mentoring-consulting': '/services/mentoring-and-consulting'
    }
    return urlMap[groupId] || '/services'
  }
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Only trigger the modal if clicking on the main card, not the buttons
    if ((e.target as HTMLElement).closest('button, a')) {
      return
    }
    onClick()
  }
  
  return (
    <div
      className="relative overflow-hidden rounded-2xl cursor-pointer card-enhanced hover:scale-105 transition-all duration-300 group"
      onClick={handleCardClick}
    >
      {/* Background Image */}
      {group.backgroundImage && (
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${group.backgroundImage}')` }}
          />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="flex items-center mb-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mr-4 text-white"
            style={{ background: `linear-gradient(135deg, ${group.colorTheme.primary}, ${group.colorTheme.secondary})` }}
          >
            {group.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
              {group.name}
            </h3>
            <p className="text-gray-600">
              {group.packages.length} packages available
            </p>
          </div>
        </div>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          {group.description}
        </p>
        
        <div className="mb-6">
          <StartingAtPriceDisplay 
            price={lowestPrice} 
            size="sm"
            showDiscount={true}
          />
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button 
            onClick={() => onClick()}
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 rounded-xl font-semibold hover:from-secondary hover:to-accent transition-all duration-300"
          >
            View Quick Packages
          </button>
          
          <Link
            href={getCategoryPageUrl(group.id)}
            className="w-full block text-center border-2 border-primary text-primary py-3 px-4 rounded-xl font-semibold hover:bg-primary hover:text-white transition-all duration-300"
          >
            Browse Individual Services
          </Link>
        </div>
      </div>
    </div>
  )
}
