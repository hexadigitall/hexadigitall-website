/**
 * SiteSEO Component
 * 
 * Centralized SEO and Open Graph meta tags component for Next.js App Router.
 * Provides sensible defaults and proper URL construction for both static and dynamic pages.
 * 
 * @example Static Page (App Router - use in generateMetadata)
 * ```tsx
 * export const metadata = generateSiteSEO({
 *   title: 'About Us',
 *   description: 'Learn about Hexadigitall...',
 *   path: '/about',
 * });
 * ```
 * 
 * @example Dynamic Page
 * ```tsx
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const service = await fetchService(params.slug);
 *   return generateSiteSEO({
 *     title: service.title,
 *     description: service.description,
 *     path: `/services/${params.slug}`,
 *     image: service.ogImage,
 *   });
 * }
 * ```
 */

import type { Metadata } from 'next';

export interface SiteSEOProps {
  /** Page title (will be suffixed with | Hexadigitall) */
  title: string;
  
  /** Page description for meta tags */
  description: string;
  
  /** Relative path from site root (e.g., '/about', '/services/web-development') */
  path: string;
  
  /** Absolute URL to Open Graph image (defaults to site default) */
  image?: string;
  
  /** Image width in pixels (default: 1200) */
  imageWidth?: number;
  
  /** Image height in pixels (default: 630) */
  imageHeight?: number;
  
  /** Image alt text (defaults to title) */
  imageAlt?: string;
  
  /** Image MIME type (default: 'image/jpeg') */
  imageType?: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
  
  /** Open Graph type (default: 'website') */
  type?: 'website' | 'article' | 'profile' | 'book' | 'video.movie' | 'video.episode';
  
  /** Article publish date (ISO 8601) - only for type='article' */
  publishedTime?: string;
  
  /** Article modified date (ISO 8601) - only for type='article' */
  modifiedTime?: string;
  
  /** Article author(s) - only for type='article' */
  authors?: string[];
  
  /** Article tags/keywords - only for type='article' */
  tags?: string[];
  
  /** Keywords for meta tag */
  keywords?: string[];
  
  /** Twitter handle (without @) for creator */
  twitterCreator?: string;
  
  /** Twitter card type */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  
  /** Locale (default: 'en_US') */
  locale?: string;
  
  /** Additional alternate locales */
  alternateLocales?: string[];
  
  /** Disable indexing for this page */
  noindex?: boolean;
  
  /** Disable following links on this page */
  nofollow?: boolean;
}

// Site configuration
const SITE_CONFIG = {
  name: 'Hexadigitall',
  url: 'https://hexadigitall.com',
  defaultImage: 'https://hexadigitall.com/og-images/services-hub.jpg',
  defaultImageAlt: 'Hexadigitall - Your Digital Partner in Nigeria',
  twitterHandle: '@hexadigitall',
  locale: 'en_US',
  titleSuffix: '| Hexadigitall',
} as const;

/**
 * Generate Next.js Metadata object with comprehensive SEO tags
 */
export function generateSiteSEO(props: SiteSEOProps): Metadata {
  const {
    title,
    description,
    path,
    image = SITE_CONFIG.defaultImage,
    imageWidth = 1200,
    imageHeight = 630,
    imageAlt = title,
    imageType = 'image/jpeg',
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    tags,
    keywords,
    twitterCreator,
    twitterCard = 'summary_large_image',
    locale = SITE_CONFIG.locale,
    alternateLocales,
    noindex = false,
    nofollow = false,
  } = props;

  // Construct absolute URL
  const url = `${SITE_CONFIG.url}${path}`;
  
  // Ensure image URL is absolute
  const absoluteImageUrl = image.startsWith('http') 
    ? image 
    : `${SITE_CONFIG.url}${image}`;

  // Build Open Graph metadata
  const openGraph: Metadata['openGraph'] = {
    type,
    locale,
    url,
    siteName: SITE_CONFIG.name,
    title: `${title} ${SITE_CONFIG.titleSuffix}`,
    description,
    images: [
      {
        url: absoluteImageUrl,
        secureUrl: absoluteImageUrl, // HTTPS version
        width: imageWidth,
        height: imageHeight,
        alt: imageAlt,
        type: imageType,
      },
    ],
  };

  // Add article-specific metadata
  if (type === 'article') {
    openGraph.publishedTime = publishedTime;
    openGraph.modifiedTime = modifiedTime;
    openGraph.authors = authors;
    openGraph.tags = tags;
  }

  // Add alternate locales
  if (alternateLocales && alternateLocales.length > 0) {
    openGraph.alternateLocale = alternateLocales;
  }

  // Build Twitter metadata
  const twitter: Metadata['twitter'] = {
    card: twitterCard,
    site: SITE_CONFIG.twitterHandle,
    creator: twitterCreator ? `@${twitterCreator}` : SITE_CONFIG.twitterHandle,
    title: `${title} ${SITE_CONFIG.titleSuffix}`,
    description,
    images: [absoluteImageUrl],
  };

  // Build robots directive
  const robots: Metadata['robots'] = {
    index: !noindex,
    follow: !nofollow,
    googleBot: {
      index: !noindex,
      follow: !nofollow,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  };

  // Combine all metadata
  return {
    title: `${title} ${SITE_CONFIG.titleSuffix}`,
    description,
    keywords,
    openGraph,
    twitter,
    robots,
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate structured data for articles (JSON-LD)
 */
export function generateArticleStructuredData(props: {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedTime: string;
  modifiedTime: string;
  author: {
    name: string;
    url?: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: props.title,
    description: props.description,
    image: props.image,
    datePublished: props.publishedTime,
    dateModified: props.modifiedTime,
    author: {
      '@type': 'Person',
      name: props.author.name,
      url: props.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/hexadigitall-logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': props.url,
    },
  };
}

/**
 * Generate structured data for services (JSON-LD)
 */
export function generateServiceStructuredData(props: {
  name: string;
  description: string;
  url: string;
  image: string;
  price?: {
    min: number;
    max?: number;
    currency: string;
  };
}) {
  const serviceData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: props.name,
    description: props.description,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria',
    },
    url: props.url,
    image: props.image,
  };

  // Add pricing if provided
  if (props.price) {
    serviceData.offers = {
      '@type': 'Offer',
      priceCurrency: props.price.currency,
      price: props.price.min.toString(),
      priceRange: props.price.max 
        ? `${props.price.min}-${props.price.max}`
        : undefined,
    };
  }

  return serviceData;
}

/**
 * Generate structured data for courses (JSON-LD)
 */
export function generateCourseStructuredData(props: {
  name: string;
  description: string;
  url: string;
  image: string;
  price?: {
    amount: number;
    currency: string;
  };
  duration?: string; // ISO 8601 duration (e.g., 'P8W' for 8 weeks)
  instructor?: string;
}) {
  const courseData: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: props.name,
    description: props.description,
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    url: props.url,
    image: props.image,
  };

  // Add pricing if provided
  if (props.price) {
    courseData.offers = {
      '@type': 'Offer',
      priceCurrency: props.price.currency,
      price: props.price.amount.toString(),
      category: 'Course',
    };
  }

  // Add duration if provided
  if (props.duration) {
    courseData.timeRequired = props.duration;
  }

  // Add instructor if provided
  if (props.instructor) {
    courseData.instructor = {
      '@type': 'Person',
      name: props.instructor,
    };
  }

  return courseData;
}

/**
 * Helper to generate breadcrumb structured data (JSON-LD)
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Validate image URL for social sharing
 */
export function validateSocialImage(imageUrl: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if URL is absolute
  if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    errors.push('Image URL must be absolute (start with https://)');
  }

  // Check if HTTPS
  if (imageUrl.startsWith('http://')) {
    warnings.push('Consider using HTTPS for better security and compatibility');
  }

  // Check file extension
  const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const hasValidExtension = validExtensions.some(ext => 
    imageUrl.toLowerCase().includes(ext)
  );
  
  if (!hasValidExtension) {
    warnings.push('Image URL should have a valid extension (.jpg, .png, .gif, .webp)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Export site config for use in other files
export { SITE_CONFIG };
