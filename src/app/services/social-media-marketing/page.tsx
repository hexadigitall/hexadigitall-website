import React from 'react'
import { Metadata } from 'next'
import TieredServicePage from '@/components/services/TieredServicePage'
import { MARKETING_PACKAGE_GROUPS } from '@/data/servicePackages'

export const metadata: Metadata = {
  title: 'Social Media Marketing Services | Hexadigitall',
  description: 'Grow your audience, increase engagement, and drive sales with comprehensive social media marketing services.',
  keywords: ['social media marketing', 'digital marketing', 'content creation', 'social media management', 'Nigeria'],
}

export default function SocialMediaMarketingPage() {
  return (
    <TieredServicePage
      title="Social Media Marketing"
      description="Grow your audience, increase engagement, and drive sales with comprehensive social media marketing services. From content creation to paid advertising, we help you succeed online."
      journeyStage="grow"
      packageGroups={MARKETING_PACKAGE_GROUPS}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Social Media Marketing' }
      ]}
    />
  )
}
