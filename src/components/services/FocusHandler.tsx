// src/components/services/FocusHandler.tsx
"use client"

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface FocusHandlerProps {
  serviceSlug: string
}

export default function FocusHandler({ serviceSlug }: FocusHandlerProps) {
  const searchParams = useSearchParams()

  useEffect(() => {
    const focus = searchParams.get('focus')
    
    if (focus && serviceSlug === 'web-and-mobile-software-development') {
      // Update page title based on focus
      if (focus === 'web') {
        document.title = 'Web Development Services | Hexadigitall'
        // Scroll to relevant section after a delay
        setTimeout(() => {
          const element = document.getElementById('development-services')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 500)
      } else if (focus === 'mobile') {
        document.title = 'Mobile App Development Services | Hexadigitall'
        // Scroll to relevant section after a delay
        setTimeout(() => {
          const element = document.getElementById('development-services')
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        }, 500)
      }
    }
  }, [searchParams, serviceSlug])

  // This component doesn't render anything visible
  return null
}