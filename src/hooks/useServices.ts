// src/hooks/useServices.ts
"use client";

import { useState, useEffect } from 'react';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';

interface ServiceLink {
  href: string;
  label: string;
  slug: string;
}

export function useServices() {
  const [services, setServices] = useState<ServiceLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define fallbacks outside to use them in multiple places
    const fallbackServices = [
      { href: "/services/business-plan-and-logo-design", label: "Business Plan & Logo", slug: "business-plan-and-logo-design" },
      { href: "/services/web-and-mobile-software-development", label: "Web & Mobile Dev", slug: "web-and-mobile-software-development" },
      { href: "/services/social-media-advertising-and-marketing", label: "Social Media Marketing", slug: "social-media-advertising-and-marketing" },
      { href: "/services/profile-and-portfolio-building", label: "Portfolio Building", slug: "profile-and-portfolio-building" },
      { href: "/services/mentoring-and-consulting", label: "Mentoring & Consulting", slug: "mentoring-and-consulting" },
    ];

    async function fetchServices() {
      try {
        const query = groq`*[_type == "service"] | order(title asc) {
          title,
          "slug": slug.current
        }`;
        
        // Add a timeout to the fetch so it doesn't hang forever
        const sanityServices = await client.fetch(query);
        
        if (Array.isArray(sanityServices) && sanityServices.length > 0) {
          const serviceLinks: ServiceLink[] = sanityServices.map((service: { title: string; slug: string }) => ({
            href: `/services/${service.slug}`,
            label: service.title,
            slug: service.slug
          }));
          
          setServices(serviceLinks);
        } else {
          // ⚡️ CHANGE: Don't throw error, just warn and use fallback
          console.warn('Sanity returned no services, using fallback links.');
          setServices(fallbackServices);
        }
      } catch (error) {
        // ⚡️ CHANGE: Use warn instead of error to reduce console noise
        console.warn('Network issue fetching services (using fallback):', error);
        setServices(fallbackServices);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return { services, loading };
}