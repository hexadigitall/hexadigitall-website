"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

interface SearchParamsHandlerProps {
  onFocusChange: (focus: string | null) => void
}

export function SearchParamsHandler({ onFocusChange }: SearchParamsHandlerProps) {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const focus = searchParams.get('focus')
    onFocusChange(focus)
    
    if (focus) {
      // Auto-scroll to service categories section after data loads
      setTimeout(() => {
        const element = document.getElementById('service-packages')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
        // Update page title for focused services
        if (focus === 'web-development') {
          document.title = 'Web Development Services | Hexadigitall'
        } else if (focus === 'mobile-development') {
          document.title = 'Mobile App Development Services | Hexadigitall'
        }
      }, 500)
    }
  }, [searchParams, onFocusChange])
  
  return null // This component doesn't render anything
}