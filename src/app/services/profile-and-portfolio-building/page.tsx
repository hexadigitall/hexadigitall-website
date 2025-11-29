import React from 'react'
import { Metadata } from 'next'
import CompleteServicePage from '@/components/services/CompleteServicePage'
import { PORTFOLIO_PACKAGE_GROUPS } from '@/data/servicePackages'
import { PORTFOLIO_INDIVIDUAL_SERVICES } from '@/data/individualServices'

export const metadata: Metadata = {
  title: 'Professional Portfolio & Profile Building Services | Hexadigitall',
  description: 'Showcase your skills and attract opportunities with professional portfolios, optimized profiles, and personal branding that makes you stand out from the competition.',
  keywords: ['portfolio building', 'professional profile', 'CV writing', 'resume design', 'LinkedIn optimization', 'personal branding', 'Nigeria'],
}

export default function ProfilePortfolioPage() {
  return (
    <CompleteServicePage
      pageTitle="Profile & Portfolio Building"
      pageDescription="Showcase your skills and attract opportunities with professional portfolios, optimized profiles, and personal branding that makes you stand out from the competition."
      heroGradient="from-purple-600/10 via-blue-600/10 to-indigo-600/10"
      accentColor="purple"
      categoryIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      }
      breadcrumbItems={[
        { label: 'Services', href: '/services' },
        { label: 'Profile & Portfolio Building' }
      ]}
      packageGroups={PORTFOLIO_PACKAGE_GROUPS}
      individualServices={PORTFOLIO_INDIVIDUAL_SERVICES}
      serviceType="portfolio"
    />
  )
}