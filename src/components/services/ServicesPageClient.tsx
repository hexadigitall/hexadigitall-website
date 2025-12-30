// src/components/services/ServicesPageClient.tsx
'use client'

import React from 'react'

interface ServicesPageClientProps {
  servicesPage: {
    title?: string
    description?: string
    bannerBackgroundImage?: { asset?: { url?: string }, alt?: string }
    ogImage?: { asset?: { url?: string }, alt?: string }
    ogTitle?: string
    ogDescription?: string
  }
}

const ServicesPageClient: React.FC<ServicesPageClientProps> = ({ servicesPage }) => {
  if (!servicesPage) {
    return (
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">Our Services</h1>
          <p className="text-lg text-gray-700 mb-8">Explore all our services, packages, and solutions.</p>
        </div>
      </section>
    );
  }
  const bannerUrl = servicesPage?.bannerBackgroundImage?.asset?.url || null;
  const bannerAlt = servicesPage?.bannerBackgroundImage?.alt || servicesPage?.title || 'Services Banner';
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        {bannerUrl ? (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <img
              src={bannerUrl}
              alt={bannerAlt}
              className="w-full h-64 object-cover"
            />
          </div>
        ) : null}
        <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">
          {servicesPage.title || 'Our Services'}
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          {servicesPage.description || 'Explore all our services, packages, and solutions.'}
        </p>
        {/* Add more UI here as needed */}
      </div>
    </section>
  )
}

export default ServicesPageClient
