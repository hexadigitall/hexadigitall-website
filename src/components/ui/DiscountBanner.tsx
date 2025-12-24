'use client'

// 👇 CRITICAL FIX: Added missing imports
import { useState, useEffect } from 'react' 
import { useCurrency } from '@/contexts/CurrencyContext'
import { CountdownTimer, SpotsRemaining } from './CountdownTimer'

interface DiscountBannerProps {
  size?: 'sm' | 'md' | 'lg'
  showCountdown?: boolean
  showSpots?: boolean
  className?: string
}

export function DiscountBanner({ 
  size = 'md', 
  showCountdown = true, 
  showSpots = true,
  className = "" 
}: DiscountBannerProps) {
  const { isLocalCurrency, getLocalDiscountMessage } = useCurrency()
  const [mounted, setMounted] = useState(false)

  // Fix: Hydration mismatch prevention
  useEffect(() => {
    setMounted(true)
  }, [])

  // Fix: Hooks rules - Return must be AFTER hooks
  if (!mounted) return null;

  const discountMessage = getLocalDiscountMessage()
  
  if (!isLocalCurrency() || !discountMessage) {
    return null
  }

  const sizeClasses = {
    sm: {
      container: 'p-3 sm:p-4',
      mainText: 'text-lg sm:text-xl',
      subText: 'text-xs sm:text-sm',
      badge: 'text-xs sm:text-sm px-3 py-2',
    },
    md: {
      container: 'p-4 sm:p-6',
      mainText: 'text-xl sm:text-3xl',
      subText: 'text-xs sm:text-sm',
      badge: 'text-xs sm:text-sm px-3 sm:px-4 py-2',
    },
    lg: {
      container: 'p-6 sm:p-8',
      mainText: 'text-2xl sm:text-4xl',
      subText: 'text-sm sm:text-base',
      badge: 'text-sm sm:text-base px-4 sm:px-6 py-3',
    }
  }
  
  const styles = sizeClasses[size]
  
  return (
    <div className={`bg-gradient-to-r from-red-500/10 via-red-400/5 to-red-500/10 border-2 border-red-400/30 rounded-2xl text-center shadow-lg ${styles.container} ${className}`}>
      <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <span className={`bg-gradient-to-r from-red-500 to-red-600 bg-red-600 text-white rounded-full font-bold animate-bounce whitespace-nowrap shadow-lg ${styles.badge}`}>
            🔥 MEGA LAUNCH SPECIAL
          </span>
          <span className={`font-bold text-red-600 animate-pulse ${styles.mainText}`}>
            50% OFF!
          </span>
        </div>
        <div className={`text-gray-700 font-medium text-center ${styles.subText}`}>
          🇳🇬 Nigerian clients only • Limited spots remaining • Ends Jan 31, 2026
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center justify-center gap-3">
        <p className={`text-gray-700 text-center ${styles.subText}`}>
          <span className="font-semibold text-red-600">💯 Supporting Nigerian businesses</span> with world-class solutions at ultra-affordable prices
        </p>
        {(showCountdown || showSpots) && (
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 ${styles.subText}`}>
            {showSpots && <SpotsRemaining className="" />}
            {showSpots && showCountdown && <span className="hidden sm:inline text-gray-500">•</span>}
            {showCountdown && (
              <CountdownTimer 
                endDate={new Date('2026-01-31T23:59:59Z')} 
                className=""
              />
            )}
            <span className="hidden sm:inline text-gray-500">•</span>
            <span className="text-green-600 font-medium whitespace-nowrap">💳 Payment plans available</span>
          </div>
        )}
      </div>
    </div>
  )
}

export function CompactDiscountBanner({ className = "" }: { className?: string }) {
  const { isLocalCurrency, getLocalDiscountMessage } = useCurrency()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null
  
  const discountMessage = getLocalDiscountMessage()
  if (!isLocalCurrency() || !discountMessage) return null

  return (
    <div className={`inline-flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold animate-pulse shadow-lg ${className}`}>
      <span>🔥</span>
      <span>50% OFF LAUNCH SPECIAL</span>
      <span>🇳🇬</span>
    </div>
  )
}

export function InlineDiscountBadge({ className = "" }: { className?: string }) {
  const { isLocalCurrency } = useCurrency()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => { setMounted(true) }, [])
  
  if (!mounted || !isLocalCurrency()) return null

  return (
    <span className={`bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse ${className}`}>
      -50% 🇳🇬
    </span>
  )
}