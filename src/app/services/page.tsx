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

export async function generateMetadata(): Promise<Metadata> {
  const data = await client.fetch(servicesPageQuery);

  const title = data?.ogTitle || data?.title || 'Our Services | Hexadigitall';
  const description = data?.ogDescription || data?.description || 'Explore our expert web development, marketing, and business solutions.';
  
  // Logic: Sanity OG -> Sanity Banner -> Local Fallback
  const ogImage = data?.ogImage?.asset?.url 
    || data?.bannerBackgroundImage?.asset?.url 
    || '/assets/images/services/service-portfolio-website.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://hexadigitall.com/services',
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

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