import React from 'react'
import { Metadata } from 'next'
import CompleteServicePage from '@/components/services/CompleteServicePage'
import { BUSINESS_PLAN_PACKAGE_GROUPS } from '@/data/servicePackages'
import { BUSINESS_PLAN_INDIVIDUAL_SERVICES, BRANDING_INDIVIDUAL_SERVICES } from '@/data/individualServices'

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
    <CompleteServicePage
      pageTitle="Business Plan & Logo Design"
      pageDescription="Launch your business with confidence. Professional business plans, stunning logos, and complete brand packages that establish credibility and attract investors."
      heroGradient="from-blue-600/10 via-indigo-600/10 to-purple-600/10"
      heroImage="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80"
      accentColor="blue"
      categoryIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      }
      breadcrumbItems={[
        { label: 'Services', href: '/services' },
        { label: 'Business Plan & Logo Design' }
      ]}
      packageGroups={BUSINESS_PLAN_PACKAGE_GROUPS}
      individualServices={[...BUSINESS_PLAN_INDIVIDUAL_SERVICES, ...BRANDING_INDIVIDUAL_SERVICES]}
      serviceType="business"
    />
  )
}