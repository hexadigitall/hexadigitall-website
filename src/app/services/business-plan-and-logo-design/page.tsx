import React from 'react'
import { Metadata } from 'next'
import TieredServicePage from '@/components/services/TieredServicePage'
import { BUSINESS_PLAN_PACKAGE_GROUPS } from '@/data/servicePackages'

// Static metadata for SEO
export const metadata: Metadata = {
  title: 'Business Plan & Logo Design Services | Professional Business Foundation',
  description: 'Launch your business with confidence. Professional business plans, stunning logos, and complete brand packages that establish credibility and attract investors.',
  keywords: 'business plan, logo design, brand identity, startup services, investor pitch deck, business planning',
  openGraph: {
    title: 'Business Plan & Logo Design Services',
    description: 'Complete business planning and brand identity services to launch your business with confidence.',
    images: ['/images/services/business-plan-logo-design.jpg']
  }
}

export default function BusinessPlanLogoPage() {
  return (
    <TieredServicePage
      title="Business Plan & Logo Design"
      description="Launch your business with confidence. Professional business plans, stunning logos, and complete brand packages that establish credibility and attract investors."
      journeyStage="idea"
      packageGroups={BUSINESS_PLAN_PACKAGE_GROUPS}
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Services', href: '/services' },
        { label: 'Business Plan & Logo Design' }
      ]}
    />
  )
}