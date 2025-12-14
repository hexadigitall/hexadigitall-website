// src/app/services/page.tsx
import React from 'react'
import ServicesPageClient from './ServicesPageClient'
import type { Metadata } from 'next'

const BASE_URL = 'https://hexadigitall.com'
const SERVICES_OG_IMAGE = `${BASE_URL}/og-images/services-hub.jpg`

export const metadata: Metadata = {
  title: 'Professional Digital Services | Hexadigitall',
  description: 'Web development, digital marketing, business planning, and mentoring for Nigerian businesses. Starting at ₦15,000 with fast delivery.',
  openGraph: {
    title: 'Professional Digital Services for Your Business',
    description: 'Web, marketing, and business planning packages tailored for Nigerian businesses, with clear pricing and fast delivery. Starting at ₦15,000 and ready to launch your next project.',
    images: [{
      url: SERVICES_OG_IMAGE,
      width: 1200,
      height: 630,
      alt: 'Hexadigitall Services',
      type: 'image/jpeg'
    }],
    type: 'website',
    siteName: 'Hexadigitall',
    url: `${BASE_URL}/services`,
    locale: 'en_NG'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Digital Services for Nigerian Businesses',
    description: 'Web Dev · Marketing · Business Planning · From ₦15,000. Nigerian-focused pricing, rapid delivery, and expert support to launch your project.',
    images: [SERVICES_OG_IMAGE],
    creator: '@hexadigitall',
    site: '@hexadigitall'
  },
  alternates: {
    canonical: `${BASE_URL}/services`
  }
}


export default function ServicesPage() {
  return <ServicesPageClient />
}
