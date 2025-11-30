import React from 'react'
import { Metadata } from 'next'
import CompleteServicePage from '@/components/services/CompleteServicePage'
import { WEB_DEV_PACKAGE_GROUPS } from '@/data/servicePackages'
import { WEB_DEV_INDIVIDUAL_SERVICES } from '@/data/individualServices'

export const metadata: Metadata = {
  title: 'Web & Mobile App Development Services | Custom Software | Hexadigitall',
  description: 'Transform your digital vision into reality with our custom web and mobile solutions. From landing pages to enterprise applications, we build scalable, user-friendly products.',
  keywords: ['web development', 'mobile app development', 'custom software', 'react development', 'next.js', 'e-commerce', 'Nigeria web developers'],
}

export default function WebMobileDevelopmentPage() {
  return (
    <CompleteServicePage
      pageTitle="Web & Mobile Development"
      pageDescription="Transform your digital vision into reality with our custom web and mobile solutions. From landing pages to enterprise applications, we build scalable, user-friendly products."
      heroGradient="from-blue-600/10 via-cyan-600/10 to-sky-600/10"
      heroImage="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1920&q=80"
      accentColor="blue"
      categoryIcon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      }
      breadcrumbItems={[
        { label: 'Services', href: '/services' },
        { label: 'Web & Mobile Development' }
      ]}
      packageGroups={WEB_DEV_PACKAGE_GROUPS}
      individualServices={WEB_DEV_INDIVIDUAL_SERVICES}
      serviceType="web-dev"
    />
  )
}

