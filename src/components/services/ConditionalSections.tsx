"use client"

import { useState, ReactNode } from 'react'
import { Suspense } from 'react'
import CustomizeHandler from './CustomizeHandler'

interface ConditionalSectionsProps {
  children: ReactNode
  fallbackContent?: ReactNode
}

export default function ConditionalSections({ children, fallbackContent }: ConditionalSectionsProps) {
  const [isCustomizing, setIsCustomizing] = useState(false)

  const handleCustomizeStateChange = (customizing: boolean) => {
    setIsCustomizing(customizing)
  }

  return (
    <>
      <Suspense fallback={null}>
        <CustomizeHandler onCustomizeStateChange={handleCustomizeStateChange} />
      </Suspense>
      
      {!isCustomizing && children}
      {isCustomizing && fallbackContent}
    </>
  )
}