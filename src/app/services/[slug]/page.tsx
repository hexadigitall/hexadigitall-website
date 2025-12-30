/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CompleteServicePage from '@/components/services/CompleteServicePage'
import {
  getAllServiceCategories,
  getServiceCategoryBySlug,
} from '@/lib/sanity-queries'
import { 
  WEB_DEV_PACKAGE_GROUPS, 
  BUSINESS_PLAN_PACKAGE_GROUPS, 
  BRANDING_PACKAGE_GROUPS, 
  MARKETING_PACKAGE_GROUPS, 
  MENTORING_PACKAGE_GROUPS, 
  PORTFOLIO_PACKAGE_GROUPS 
} from '@/data/servicePackages'
import type { ServicePackageGroup } from '@/types/service'
// Import the specific type the component expects to fix the red underline
import type { IndividualService as ComponentIndividualService } from '@/data/individualServices'
import { ALL_INDIVIDUAL_SERVICES } from '@/data/individualServices';

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

// Map slugs to Local Data Groups
const DATA_MAP: Record<string, ServicePackageGroup[]> = {
  'web-and-mobile-software-development': WEB_DEV_PACKAGE_GROUPS,
  'business-plan-and-logo-design': [...BUSINESS_PLAN_PACKAGE_GROUPS, ...BRANDING_PACKAGE_GROUPS],
  'social-media-advertising-and-marketing': MARKETING_PACKAGE_GROUPS,
  'mentoring-and-consulting': MENTORING_PACKAGE_GROUPS,
  'profile-and-portfolio-building': PORTFOLIO_PACKAGE_GROUPS,
}

// Define specific type to match CompleteServicePage props
type AccentColor = 'pink' | 'blue' | 'purple' | 'green' | 'indigo' | 'orange'

const ACCENT_MAP: Record<string, AccentColor> = {
  'web': 'indigo',
  'business': 'blue',
  'marketing': 'pink',
  'consulting': 'purple',
  'profile': 'orange'
}

type Props = {
  params: { slug: string }
}

/**
 * Get OG image for service
 * Uses the exact slug to match the generated asset in public/og-images
 */
function getOgImage(slug: string): string {
  return `https://hexadigitall.com/og-images/${slug}.jpg`
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  let service = null;
  try {
    service = await getServiceCategoryBySlug(slug);
  } catch (e) {
    service = null;
  }
  // Fallback to local data if Sanity is unreachable and slug is critical
  if (!service) {
    if (FALLBACK_SLUGS.includes(slug) && DATA_MAP[slug]) {
      // Try to find an individual service for this slug
      const individual = ALL_INDIVIDUAL_SERVICES.find(s => s.id === slug);
      if (individual) {
        return {
          title: individual.ogTitle || individual.name,
          description: individual.ogDescription || individual.description,
          openGraph: {
            title: individual.ogTitle || individual.name,
            description: individual.ogDescription || individual.description,
            url: `https://hexadigitall.com/services/${slug}`,
            images: [
              individual.ogImage
                ? { url: `https://hexadigitall.com${individual.ogImage}`, width: 1200, height: 630 }
                : { url: getOgImage(slug), width: 1200, height: 630 }
            ],
            type: 'website',
          },
          twitter: {
            card: 'summary_large_image',
            title: individual.ogTitle || individual.name,
            description: individual.ogDescription || individual.description,
            images: [individual.ogImage ? `https://hexadigitall.com${individual.ogImage}` : getOgImage(slug)],
          },
        };
      }
      return {
        title: slug.replace(/-/g, ' '),
        description: `Service page for ${slug.replace(/-/g, ' ')}.`,
        openGraph: {
          title: slug.replace(/-/g, ' '),
          description: `Service page for ${slug.replace(/-/g, ' ')}.`,
          url: `https://hexadigitall.com/services/${slug}`,
          images: [{ url: getOgImage(slug), width: 1200, height: 630 }],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: slug.replace(/-/g, ' '),
          description: `Service page for ${slug.replace(/-/g, ' ')}.`,
          images: [getOgImage(slug)],
        },
      };
    }
    return {
      title: 'Service Not Found',
    };
  }
  // Safe price extraction
  const lowestPrice = service.packages?.reduce((min: number, p: any) => 
    (p.price < min ? p.price : min), Infinity) || 0;
  const formattedPrice = lowestPrice !== Infinity 
    ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(lowestPrice * 1000) 
    : 'Contact for pricing';

  // Use ogImage from Sanity if available, fallback to old logic
  const ogImageUrl = service.ogImage?.asset?.url || getOgImage(slug);

  return {
    title: service.ogTitle || service.title,
    description: service.ogDescription || `${service.description || service.title}. Starting from ${formattedPrice}.`,
    openGraph: {
      title: service.ogTitle || service.title,
      description: service.ogDescription || service.description,
      url: `https://hexadigitall.com/services/${slug}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: service.ogTitle || service.title,
      description: service.ogDescription || service.description,
      images: [ogImageUrl],
    },
  };
}

export default async function ServicePage(props: Props) {
  const params = await props.params;
  const slug = params.slug;
  let serviceCategory = null;
  try {
    serviceCategory = await getServiceCategoryBySlug(slug);
  } catch (e) {
    serviceCategory = null;
  }
  // Fallback to local data if Sanity is unreachable and slug is critical
  let localGroups = DATA_MAP[slug] || [];
  let accentColor: AccentColor = 'blue';
  let pageTitle = slug.replace(/-/g, ' ');
  let pageDescription = '';
  let serviceType = 'general';
  if (!serviceCategory) {
    if (FALLBACK_SLUGS.includes(slug) && localGroups.length > 0) {
      // Use fallback data
      pageDescription = `Service page for ${pageTitle}.`;
      accentColor = 'blue';
      serviceType = 'general';
    } else {
      notFound();
    }
  } else {
    accentColor = (ACCENT_MAP[serviceCategory.serviceType] || 'blue') as AccentColor;
    pageTitle = serviceCategory.title;
    pageDescription = serviceCategory.description || '';
    serviceType = serviceCategory.serviceType || 'general';
    // Merge Sanity Prices into Local Structure
    localGroups = localGroups.map(group => ({
      ...group,
      tiers: group.tiers.map(tier => {
        const sanityPackage = serviceCategory.packages?.find((p: any) => p.name === tier.name);
        return sanityPackage ? { ...tier, price: sanityPackage.price } : tier;
      })
    }));
  }
  // Map serviceType or slug to the correct category string for individual services
  const serviceTypeToCategory: Record<string, string> = {
    'web': 'web-dev',
    'web-dev': 'web-dev',
    'web & mobile': 'web-dev',
    'business': 'business',
    'business-plan': 'business',
    'branding': 'branding',
    'marketing': 'marketing',
    'social': 'marketing',
    'social-media': 'marketing',
    'mentoring': 'mentoring',
    'consulting': 'mentoring',
    'portfolio': 'portfolio',
    'profile': 'portfolio',
  };
  const categoryKey = serviceTypeToCategory[serviceType] || serviceType;
  const relevantIndividualServices = ALL_INDIVIDUAL_SERVICES.filter(s => s.category === categoryKey) as ComponentIndividualService[];
  // --- JSON-LD GENERATION (Restored) ---
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: pageTitle,
    description: pageDescription,
    provider: {
      '@type': 'Organization',
      name: 'Hexadigitall',
      url: 'https://hexadigitall.com'
    },
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Service Packages',
      itemListElement: localGroups.flatMap(g => g.tiers).map((tier, index) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: tier.name
        },
        price: tier.price,
        priceCurrency: 'USD',
        position: index + 1
      }))
    }
  };
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
        name: pageTitle,
        item: `https://hexadigitall.com/services/${slug}`
      }
    ]
  };
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
      <CompleteServicePage
        pageTitle={pageTitle}
        pageDescription={pageDescription}
        heroGradient={`from-${accentColor}-900 to-${accentColor}-800`}
        bannerBackgroundImage={
          serviceCategory?.bannerBackgroundImage?.asset?.url
            ? serviceCategory.bannerBackgroundImage.asset.url
            : (() => {
                switch (slug) {
                  case 'web-and-mobile-software-development':
                    return '/promotional-campaign/images/raw/person-screen-2.jpg';
                  case 'business-plan-and-logo-design':
                    return '/promotional-campaign/images/raw/person-business-1.jpg';
                  case 'social-media-advertising-and-marketing':
                    return '/promotional-campaign/images/raw/service-web-and-mobile-development2.jpg';
                  case 'profile-and-portfolio-building':
                    return '/promotional-campaign/images/raw/service-social-starter2.jpg';
                  case 'mentoring-and-consulting':
                    return '/promotional-campaign/images/raw/service-mentoring-and-consulting.jpg';
                  default:
                    return undefined;
                }
              })()
        }
        accentColor={accentColor}
        categoryIcon={null}
        breadcrumbItems={[
          { label: 'Services', href: '/services' },
          { label: pageTitle }
        ]}
        packageGroups={localGroups.length > 0 ? localGroups : []}
        individualServices={relevantIndividualServices}
        serviceType={serviceType}
        slug={slug}
      />
    </article>
  );
}

export async function generateStaticParams() {
  try {
    const categories = await getAllServiceCategories()
    const slugs = categories.map((category) => category.slug?.current).filter(Boolean) as string[]
    const unique = Array.from(new Set([...slugs, ...FALLBACK_SLUGS]))
    return unique.map((slug) => ({ slug }))
  } catch (error) {
    console.warn('Error generating static params:', error)
    return FALLBACK_SLUGS.map((slug) => ({ slug }))
  }
}