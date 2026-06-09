// src/lib/seo.ts
import type { Metadata } from 'next';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  path = '',
  image = '/digitall_partner.png',
  type = 'website',
  publishedTime,
  modifiedTime
}: SEOConfig): Metadata {
  const baseUrl = 'https://hexadigitall.com';
  const url = `${baseUrl}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return {
    title: `${title} | Hexadigitall`,
    description,
    keywords: [
      ...keywords,
      'Hexadigitall',
      'Nigeria',
      'digital services',
      'web development',
      'business planning',
      'digital marketing'
    ],
    authors: [{ name: 'Hexadigitall Team' }],
    creator: 'Hexadigitall',
    publisher: 'Hexadigitall',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      type: type || 'website',
      url,
      siteName: 'Hexadigitall',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@hexadigitall',
      site: '@hexadigitall',
    },
    alternates: {
      canonical: url,
    },
  };
}

export const baseKeywords = [
  'web development Nigeria',
  'digital marketing Nigeria',
  'business planning',
  'startup consulting',
  'mobile app development',
  'logo design',
  'brand identity',
  'social media marketing',
  'software development',
  'business plan writing',
  'digital transformation',
  'tech consulting Nigeria',
  'Calabar web development',
  'Cross River tech services'
];

export const serviceKeywords = {
  'business-plan-and-logo-design': [
    'business plan writing',
    'investor ready business plan',
    'logo design Nigeria',
    'brand identity design',
    'startup business plan',
    'business planning services',
    'professional logo design',
    'brand development Nigeria'
  ],
  'web-and-mobile-software-development': [
    'web development Nigeria',
    'mobile app development',
    'software development services',
    'custom web applications',
    'responsive web design',
    'e-commerce development',
    'mobile app Nigeria',
    'web application development'
  ],
  'social-media-advertising-and-marketing': [
    'digital marketing Nigeria',
    'social media marketing',
    'Facebook advertising',
    'Instagram marketing',
    'social media management',
    'online advertising Nigeria',
    'digital advertising services',
    'social media strategy'
  ],
  'profile-and-portfolio-building': [
    'professional portfolio',
    'personal branding',
    'LinkedIn optimization',
    'career portfolio',
    'professional profile',
    'portfolio development',
    'personal brand Nigeria',
    'career development'
  ],
  'mentoring-and-consulting': [
    'business mentoring Nigeria',
    'startup consulting',
    'business strategy consulting',
    'entrepreneurship mentoring',
    'business advisory services',
    'startup guidance Nigeria',
    'business coaching',
    'strategic consulting'
  ]
};

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}
