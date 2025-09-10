// src/lib/structured-data.ts

export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Hexadigitall",
  "alternateName": "Hexadigitall Nigeria",
  "description": "Your all-in-one digital partner in Nigeria, providing business planning, web development, digital marketing, and consulting services.",
  "url": "https://hexadigitall.com",
  "logo": "https://hexadigitall.com/hexadigitall-logo-transparent.png",
  "image": "https://hexadigitall.com/digitall_partner.png",
  "founder": {
    "@type": "Person",
    "name": "Hexadigitall Team"
  },
  "foundingLocation": {
    "@type": "Place",
    "name": "Calabar, Cross River, Nigeria"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Nigeria"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+234-812-580-2140",
    "contactType": "Customer Service",
    "email": "hexadigitztech@gmail.com",
    "availableLanguage": "English"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Calabar",
    "addressRegion": "Cross River",
    "addressCountry": "NG"
  },
  "sameAs": [
    "https://twitter.com/hexadigitall",
    "https://instagram.com/hexadigitall",
    "https://linkedin.com/company/hexadigitall"
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Hexadigitall Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Business Planning & Logo Design",
          "description": "Comprehensive business plan development and professional logo design services"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Web & Mobile Development",
          "description": "Custom web and mobile application development services"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Digital Marketing",
          "description": "Social media advertising and digital marketing services"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Mentoring & Consulting", 
          "description": "Business mentoring and strategic consulting services"
        }
      }
    ]
  }
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Hexadigitall",
  "description": "Your all-in-one digital partner providing business planning, web development, digital marketing, and consulting services in Nigeria.",
  "url": "https://hexadigitall.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://hexadigitall.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "author": {
    "@type": "Organization",
    "name": "Hexadigitall"
  },
  "publisher": {
    "@type": "Organization", 
    "name": "Hexadigitall"
  }
};

export const breadcrumbStructuredData = (items: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const serviceStructuredData = (service: {
  name: string;
  description: string;
  price?: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": {
    "@type": "Organization",
    "name": "Hexadigitall"
  },
  "areaServed": {
    "@type": "Country",
    "name": "Nigeria"
  },
  "url": service.url,
  ...(service.price && {
    "offers": {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "NGN"
    }
  })
});

export const courseStructuredData = (course: {
  name: string;
  description: string;
  price: string;
  currency: string;
  instructor?: string;
  duration?: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.name,
  "description": course.description,
  "provider": {
    "@type": "Organization",
    "name": "Hexadigitall"
  },
  "offers": {
    "@type": "Offer",
    "price": course.price,
    "priceCurrency": course.currency
  },
  "url": course.url,
  ...(course.instructor && {
    "instructor": {
      "@type": "Person",
      "name": course.instructor
    }
  }),
  ...(course.duration && {
    "timeRequired": course.duration
  })
});

export function generateStructuredData(data: any) {
  return JSON.stringify(data, null, 2);
}
