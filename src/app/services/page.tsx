// src/app/services/page.tsx
import React from 'react'
import ServicesPageClient from './ServicesPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Professional Digital Services | Hexadigitall',
  description: 'Web development, digital marketing, and business planning for Nigerian businesses. Fast, professional and affordable packages.',
  openGraph: {
    title: 'Professional Digital Services',
    description: 'Transform your business with expert web development, marketing, and consulting services.',
    images: [{ url: '/og-images/services-hub.jpg', width: 1200, height: 630, alt: 'Hexadigitall Services' }],
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Digital Services',
    description: 'Web Dev · Marketing · Business Planning',
    images: ['/og-images/services-hub.jpg']
  }
}


export default function ServicesPage() {
  return <ServicesPageClient />
}
