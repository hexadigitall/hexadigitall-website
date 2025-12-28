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

// Fallback slugs for static params generation (Critical Pages)
const FALLBACK_SLUGS = [
  'business-plan-and-logo-design',
  'web-and-mobile-software-development',
  'social-media-advertising-and-marketing',
  'profile-and-portfolio-building',
  'mentoring-and-consulting',
  'landing-page',
  'ecommerce-website',
  'web-app-development',
]

/**
 * 🎨 Get OG image for service
 * Uses the exact slug to match the generated asset in public/og-images
 */
function getOgImage(slug: string): string {
  // Use absolute URL for best compatibility with LinkedIn/WhatsApp
  return `https://hexadigitall.com/og-images/${slug}.jpg`
}

/**
 * 💰 Extract pricing info from service category for metadata
 */
function getServicePricing(serviceCategory: ServiceCategory): string {
  // SAFETY: Use optional chaining in case types are loose
  const packages = serviceCategory.packages || []
  
  if (packages.length === 0) {
    return 'Professional packages available'
  }
  
  const prices = packages
    .map((pkg: any) => pkg.price)
    .filter((price: any) => typeof price === 'number' && price > 0)
  
  if (prices.length === 0) return 'Flexible pricing available'
  
  const minPrice = Math.min(...prices)
  return `Starting from ₦${minPrice.toLocaleString()}`
}

/**
 * 📊 Resolve Service Stats with Intelligent Defaults
 */
function resolveServiceStats(serviceCategory: ServiceCategory): ServiceStats {
  // SAFETY: Typed as Record<string, ...> to prevent "Index signature" errors
  const defaults: Record<string, ServiceStats> = {
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

  // SAFETY: Handle undefined or unknown service types gracefully
  const serviceType = serviceCategory.serviceType || 'general';
  const defaultStats = defaults[serviceType] || defaults.general;

  // SAFETY: Use optional chaining for statistics
  const metrics = (serviceCategory.statistics as ServiceStats | undefined)?.metrics ?? {}
  
  return {
    fundingSuccessRate: metrics.clientSatisfaction ?? defaultStats.fundingSuccessRate,
    totalFundingRaised: metrics.projectsCompleted
      ? `${metrics.projectsCompleted}+ Projects Delivered`
      : defaultStats.totalFundingRaised,
    averageRevenueGrowth: defaultStats.averageRevenueGrowth,
    averageDeliveryTime: (metrics.averageDeliveryTime as string | undefined) ?? defaultStats.averageDeliveryTime,
  }
}

function filterIndividualServices(serviceType: any): IndividualService[] {
  // SAFETY: Cast to string comparison to avoid strict enum issues
  return getIndividualServices().filter((service) => !service.category || service.category === serviceType)
}

/**
 * 🛡️ SMART DATA FETCHER (Safety Net)
 * Tries Sanity first. If Sanity returns old/broken data, falls back to src/data.
 */
async function getSmartServiceCategory(slug: string): Promise<ServiceCategory | null> {
  // 1. Try fetching from Sanity
  const sanityData = await getServiceCategoryBySlug(slug);

  // 2. Validate Sanity Data (BUILD-PROOFED)
  // We cast to 'any' to prevent TypeScript from blocking the build if the 
  // 'ServiceCategory' type definition is outdated (missing 'packages').
  const safeData = sanityData as any;

  if (safeData && safeData.packages && safeData.packages.length > 0) {
    return sanityData;
  }

  // 3. Force Fallback to Local Data if Sanity is missing or outdated
  return getFallbackServiceCategory(slug);
}

// --- METADATA GENERATION ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const serviceCategory = await getSmartServiceCategory(slug);

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
  const socialDescription = baseDescription.length > 120 
    ? `${baseDescription.slice(0, 120)}... ${pricing}`
    : `${baseDescription} ${pricing}`

  return {
    title,
    description: `${baseDescription} ${pricing}. Fast delivery, Nigerian market expertise.`,
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

// --- PAGE COMPONENT ---
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Use Smart Fetcher (Sanity -> Fallback)
  const serviceCategory = await getSmartServiceCategory(slug);

  if (!serviceCategory) {
    notFound()
  }

  const serviceStats = resolveServiceStats(serviceCategory)
  const individualServices = filterIndividualServices(serviceCategory.serviceType)

  // Enhanced JSON-LD (Restored Provider & Rating info)
  // SAFETY: Use safe access for packages
  const packages = serviceCategory.packages || []
  const minPrice = packages.length > 0
    ? Math.min(...packages.map((p: any) => p.price || 0).filter((p: number) => p > 0))
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

// --- STATIC GENERATION (Restored Full Logic) ---
export async function generateStaticParams() {
  try {
    // 1. Fetch live categories from Sanity
    const categories = await getAllServiceCategories()
    const slugs = categories.map((category) => category.slug?.current).filter(Boolean) as string[]
    
    // 2. Combine with Fallback (Critical) Slugs to ensure everything is covered
    const unique = Array.from(new Set([...slugs, ...FALLBACK_SLUGS]))
    
    return unique.map((slug) => ({ slug }))
  } catch (error) {
    console.warn('Failed to fetch service slugs during build:', error)
    // 3. Fail safe: If Sanity is down at build time, at least build the critical pages
    return FALLBACK_SLUGS.map((slug) => ({ slug }))
  }
}