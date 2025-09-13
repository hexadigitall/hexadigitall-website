// src/components/ui/OptimizedImage.tsx
"use client"

import Image, { ImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<ImageProps, 'sizes'> {
  sizes?: string
  fallback?: string
  containerClassName?: string
}

export default function OptimizedImage({
  src,
  alt,
  sizes,
  fill,
  fallback = '/digitall_partner.png',
  containerClassName = '',
  className = '',
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  // Auto-generate appropriate sizes if not provided
  const autoSizes = !sizes ? (
    fill 
      ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
  ) : sizes

  const handleError = () => {
    if (!hasError && fallback && imgSrc !== fallback) {
      setImgSrc(fallback)
      setHasError(true)
    }
  }

  const baseClassName = `transition-opacity duration-300 ${
    hasError ? 'opacity-75' : 'opacity-100'
  } ${className}`

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${containerClassName}`}>
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes={autoSizes}
          className={baseClassName}
          priority={priority}
          onError={handleError}
          {...props}
        />
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      sizes={autoSizes}
      className={baseClassName}
      priority={priority}
      onError={handleError}
      {...props}
    />
  )
}