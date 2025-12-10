// src/app/page.tsx

import type { Metadata } from 'next';
import Hero from '@/components/sections/Hero';
import FeaturedCourses from '@/components/sections/FeaturedCourses';
import WhyChooseUs from '@/components/sections/WhyChooseUs';
import Testimonials from '@/components/sections/Testimonials';
import FinalCTA from '@/components/sections/FinalCTA';
import { organizationStructuredData, websiteStructuredData, generateStructuredData } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Hexadigitall | Your All-in-One Digital Partner in Nigeria',
  description: 'Transform your business ideas into reality with Hexadigitall. Expert web development, digital marketing, business planning, and consulting services in Nigeria. From idea to impact.',
  keywords: ['digital partner Nigeria', 'web development Nigeria', 'business planning', 'digital marketing', 'software development', 'startup consulting', 'logo design', 'business plan writing'],
  openGraph: {
    title: 'Hexadigitall | Your All-in-One Digital Partner',
    description: 'Transform your business ideas into reality with expert digital services in Nigeria.',
    type: 'website',
    url: 'https://hexadigitall.com',
    images: [{
      url: 'https://hexadigitall.com/digitall_partner.png',
      width: 1200,
      height: 630,
      alt: 'Hexadigitall - Your Digital Partner',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hexadigitall | Your Digital Partner',
    description: 'Transform your business ideas into reality with expert digital services in Nigeria.',
  },
  alternates: {
    canonical: 'https://hexadigitall.com',
  },
};

export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(organizationStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: generateStructuredData(websiteStructuredData),
        }}
      />
      
      <Hero />
      <FeaturedCourses id="courses-preview" />
      <WhyChooseUs />
      <Testimonials />
      <FinalCTA />
    </>
  );
}
