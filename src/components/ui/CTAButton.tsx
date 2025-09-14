// src/components/ui/CTAButton.tsx
'use client'

import Link from 'next/link'
import { ReactNode, MouseEventHandler } from 'react'

interface BaseCTAProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  className?: string
  icon?: ReactNode
  iconPosition?: 'left' | 'right'
}

interface CTAButtonProps extends BaseCTAProps {
  onClick?: MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  href?: undefined
}

interface CTALinkProps extends BaseCTAProps {
  href: string
  onClick?: undefined
  type?: undefined
  disabled?: undefined
}

type CTAProps = CTAButtonProps | CTALinkProps

const getVariantClasses = (variant: string) => {
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl border-transparent',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300 hover:border-gray-400',
    accent: 'bg-accent hover:bg-accent/90 text-white shadow-lg hover:shadow-xl border-transparent',
    success: 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl border-transparent',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl border-transparent',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl border-transparent',
  }
  return variants[variant as keyof typeof variants] || variants.primary
}

const getSizeClasses = (size: string) => {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  }
  return sizes[size as keyof typeof sizes] || sizes.md
}

export function CTAButton(props: CTAProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    icon,
    iconPosition = 'right',
    ...restProps
  } = props

  const baseClasses = `
    inline-flex items-center justify-center
    font-semibold rounded-xl border-2
    transition-all duration-300 
    transform hover:-translate-y-1 active:translate-y-0
    focus:ring-4 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
  `.trim()

  const variantClasses = getVariantClasses(variant)
  const sizeClasses = getSizeClasses(size)
  const allClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  )

  if ('href' in props && props.href) {
    const { href, ...linkProps } = props as CTALinkProps
    return (
      <Link href={href} className={allClasses}>
        {content}
      </Link>
    )
  }

  const { onClick, type, disabled, ...buttonProps } = props as CTAButtonProps
  return (
    <button 
      className={allClasses} 
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {content}
    </button>
  )
}

// Specialized CTA variants for common use cases
export function PrimaryCTA({ children, ...props }: Omit<CTAProps, 'variant'>) {
  const ctaProps = { variant: 'primary' as const, children, ...props }
  return <CTAButton {...(ctaProps as CTAProps)} />
}

export function SecondaryCTA({ children, ...props }: Omit<CTAProps, 'variant'>) {
  const ctaProps = { variant: 'secondary' as const, children, ...props }
  return <CTAButton {...(ctaProps as CTAProps)} />
}

export function AccentCTA({ children, ...props }: Omit<CTAProps, 'variant'>) {
  const ctaProps = { variant: 'accent' as const, children, ...props }
  return <CTAButton {...(ctaProps as CTAProps)} />
}

// Service-specific CTAs with consistent styling
export function RequestServiceCTA({ children = "Request Service", ...props }: Omit<CTAProps, 'variant' | 'icon'>) {
  const ctaProps = {
    variant: 'primary' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    ),
    children,
    ...props
  }
  
  return <CTAButton {...(ctaProps as CTAProps)} />
}

export function LearnMoreCTA({ children = "Learn More", ...props }: Omit<CTAProps, 'variant' | 'icon'>) {
  const ctaProps = {
    variant: 'secondary' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
    children,
    ...props
  }
  
  return <CTAButton {...(ctaProps as CTAProps)} />
}

export function ContactCTA({ children = "Contact Us", ...props }: Omit<CTAProps, 'variant' | 'icon'>) {
  const ctaProps = {
    variant: 'accent' as const,
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    children,
    ...props
  }
  
  return <CTAButton {...(ctaProps as CTAProps)} />
}
