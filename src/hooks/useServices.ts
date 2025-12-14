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
        // Fallback to services that actually exist with correct slugs
        // These URLs have been verified to work correctly
        setServices([
          { href: "/services/business-plan-and-logo-design", label: "Business Plan & Logo", slug: "business-plan-and-logo-design" },
          { href: "/services/web-and-mobile-software-development", label: "Web & Mobile Dev", slug: "web-and-mobile-software-development" },
          { href: "/services/social-media-advertising-and-marketing", label: "Social Media Marketing", slug: "social-media-advertising-and-marketing" },
          { href: "/services/profile-and-portfolio-building", label: "Portfolio Building", slug: "profile-and-portfolio-building" },
          { href: "/services/mentoring-and-consulting", label: "Mentoring & Consulting", slug: "mentoring-and-consulting" },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  return { services, loading };
}
