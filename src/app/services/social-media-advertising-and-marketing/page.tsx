import React from 'react'
import { Metadata } from 'next'
import CompleteServicePage from '@/components/services/CompleteServicePage'
import { MARKETING_PACKAGE_GROUPS } from '@/data/servicePackages'
import { MARKETING_INDIVIDUAL_SERVICES } from '@/data/individualServices'

export const metadata: Metadata = {
  title: 'Social Media Marketing & Advertising Services | Hexadigitall',
  description: 'Grow your audience, increase engagement, and drive sales with comprehensive social media marketing and advertising services. Individual services, custom bundles, and complete packages available.',
  keywords: ['social media marketing', 'digital marketing', 'social media advertising', 'content creation', 'social media management', 'Nigeria'],
}

export default function SocialMediaMarketingPage() {
  return (
    <CompleteServicePage
      pageTitle="Social Media Marketing & Advertising"
      pageDescription="Grow your audience, increase engagement, and drive sales with our comprehensive social media marketing services. From content creation to paid advertising, we help you succeed online."
      heroGradient="from-pink-600/10 via-red-600/10 to-orange-600/10"
      accentColor="pink"
      categoryIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      }
      breadcrumbItems={[
        { label: 'Services', href: '/services' },
        { label: 'Social Media Marketing & Advertising' }
      ]}
      packageGroups={MARKETING_PACKAGE_GROUPS}
      individualServices={MARKETING_INDIVIDUAL_SERVICES}
      serviceType="marketing"
    />
  )
}
