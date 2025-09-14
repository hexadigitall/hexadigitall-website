"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import CustomizationWizard from './CustomizationWizard'

interface CustomizeHandlerProps {
  onCustomizeStateChange?: (isCustomizing: boolean) => void
}

export default function CustomizeHandler({ onCustomizeStateChange }: CustomizeHandlerProps) {
  const searchParams = useSearchParams()
  const [showCustomizer, setShowCustomizer] = useState(false)

  useEffect(() => {
    const customize = searchParams.get('customize') === 'true'
    setShowCustomizer(customize)
    onCustomizeStateChange?.(customize)

    if (customize) {
      // Update page title for customization
      document.title = 'Custom Web & Mobile Solution Builder | Hexadigitall'
    }
  }, [searchParams, onCustomizeStateChange])

  if (!showCustomizer) {
    return null
  }

  return (
    <div className="mt-16 mb-16">
      <CustomizationWizard />
    </div>
  )
}
