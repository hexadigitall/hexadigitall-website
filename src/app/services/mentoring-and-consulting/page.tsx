import React from 'react'
import { Metadata } from 'next'
import CompleteServicePage from '@/components/services/CompleteServicePage'
import { MENTORING_PACKAGE_GROUPS } from '@/data/servicePackages'
import { MENTORING_INDIVIDUAL_SERVICES } from '@/data/individualServices'

export const metadata: Metadata = {
  title: 'Business Mentoring & Consulting Services | Expert Guidance | Hexadigitall',
  description: 'Expert guidance from industry professionals. Strategic consulting, career mentoring, and business advice to accelerate your growth and avoid costly mistakes.',
  keywords: ['business mentoring', 'consulting services', 'career coaching', 'business strategy', 'professional development', 'startup consulting', 'Nigeria'],
}

export default function MentoringConsultingPage() {
  return (
    <CompleteServicePage
      pageTitle="Mentoring & Consulting"
      pageDescription="Expert guidance from industry professionals. Strategic consulting, career mentoring, and business advice to accelerate your growth and avoid costly mistakes."
      heroGradient="from-indigo-600/10 via-blue-600/10 to-purple-600/10"
      heroImage="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
      accentColor="indigo"
      categoryIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      }
      breadcrumbItems={[
        { label: 'Services', href: '/services' },
        { label: 'Mentoring & Consulting' }
      ]}
      packageGroups={MENTORING_PACKAGE_GROUPS}
      individualServices={MENTORING_INDIVIDUAL_SERVICES}
      serviceType="mentoring"
    />
  )
}