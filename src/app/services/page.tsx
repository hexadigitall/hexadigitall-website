// src/app/services/page.tsx

import React from 'react'
import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import ServicesPageClient from './ServicesPageClient'

export const dynamic = 'force-dynamic';

const servicesPageQuery = groq`*[_type == "servicesPage"][0]{
  title,
  description,
  bannerBackgroundImage {
    asset-> {
      url
    }
  },
  ogTitle,
  ogDescription,
  ogImage {
    asset-> {
      url
    }
  }
}`


export const BASE_URL = 'https://hexadigitall.com';
export const SERVICES_OG_IMAGE = 'https://cdn.sanity.io/images/puzezel0/production/3aea2a5b0d3c40bb0165b12f309deb431ab30b61-1600x840.png';

export const metadata: Metadata = {
  title: 'Our Services | Hexadigitall',
  description: 'Explore our expert web development, marketing, and business solutions.',
  openGraph: {
    title: 'Our Services | Hexadigitall',
    description: 'Explore our expert web development, marketing, and business solutions.',
    images: [{ url: SERVICES_OG_IMAGE, width: 1600, height: 840, alt: 'Hexadigitall Services', type: 'image/png' }],
    type: 'website',
    siteName: 'Hexadigitall',
    url: `${BASE_URL}/services`,
    locale: 'en_NG',
  },
};

export default async function ServicesPage() {
  // Fetch data for the UI
  const data = await client.fetch(servicesPageQuery);

  return (
    <ServicesPageClient 
      initialData={{
        title: data?.title,
        description: data?.description,
        bannerImage: data?.bannerBackgroundImage?.asset?.url
      }} 
    />
  )
}