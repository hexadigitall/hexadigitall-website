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

import type { ServicePackageGroup, ServicePackageTier, ServiceAddOn } from '@/types/service'

// ============================================================================
// GLOBAL ADD-ONS AVAILABLE FOR ALL SERVICES
// ============================================================================

export const COMMON_ADD_ONS: ServiceAddOn[] = [
  {
    _key: 'rush-delivery',
    name: 'Rush Delivery',
    price: 149,
    description: 'Speed up delivery by 50% (2-3 days faster)',
    required: false
  },
  {
    _key: 'premium-support',
    name: 'Premium Support',
    price: 79,
    description: 'Priority support with 24-hour response time for 1 month',
    required: false
  },
  {
    _key: 'unlimited-revisions',
    name: 'Unlimited Revisions',
    price: 99,
    description: 'Unlimited revision rounds (instead of limited per tier)',
    required: false
  },
  {
    _key: 'source-code-access',
    name: 'Source Code Access',
    price: 199,
    description: 'Full source code and documentation delivered',
    required: false
  }
]

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
        price: 299,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-5 days',
        features: [
          '1 Page design',
          'Mobile responsive',
          'Contact form',
          'Hero section + CTA',
          'Basic SEO setup',
          'Email integration',
          '2 Revisions'
        ],
        popular: false
      },
      {
        _key: 'landing-page-standard',
        name: 'Landing Page — Standard',
        tier: 'standard',
        price: 599,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
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
        price: 1199,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-10 days',
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
        price: 999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-10 days',
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
          '3 Revisions'
        ],
        popular: false
      },
      {
        _key: 'business-website-standard',
        name: 'Business Website — Standard',
        tier: 'standard',
        price: 1999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '10-14 days',
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
          '5 Revisions'
        ],
        popular: true
      },
      {
        _key: 'business-website-premium',
        name: 'Business Website — Premium',
        tier: 'premium',
        price: 3999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '14-21 days',
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
          'Monthly maintenance package (3 months)',
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
        price: 1499,
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
          '3 Revisions'
        ],
        popular: false
      },
      {
        _key: 'ecommerce-standard',
        name: 'E-commerce Store — Standard',
        tier: 'standard',
        price: 2999,
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
          '5 Revisions'
        ],
        popular: true
      },
      {
        _key: 'ecommerce-premium',
        name: 'E-commerce Store — Premium',
        tier: 'premium',
        price: 5999,
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
          'Unlimited revisions'
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
        price: 2499,
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
          '5 Revisions'
        ],
        popular: false
      },
      {
        _key: 'webapp-business',
        name: 'Web App — Business Edition',
        subtitle: 'For growing companies scaling their operations',
        tier: 'standard',
        price: 4999,
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
          '10 Revisions'
        ],
        popular: true
      },
      {
        _key: 'webapp-enterprise',
        name: 'Web App — Enterprise Edition',
        subtitle: 'For complex systems requiring maximum flexibility',
        tier: 'premium',
        price: 9999,
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
          '3 months of maintenance included',
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
    name: 'Business Plan',
    description: 'Essential business plan for new ventures and investors.',
    tiers: [
      {
        _key: 'bp-starter-basic',
        name: 'Business Plan — Basic',
        tier: 'basic',
        price: 249,
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
          '2 Revisions'
        ],
        popular: false
      },
      {
        _key: 'bp-starter-standard',
        name: 'Business Plan — Standard',
        tier: 'standard',
        price: 499,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          'Everything in Basic',
          'Company description & structure',
          'Competitive analysis',
          'Marketing & sales strategy',
          'Financial projections (3 years)',
          'Break-even analysis',
          'Funding strategy',
          'Risk assessment',
          'Up to 15 pages',
          'Professional formatting',
          '3 Revisions'
        ],
        popular: true
      },
      {
        _key: 'bp-starter-premium',
        name: 'Business Plan — Premium',
        tier: 'premium',
        price: 999,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-10 days',
        features: [
          'Everything in Standard',
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
        name: 'Growth Plan — Basic',
        tier: 'basic',
        price: 399,
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
        name: 'Growth Plan — Standard',
        tier: 'standard',
        price: 799,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          'Everything in Basic',
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
        name: 'Growth Plan — Premium',
        tier: 'premium',
        price: 1599,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-12 days',
        features: [
          'Everything in Standard',
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
        price: 149,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-5 days',
        features: [
          '3 logo concepts',
          '2 Revision rounds',
          'PNG & SVG files',
          'Color & B&W versions',
          'Usage guidelines'
        ],
        popular: false
      },
      {
        _key: 'logo-standard',
        name: 'Logo Design — Standard',
        tier: 'standard',
        price: 299,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          'Everything in Basic',
          '5 logo concepts',
          '5 revision rounds',
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
        name: 'Logo Design — Premium',
        tier: 'premium',
        price: 599,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-10 days',
        features: [
          'Everything in Standard',
          '10 logo concepts',
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
        name: 'Marketing Strategy — Basic',
        tier: 'basic',
        price: 299,
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
        name: 'Marketing Strategy — Standard',
        tier: 'standard',
        price: 599,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-10 days',
        features: [
          'Everything in Basic',
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
        name: 'Marketing Strategy — Premium',
        tier: 'premium',
        price: 1199,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '10-14 days',
        features: [
          'Everything in Standard',
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
        name: 'Social Media — Basic',
        tier: 'basic',
        price: 399,
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
        name: 'Social Media — Standard',
        tier: 'standard',
        price: 799,
        currency: 'USD',
        billing: 'monthly',
        deliveryTime: 'Monthly',
        features: [
          'Everything in Basic',
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
        name: 'Social Media — Premium',
        tier: 'premium',
        price: 1599,
        currency: 'USD',
        billing: 'monthly',
        deliveryTime: 'Monthly',
        features: [
          'Everything in Standard',
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

// ============================================================================
// MENTORING & CONSULTING PACKAGE GROUPS
// ============================================================================

export const MENTORING_PACKAGE_GROUPS: ServicePackageGroup[] = [
  {
    _id: 'mentoring-strategy-session',
    name: 'Strategy Session',
    slug: 'strategy-session',
    description: 'One-on-one strategic consulting to address specific business or career challenges.',
    icon: 'lightbulb',
    category: 'consulting',
    serviceType: 'tiered',
    tiers: [
      {
        _key: 'strategy-basic',
        name: 'Strategy Session — Basic',
        tier: 'basic',
        price: 79,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '1 hour session',
        features: [
          '60-minute video consultation',
          'Problem identification',
          'Initial action plan',
          'Resource recommendations',
          'Follow-up email summary'
        ],
        popular: false
      },
      {
        _key: 'strategy-standard',
        name: 'Strategy Session — Standard',
        tier: 'standard',
        price: 149,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '2 sessions',
        features: [
          'Everything in Basic',
          '2 x 90-minute sessions',
          'Comprehensive analysis',
          'Detailed implementation roadmap',
          'Priority booking',
          '30-day follow-up check-in',
          'Direct email access for 2 weeks'
        ],
        popular: true
      },
      {
        _key: 'strategy-premium',
        name: 'Strategy Session — Premium',
        tier: 'premium',
        price: 349,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '4 weeks',
        features: [
          'Everything in Standard',
          '4 x 90-minute sessions over 4 weeks',
          'Business process audit',
          'Custom strategic framework',
          'Implementation support',
          '90-day follow-up program',
          'Direct phone/WhatsApp access',
          'Weekly progress check-ins'
        ],
        popular: false
      }
    ]
  },
  {
    _id: 'mentoring-business-coaching',
    name: 'Business Coaching',
    slug: 'business-coaching',
    description: 'Ongoing coaching program to grow your business and develop leadership skills.',
    icon: 'chart-bar',
    category: 'consulting',
    serviceType: 'tiered',
    tiers: [
      {
        _key: 'coaching-basic',
        name: 'Business Coaching — Basic',
        tier: 'basic',
        price: 249,
        currency: 'USD',
        billing: 'monthly',
        deliveryTime: 'Monthly',
        features: [
          '2 sessions per month (60 min each)',
          'Goal setting & tracking',
          'Email support',
          'Resource library access',
          'Monthly progress reports'
        ],
        popular: false
      },
      {
        _key: 'coaching-standard',
        name: 'Business Coaching — Standard',
        tier: 'standard',
        price: 499,
        currency: 'USD',
        billing: 'monthly',
        deliveryTime: 'Monthly',
        features: [
          'Everything in Basic',
          '4 sessions per month (60 min each)',
          'Strategic planning support',
          'Team dynamics consultation',
          'Priority scheduling',
          'Bi-weekly check-ins',
          'WhatsApp support'
        ],
        popular: true
      },
      {
        _key: 'coaching-premium',
        name: 'Business Coaching — Premium',
        tier: 'premium',
        price: 999,
        currency: 'USD',
        billing: 'monthly',
        deliveryTime: 'Monthly',
        features: [
          'Everything in Standard',
          'Unlimited 1-on-1 sessions',
          'Leadership development program',
          'Board meeting preparation',
          'Investor pitch coaching',
          '24/7 on-call support',
          'Quarterly strategic retreats',
          'Network introduction & connections'
        ],
        popular: false
      }
    ]
  },
  {
    _id: 'mentoring-career-coaching',
    name: 'Career Coaching',
    slug: 'career-coaching',
    description: 'Professional career development and transition coaching for tech professionals.',
    icon: 'user-group',
    category: 'consulting',
    serviceType: 'tiered',
    tiers: [
      {
        _key: 'career-basic',
        name: 'Career Coaching — Basic',
        tier: 'basic',
        price: 99,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '1 week',
        features: [
          '2 x 45-minute sessions',
          'Career assessment',
          'Skills gap analysis',
          'Resume/CV review',
          'Job search strategy',
          'Interview preparation tips'
        ],
        popular: false
      },
      {
        _key: 'career-standard',
        name: 'Career Coaching — Transition',
        tier: 'standard',
        price: 199,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '4 weeks',
        features: [
          'Everything in Jump Start',
          '6 x 60-minute sessions over 4 weeks',
          'Industry insights report',
          'Personal branding strategy',
          'LinkedIn optimization',
          'Networking roadmap',
          'Mock interviews',
          'Salary negotiation coaching'
        ],
        popular: true
      },
      {
        _key: 'career-premium',
        name: 'Career Coaching — Executive',
        tier: 'premium',
        price: 399,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '12 weeks',
        features: [
          'Everything in Transition',
          '12 x 60-minute sessions over 12 weeks',
          'Executive presence development',
          'Leadership brand building',
          'C-suite interview preparation',
          'Direct industry introductions',
          'Board positioning strategy',
          'Equity & compensation consulting',
          'Lifetime alumni network access'
        ],
        popular: false
      }
    ]
  }
]

// ============================================================================
// PROFILE & PORTFOLIO BUILDING PACKAGE GROUPS
// ============================================================================

export const PORTFOLIO_PACKAGE_GROUPS: ServicePackageGroup[] = [
  {
    _id: 'portfolio-cv-resume',
    name: 'Professional CV/Resume',
    slug: 'cv-resume',
    description: 'ATS-optimized professional CV and resume writing for tech professionals.',
    icon: 'document-text',
    category: 'portfolio',
    serviceType: 'tiered',
    tiers: [
      {
        _key: 'cv-basic',
        name: 'CV/Resume — Essential',
        tier: 'basic',
        price: 49,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-5 days',
        features: [
          'ATS-friendly format',
          '1 page professional CV',
          'PDF & DOC formats',
          '1 revision round',
          'Professional design template',
          'Basic keyword optimization'
        ],
        popular: false
      },
      {
        _key: 'cv-standard',
        name: 'CV/Resume — Professional',
        tier: 'standard',
        price: 99,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-5 days',
        features: [
          'Everything in Essential',
          '2-page CV (if needed)',
          'Cover letter template',
          '3 revision rounds',
          'LinkedIn headline & summary',
          'Achievement quantification',
          'Industry-specific optimization'
        ],
        popular: true
      },
      {
        _key: 'cv-premium',
        name: 'CV/Resume — Executive',
        tier: 'premium',
        price: 199,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          'Everything in Professional',
          'Executive CV (3+ pages)',
          '3 custom cover letters',
          'Complete LinkedIn makeover',
          'Portfolio website integration',
          'Unlimited revisions',
          'Interview coaching session',
          'Personal brand strategy'
        ],
        popular: false
      }
    ]
  },
  {
    _id: 'portfolio-website',
    name: 'Portfolio Website',
    slug: 'portfolio-website',
    description: 'Professional portfolio website to showcase your projects and skills.',
    icon: 'monitor',
    category: 'portfolio',
    serviceType: 'tiered',
    tiers: [
      {
        _key: 'portfolio-basic',
        name: 'Portfolio Website — Starter',
        tier: 'basic',
        price: 199,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          '3-page responsive website',
          'Home + About + Portfolio',
          'Gallery for 10 projects',
          'Contact form',
          'Mobile optimization',
          'Basic SEO setup',
          '3 months hosting'
        ],
        popular: false
      },
      {
        _key: 'portfolio-standard',
        name: 'Portfolio Website — Professional',
        tier: 'standard',
        price: 399,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-10 days',
        features: [
          'Everything in Starter',
          '5-page website with blog',
          'Gallery for 25 projects',
          'Advanced filtering & search',
          'Client testimonials section',
          'Social media integration',
          'Google Analytics',
          'Content management system',
          '12 months hosting + domain'
        ],
        popular: true
      },
      {
        _key: 'portfolio-premium',
        name: 'Portfolio Website — Premium',
        tier: 'premium',
        price: 799,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '10-14 days',
        features: [
          'Everything in Professional',
          'Unlimited pages',
          'Custom interactive features',
          'Video portfolio integration',
          'E-commerce for digital products',
          'Newsletter integration',
          'Advanced SEO & performance',
          'Priority support for 6 months',
          '24 months hosting + premium domain'
        ],
        popular: false
      }
    ]
  },
  {
    _id: 'portfolio-linkedin',
    name: 'LinkedIn Optimization',
    slug: 'linkedin-optimization',
    description: 'Complete LinkedIn profile makeover to attract recruiters and opportunities.',
    icon: 'user-circle',
    category: 'portfolio',
    serviceType: 'tiered',
    tiers: [
      {
        _key: 'linkedin-basic',
        name: 'LinkedIn — Quick Refresh',
        tier: 'basic',
        price: 69,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '2-3 days',
        features: [
          'Professional headline writing',
          'Compelling summary (about section)',
          'Skills optimization (top 10)',
          'Experience descriptions',
          'Profile photo guidelines',
          '1 revision round'
        ],
        popular: false
      },
      {
        _key: 'linkedin-standard',
        name: 'LinkedIn — Complete Makeover',
        tier: 'standard',
        price: 149,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-5 days',
        features: [
          'Everything in Quick Refresh',
          'All 50 skills optimization',
          'Featured section setup',
          'Achievement highlights',
          'Connection request templates',
          'Networking strategy guide',
          'Content posting strategy',
          '3 revision rounds'
        ],
        popular: true
      },
      {
        _key: 'linkedin-premium',
        name: 'LinkedIn — Executive Presence',
        tier: 'premium',
        price: 299,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '5-7 days',
        features: [
          'Everything in Complete Makeover',
          'Executive positioning strategy',
          'Thought leadership content plan',
          '5 custom posts + articles',
          'Profile banner design',
          'Recommendations strategy',
          'Influencer engagement tactics',
          'Lead generation setup',
          'Monthly optimization for 3 months'
        ],
        popular: false
      }
    ]
  }
]

export default WEB_DEV_PACKAGE_GROUPS


