import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Define interfaces locally to avoid import issues
interface ServicePackage {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  isPopular: boolean;
}

interface ServiceFeature {
  title: string;
  description: string;
}

interface ServiceFAQ {
  question: string;
  answer: string;
}

interface ServiceCategory {
  _type: 'serviceCategory';
  title: string;
  slug: { _type: 'slug'; current: string };
  description: string;
  packages?: ServicePackage[];
  features?: ServiceFeature[];
  faqs?: ServiceFAQ[];
  requirements?: string[];
}

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2023-12-01',
});

// Service categories data
const serviceCategories: ServiceCategory[] = [
  {
    _type: 'serviceCategory',
    title: 'Business Plan & Logo Design',
    slug: { _type: 'slug', current: 'business-plan-and-logo-design' },
    description: 'Professional business plan writing and custom logo design services to establish your brand identity and secure funding.',
    packages: [
      {
        name: 'Starter',
        price: 79,
        originalPrice: 99,
        description: 'Perfect for new entrepreneurs',
        features: [
          'Executive Summary (2-3 pages)',
          'Basic Market Analysis',
          'Simple Financial Projections',
          '1 Logo Design Concept',
          'Basic Brand Color Palette',
          '2 Rounds of Revisions',
          'PDF Delivery'
        ],
        isPopular: false
      },
      {
        name: 'Professional',
        price: 149,
        originalPrice: 199,
        description: 'Complete business planning solution',
        features: [
          'Comprehensive Business Plan (15-20 pages)',
          'Detailed Market Research',
          'Financial Projections (3 years)',
          '3 Logo Design Concepts',
          'Complete Brand Guidelines',
          'Marketing Strategy Overview',
          'Unlimited Revisions',
          'PowerPoint Presentation'
        ],
        isPopular: true
      },
      {
        name: 'Premium',
        price: 249,
        originalPrice: 299,
        description: 'Investor-ready package',
        features: [
          'Investment-Ready Business Plan (25+ pages)',
          'Comprehensive Market Analysis',
          'Detailed Financial Models',
          '5 Logo Design Concepts',
          'Full Brand Identity Package',
          'Marketing & Sales Strategy',
          'Operational Plan',
          'Risk Analysis',
          'Investor Pitch Deck',
          'Unlimited Revisions',
          'Priority Support'
        ],
        isPopular: false
      }
    ],
    features: [
      {
        title: 'Market Research',
        description: 'In-depth analysis of your target market, competitors, and industry trends.'
      },
      {
        title: 'Financial Planning',
        description: 'Detailed financial projections, cash flow analysis, and funding requirements.'
      },
      {
        title: 'Custom Logo Design',
        description: 'Unique logo designs that represent your brand identity and values.'
      },
      {
        title: 'Brand Guidelines',
        description: 'Complete brand identity package with colors, fonts, and usage guidelines.'
      }
    ],
    faqs: [
      {
        question: 'How long does it take to complete a business plan?',
        answer: 'Typically 5-7 business days for the Professional package, and 7-10 business days for the Premium package. Starter package is completed within 3-5 business days.'
      },
      {
        question: 'Can I request revisions?',
        answer: 'Yes! All packages include revisions. Starter includes 2 rounds, while Professional and Premium include unlimited revisions.'
      },
      {
        question: 'Do you provide industry-specific business plans?',
        answer: 'Absolutely! We have experience across various industries including tech, retail, healthcare, food & beverage, and more.'
      }
    ],
    requirements: [
      'Business concept and description',
      'Target market information',
      'Competitive analysis data (if available)',
      'Financial information and projections',
      'Brand preferences for logo design',
      'Any specific industry regulations or requirements'
    ]
  },
  {
    _type: 'serviceCategory',
    title: 'Website Development',
    slug: { _type: 'slug', current: 'website-development' },
    description: 'Custom website development services tailored to your business needs, from simple landing pages to complex web applications.',
    packages: [
      {
        name: 'Basic',
        price: 499,
        originalPrice: 699,
        description: 'Perfect for small businesses',
        features: [
          'Up to 5 Pages',
          'Responsive Design',
          'Basic SEO Setup',
          'Contact Form',
          '30 Days Support',
          'SSL Certificate',
          'Google Analytics Integration'
        ],
        isPopular: false
      },
      {
        name: 'Standard',
        price: 999,
        originalPrice: 1299,
        description: 'Most popular choice',
        features: [
          'Up to 10 Pages',
          'Custom Design',
          'Advanced SEO',
          'Content Management System',
          'E-commerce Ready',
          '90 Days Support',
          'Performance Optimization',
          'Social Media Integration'
        ],
        isPopular: true
      },
      {
        name: 'Premium',
        price: 1999,
        originalPrice: 2499,
        description: 'Enterprise solution',
        features: [
          'Unlimited Pages',
          'Custom Functionality',
          'Advanced SEO Package',
          'Multi-language Support',
          'Custom Integrations',
          '6 Months Support',
          'Priority Updates',
          'Training Sessions'
        ],
        isPopular: false
      }
    ]
  },
  {
    _type: 'serviceCategory',
    title: 'Digital Marketing',
    slug: { _type: 'slug', current: 'digital-marketing' },
    description: 'Comprehensive digital marketing solutions to grow your online presence and drive more customers to your business.',
    packages: [
      {
        name: 'Starter',
        price: 299,
        originalPrice: 399,
        description: 'Essential marketing package',
        features: [
          'Social Media Management (2 platforms)',
          'Content Creation (8 posts/month)',
          'Basic Analytics',
          'Monthly Report',
          'Email Support'
        ],
        isPopular: false
      },
      {
        name: 'Growth',
        price: 599,
        originalPrice: 799,
        description: 'Accelerate your growth',
        features: [
          'Social Media Management (4 platforms)',
          'Content Creation (16 posts/month)',
          'Google Ads Management',
          'SEO Optimization',
          'Detailed Analytics',
          'Bi-weekly Strategy Calls',
          'Priority Support'
        ],
        isPopular: true
      },
      {
        name: 'Enterprise',
        price: 1299,
        originalPrice: 1599,
        description: 'Complete marketing solution',
        features: [
          'Full Social Media Management',
          'Unlimited Content Creation',
          'Multi-platform Ad Management',
          'Advanced SEO & SEM',
          'Email Marketing Campaigns',
          'Conversion Rate Optimization',
          'Weekly Strategy Sessions',
          'Dedicated Account Manager'
        ],
        isPopular: false
      }
    ]
  }
];

export async function migrateServices(suppliedClient = client) {
  console.log('🚀 Starting service migration...');

  try {
    for (const service of serviceCategories) {
      console.log(`📝 Creating service: ${service.title}`);
      
      const result = await suppliedClient.create(service);
      console.log(`✅ Created service with ID: ${result._id}`);
    }

    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Total services migrated: ${serviceCategories.length}`);

  } catch (error) {
    // Re-throw so callers (tests) can handle errors. CLI runner below will exit.
    throw error;
  }
}

// If run directly, execute and exit on error
// Determine if this script was executed directly. Try CJS detection first, then fall back to argv checks.
const isMain = (() => {
  try {
    if (typeof require !== 'undefined' && require.main === module) return true;
  } catch (e) {
    // ignore
  }

  const scriptPath = process.argv[1] || '';
  if (scriptPath.endsWith('migrate-services.ts') || scriptPath.endsWith('migrate-services.js')) return true;
  return false;
})();

if (isMain) {
  migrateServices().catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}

export { serviceCategories };

// Helper: format legacy packages into packageGroups
export function formatPackageGroups(legacyPackages: unknown[]) {
  if (!Array.isArray(legacyPackages) || legacyPackages.length === 0) return [];

  // Narrow to expected shape
  const packages = legacyPackages.map((p) => (typeof p === 'object' && p !== null ? p as Record<string, any> : {}));

  // Simple heuristic: remove the first word from package names to derive a group name
  const firstName = (packages[0] && (packages[0].name as string)) || '';
  const parts = firstName.split(' ');
  const groupName = parts.slice(1).join(' ').trim() || firstName;
  const key = groupName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const tiers = packages.map((p) => ({
    name: p.name,
    tier: p.tier ?? null,
    price: p.price ?? null,
    currency: p.currency ?? 'USD',
    billing: p.billing ?? 'one-time',
    features: Array.isArray(p.features) ? p.features : []
  }));

  return [
    {
      _type: 'packageGroup',
      name: groupName,
      key: { _type: 'slug', current: key },
      tiers
    }
  ];
}