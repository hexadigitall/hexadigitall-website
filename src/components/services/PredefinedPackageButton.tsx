"use client"

import { ReactNode } from 'react'

interface PredefinedPackageButtonProps {
  packageName: string
  packagePrice: number
  packageFeatures: string[]
  serviceTitle: string
  deliveryTime?: string
  children: ReactNode
}

/**
 * Wrapper component for pre-defined package buttons that directly opens payment modal
 * instead of going through the wizard flow
 */
export default function PredefinedPackageButton({
  packageName,
  packagePrice,
  packageFeatures,
  serviceTitle,
  deliveryTime = "2-4 weeks",
  children
}: PredefinedPackageButtonProps) {
  
  const handleClick = () => {
    // Dispatch custom event with package details
    window.dispatchEvent(new CustomEvent('openDirectPayment', {
      detail: {
        packageName,
        packagePrice,
        packageFeatures,
        serviceTitle,
        deliveryTime
      }
    }))
  }

  return (
    <div onClick={handleClick} style={{ cursor: 'pointer', display: 'contents' }}>
      {children}
    </div>
  )
}
