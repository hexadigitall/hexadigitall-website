'use client'

import React, { useState, useRef, useEffect } from 'react'
import TierSelectionModal from '@/components/services/TierSelectionModal'
import { ServiceRequestFlow, ServiceCategory as LegacyServiceCategory } from '@/components/services/ServiceRequestFlow'
import type { ServicePackageGroup, ServicePackageTier } from '@/types/service'
import type { IndividualService } from '@/data/individualServices'
import { useCurrency } from '@/contexts/CurrencyContext'
import { StartingAtPriceDisplay } from '@/components/ui/PriceDisplay'
import Breadcrumb from '@/components/ui/Breadcrumb'
import JourneyHeader from '@/components/services/JourneyHeader'

interface CompleteServicePageProps {
  pageTitle: string
  pageDescription: string
  heroGradient: string
  heroImage?: string
  accentColor: 'pink' | 'blue' | 'purple' | 'green' | 'indigo' | 'orange'
  categoryIcon: React.ReactNode
  breadcrumbItems: { label: string; href?: string }[]
  packageGroups: ServicePackageGroup[]
  individualServices: IndividualService[]
  serviceType: string
}

const accentColors = {
  pink: {
    from: 'from-pink-500',
    to: 'to-red-500',
    hover: 'hover:from-pink-600 hover:to-red-600',
    bg: 'bg-pink-500',
    hoverBg: 'hover:bg-pink-600',
    border: 'border-pink-500',
    ring: 'ring-pink-200',
    text: 'text-pink-500',
    gradient: 'from-pink-600/10 via-red-600/10 to-orange-600/10'
  },
  blue: {
    from: 'from-blue-500',
    to: 'to-cyan-500',
    hover: 'hover:from-blue-600 hover:to-cyan-600',
    bg: 'bg-blue-500',
    hoverBg: 'hover:bg-blue-600',
    border: 'border-blue-500',
    ring: 'ring-blue-200',
    text: 'text-blue-500',
    gradient: 'from-blue-600/10 via-cyan-600/10 to-sky-600/10'
  },
  purple: {
    from: 'from-purple-500',
    to: 'to-indigo-500',
    hover: 'hover:from-purple-600 hover:to-indigo-600',
    bg: 'bg-purple-500',
    hoverBg: 'hover:bg-purple-600',
    border: 'border-purple-500',
    ring: 'ring-purple-200',
    text: 'text-purple-500',
    gradient: 'from-purple-600/10 via-indigo-600/10 to-blue-600/10'
  },
  green: {
    from: 'from-green-500',
    to: 'to-emerald-500',
    hover: 'hover:from-green-600 hover:to-emerald-600',
    bg: 'bg-green-500',
    hoverBg: 'hover:bg-green-600',
    border: 'border-green-500',
    ring: 'ring-green-200',
    text: 'text-green-500',
    gradient: 'from-green-600/10 via-emerald-600/10 to-teal-600/10'
  },
  indigo: {
    from: 'from-indigo-500',
    to: 'to-purple-500',
    hover: 'hover:from-indigo-600 hover:to-purple-600',
    bg: 'bg-indigo-500',
    hoverBg: 'hover:bg-indigo-600',
    border: 'border-indigo-500',
    ring: 'ring-indigo-200',
    text: 'text-indigo-500',
    gradient: 'from-indigo-600/10 via-purple-600/10 to-pink-600/10'
  },
  orange: {
    from: 'from-orange-500',
    to: 'to-amber-500',
    hover: 'hover:from-orange-600 hover:to-amber-600',
    bg: 'bg-orange-500',
    hoverBg: 'hover:bg-orange-600',
    border: 'border-orange-500',
    ring: 'ring-orange-200',
    text: 'text-orange-500',
    gradient: 'from-orange-600/10 via-amber-600/10 to-yellow-600/10'
  }
}

export default function CompleteServicePage({
  pageTitle,
  pageDescription,
  heroGradient,
  heroImage,
  accentColor,
  categoryIcon,
  breadcrumbItems,
  packageGroups,
  individualServices,
  serviceType
}: CompleteServicePageProps) {
  const [selectedGroup, setSelectedGroup] = useState<ServicePackageGroup | null>(null)
  // Track a selected tier when a group is opened (used for modal launch)
  // Selected tier state retained for potential future tier-specific actions (modal launch, analytics)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTier, setSelectedTier] = useState<ServicePackageTier | null>(null)
  const [showRequestFlow, setShowRequestFlow] = useState(false)
  const [requestServiceCategory, setRequestServiceCategory] = useState<LegacyServiceCategory | null>(null)
  const [showALaCarte, setShowALaCarte] = useState(false)
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set())
  const [showAllIndividual, setShowAllIndividual] = useState(false)
  const individualSectionRef = useRef<HTMLDivElement>(null)
  // Reserved for future dynamic pricing announcements
  // Live region reserved for dynamic pricing updates (currently unused)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const priceLiveRegionRef = useRef<HTMLDivElement>(null)
  const tierHeadingRef = useRef<HTMLHeadingElement>(null)
  const bundleHeadingRef = useRef<HTMLHeadingElement>(null)
  const individualHeadingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    individualHeadingRef.current?.focus()
  }, [])
  const { currentCurrency, getLocalDiscountMessage, convertPrice } = useCurrency()
  const discountMessage = getLocalDiscountMessage()
  const colors = accentColors[accentColor]
  
  // Determine journey stage based on service type
  const journeyStage = serviceType === 'business' ? 'idea' 
    : serviceType === 'web-dev' ? 'build' 
    : 'grow'

  // Toggle service selection
  const toggleServiceSelection = (serviceId: string) => {
    const newSelected = new Set(selectedServices)
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId)
    } else {
      newSelected.add(serviceId)
    }
    setSelectedServices(newSelected)
  }

  // Calculate total price for selected services
  const calculateTotal = () => {
    let total = 0
    selectedServices.forEach(serviceId => {
      const service = individualServices.find(s => s.id === serviceId)
      if (service) {
        total += service.price
      }
    })
    return total
  }

  const totalPrice = calculateTotal()
  const hasSelectedServices = selectedServices.size > 0

  // Bundle discount (5% off when buying 2+, 10% off when buying 3+)
  const getBundleDiscount = () => {
    if (selectedServices.size >= 3) return 0.10
    if (selectedServices.size >= 2) return 0.05
    return 0
  }

  const bundleDiscount = getBundleDiscount()
  const savings = totalPrice * bundleDiscount
  const finalPrice = totalPrice - savings

  const handleTierSelect = (tier: ServicePackageTier) => {
    if (!selectedGroup) return
    setSelectedTier(tier)
    const sc: LegacyServiceCategory = {
      _id: selectedGroup.key?.current || 'tier-service',
      title: selectedGroup.name,
      slug: { current: selectedGroup.key?.current || '' },
      description: selectedGroup.description || 'Service package',
      icon: '📦',
      featured: true,
      serviceType,
      packages: [
        {
          _key: tier._key,
          name: tier.name,
          tier: tier.tier,
          price: tier.price,
          currency: tier.currency,
          billing: tier.billing,
          deliveryTime: tier.deliveryTime || '7-14 days',
          features: (tier.features || []).map(f => typeof f === 'string' ? f : (f?.title || f?.description || '')),
          popular: tier.popular || false
        }
      ]
    }
    setRequestServiceCategory(sc)
    setShowRequestFlow(true)
    setSelectedGroup(null)
  }

  const handleIndividualServiceSelect = (service: IndividualService) => {
    const sc: LegacyServiceCategory = {
      _id: `${serviceType}-individual`,
      title: pageTitle,
      slug: { current: serviceType },
      description: service.description,
      icon: '📦',
      featured: false,
      serviceType,
      packages: [{
        _key: service.id,
        name: service.name,
        tier: 'basic' as const,
        price: service.price,
        currency: 'USD',
        billing: 'one_time' as const,
        deliveryTime: service.deliveryTime,
        features: service.features,
        popular: false
      }]
    }
    setRequestServiceCategory(sc)
    setShowRequestFlow(true)
  }

  const handleCustomBundleCheckout = () => {
    if (selectedServices.size === 0) return

    const selectedItems = Array.from(selectedServices).map(serviceId => {
      const service = individualServices.find(s => s.id === serviceId)!
      return service
    })

    const bundleName = selectedServices.size === 1 
      ? selectedItems[0].name
      : `Custom Bundle (${selectedServices.size} services)`
    
    const allFeatures = selectedItems.flatMap(s => s.features)
    const longestDelivery = Math.max(...selectedItems.map(s => parseInt(s.deliveryTime.split('-')[1] || '7')))

    const sc: LegacyServiceCategory = {
      _id: `${serviceType}-custom-bundle`,
      title: pageTitle,
      slug: { current: serviceType },
      description: `Custom bundle including: ${selectedItems.map(s => s.name).join(', ')}`,
      icon: '📦',
      featured: false,
      serviceType,
      packages: [{
        _key: 'custom-bundle',
        name: bundleName,
        tier: 'basic' as const,
        price: finalPrice,
        currency: 'USD',
        billing: 'one_time' as const,
        deliveryTime: `${longestDelivery}-${longestDelivery + 2} days`,
        features: allFeatures,
        popular: false
      }]
    }
    setRequestServiceCategory(sc)
    setShowRequestFlow(true)
  }

  const serviceCategory = showRequestFlow ? requestServiceCategory : null

  return (
    <div className={`min-h-screen bg-gradient-to-b from-slate-50 via-white to-gray-50 scroll-smooth ${hasSelectedServices ? 'pb-32 sm:pb-24' : ''}`}>
      {/* Breadcrumb */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>
      
      {/* User Journey Navigation */}
      <JourneyHeader currentStage={journeyStage} />

      {/* Hero Section */}
      <div className="relative py-12 sm:py-20 overflow-hidden">
        {/* Background Image */}
        {heroImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white/95"></div>
          </div>
        )}
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${heroGradient}`}></div>
          <div className={`absolute top-1/4 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-gradient-to-r ${colors.from} ${colors.to} opacity-20 rounded-full blur-3xl animate-pulse`}></div>
          <div className={`absolute bottom-1/4 right-1/4 w-60 sm:w-80 h-60 sm:h-80 bg-gradient-to-r ${colors.from} ${colors.to} opacity-20 rounded-full blur-2xl animate-pulse`} style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            {/* Special Offer Banner */}
            {discountMessage && (
              <div className="mb-6 sm:mb-8 flex justify-center">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-pink-500 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-bold text-white shadow-lg animate-bounce">
                  <span>🇳🇬</span>
                  <span className="hidden sm:inline">NIGERIAN LAUNCH SPECIAL - 50% OFF ALL PACKAGES!</span>
                  <span className="sm:hidden">50% OFF ALL PACKAGES!</span>
                  <span>🔥</span>
                </div>
              </div>
            )}
            
            <div className={`inline-flex items-center space-x-2 bg-gradient-to-r ${colors.from} ${colors.to} bg-opacity-10 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6`}>
              {categoryIcon}
              <span className="capitalize">{pageTitle}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4 sm:mb-6 px-4">
              {pageTitle}
            </h1>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              {pageDescription}
            </p>
            
            {/* Currency Info */}
            <div className="mt-6 sm:mt-8">
              <div className="inline-flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <span>Prices shown in:</span>
                <span className="font-semibold text-primary">{currentCurrency.flag} {currentCurrency.code}</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Pills */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <a href="#individual-services" className="min-h-[44px] px-4 sm:px-6 py-3 bg-white border-2 border-gray-300 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:border-gray-400 hover:shadow-md transition-all inline-flex items-center active:scale-95">
              Individual Services
            </a>
            <a href="#custom-bundle" className="min-h-[44px] px-4 sm:px-6 py-3 bg-white border-2 border-gray-300 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:border-gray-400 hover:shadow-md transition-all inline-flex items-center active:scale-95">
              Build Bundle
            </a>
            <a href="#tiered-packages" className="min-h-[44px] px-4 sm:px-6 py-3 bg-white border-2 border-gray-300 rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:border-gray-400 hover:shadow-md transition-all inline-flex items-center active:scale-95">
              Complete Packages
            </a>
          </div>

          {/* Section 1: Pre-packaged Individual Services */}
          <div id="individual-services" ref={individualSectionRef} className="mb-16 sm:mb-20 scroll-mt-24">
            <div className="text-center mb-8 sm:mb-12 px-4">
              <h2 ref={individualHeadingRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 focus:outline-none">Individual Services</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Need just one specific service? Choose from our ready-to-buy individual offerings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
              {(showAllIndividual ? individualServices : individualServices.slice(0, 3)).map((service) => (
                <div key={service.id} className="card-enhanced p-4 sm:p-6 hover:shadow-xl transition-all duration-300">
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600">{service.description}</p>
                  </div>
                  
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <StartingAtPriceDisplay 
                      price={service.price} 
                      size="lg" 
                      showDiscount={true}
                    />
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 flex items-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Delivery: {service.deliveryTime}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-xs sm:text-sm text-gray-700">
                        <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${colors.text} mr-2 flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button 
                    onClick={() => handleIndividualServiceSelect(service)}
                    className={`w-full min-h-[44px] bg-gradient-to-r ${colors.from} ${colors.to} text-white py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold ${colors.hover} transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-md hover:shadow-lg focus:ring-2 focus:ring-offset-2`}
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
            
            {/* Show More/Less Button */}
            {individualServices.length > 3 && (
              <div className="text-center mt-8 px-4">
                <button
                  onClick={() => {
                    if (showAllIndividual) {
                      // When collapsing, scroll to the section to maintain view context
                      individualSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                    setShowAllIndividual(!showAllIndividual)
                  }}
                  className={`inline-flex items-center gap-2 min-h-[44px] px-6 sm:px-8 py-3 bg-white border-2 ${colors.border} text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95`}
                >
                  {showAllIndividual ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                      <span>Show Less</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                      <span>Show {individualServices.length - 3} More Services</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Section 2: À La Carte Builder */}
          <div id="custom-bundle" className="mb-16 sm:mb-20 scroll-mt-24">
            <div className="card-enhanced rounded-2xl p-6 sm:p-8 mx-4">
              <div className="text-center mb-6">
                <h2 ref={bundleHeadingRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 flex items-center justify-center gap-2 focus:outline-none">
                  <svg className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Build Your Custom Bundle
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Select multiple services and save! Get <strong>5% off</strong> when buying 2+ services, <strong>10% off</strong> for 3+.
                </p>
              </div>
              
              {!showALaCarte ? (
                <div className="text-center">
                  <button
                    onClick={() => setShowALaCarte(true)}
                    className={`inline-flex items-center min-h-[44px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${colors.from} ${colors.to} text-white font-semibold rounded-xl ${colors.hover} transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base`}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Open À La Carte Builder
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {individualServices.map((service) => {
                      const isSelected = selectedServices.has(service.id)
                      return (
                        <div 
                          key={service.id} 
                          className={`bg-white border-2 rounded-2xl p-4 sm:p-6 transition-all duration-300 cursor-pointer ${
                            isSelected 
                              ? `${colors.border} shadow-lg ring-2 ${colors.ring}` 
                              : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                          }`}
                          onClick={() => toggleServiceSelection(service.id)}
                        >
                          {/* Checkbox Header */}
                          <div className="flex items-start justify-between mb-3 min-h-[44px]">
                            <div className="flex-1 pr-2">
                              <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{service.name}</h3>
                            </div>
                            <div className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected 
                                ? `${colors.bg} ${colors.border}` 
                                : 'border-gray-300'
                            }`}>
                              {isSelected && (
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-gray-600 mb-4">{service.description}</p>
                          
                          <div className="mb-4">
                            <StartingAtPriceDisplay 
                              price={service.price} 
                              size="md" 
                              showDiscount={true}
                            />
                            <p className="text-xs text-gray-500 mt-1">Delivery: {service.deliveryTime}</p>
                          </div>

                          <ul className="space-y-1">
                            {service.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center text-xs text-gray-600">
                                <svg className={`w-3 h-3 ${colors.text} mr-2 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {feature}
                              </li>
                            ))}
                            {service.features.length > 3 && (
                              <li className="text-xs text-gray-500 italic pl-5">
                                +{service.features.length - 3} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                    <button
                      onClick={() => {
                        setShowALaCarte(false)
                        setSelectedServices(new Set())
                      }}
                      className="text-gray-500 hover:text-gray-700 text-xs sm:text-sm font-medium px-4 py-2"
                    >
                      Hide Builder
                    </button>
                    {hasSelectedServices && (
                      <button
                        onClick={() => setSelectedServices(new Set())}
                        className={`${colors.text} hover:opacity-80 text-xs sm:text-sm font-medium px-4 py-2`}
                      >
                        Clear All ({selectedServices.size})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Tiered Packages */}
          <div id="tiered-packages" className="mb-16 sm:mb-20 scroll-mt-24 px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 ref={tierHeadingRef} tabIndex={-1} className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 focus:outline-none">Complete Packages</h2>
              <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
                Choose from our tiered packages with flexible options to match your budget and growth goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {packageGroups.map((group) => {
                const minPrice = group.tiers.length > 0 ? Math.min(...group.tiers.map(t => t.price)) : 0
                return (
                  <div 
                    key={group.key?.current || group.name}
                    className="card-enhanced p-4 sm:p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedGroup(group)}
                  >
                    <div className="text-center mb-6">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{group.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4">{group.description}</p>
                      <StartingAtPriceDisplay 
                        price={minPrice} 
                        size="lg" 
                        showDiscount={true}
                      />
                    </div>

                    <div className="mb-6 sm:mb-8">
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3">Available tiers:</p>
                      <ul className="space-y-2">
                        {group.tiers.map((tier) => (
                          <li key={tier._key} className="flex items-center text-xs sm:text-sm text-gray-600">
                            <svg className={`w-3 h-3 sm:w-4 sm:h-4 ${colors.text} mr-2 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">{tier.name}</span>
                            {tier.popular && <span className={`ml-2 text-xs ${colors.text} font-bold`}>POPULAR</span>}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className={`w-full bg-gradient-to-r ${colors.from} ${colors.to} text-white py-2 sm:py-3 px-4 sm:px-6 rounded-xl text-sm sm:text-base font-semibold ${colors.hover} transition-colors`}>
                      View Options & Pricing
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Checkout Bar for Custom Bundle */}
      {hasSelectedServices && (
        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t-2 ${colors.border} shadow-2xl z-50 animate-slide-up`}>
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 relative">
              {/* Dismiss Button */}
              <button
                onClick={() => setSelectedServices(new Set())}
                className="absolute -top-10 right-4 sm:-top-12 sm:right-6 bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2 shadow-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Clear selection"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center sm:justify-start">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-600">Selected Services</p>
                  <p className="text-base sm:text-lg font-bold text-gray-900">{selectedServices.size} {selectedServices.size === 1 ? 'service' : 'services'}</p>
                </div>
                <div className="h-8 sm:h-10 w-px bg-gray-300 hidden sm:block"></div>
                <div className="text-center sm:text-left">
                  <p className="text-xs text-gray-600">Total Price</p>
                  <div className="flex items-baseline gap-2 flex-wrap justify-center sm:justify-start">
                    {bundleDiscount > 0 && (
                      <span className="text-sm text-gray-400 line-through">{currentCurrency.symbol}{Math.round(convertPrice(totalPrice, currentCurrency.code))}</span>
                    )}
                    <StartingAtPriceDisplay 
                      price={finalPrice} 
                      size="lg" 
                      showDiscount={true}
                    />
                    {bundleDiscount > 0 && (
                      <span className="text-xs text-green-600 font-semibold">
                        Save {Math.round(bundleDiscount * 100)}%!
                      </span>
                    )}
                  </div>
                  {savings > 0 && (
                    <p className="text-xs text-green-600 font-medium">
                      You save {currentCurrency.symbol}{Math.round(convertPrice(savings, currentCurrency.code))}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleCustomBundleCheckout}
                className={`inline-flex items-center min-h-[44px] px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r ${colors.from} ${colors.to} text-white font-bold rounded-xl ${colors.hover} transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-sm sm:text-base whitespace-nowrap`}
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tier Selection Modal */}
      {selectedGroup && (
        <TierSelectionModal
          packageGroup={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onTierSelect={handleTierSelect}
        />
      )}

      {/* Service Request Flow for checkout */}
      {serviceCategory && showRequestFlow && (
        <ServiceRequestFlow
          serviceCategory={serviceCategory}
          onClose={() => {
            setShowRequestFlow(false)
            setRequestServiceCategory(null)
            setSelectedTier(null)
          }}
        />
      )}
    </div>
  )
}
