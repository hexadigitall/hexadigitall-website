// src/components/SEOStructuredData.tsx
"use client";

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function SEOStructuredData() {
  const pathname = usePathname();
  
  // Organization Schema (for all pages)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Hexadigitall",
    "alternateName": "Hexadigitall Nigeria",
    "url": "https://hexadigitall.com",
    "logo": "https://hexadigitall.com/digitall_partner.png",
    "image": "https://hexadigitall.com/digitall_partner.png",
    "description": "Your all-in-one digital partner in Nigeria, turning ideas into reality. Expert web development, digital marketing, and business planning services.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Lagos",
      "addressLocality": "Lagos",
      "addressRegion": "Lagos State",
      "addressCountry": "NG"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+234-812-580-2140",
      "contactType": "customer service",
      "availableLanguage": ["English"],
      "areaServed": "NG"
    },
    "founder": {
      "@type": "Person",
      "name": "Hexadigitall Team"
    },
    "foundingDate": "2023",
    "sameAs": [
      "https://www.linkedin.com/company/hexadigitall",
      "https://twitter.com/hexadigitall",
      "https://www.facebook.com/hexadigitall"
    ],
    "serviceArea": {
      "@type": "Country",
      "name": "Nigeria"
    },
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Web Development",
          "description": "Professional web development services in Nigeria"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Digital Marketing",
          "description": "Digital marketing and social media services"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Business Planning",
          "description": "Business plan development and consulting"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Training Courses",
          "description": "Digital skills training and courses"
        }
      }
    ]
  };

  // Website Schema
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Hexadigitall",
    "url": "https://hexadigitall.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://hexadigitall.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hexadigitall",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hexadigitall.com/digitall_partner.png"
      }
    }
  };

  // Local Business Schema (for better local SEO)
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://hexadigitall.com/#organization",
    "name": "Hexadigitall",
    "alternateName": "Hexadigitall Nigeria",
    "description": "Leading digital services company in Nigeria providing web development, digital marketing, and business planning services.",
    "url": "https://hexadigitall.com",
    "telephone": "+234-812-580-2140",
    "email": "hexadigitztech@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Lagos",
      "addressLocality": "Lagos",
      "addressRegion": "Lagos State",
      "postalCode": "",
      "addressCountry": "NG"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 6.5244,
      "longitude": 3.3792
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday", 
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "$$",
    "paymentAccepted": "Cash, Credit Card, Bank Transfer",
    "currenciesAccepted": "NGN, USD",
    "areaServed": {
      "@type": "Country",
      "name": "Nigeria"
    },
    "serviceArea": {
      "@type": "Country", 
      "name": "Nigeria"
    },
    "image": [
      "https://hexadigitall.com/digitall_partner.png"
    ],
    "logo": "https://hexadigitall.com/digitall_partner.png",
    "sameAs": [
      "https://www.linkedin.com/company/hexadigitall",
      "https://twitter.com/hexadigitall",
      "https://www.facebook.com/hexadigitall"
    ]
  };

  // Course Provider Schema (for courses pages)
  const courseProviderSchema = pathname.includes('/courses') ? {
    "@context": "https://schema.org",
    "@type": "EducationOrganization",
    "name": "Hexadigitall",
    "url": "https://hexadigitall.com",
    "description": "Professional digital skills training provider in Nigeria",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Lagos",
      "addressRegion": "Lagos State",
      "addressCountry": "NG"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Skills Courses",
      "itemListElement": [
        {
          "@type": "Course",
          "name": "Web Development",
          "description": "Learn modern web development with React, Next.js",
          "provider": {
            "@type": "Organization",
            "name": "Hexadigitall"
          }
        },
        {
          "@type": "Course", 
          "name": "Digital Marketing",
          "description": "Master digital marketing and social media strategies",
          "provider": {
            "@type": "Organization",
            "name": "Hexadigitall"
          }
        }
      ]
    }
  } : null;

  // Service Provider Schema (for services pages)  
  const serviceProviderSchema = pathname.includes('/services') ? {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Hexadigitall Digital Services",
    "url": "https://hexadigitall.com/services",
    "description": "Professional digital services including web development, mobile app development, digital marketing, and business planning in Nigeria",
    "provider": {
      "@type": "Organization",
      "name": "Hexadigitall"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Nigeria"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Digital Services",
      "itemListElement": [
        {
          "@type": "Service",
          "name": "Web Development",
          "description": "Custom website and web application development"
        },
        {
          "@type": "Service",
          "name": "Mobile App Development", 
          "description": "iOS and Android mobile application development"
        },
        {
          "@type": "Service",
          "name": "Digital Marketing",
          "description": "Social media marketing and digital advertising"
        },
        {
          "@type": "Service",
          "name": "Business Planning",
          "description": "Business plan development and strategy consulting"
        }
      ]
    }
  } : null;

  return (
    <>
      {/* Organization Schema */}
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      {/* Website Schema */}
      <Script
        id="website-schema" 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />

      {/* Local Business Schema */}
      <Script
        id="local-business-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      {/* Course Provider Schema */}
      {courseProviderSchema && (
        <Script
          id="course-provider-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(courseProviderSchema),
          }}
        />
      )}

      {/* Service Provider Schema */}
      {serviceProviderSchema && (
        <Script
          id="service-provider-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceProviderSchema),
          }}
        />
      )}
    </>
  );
}