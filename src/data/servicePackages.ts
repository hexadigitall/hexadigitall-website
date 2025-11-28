// src/data/servicePackages.ts
/**
 * COMPREHENSIVE TIER SYSTEM FOR HEXADIGITALL
 * 
 * Architecture:
 * - ServicePackageGroup: The "card" users see (e.g., "Landing Page")
 * - ServicePackageTier: The "flavor" within each card (Basic/Standard/Premium)
 * 
 * Naming Convention: Basic / Standard / Premium across ALL services for consistency
 * Pricing Philosophy: Clear value escalation—each tier should have 2-3x justifiable feature/scope increase
 * Popular Badge: Always on Standard tier (psychological sweet spot: "Goldilocks")
 * Currency: Dual USD/NGN support via convertPrice()
 */

import type { ServicePackageGroup, ServicePackageTier } from '@/types/service'

// ============================================================================
// WEB & MOBILE DEVELOPMENT PACKAGES (BUILD STAGE)
// ============================================================================

export const WEB_DEV_PACKAGE_GROUPS: ServicePackageGroup[] = [
  {
    key: { current: 'landing-page' },
    name: 'Landing Page',
    description: 'High-converting single-page websites for campaigns, product launches, and lead generation.',
    tiers: [
      {
        _key: 'landing-page-basic',
        name: 'Landing Page — Basic',
        tier: 'basic',
        price: 499,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          '1 Page design',
          'Mobile responsive',
          'Contact form',
          'Hero section + CTA',
          'Basic SEO setup',
          'Email integration',
          '3 Revisions'
        ],
        popular: false
      },
      {
        _key: 'landing-page-standard',
        name: 'Landing Page — Standard',
        tier: 'standard',
        price: 999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-10 days',
        features: [
          'Everything in Basic',
          'A/B Testing variants',
          'Video background support',
          'Newsletter signup',
          'Analytics dashboard',
          'Social media integration',
          'Payment form integration',
          'Advanced SEO (meta tags, schema)',
          '5 Revisions'
        ],
        popular: true
      },
      {
        _key: 'landing-page-premium',
        name: 'Landing Page — Premium',
        tier: 'premium',
        price: 1999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '10-14 days',
        features: [
          'Everything in Standard',
          'Custom animations',
          'Heatmap & conversion tracking',
          'Multi-variant funnel setup',
          'Email automation workflow',
          'CRM integration (HubSpot/Pipedrive)',
          'Performance optimization (99+ Lighthouse)',
          'CDN & image optimization',
          'Monthly analytics report',
          'Unlimited revisions'
        ],
        popular: false
      }
    ]
  },
  {
    key: { current: 'business-website' },
    name: 'Business Website',
    description: 'Professional multi-page websites with CMS, blog, and full company presence.',
    tiers: [
      {
        _key: 'business-website-basic',
        name: 'Business Website — Basic',
        tier: 'basic',
        price: 1499,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '10-14 days',
        features: [
          'Up to 5 pages',
          'Mobile responsive',
          'Contact/Quote form',
          'About, Services, Contact pages',
          'Basic blog setup',
          'SSL Certificate',
          'Email setup',
          'Local SEO',
          'Google Analytics',
          '5 Revisions'
        ],
        popular: false
      },
      {
        _key: 'business-website-standard',
        name: 'Business Website — Standard',
        tier: 'standard',
        price: 2999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '14-21 days',
        features: [
          'Everything in Basic',
          'Up to 10 pages',
          'CMS (Sanity/Strapi)',
          'Blog with 10 posts',
          'Portfolio/Gallery',
          'Team member pages',
          'Testimonials section',
          'Services pages with pricing',
          'Advanced SEO (schema, sitemaps)',
          'Social sharing optimization',
          'Newsletter integration',
          '10 Revisions'
        ],
        popular: true
      },
      {
        _key: 'business-website-premium',
        name: 'Business Website — Premium',
        tier: 'premium',
        price: 5999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '21-30 days',
        features: [
          'Everything in Standard',
          'Unlimited pages',
          'Advanced CMS with workflows',
          'Blog with SEO automation',
          'Interactive portfolio with filtering',
          'Client testimonials with ratings',
          'Appointment booking system',
          'Payment integration (Stripe/Paypal)',
          'Multi-language support',
          'Advanced analytics & reporting',
          'Performance optimization (99+ Lighthouse)',
          'Monthly maintenance package (6 months)',
          'Unlimited revisions'
        ],
        popular: false
      }
    ]
  },
  {
    key: { current: 'ecommerce-website' },
    name: 'E-commerce Store',
    description: 'Full-featured online stores with inventory management and payment processing.',
    tiers: [
      {
        _key: 'ecommerce-basic',
        name: 'E-commerce Store — Basic',
        tier: 'basic',
        price: 1999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '14-21 days',
        features: [
          'Up to 50 products',
          'Product catalog with categories',
          'Basic product filters',
          'Shopping cart',
          'Stripe payment integration',
          'Order management',
          'Email notifications',
          'Shipping integration (basic)',
          'Mobile responsive',
          'SSL Certificate',
          'Email support'
        ],
        popular: false
      },
      {
        _key: 'ecommerce-standard',
        name: 'E-commerce Store — Standard',
        tier: 'standard',
        price: 3999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '21-28 days',
        features: [
          'Everything in Basic',
          'Up to 500 products',
          'Advanced product filtering & search',
          'Customer accounts & wishlists',
          'Email marketing integration (Klaviyo)',
          'Inventory management system',
          'Discount codes & promotions',
          'Advanced shipping calculator',
          'Product reviews & ratings',
          'Blog for SEO',
          'Analytics dashboard',
          'Google Shopping integration',
          'Priority email support'
        ],
        popular: true
      },
      {
        _key: 'ecommerce-premium',
        name: 'E-commerce Store — Premium',
        tier: 'premium',
        price: 7999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '28-35 days',
        features: [
          'Everything in Standard',
          'Unlimited products',
          'Multi-currency & language support',
          'Advanced inventory & warehouse management',
          'Subscription & recurring billing',
          'Abandoned cart recovery automation',
          'Advanced analytics & AI insights',
          'Custom loyalty program',
          'Multiple payment gateways (Stripe, PayPal, Apple Pay)',
          'Marketplace integration (Amazon, eBay)',
          'Advanced CMS for content',
          'API access for custom integrations',
          'Monthly maintenance & optimization',
          '24/7 Priority support'
        ],
        popular: false
      }
    ]
  },
  {
    key: { current: 'web-app-development' },
    name: 'Web Application Development',
    description: 'Scalable web applications with database, APIs, and modern architecture tailored to your business stage.',
    tiers: [
      {
        _key: 'webapp-startup',
        name: 'Web App — Startup Edition',
        subtitle: 'Perfect for MVPs and early-stage products',
        tier: 'basic',
        price: 2999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '21-28 days',
        features: [
          'Up to 10 simple pages/screens',
          'User authentication (basic)',
          'Database integration',
          'REST API',
          'Email notifications',
          'Basic file uploads',
          'Mobile responsive',
          '3rd party API integration (1)',
          'SSL Certificate',
          '10 Revisions'
        ],
        popular: false
      },
      {
        _key: 'webapp-business',
        name: 'Web App — Business Edition',
        subtitle: 'For growing companies scaling their operations',
        tier: 'standard',
        price: 5999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '28-40 days',
        features: [
          'Everything in Startup Edition',
          'Up to 20 feature-rich pages/screens',
          'Advanced authentication (2FA, SSO)',
          'Complex data management',
          'GraphQL & REST APIs',
          'Real-time notifications (WebSockets)',
          'Advanced file management',
          '3rd party API integrations (up to 5)',
          'Payment processing integration',
          'Analytics & logging',
          'Caching & optimization',
          '20 Revisions'
        ],
        popular: true
      },
      {
        _key: 'webapp-enterprise',
        name: 'Web App — Enterprise Edition',
        subtitle: 'For complex systems requiring maximum flexibility',
        tier: 'premium',
        price: 12999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '40-60 days',
        features: [
          'Everything in Business Edition',
          'Unlimited pages/screens',
          'Enterprise authentication (OAuth2, SAML)',
          'Microservices architecture',
          'Advanced reporting & dashboards',
          'Machine learning integration',
          'Real-time collaboration features',
          'Advanced security (encryption, auditing)',
          'Unlimited 3rd party integrations',
          'Custom admin dashboard',
          'Load testing & optimization',
          'Disaster recovery setup',
          '6 months of maintenance included',
          'Technical documentation',
          'Unlimited revisions',
          'Dedicated developer consultation'
        ],
        popular: false
      }
    ]
  }
]

// ============================================================================
// BUSINESS PLANNING & STRATEGY PACKAGES (IDEA STAGE)
// ============================================================================

export const BUSINESS_PLAN_PACKAGE_GROUPS: ServicePackageGroup[] = [
  {
    key: { current: 'business-plan-starter' },
    name: 'Starter Business Plan',
    description: 'Essential business plan for new ventures and investors.',
    tiers: [
      {
        _key: 'bp-starter-basic',
        name: 'Business Plan — Essentials',
        tier: 'basic',
        price: 299,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-5 days',
        features: [
          'Executive summary',
          'Business overview',
          'Market analysis (basic)',
          'Financial projections (1 year)',
          'Funding request',
          'Up to 5 pages',
          'Email support'
        ],
        popular: false
      },
      {
        _key: 'bp-starter-standard',
        name: 'Business Plan — Complete',
        tier: 'standard',
        price: 599,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          'Everything in Essentials',
          'Company description & structure',
          'Competitive analysis',
          'Marketing & sales strategy',
          'Financial projections (3 years)',
          'Break-even analysis',
          'Funding strategy',
          'Risk assessment',
          'Up to 15 pages',
          'Professional formatting',
          'Revision included'
        ],
        popular: true
      },
      {
        _key: 'bp-starter-premium',
        name: 'Business Plan — Investment-Ready',
        tier: 'premium',
        price: 1299,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-10 days',
        features: [
          'Everything in Complete',
          'Detailed financial modeling',
          'Sensitivity analysis',
          'Market research data (paid sources)',
          'Executive presentation slides',
          'Pitch deck (10-15 slides)',
          'Financial statements (5 years)',
          'Exit strategy',
          'Investor FAQ document',
          'Personalized investor recommendations',
          'Unlimited revisions',
          'Phone consultation included'
        ],
        popular: false
      }
    ]
  },
  {
    key: { current: 'business-plan-growth' },
    name: 'Growth Strategy Plan',
    description: 'Comprehensive growth strategy for scaling existing businesses.',
    tiers: [
      {
        _key: 'bp-growth-basic',
        name: 'Growth Plan — Quick Assessment',
        tier: 'basic',
        price: 499,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-5 days',
        features: [
          'Growth opportunity assessment',
          'SWOT analysis',
          'Market trends analysis',
          'Initial recommendations',
          'Action items list',
          'Up to 10 pages'
        ],
        popular: false
      },
      {
        _key: 'bp-growth-standard',
        name: 'Growth Plan — Strategic',
        tier: 'standard',
        price: 999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          'Everything in Quick Assessment',
          'Detailed market analysis',
          'Competitive positioning',
          'Growth channel analysis',
          'Financial projections (2 years)',
          'Customer acquisition strategy',
          'Product/service roadmap',
          'Team scaling plan',
          'Implementation timeline',
          'KPI dashboard',
          'Up to 25 pages'
        ],
        popular: true
      },
      {
        _key: 'bp-growth-premium',
        name: 'Growth Plan — Enterprise',
        tier: 'premium',
        price: 2499,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-12 days',
        features: [
          'Everything in Strategic',
          'Detailed financial modeling & forecasting',
          'Multi-channel growth analysis',
          'Partnership & acquisition strategy',
          'International expansion roadmap',
          'Technology infrastructure plan',
          'Fundraising strategy & investor prep',
          'Risk mitigation strategies',
          'Quarterly milestone tracking',
          'Dedicated growth consultant (3 sessions)',
          'Competitive intelligence reports',
          'Up to 40 pages'
        ],
        popular: false
      }
    ]
  }
]

// ============================================================================
// BRANDING & LOGO DESIGN PACKAGES
// ============================================================================

export const BRANDING_PACKAGE_GROUPS: ServicePackageGroup[] = [
  {
    key: { current: 'logo-design' },
    name: 'Logo Design',
    description: 'Professional logo design for your brand identity.',
    tiers: [
      {
        _key: 'logo-basic',
        name: 'Logo Design — Basic',
        tier: 'basic',
        price: 199,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-5 days',
        features: [
          '5 logo concepts',
          '2 Revision rounds',
          'PNG & SVG files',
          'Color & B&W versions',
          'Usage guidelines'
        ],
        popular: false
      },
      {
        _key: 'logo-standard',
        name: 'Logo Design — Professional',
        tier: 'standard',
        price: 399,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          'Everything in Basic',
          '10 logo concepts',
          'Unlimited revision rounds',
          'All file formats (AI, PDF, PNG, SVG, JPG)',
          'Brand color palette',
          'Typography recommendations',
          'Social media icon set',
          'Favicon'
        ],
        popular: true
      },
      {
        _key: 'logo-premium',
        name: 'Logo Design — Brand Suite',
        tier: 'premium',
        price: 799,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-10 days',
        features: [
          'Everything in Professional',
          'Brand identity manual',
          'Business card design',
          'Letterhead design',
          'Email signature',
          'Brand guidelines document',
          'Social media templates',
          'Presentation template',
          'Unlimited revisions',
          'Trademark search consultation'
        ],
        popular: false
      }
    ]
  }
]

// ============================================================================
// MARKETING & DIGITAL STRATEGY PACKAGES (GROW STAGE)
// ============================================================================

export const MARKETING_PACKAGE_GROUPS: ServicePackageGroup[] = [
  {
    key: { current: 'digital-marketing-strategy' },
    name: 'Digital Marketing Strategy',
    description: 'Comprehensive digital marketing plans to reach and convert your audience.',
    tiers: [
      {
        _key: 'dm-basic',
        name: 'Marketing Strategy — Starter',
        tier: 'basic',
        price: 399,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          'Audience analysis',
          'Competitor analysis',
          'Channel recommendations',
          'Basic content calendar (1 month)',
          'Social media strategy',
          'Monthly reporting template'
        ],
        popular: false
      },
      {
        _key: 'dm-standard',
        name: 'Marketing Strategy — Professional',
        tier: 'standard',
        price: 799,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-10 days',
        features: [
          'Everything in Starter',
          'Detailed audience personas',
          'SWOT analysis',
          'Multi-channel strategy',
          'Content calendar (3 months)',
          'Email marketing strategy',
          'Paid advertising recommendations',
          'SEO roadmap',
          'Monthly analytics report template',
          'Budget allocation guide'
        ],
        popular: true
      },
      {
        _key: 'dm-premium',
        name: 'Marketing Strategy — Enterprise',
        tier: 'premium',
        price: 1999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '10-14 days',
        features: [
          'Everything in Professional',
          'Advanced audience insights & segmentation',
          'Competitive intelligence (3 competitors)',
          '6-month integrated marketing plan',
          'Content strategy & calendar',
          'Email marketing automation setup',
          'Social media strategy for 5 platforms',
          'Paid ads strategy (Google, Meta, LinkedIn)',
          'SEO technical audit & roadmap',
          'Conversion rate optimization plan',
          'Monthly performance reviews (3 months)',
          'Marketing automation tool recommendations',
          'Dedicated strategy consultant (2 sessions)'
        ],
        popular: false
      }
    ]
  },
  {
    key: { current: 'social-media-management' },
    name: 'Social Media Management',
    description: 'Managed social media presence with content creation and community engagement.',
    tiers: [
      {
        _key: 'sm-basic',
        name: 'Social Media — Essential',
        tier: 'basic',
        price: 499,
        currency: 'USD',
        billing: 'monthly',
        deliveryTime: 'Monthly',
        features: [
          '1 Social platform management',
          '8 posts per month',
          'Basic content creation',
          'Monthly analytics report',
          'Community engagement (basic)'
        ],
        popular: false
      },
      {
        _key: 'sm-standard',
        name: 'Social Media — Professional',
        tier: 'standard',
        price: 1199,
        currency: 'USD',
        billing: 'monthly',
        deliveryTime: 'Monthly',
        features: [
          'Everything in Essential',
          '3 Social platforms',
          '20 posts per month',
          'Professional content creation',
          'Community engagement & responses',
          'Monthly performance analytics',
          'Influencer outreach',
          'Hashtag strategy',
          'Monthly strategy call'
        ],
        popular: true
      },
      {
        _key: 'sm-premium',
        name: 'Social Media — Managed Growth',
        tier: 'premium',
        price: 2499,
        currency: 'USD',
        billing: 'monthly',
        deliveryTime: 'Monthly',
        features: [
          'Everything in Professional',
          'All 5 major platforms',
          '50+ posts per month',
          'Video content creation',
          'Story content & reels',
          '24/7 community management',
          'Influencer collaboration program',
          'Paid social ads management',
          'Weekly performance reviews',
          'Bi-weekly strategy calls',
          'Growth goal tracking'
        ],
        popular: false
      }
    ]
  }
]

export default WEB_DEV_PACKAGE_GROUPS


