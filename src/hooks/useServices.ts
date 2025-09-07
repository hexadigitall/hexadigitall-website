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
    async function fetchServices() {
      try {
        // Check if Sanity is properly configured
        if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.NEXT_PUBLIC_SANITY_DATASET) {
          console.warn('Sanity not configured, using fallback services');
          throw new Error('Sanity configuration missing');
        }

        const query = groq`*[_type == "service"] | order(title asc) {
          title,
          "slug": slug.current
        }`;
        
        const sanityServices = await client.fetch(query);
        
        if (Array.isArray(sanityServices) && sanityServices.length > 0) {
          const serviceLinks: ServiceLink[] = sanityServices.map((service: { title: string; slug: string }) => ({
            href: `/services/${service.slug}`,
            label: service.title,
            slug: service.slug
          }));
          
          setServices(serviceLinks);
        } else {
          throw new Error('No services found in Sanity');
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        // Fallback to hardcoded services if fetch fails
        setServices([
          { href: "/services/business-plan-logo", label: "Business Plan & Logo", slug: "business-plan-logo" },
          { href: "/services/web-mobile-development", label: "Web & Mobile Dev", slug: "web-mobile-development" },
          { href: "/services/social-media-marketing", label: "Social Media Marketing", slug: "social-media-marketing" },
          { href: "/services/portfolio-building", label: "Portfolio Building", slug: "portfolio-building" },
          { href: "/services/mentoring-consulting", label: "Mentoring & Consulting", slug: "mentoring-consulting" },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return { services, loading };
}
