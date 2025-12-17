/**
 * Open Graph (OG) Helper Library
 * 
 * Utilities for generating consistent and complete Open Graph meta tags
 * for social media sharing across Facebook, Twitter, LinkedIn, and WhatsApp.
 */

import type { Metadata } from 'next';

export interface OGImageOptions {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
}

export interface OGMetadataOptions {
  title: string;
  description: string;
  url: string;
  siteName?: string;
  type?: 'website' | 'article' | 'product';
  image?: OGImageOptions;
  images?: OGImageOptions[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  twitterHandle?: string;
}

/**
 * Get absolute URL for the site
 */
export function getAbsoluteUrl(path: string = ''): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hexadigitall.com';
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

/**
 * Convert Sanity image URL to absolute OG-friendly URL
 * Ensures images from Sanity CDN are properly formatted for social sharing
 */
export function getSanityImageUrl(imageUrl: string, width: number = 1200, height: number = 630): string {
  if (!imageUrl) {
    return getAbsoluteUrl('/og-images/default.jpg');
  }

  // If already absolute, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If relative path to public folder
  if (imageUrl.startsWith('/')) {
    return getAbsoluteUrl(imageUrl);
  }

  return imageUrl;
}

/**
 * Generate complete Open Graph metadata for a page
 * Following best practices for social media sharing
 */
export function generateOGMetadata(options: OGMetadataOptions): Metadata {
  const {
    title,
    description,
    url,
    siteName = 'Hexadigitall',
    type = 'website',
    image,
    images,
    publishedTime,
    modifiedTime,
    authors,
    tags,
    twitterHandle = '@hexadigitall',
  } = options;

  // Prepare images array
  const ogImages = images || (image ? [image] : []);
  
  // Ensure all images have required properties
  const formattedImages = ogImages.map((img) => ({
    url: getAbsoluteUrl(img.url),
    secureUrl: getAbsoluteUrl(img.url), // HTTPS version
    width: img.width || 1200,
    height: img.height || 630,
    alt: img.alt || title,
    type: img.type || 'image/jpeg',
  }));

  // Base metadata
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      type,
      locale: 'en_US',
      url: getAbsoluteUrl(url),
      siteName,
      title,
      description,
      images: formattedImages,
    },
    twitter: {
      card: 'summary_large_image',
      site: twitterHandle,
      creator: twitterHandle,
      title,
      description,
      images: formattedImages.map((img) => img.url),
    },
    alternates: {
      canonical: getAbsoluteUrl(url),
    },
  };

  // Add article-specific metadata
  if (type === 'article' && metadata.openGraph) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors,
      tags,
    };
  }

  return metadata;
}

/**
 * Generate metadata for a product page (e-commerce)
 * Includes product-specific OG tags
 */
export function generateProductMetadata(options: {
  title: string;
  description: string;
  url: string;
  image: string;
  price?: string;
  currency?: string;
  availability?: 'in stock' | 'out of stock' | 'preorder';
  brand?: string;
  condition?: 'new' | 'used' | 'refurbished';
}): Metadata {
  const metadata = generateOGMetadata({
    title: options.title,
    description: options.description,
    url: options.url,
    type: 'product' as 'website', // Type assertion as Next.js Metadata type is limited
    image: {
      url: options.image,
      width: 1200,
      height: 630,
      alt: options.title,
    },
  });

  // Note: Full product:* tags require extending Next.js Metadata type
  // For now, these would be added via page-specific head elements if needed

  return metadata;
}

/**
 * Default fallback image for pages without specific OG images
 */
export const DEFAULT_OG_IMAGE: OGImageOptions = {
  url: '/digitall_partner.png',
  width: 1200,
  height: 630,
  alt: 'Hexadigitall - Your Digital Partner',
  type: 'image/png',
};

/**
 * Validate that an OG image meets social platform requirements
 */
export function validateOGImage(image: OGImageOptions): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!image.url) {
    errors.push('Image URL is required');
  }

  // Check dimensions
  const width = image.width || 0;
  const height = image.height || 0;

  if (width < 200 || height < 200) {
    errors.push('Image must be at least 200x200px');
  }

  if (width < 1200 || height < 630) {
    warnings.push('Recommended size is 1200x630px for optimal display');
  }

  // Check aspect ratio
  const aspectRatio = width / height;
  if (aspectRatio < 1.5 || aspectRatio > 2.5) {
    warnings.push('Recommended aspect ratio is 1.91:1 (1200x630)');
  }

  // Check image type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (image.type && !validTypes.includes(image.type)) {
    warnings.push(`Image type ${image.type} may not be supported by all platforms`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Generate share URLs for various social platforms
 */
export function generateShareUrls(url: string, title?: string, description?: string) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title || '');
  const encodedDescription = encodeURIComponent(description || '');

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };
}
