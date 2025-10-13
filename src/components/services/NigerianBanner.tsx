'use client'

import { useCurrency } from '@/contexts/CurrencyContext'

export default function NigerianBanner() {
  const { getLocalDiscountMessage, isLocalCurrency } = useCurrency()
  const discountMessage = getLocalDiscountMessage()
  
  // Only show if user has Nigerian currency
  if (!isLocalCurrency() || !discountMessage) {
    return null
  }
  
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 animate-pulse shadow-lg">
        <span>🇳🇬</span>
        <span>NIGERIAN LAUNCH SPECIAL: 50% OFF ALL PACKAGES!</span>
        <span>🔥</span>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 max-w-4xl mx-auto mb-8">
        <h3 className="text-xl font-bold text-green-800 mb-2">💰 Limited Time Offer - Ends January 31, 2026</h3>
        <p className="text-green-700">
          Nigerian clients get <strong>50% OFF</strong> all our Web & Mobile Development packages. 
          Perfect time to launch your digital presence at unbeatable prices!
        </p>
      </div>
    </div>
  )
}