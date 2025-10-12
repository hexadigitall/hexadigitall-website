'use client'

import { ReactNode } from 'react'

interface QuoteButtonWrapperProps {
  children: ReactNode
  quoteType: 'web' | 'mobile' | 'complete'
}

export default function QuoteButtonWrapper({ children, quoteType }: QuoteButtonWrapperProps) {
  const handleClick = () => {
    // Dispatch custom event that WebMobileQuoteButtons listens to
    const eventName = quoteType === 'web' ? 'openWebQuote' 
      : quoteType === 'mobile' ? 'openMobileQuote'
      : 'openCompleteQuote'
    
    window.dispatchEvent(new Event(eventName))
  }

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  )
}
