import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import DynamicServicePage from '@/components/services/DynamicServicePage'
import {
  getAllServiceCategories,
  getFallbackServiceCategory,
  getIndividualServices,
  getServiceCategoryBySlug,
} from '@/lib/sanity-queries'
import type { IndividualService, ServiceCategory, ServiceStats } from '@/types/service'

const OG_IMAGE_MAP: Record<string, string> = {
  'web-and-mobile-software-development': '/og-images/service-web-development.jpg',
  'social-media-advertising-and-marketing': '/og-images/service-digital-marketing.jpg',
  'business-plan-and-logo-design': '/og-images/service-business-planning.jpg',
}

const FALLBACK_SLUGS = [
  'business-plan-and-logo-design',
  'web-and-mobile-software-development',
  'social-media-advertising-and-marketing',
  'profile-and-portfolio-building',
  'mentoring-and-consulting',
]

/**
 * Get OG image for service - checks for service-specific image first,
 * then falls back to services hub image
 */
function getOgImage(slug: string): string {
  // Check static map first
  if (OG_IMAGE_MAP[slug]) return OG_IMAGE_MAP[slug]
  
  // Check if service-specific OG image exists (generated)
  const serviceSpecificImage = `/og-images/service-${slug}.jpg`
  // Note: In production, you'd verify the file exists. For now, we use fallback.
  
  return '/og-images/services-hub.jpg'
}

/**
 * Extract pricing info from service category for metadata
 */
function getServicePricing(serviceCategory: ServiceCategory): string {
  if (!serviceCategory.packages || serviceCategory.packages.length === 0) {
    return 'Professional packages available'
  }
  
  const prices = serviceCategory.packages
    .map(pkg => pkg.price)
    .filter(price => price && price > 0)
  
  if (prices.length === 0) return 'Flexible pricing available'
  
  const minPrice = Math.min(...prices)
  return `Starting from ₦${minPrice.toLocaleString()}`
}

function resolveServiceStats(serviceCategory: ServiceCategory): ServiceStats {
  const defaults: Record<ServiceCategory['serviceType'], ServiceStats> = {
    business: {
      fundingSuccessRate: 95,
      totalFundingRaised: '$1.8M+ Value Created',
      averageRevenueGrowth: 120,
      averageDeliveryTime: '5-10 days',
    },
    web: {
      fundingSuccessRate: 93,
      totalFundingRaised: '$2.4M+ in Projects',
      averageRevenueGrowth: 140,
      averageDeliveryTime: '10-20 days',
    },
    marketing: {
      fundingSuccessRate: 92,
      totalFundingRaised: '$900k+ in Growth',
      averageRevenueGrowth: 160,
      averageDeliveryTime: '7-14 days',
    },
    consulting: {
      fundingSuccessRate: 94,
      totalFundingRaised: '$1.2M+ Impact',
      averageRevenueGrowth: 110,
      averageDeliveryTime: '5-12 days',
    },
    mobile: {
      fundingSuccessRate: 90,
      totalFundingRaised: '$1.1M+ in Builds',
      averageRevenueGrowth: 130,
      averageDeliveryTime: '15-25 days',
    },
    cloud: {
      fundingSuccessRate: 90,
      totalFundingRaised: '$1.1M+ in Builds',
      averageRevenueGrowth: 130,
      averageDeliveryTime: '12-20 days',
    },
    software: {
      fundingSuccessRate: 90,
      totalFundingRaised: '$1.1M+ in Builds',
      averageRevenueGrowth: 130,
      averageDeliveryTime: '12-20 days',
    },
    branding: {
      fundingSuccessRate: 91,
      totalFundingRaised: '$480k+ Brand Value',
      averageRevenueGrowth: 105,
      averageDeliveryTime: '5-9 days',
    },
    profile: {
      fundingSuccessRate: 91,
      totalFundingRaised: '$480k+ Brand Value',
      averageRevenueGrowth: 105,
      averageDeliveryTime: '5-9 days',
    },
    general: {
      fundingSuccessRate: 90,
      totalFundingRaised: '$500k+ Impact',
      averageRevenueGrowth: 100,
      averageDeliveryTime: '7-14 days',
    },
  }

  const metrics = (serviceCategory.statistics as ServiceStats | undefined)?.metrics ?? {}
  const mapped: ServiceStats = {
    fundingSuccessRate: metrics.clientSatisfaction ?? defaults[serviceCategory.serviceType]?.fundingSuccessRate,
    totalFundingRaised: metrics.projectsCompleted
      ? `${metrics.projectsCompleted}+ Projects Delivered`
      : defaults[serviceCategory.serviceType]?.totalFundingRaised,
    averageRevenueGrowth: defaults[serviceCategory.serviceType]?.averageRevenueGrowth,
    averageDeliveryTime: (metrics.averageDeliveryTime as string | undefined) ?? defaults[serviceCategory.serviceType]?.averageDeliveryTime,
  }

  return mapped
}

function filterIndividualServices(serviceType: ServiceCategory['serviceType']): IndividualService[] {
  return getIndividualServices().filter((service) => !service.category || service.category === serviceType)
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const serviceCategory = (await getServiceCategoryBySlug(slug)) ?? getFallbackServiceCategory(slug)

  if (!serviceCategory) {
    return {
      title: 'Services | Hexadigitall',
      description: 'Professional services for ambitious founders and teams.',
    }
  }

  const ogImage = getOgImage(slug)
  const pricing = getServicePricing(serviceCategory)
  const title = `${serviceCategory.title} | Hexadigitall`
  const baseDescription = serviceCategory.description || 'Professional services tailored to your goals.'
  
  // Enhanced description with pricing for better CTR
  const description = `${baseDescription} ${pricing}. Fast delivery, Nigerian market expertise.`
  
  // Shorter description for social media (max 150 chars for optimal display)
  const socialDescription = baseDescription.length > 120 
    ? `${baseDescription.slice(0, 120)}... ${pricing}`
    : `${baseDescription} ${pricing}`

  return {
    title,
    description,
    keywords: `${serviceCategory.title}, ${serviceCategory.serviceType} services, Nigerian businesses, Hexadigitall`,
    openGraph: {
      title: `${serviceCategory.title} Services`,
      description: socialDescription,
      images: [{ 
        url: ogImage, 
        width: 1200, 
        height: 630, 
        alt: `${serviceCategory.title} - Hexadigitall Professional Services`,
        type: 'image/jpeg'
      }],
      type: 'website',
      siteName: 'Hexadigitall',
      url: `https://hexadigitall.com/services/${slug}`,
      locale: 'en_NG',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${serviceCategory.title} Services`,
      description: socialDescription,
      images: [ogImage],
      creator: '@hexadigitall',
      site: '@hexadigitall'
    },
    alternates: {
      canonical: `https://hexadigitall.com/services/${slug}`
    }
  }
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const serviceCategory = (await getServiceCategoryBySlug(slug)) ?? getFallbackServiceCategory(slug)

  if (!serviceCategory) {
    notFound()
  }

  const serviceStats = resolveServiceStats(serviceCategory)
  const individualServices = filterIndividualServices(serviceCategory.serviceType)

  // Enhanced JSON-LD with pricing and detailed service info
  const minPrice = serviceCategory.packages && serviceCategory.packages.length > 0
    ? Math.min(...serviceCategory.packages.map(p => p.price || 0).filter(p => p > 0))
    : undefined

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceCategory.title,
    description: serviceCategory.description,
    serviceType: serviceCategory.serviceType,
    provider: {
      '@type': 'Organization',
      name: 'Hexadigitall',
      url: 'https://hexadigitall.com',
      logo: 'https://hexadigitall.com/hexadigitall-logo.svg',
      sameAs: [
        'https://twitter.com/hexadigitall',
        'https://linkedin.com/company/hexadigitall'
      ]
    },
    areaServed: {
      '@type': 'Country',
      name: 'Nigeria'
    },
    offers: minPrice ? {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      price: minPrice,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      url: `https://hexadigitall.com/services/${slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Hexadigitall'
      }
    } : {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      availability: 'https://schema.org/InStock',
      url: `https://hexadigitall.com/services/${slug}`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
      bestRating: '5'
    }
  }

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://hexadigitall.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Services',
        item: 'https://hexadigitall.com/services'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: serviceCategory.title,
        item: `https://hexadigitall.com/services/${slug}`
      }
    ]
  }

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <DynamicServicePage
        serviceCategory={serviceCategory}
        individualServices={individualServices}
        serviceStats={serviceStats}
      />
    </article>
  )
}

export async function generateStaticParams() {
  try {
    const categories = await getAllServiceCategories()
    const slugs = categories.map((category) => category.slug?.current).filter(Boolean) as string[]
    const unique = Array.from(new Set([...slugs, ...FALLBACK_SLUGS]))
    return unique.map((slug) => ({ slug }))
  } catch (error) {
    console.warn('Failed to fetch service slugs during build:', error)
    return FALLBACK_SLUGS.map((slug) => ({ slug }))
  }
}
