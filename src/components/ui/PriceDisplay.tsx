'use client'

import { useCurrency } from '@/contexts/CurrencyContext'

interface PriceDisplayProps {
  price: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showDiscount?: boolean
  showUrgency?: boolean
  className?: string
}

export function PriceDisplay({ 
  price, 
  size = 'md', 
  showDiscount = true, 
  showUrgency = true,
  className = "" 
}: PriceDisplayProps) {
  const { formatPriceWithDiscount, isLocalCurrency } = useCurrency()
  
  const priceInfo = formatPriceWithDiscount(price, { applyNigerianDiscount: true })
  
  const sizeClasses = {
    sm: {
      original: 'text-sm',
      discounted: 'text-lg font-bold',
      badge: 'text-xs px-2 py-1',
    },
    md: {
      original: 'text-base',
      discounted: 'text-2xl font-bold',
      badge: 'text-sm px-3 py-1',
    },
    lg: {
      original: 'text-lg',
      discounted: 'text-3xl font-bold',
      badge: 'text-sm px-3 py-1',
    },
    xl: {
      original: 'text-xl',
      discounted: 'text-4xl font-bold',
      badge: 'text-base px-4 py-2',
    }
  }
  
  const styles = sizeClasses[size]
  
  if (!priceInfo.hasDiscount || !showDiscount) {
    // No discount - show regular price
    return (
      <div className={`${className}`}>
        <span className={`text-primary ${styles.discounted}`}>
          {priceInfo.discountedPrice}
        </span>
      </div>
    )
  }
  
  // Show discount pricing with urgency
  return (
    <div className={`${className}`}>
      {/* Discount Badge */}
      {showUrgency && isLocalCurrency() && (
        <div className="flex flex-col items-center justify-center mb-3 gap-2">
          <span className={`bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold animate-pulse shadow-lg ${styles.badge}`}>
            🔥 MEGA {priceInfo.discountPercentage}% OFF - LIMITED TIME!
          </span>
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            🇳🇬 Nigerian Launch Special - Ends Jan 31, 2026
          </span>
        </div>
      )}
      
      {/* Price Display */}
      <div className="flex flex-col items-center">
        {/* Original Price (Struck Through) */}
        <div className="flex items-center space-x-2 mb-1">
          <span className={`text-gray-500 line-through ${styles.original}`}>
            {priceInfo.originalPrice}
          </span>
          {showUrgency && (
            <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
              WAS
            </span>
          )}
        </div>
        
        {/* Discounted Price */}
        <div className="flex items-center space-x-2">
          <span className={`text-green-600 ${styles.discounted}`}>
            {priceInfo.discountedPrice}
          </span>
          {showUrgency && (
            <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-medium">
              NOW
            </span>
          )}
        </div>
        
        {/* Savings Display */}
        {showUrgency && (
          <div className="mt-2 text-center">
            <span className="text-xs sm:text-sm text-green-600 font-medium">
              💰 You save {priceInfo.discountPercentage}%!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// Compact version for cards and small displays
export function CompactPriceDisplay({ 
  price, 
  showDiscount = true,
  className = "" 
}: {
  price: number
  showDiscount?: boolean
  className?: string
}) {
  const { formatPriceWithDiscount, isLocalCurrency } = useCurrency()
  
  const priceInfo = formatPriceWithDiscount(price, { applyNigerianDiscount: true })
  
  if (!priceInfo.hasDiscount || !showDiscount) {
    return (
      <span className={`text-primary font-bold ${className}`}>
        {priceInfo.discountedPrice}
      </span>
    )
  }
  
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      {/* Discount Badge */}
      {isLocalCurrency() && (
        <div className="flex items-center gap-2">
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-md">
            🔥 {priceInfo.discountPercentage}% OFF
          </span>
          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            🇳🇬 SPECIAL
          </span>
        </div>
      )}
      
      {/* Prices */}
      <div className="flex flex-col items-center">
        {priceInfo.hasDiscount && (
          <span className="text-gray-500 line-through text-sm font-medium mb-1">
            {priceInfo.originalPrice}
          </span>
        )}
        <span className={`font-bold text-xl ${priceInfo.hasDiscount ? 'text-green-600' : 'text-primary'}`}>
          {priceInfo.discountedPrice}
        </span>
        {priceInfo.hasDiscount && isLocalCurrency() && (
          <span className="text-green-600 text-xs font-medium mt-1">
            💰 You save {priceInfo.discountPercentage}%!
          </span>
        )}
      </div>
    </div>
  )
}

// Hero/Landing page version with maximum urgency
export function HeroPriceDisplay({ 
  price, 
  className = "" 
}: {
  price: number
  className?: string
}) {
  const { formatPriceWithDiscount, isLocalCurrency } = useCurrency()
  
  const priceInfo = formatPriceWithDiscount(price, { applyNigerianDiscount: true })
  
  if (!priceInfo.hasDiscount || !isLocalCurrency()) {
    return (
      <div className={`text-center ${className}`}>
        <span className="text-5xl font-bold text-white">
          {priceInfo.discountedPrice}
        </span>
      </div>
    )
  }
  
  return (
    <div className={`text-center ${className}`}>
      {/* Mega Discount Badge */}
      <div className="mb-4">
        <span className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-bold animate-bounce shadow-lg">
          🔥 MEGA {priceInfo.discountPercentage}% OFF - ENDS SOON!
        </span>
      </div>
      
      {/* Price Comparison */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-gray-300 text-xs sm:text-sm mb-1">REGULAR PRICE:</div>
            <div className="text-gray-400 line-through text-xl sm:text-3xl font-bold">
              {priceInfo.originalPrice}
            </div>
          </div>
          
          <div className="bg-red-500 text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full animate-pulse text-sm font-bold">
            VS
          </div>
          
          <div className="text-center">
            <div className="text-green-300 text-xs sm:text-sm mb-1">🇳🇬 NIGERIAN PRICE:</div>
            <div className="text-green-400 text-2xl sm:text-4xl font-bold animate-pulse">
              {priceInfo.discountedPrice}
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <span className="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-full text-sm sm:text-lg font-bold">
            💰 SAVE {priceInfo.discountPercentage}% - LIMITED TIME!
          </span>
        </div>
      </div>
    </div>
  )
}