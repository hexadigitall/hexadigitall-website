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
export const SERVICES_OG_IMAGE = `${BASE_URL}/assets/images/services/service-portfolio-website.jpg`;

export const metadata: Metadata = {
  title: 'Our Services | Hexadigitall',
  description: 'Explore our expert web development, marketing, and business solutions.',
  openGraph: {
    title: 'Our Services | Hexadigitall',
    description: 'Explore our expert web development, marketing, and business solutions.',
    images: [{ url: SERVICES_OG_IMAGE, width: 1200, height: 630, alt: 'Hexadigitall Services', type: 'image/jpeg' }],
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