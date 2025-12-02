/**
 * Individual Services Data
 * 
 * Pre-packaged individual services for each service category.
 * These are ready-to-buy, one-click purchase options for customers
 * who need just one specific service.
 */

export interface IndividualService {
  id: string
  name: string
  price: number
  description: string
  deliveryTime: string
  features: string[]
  category: 'web-dev' | 'business' | 'branding' | 'marketing' | 'mentoring' | 'portfolio'
}

// Web & Mobile Development Individual Services
// Note: Full projects (Landing Pages, E-commerce) are sold as Tiered Packages.
// This list contains task-based services: audits, fixes, specific features.
export const WEB_DEV_INDIVIDUAL_SERVICES: IndividualService[] = [
  {
    id: 'website-redesign',
    name: 'Website Redesign',
    price: 599,
    description: 'Modernize your existing website with fresh design and improved UX',
    deliveryTime: '7-10 days',
    category: 'web-dev',
    features: [
      'Complete visual refresh',
      'UI/UX improvements',
      'Mobile optimization',
      'Performance enhancement',
      'Content migration',
      '2 revision rounds'
    ]
  },
  {
    id: 'seo-audit',
    name: 'SEO Audit & Report',
    price: 199,
    description: 'Comprehensive SEO analysis with actionable recommendations',
    deliveryTime: '3-5 days',
    category: 'web-dev',
    features: [
      'Technical SEO audit',
      'On-page optimization review',
      'Keyword analysis',
      'Competitor comparison',
      'Actionable recommendations',
      'Priority roadmap'
    ]
  },
  {
    id: 'speed-optimization',
    name: 'Website Speed Optimization',
    price: 299,
    description: 'Boost your site performance and Core Web Vitals scores',
    deliveryTime: '3-5 days',
    category: 'web-dev',
    features: [
      'Performance audit',
      'Image optimization',
      'Code minification',
      'Caching setup',
      'CDN configuration',
      'Before/after metrics'
    ]
  },
  {
    id: 'payment-gateway-integration',
    name: 'Payment Gateway Integration',
    price: 349,
    description: 'Add Stripe, Paystack, or Flutterwave to your existing site',
    deliveryTime: '4-6 days',
    category: 'web-dev',
    features: [
      'Gateway setup & configuration',
      'Secure checkout flow',
      'Webhook integration',
      'Order confirmation emails',
      'Testing & documentation',
      'PCI compliance guidance'
    ]
  },
  {
    id: 'bug-fix-monthly',
    name: 'Monthly Bug Fixes & Support',
    price: 199,
    description: 'Ongoing maintenance and bug fixes for your website',
    deliveryTime: 'Monthly',
    category: 'web-dev',
    features: [
      'Up to 5 hours of fixes/month',
      'Priority support',
      'Security updates',
      'Content updates',
      'Performance monitoring',
      'Monthly report'
    ]
  }
]

// Business Plan & Strategy Individual Services
export const BUSINESS_PLAN_INDIVIDUAL_SERVICES: IndividualService[] = [
  {
    id: 'executive-summary',
    name: 'Executive Summary',
    price: 149,
    description: '2-page compelling executive summary for quick investor review',
    deliveryTime: '3-4 days',
    category: 'business',
    features: [
      'Problem & solution overview',
      'Market opportunity summary',
      'Financial projections snapshot',
      'Team highlights',
      'Investment ask & use of funds',
      'Professional formatting'
    ]
  },
  {
    id: 'pitch-deck',
    name: 'Investor Pitch Deck',
    price: 399,
    description: '10-15 slide pitch deck designed to win investors',
    deliveryTime: '5-7 days',
    category: 'business',
    features: [
      '10-15 professionally designed slides',
      'Compelling storytelling flow',
      'Market analysis & traction',
      'Financial projections visuals',
      'Team & advisors showcase',
      '2 revision rounds'
    ]
  },
  {
    id: 'market-research',
    name: 'Market Research Report',
    price: 499,
    description: 'Comprehensive market analysis and competitive landscape research',
    deliveryTime: '7-10 days',
    category: 'business',
    features: [
      'Industry analysis & trends',
      'Target market sizing',
      'Competitor analysis (5-10 companies)',
      'Customer personas',
      'Market entry strategy',
      'Data sources & citations'
    ]
  }
]

// Branding & Logo Design Individual Services
export const BRANDING_INDIVIDUAL_SERVICES: IndividualService[] = [
  {
    id: 'logo-only',
    name: 'Logo Design Only',
    price: 149,
    description: 'Professional logo design with 3 concepts and unlimited revisions',
    deliveryTime: '3-5 days',
    category: 'branding',
    features: [
      '3 unique logo concepts',
      'Unlimited revisions',
      'Vector files (AI, SVG, EPS)',
      'PNG & JPG formats',
      'Black & white versions',
      'Social media sizes'
    ]
  },
  {
    id: 'business-cards',
    name: 'Business Card Design',
    price: 79,
    description: 'Professional business card design ready for print',
    deliveryTime: '2-3 days',
    category: 'branding',
    features: [
      'Front & back design',
      '2 design concepts',
      'Print-ready files',
      'Standard business card size',
      '2 revision rounds',
      'QR code integration option'
    ]
  },
  {
    id: 'social-media-kit',
    name: 'Social Media Branding Kit',
    price: 249,
    description: 'Complete set of branded social media templates and assets',
    deliveryTime: '5-7 days',
    category: 'branding',
    features: [
      'Profile & cover images (5 platforms)',
      '10 post templates',
      'Story templates (5 designs)',
      'Highlight covers',
      'Brand color palette guide',
      'Editable Canva templates'
    ]
  }
]

// Marketing Individual Services
export const MARKETING_INDIVIDUAL_SERVICES: IndividualService[] = [
  {
    id: 'social-media-audit',
    name: 'Social Media Audit',
    price: 69,
    description: 'Complete analysis of your social media presence with actionable insights',
    deliveryTime: '3-5 days',
    category: 'marketing',
    features: [
      'Analysis of all social platforms',
      'Competitor benchmarking',
      'Content performance review',
      'Audience analysis report',
      'Detailed recommendations',
      'Strategy roadmap'
    ]
  },
  {
    id: 'content-package',
    name: 'Content Creation Package',
    price: 129,
    description: '20 professionally designed social media posts with captions',
    deliveryTime: '5-7 days',
    category: 'marketing',
    features: [
      '20 custom designed posts',
      'Platform-optimized sizes',
      'Engaging captions included',
      'Hashtag research & recommendations',
      'Brand-consistent design',
      '2 revision rounds'
    ]
  },
  {
    id: 'ad-campaign-setup',
    name: 'Ad Campaign Setup',
    price: 179,
    description: 'Professional setup and optimization of your first ad campaign',
    deliveryTime: '3-5 days',
    category: 'marketing',
    features: [
      'Facebook & Instagram ads setup',
      'Target audience research',
      'Ad creative design (3 variants)',
      'Campaign optimization',
      'Performance tracking setup',
      '2-week monitoring included'
    ]
  }
]

// Mentoring & Consulting Individual Services
export const MENTORING_INDIVIDUAL_SERVICES: IndividualService[] = [
  {
    id: 'strategy-call',
    name: 'Strategy Call (1 Hour)',
    price: 79,
    description: 'One-on-one strategy session with an industry expert',
    deliveryTime: '1-2 days',
    category: 'mentoring',
    features: [
      '60-minute video call',
      'Pre-call questionnaire',
      'Strategic recommendations',
      'Action plan document',
      'Email follow-up support (1 week)',
      'Session recording'
    ]
  },
  {
    id: 'business-plan-review',
    name: 'Business Plan Review',
    price: 149,
    description: 'Expert review and feedback on your business plan',
    deliveryTime: '3-5 days',
    category: 'mentoring',
    features: [
      'Comprehensive plan review',
      'Detailed feedback document',
      'Financial analysis',
      'Market viability assessment',
      '30-min follow-up call',
      'Recommended improvements'
    ]
  },
  {
    id: 'pitch-practice',
    name: 'Pitch Practice Session',
    price: 99,
    description: 'Mock pitch session with feedback from seasoned investors',
    deliveryTime: '2-3 days',
    category: 'mentoring',
    features: [
      '45-minute practice session',
      'Investor perspective feedback',
      'Q&A preparation',
      'Delivery coaching',
      'Slide deck review',
      'Confidence building tips'
    ]
  }
]

// Portfolio & Profile Building Individual Services
export const PORTFOLIO_INDIVIDUAL_SERVICES: IndividualService[] = [
  {
    id: 'cv-resume-writing',
    name: 'Professional CV/Resume',
    price: 49,
    description: 'ATS-optimized resume that gets past screening algorithms',
    deliveryTime: '2-3 days',
    category: 'portfolio',
    features: [
      'ATS-optimized formatting',
      'Professional writing',
      'Industry-specific keywords',
      '2 format versions (modern & traditional)',
      'Cover letter template',
      '2 revision rounds'
    ]
  },
  {
    id: 'linkedin-optimization',
    name: 'LinkedIn Profile Optimization',
    price: 69,
    description: 'Complete LinkedIn profile makeover for maximum visibility',
    deliveryTime: '3-4 days',
    category: 'portfolio',
    features: [
      'Headline optimization',
      'About section rewrite',
      'Experience descriptions',
      'Skills & endorsements strategy',
      'Profile SEO optimization',
      'Content posting strategy'
    ]
  },
  {
    id: 'portfolio-website-basic',
    name: 'Basic Portfolio Website',
    price: 199,
    description: 'Simple portfolio website to showcase your work professionally',
    deliveryTime: '5-7 days',
    category: 'portfolio',
    features: [
      'Single-page portfolio design',
      'Project showcase gallery',
      'About & contact sections',
      'Responsive design',
      'Domain & hosting guidance',
      '1 revision round'
    ]
  }
]

// Export all services combined
export const ALL_INDIVIDUAL_SERVICES = [
  ...WEB_DEV_INDIVIDUAL_SERVICES,
  ...BUSINESS_PLAN_INDIVIDUAL_SERVICES,
  ...BRANDING_INDIVIDUAL_SERVICES,
  ...MARKETING_INDIVIDUAL_SERVICES,
  ...MENTORING_INDIVIDUAL_SERVICES,
  ...PORTFOLIO_INDIVIDUAL_SERVICES
]

// Helper function to get services by category
export function getIndividualServicesByCategory(category: IndividualService['category']) {
  return ALL_INDIVIDUAL_SERVICES.filter(service => service.category === category)
}
