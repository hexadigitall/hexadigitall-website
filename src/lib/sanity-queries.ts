// src/lib/sanity-queries.ts
import { client } from '@/sanity/client'
import { ServiceCategory, IndividualService } from '@/types/service'
import normalizeStatistics from '@/lib/normalizeStatistics'
import WEB_DEV_PACKAGE_GROUPS, { MARKETING_PACKAGE_GROUPS, BRANDING_PACKAGE_GROUPS, BUSINESS_PLAN_PACKAGE_GROUPS } from '@/data/servicePackages'

// GROQ query for service category with packages
const SERVICE_CATEGORY_QUERY = `*[_type == "serviceCategory" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  description,
  serviceType,
  icon,
  featured,
  mainImage{
    asset->{
      _id,
      url
    },
    alt,
    hotspot
  },
  packages[]{
    _key,
    name,
    tier,
    price,
    currency,
    billing,
    deliveryTime,
    features,
    popular,
    addOns[]{
      _key,
      name,
      price,
      description
    }
  },
  // New: package groups with tiers
  packageGroups[]{
    key,
    name,
    description,
    tiers[]{
      _key,
      name,
      tier,
      price,
      currency,
      billing,
      deliveryTime,
      features,
      popular,
      addOns[]{
        _key,
        name,
        price,
        description
      }
    }
  },
  // New dynamic features
  statistics-> {
    _id,
    metrics,
    performance,
    clientMetrics,
    techStack,
    lastUpdated
  },
  testimonials[]->{
    _id,
    client,
    role,
    company,
    image{asset->{_id, url}},
    testimonial,
    rating,
    featured,
    date
  },
  caseStudies[]->{
    _id,
    title,
    slug,
    client,
    challenge,
    solution,
    results,
    technologies,
    timeline,
    images[]{asset->{_id, url}, caption, alt},
    featured
  },
  requirements,
  faq[]{
    _key,
    question,
    answer
  }
}`

// GROQ query for all service categories (for related services)
const ALL_SERVICE_CATEGORIES_QUERY = `*[_type == "serviceCategory"] | order(featured desc, title asc){
  _id,
  title,
  slug,
  description,
  serviceType,
  icon,
  featured,
  packages[0]{
    price
  }
}`

// GROQ query for service categories by type
const SERVICE_CATEGORIES_BY_TYPE_QUERY = `*[_type == "serviceCategory" && serviceType == $serviceType] | order(featured desc, title asc){
  _id,
  title,
  slug,
  description,
  serviceType,
  icon,
  featured,
  packages[0]{
    price
  }
}`

/**
 * Fetch a specific service category by slug
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function getServiceCategoryBySlug(slug: string): Promise<ServiceCategory | null> {
  try {
    const serviceCategory = await client.fetch(SERVICE_CATEGORY_QUERY, { slug })

    // Normalize: if packageGroups are present, flatten tiers into packages for UI compatibility
    if (serviceCategory?.packageGroups && Array.isArray(serviceCategory.packageGroups) && serviceCategory.packageGroups.length > 0) {
      const normalizedPackages = serviceCategory.packageGroups.flatMap((group: Record<string, unknown>) => {
        const tiers = Array.isArray(group?.tiers) ? group.tiers : []
        return tiers.map((tierItem: unknown, idx: number) => {
          const tier = tierItem as Record<string, unknown>
          return {
              _key: (tier._key as any) || `${(group?.key as any)?.current || group?.name || 'group'}-${tier.tier || 'tier'}-${idx}`,
              name: (tier.name as any) || `${group?.name || 'Package'} — ${tier.tier || 'Tier'}`,
              tier: ((tier.tier || 'standard') as any),
            price: typeof tier.price === 'number' ? tier.price : 0,
              currency: (tier.currency as any) || 'USD',
              billing: ((tier.billing || 'one_time') as any),
              deliveryTime: (tier.deliveryTime as any) || '',
            features: Array.isArray(tier.features) ? tier.features : [],
            popular: !!tier.popular,
            addOns: Array.isArray(tier.addOns) ? tier.addOns : []
          }
        })
      })
      serviceCategory.packages = normalizedPackages
    }

    // Normalize statistics into canonical `{ metrics }` shape so UI components can rely on a single shape
    try {
        serviceCategory.statistics = normalizeStatistics(serviceCategory.statistics) as Record<string, unknown>
    } catch (err) {
      // Non-fatal; keep original statistics if normalization fails
      console.warn('Failed to normalize statistics for serviceCategory', serviceCategory?._id, err)
    }

    return serviceCategory
  } catch (error) {
    console.error('Error fetching service category:', error)
    return null
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Fetch all service categories
 */
export async function getAllServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const categories = await client.fetch(ALL_SERVICE_CATEGORIES_QUERY)
    return categories || []
  } catch (error) {
    console.error('Error fetching service categories:', error)
    return []
  }
}

/**
 * Fetch service categories by type (for related services)
 */
export async function getServiceCategoriesByType(serviceType: string): Promise<ServiceCategory[]> {
  try {
    const categories = await client.fetch(SERVICE_CATEGORIES_BY_TYPE_QUERY, { serviceType })
    return categories || []
  } catch (error) {
    console.error('Error fetching service categories by type:', error)
    return []
  }
}

/**
 * Get individual services for quick access (hardcoded for now, but could be from CMS later)
 * These are the $39 Logo, $89 Business Plan, etc. services
 */
export function getIndividualServices(): IndividualService[] {
  return [
    {
      id: 'logo-design-only',
      name: 'Logo Design Only',
      price: 39,
      description: 'Professional logo design with 3 concepts and unlimited revisions',
      deliveryTime: '3-5 days',
      features: [
        '3 unique logo concepts',
        'Unlimited revisions',
        'High-resolution files (PNG, JPG, SVG)',
        'Brand color palette',
        'Commercial usage rights',
        'Source files included'
      ],
      category: 'business'
    },
    {
      id: 'business-plan-only',
      name: 'Business Plan Only',
      price: 89,
      description: 'Comprehensive business plan for startups and funding applications',
      deliveryTime: '5-7 days',
      features: [
        'Executive summary',
        'Market analysis & research',
        'Financial projections (3 years)',
        'Business model canvas',
        'Competitive analysis',
        'Investor-ready presentation'
      ],
      category: 'business'
    },
    {
      id: 'pitch-deck-only',
      name: 'Pitch Deck Only',
      price: 149,
      description: 'Compelling pitch deck designed to secure funding from investors',
      deliveryTime: '3-5 days',
      features: [
        '10-12 professional slides',
        'Investor-focused storytelling',
        'Financial highlights',
        'Market opportunity analysis',
        'Team & traction showcase',
        'Editable PowerPoint format'
      ],
      category: 'business'
    }
  ]
}

/**
 * Fallback service category data when Sanity is unavailable
 */
export function getFallbackServiceCategory(slug: string): ServiceCategory | null {
  if (slug === 'business-plan-and-logo-design') {
    return {
      _id: 'fallback-business-plan-logo',
      title: 'Business Plan & Logo Design',
      slug: { current: 'business-plan-and-logo-design' },
      description: 'Complete business planning and brand identity services to launch your business with confidence.',
      serviceType: 'business',
      icon: 'chart',
      featured: false,
      packages: [
        {
          _key: 'starter-plan-fallback',
          name: 'Starter Plan',
          tier: 'standard',
          price: 79,
          currency: 'USD',
          billing: 'one_time',
          deliveryTime: '5-7 days',
          features: [
            'Executive Summary (2 pages)',
            'Business Description & Value Proposition',
            'Basic Market Analysis & Target Customer Profile',
            '1-Year Financial Projection (Revenue, Expenses, Profit)',
            'Business Model Canvas',
            'Simple Marketing Strategy Outline',
            'Basic SWOT Analysis',
            'Basic Logo Design (3 concepts)',
            'Business Plan Template for Future Updates',
            '1 Revision Round',
            '5-Day Delivery',
            'Email Support During Process'
          ],
          popular: false
        },
        {
          _key: 'growth-plan-fallback',
          name: 'Growth Plan',
          tier: 'standard',
          price: 149,
          currency: 'USD',
          billing: 'one_time',
          deliveryTime: '7-10 days',
          features: [
            'Comprehensive Business Plan (15-20 pages)',
            'Executive Summary & Company Overview',
            'Detailed Market Research & Industry Analysis',
            'Competitive Analysis (5 key competitors)',
            '3-Year Financial Projections with Monthly Breakdown',
            'Marketing & Sales Strategy with Channels',
            'Operations Plan & Organizational Structure',
            'Risk Assessment & Mitigation Strategies',
            'Basic Pitch Deck (6-8 professional slides)',
            'Professional Logo Design with 3 Variations',
            'Basic Brand Colors & Typography Guide',
            '3 Revision Rounds',
            '7-Day Delivery',
            'FREE 45-minute Strategy Consultation Call',
            'Business Plan Template & Guidelines'
          ],
          popular: true
        },
        {
          _key: 'investor-plan-fallback',
          name: 'Investor Plan',
          tier: 'premium',
          price: 249,
          currency: 'USD',
          billing: 'one_time',
          deliveryTime: '10-14 days',
          features: [
            'Investment-Grade Business Plan (25-35 pages)',
            'Professional Executive Summary (3 pages)',
            'Comprehensive Market Research & Analysis',
            'In-depth Competitive Intelligence Report',
            '5-Year Financial Modeling with Scenarios',
            'Detailed Revenue Model & Unit Economics',
            'Complete Go-to-Market Strategy',
            'Management Team Profiles & Advisory Board',
            'Professional Pitch Deck (12-15 slides)',
            'Investment Summary One-Pager',
            'Complete Brand Identity Package (Logo, Colors, Fonts)',
            'Business Cards & Letterhead Design',
            'Industry-Specific Legal Structure Recommendations',
            'Funding Strategy & Investment Timeline',
            'Unlimited Revisions for 30 Days',
            '10-Day Development Timeline',
            'FREE 2-Hour Strategy & Pitch Practice Session',
            'Investor Network Introduction (qualified businesses)',
            '30-Day Post-Delivery Support'
          ],
          popular: false
        }
      ]
    ,
    packageGroups: BUSINESS_PLAN_PACKAGE_GROUPS,
    }
  }

  // Fallback POC for web & mobile dev page: include packageGroups so the UI can render scoped groups
  if (slug === 'web-and-mobile-software-development') {
    return {
      _id: 'fallback-web-mobile-development',
      title: 'Web & Mobile Development',
      slug: { current: 'web-and-mobile-software-development' },
      description: 'Professional websites and mobile applications that drive business growth and user engagement.',
      serviceType: 'web',
      icon: 'code',
      featured: false,
      packages: [],
      packageGroups: WEB_DEV_PACKAGE_GROUPS,
      requirements: [],
      faq: []
    }
  }

  // Marketing fallbacks
  if (slug === 'social-media-advertising-and-marketing') {
    return {
      _id: 'fallback-marketing',
      title: 'Digital Marketing',
      slug: { current: slug },
      description: 'Marketing services to grow your audience and revenue.',
      serviceType: 'marketing',
      icon: 'chart',
      featured: false,
      packages: [],
      packageGroups: MARKETING_PACKAGE_GROUPS,
      testimonials: [
        {
          _id: 'tm-1',
          client: 'Acme Co',
          testimonial: 'Great growth from the marketing team!',
          rating: 5
        }
      ],
      statistics: {
        _id: 'stats-marketing',
        metrics: {
          projectsCompleted: 120,
          clientSatisfaction: 92,
          averageDeliveryTime: '30 days',
          teamSize: 8
        },
        lastUpdated: new Date().toISOString()
      },
      requirements: [],
      faq: []
    }
  }

  // Profile / Portfolio fallback
  if (slug === 'profile-and-portfolio-building') {
    return {
      _id: 'fallback-profile',
      title: 'Profile & Portfolio',
      slug: { current: 'profile-and-portfolio-building' },
      description: 'Personal profiles and portfolio websites to showcase your work.',
      serviceType: 'profile',
      icon: 'monitor',
      featured: false,
      packages: [],
      packageGroups: BRANDING_PACKAGE_GROUPS,
      testimonials: [],
      statistics: {
        _id: 'stats-profile',
        metrics: {
          projectsCompleted: 320,
          clientSatisfaction: 95,
          averageDeliveryTime: '7 days',
          teamSize: 3
        },
        lastUpdated: new Date().toISOString()
      },
      requirements: [],
      faq: []
    }
  }

  // Consulting fallback
  if (slug === 'mentoring-and-consulting') {
    return {
      _id: 'fallback-consulting',
      title: 'Mentoring & Consulting',
      slug: { current: 'mentoring-and-consulting' },
      description: 'Expert consulting and mentoring for founders and teams.',
      serviceType: 'consulting',
      icon: 'settings',
      featured: false,
      packages: [],
      packageGroups: MARKETING_PACKAGE_GROUPS,
      testimonials: [],
      statistics: {
        _id: 'stats-consulting',
        metrics: {
          projectsCompleted: 58,
          clientSatisfaction: 90,
          averageDeliveryTime: '14 days',
          teamSize: 4
        },
        lastUpdated: new Date().toISOString()
      },
      requirements: [],
      faq: []
    }
  }

  return null
}