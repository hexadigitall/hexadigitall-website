"use client"

import { useSearchParams } from 'next/navigation'
import { PriceDisplay } from '@/components/ui/PriceDisplay'
import { useCurrency } from '@/contexts/CurrencyContext'
import PredefinedPackageButton from './PredefinedPackageButton'

// Service packages data matching the updated Sanity structure
const WEB_PACKAGES = [
  {
    name: 'Landing Page',
    price: 149,
    description: 'Perfect single-page website for your business',
    features: [
      'Single Page Design',
      'Mobile Responsive',
      'Contact Form',
      'Basic SEO Setup',
      'Social Media Links',
      '2 Revision Rounds',
      '5-day delivery',
      'FREE Stock Images'
    ],
    popular: false,
    tier: 'basic'
  },
  {
    name: 'Business Website',
    price: 349,
    description: 'Complete professional website solution',
    features: [
      'Up to 6 Pages',
      'Mobile Responsive Design',
      'Basic CMS (Content Management)',
      'Contact Forms',
      'SEO Optimization',
      'Google Analytics Setup',
      'Social Media Integration',
      'SSL Certificate',
      '3 Revision Rounds',
      '10-day delivery',
      'FREE Logo Design'
    ],
    popular: true,
    tier: 'standard'
  },
  {
    name: 'E-commerce Store',
    price: 649,
    description: 'Complete online store solution',
    features: [
      'Up to 25 Products',
      'Payment Gateway Integration',
      'Basic Inventory Management',
      'Order Management System',
      'Customer Account System',
      'Mobile Responsive',
      'SEO Optimized',
      'Basic Analytics',
      '3 Revision Rounds',
      '14-day delivery',
      'FREE 2-hour training session'
    ],
    popular: false,
    tier: 'premium'
  }
]

const MOBILE_PACKAGES = [
  {
    name: 'Simple Mobile App',
    price: 299,
    description: 'Basic mobile app for your business',
    features: [
      'iOS or Android (Single Platform)',
      'Up to 5 Screens',
      'Basic UI/UX Design',
      'Push Notifications',
      'App Store Submission',
      '2 Revision Rounds',
      '14-day delivery',
      'Basic Support (30 days)'
    ],
    popular: false,
    tier: 'basic'
  },
  {
    name: 'Business App',
    price: 699,
    description: 'Complete mobile solution for growing businesses',
    features: [
      'iOS & Android (Cross-Platform)',
      'Up to 12 Screens',
      'Professional UI/UX Design',
      'Push Notifications',
      'Backend Integration',
      'User Authentication',
      'App Store Submission',
      '3 Revision Rounds',
      '21-day delivery',
      'Support (90 days)',
      'FREE App Analytics Setup'
    ],
    popular: true,
    tier: 'standard'
  },
  {
    name: 'Enterprise App',
    price: 1299,
    description: 'Advanced mobile solution with custom features',
    features: [
      'iOS & Android (Native)',
      'Unlimited Screens',
      'Custom UI/UX Design',
      'Advanced Backend',
      'API Integrations',
      'Real-time Features',
      'Admin Dashboard',
      'App Store Submission',
      'Unlimited Revisions',
      '30-day delivery',
      'Support (1 year)',
      'FREE Maintenance (3 months)'
    ],
    popular: false,
    tier: 'premium'
  }
]

export default function WebMobilePricingSections() {
  const searchParams = useSearchParams()
  const focus = searchParams.get('focus')
  const { isLocalCurrency } = useCurrency()

  const getTierColor = (tier: string, popular: boolean) => {
    if (popular) return 'border-primary ring-2 ring-primary/20 bg-primary/5'
    switch (tier) {
      case 'basic': return 'border-blue-200 bg-blue-50/50'
      case 'standard': return 'border-green-200 bg-green-50/50'
      case 'premium': return 'border-purple-200 bg-purple-50/50'
      default: return 'border-gray-200 bg-gray-50/50'
    }
  }

  const renderPackageGrid = (packages: typeof WEB_PACKAGES, title: string, subtitle: string, colorScheme: 'blue' | 'purple') => {
    const colors = {
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-white',
        border: 'border-blue-200',
        title: 'text-blue-900',
        subtitle: 'text-blue-700',
        button: 'bg-blue-500 hover:bg-blue-600'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-white',
        border: 'border-purple-200', 
        title: 'text-purple-900',
        subtitle: 'text-purple-700',
        button: 'bg-purple-500 hover:bg-purple-600'
      }
    }
    
    const scheme = colors[colorScheme]
    
    return (
    <div className={`${scheme.bg} rounded-3xl p-8 border ${scheme.border} shadow-lg`}>
      <div className="text-center mb-8">
        <h3 className={`text-3xl font-bold ${scheme.title} mb-4`}>{title}</h3>
        <p className={`${scheme.subtitle} text-lg max-w-2xl mx-auto`}>{subtitle}</p>
        
        {/* Nigerian Discount Highlight */}
        {isLocalCurrency() && (
          <div className="mt-6 inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            <span>🇳🇬</span>
            <span>50% OFF for Nigerian Clients!</span>
            <span>🔥</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => (
          <div 
            key={index}
            className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${getTierColor(pkg.tier, pkg.popular)}`}
          >
            {pkg.popular && (
              <div className="text-center mb-4">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                  ⭐ Most Popular
                </span>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h4 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h4>
              <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
              
              {/* Price Display */}
              <div className="mb-4">
                <PriceDisplay 
                  price={pkg.price}
                  size="lg"
                  showDiscount={true}
                  showUrgency={isLocalCurrency()}
                />
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {pkg.features.map((feature, featIndex) => (
                <li key={featIndex} className="flex items-center text-sm text-gray-700">
                  <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <PredefinedPackageButton
              packageName={pkg.name}
              packagePrice={pkg.price}
              packageFeatures={pkg.features}
              serviceTitle={title}
              deliveryTime={pkg.features.find(f => f.includes('delivery'))?.match(/\d+-?\d*-day/)?.[0] || '2-4 weeks'}
            >
              <button className={`w-full inline-flex items-center justify-center px-6 py-3 ${scheme.button} text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg`}>
                Get {pkg.name}
              </button>
            </PredefinedPackageButton>
          </div>
        ))}
      </div>
    </div>
    )}

  // Show different content based on focus parameter
  if (focus === 'web') {
    return (
      <div className="space-y-12">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>🌍</span>
            <span>Web Development Packages</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Web Solution</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            From simple landing pages to complex e-commerce stores, we have the perfect web solution for your business needs.
          </p>
        </div>
        {renderPackageGrid(WEB_PACKAGES, 'Web Development', 'Build stunning websites that convert visitors into customers', 'blue')}
      </div>
    )
  }

  if (focus === 'mobile') {
    return (
      <div className="space-y-12">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>📱</span>
            <span>Mobile App Development Packages</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Mobile Solution</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Create powerful mobile apps that engage users and drive business growth across iOS and Android platforms.
          </p>
        </div>
        {renderPackageGrid(MOBILE_PACKAGES, 'Mobile App Development', 'Powerful mobile apps that engage users and drive growth', 'purple')}
      </div>
    )
  }

  // Default view - show both options
  return (
    <div className="space-y-16">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Detailed Service Packages</h2>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Explore our comprehensive packages for Web Development and Mobile App Development. 
          Each service is designed to deliver exceptional results at competitive prices.
        </p>
      </div>
      
      {renderPackageGrid(WEB_PACKAGES, 'Web Development', 'Build stunning websites that convert visitors into customers', 'blue')}
      {renderPackageGrid(MOBILE_PACKAGES, 'Mobile App Development', 'Powerful mobile apps that engage users and drive growth', 'purple')}
    </div>
  )
}