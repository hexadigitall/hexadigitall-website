import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Import REAL data
import { 
  WEB_DEV_PACKAGE_GROUPS, 
  BUSINESS_PLAN_PACKAGE_GROUPS, 
  BRANDING_PACKAGE_GROUPS, 
  MARKETING_PACKAGE_GROUPS, 
  MENTORING_PACKAGE_GROUPS, 
  PORTFOLIO_PACKAGE_GROUPS 
} from '../src/data/servicePackages';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

// The 5 Golden Slugs your site uses
// @ts-ignore
const AGGREGATE_MAP: Record<string, any> = {
  'web-and-mobile-software-development': {
    title: 'Web & Mobile Development',
    groups: WEB_DEV_PACKAGE_GROUPS,
    type: 'web'
  },
  'business-plan-and-logo-design': {
    title: 'Business Planning & Branding',
    groups: [...BUSINESS_PLAN_PACKAGE_GROUPS, ...BRANDING_PACKAGE_GROUPS],
    type: 'business'
  },
  'social-media-advertising-and-marketing': {
    title: 'Digital Marketing & Growth',
    groups: MARKETING_PACKAGE_GROUPS,
    type: 'marketing'
  },
  'mentoring-and-consulting': {
    title: 'Mentoring & Consulting',
    groups: MENTORING_PACKAGE_GROUPS,
    type: 'consulting'
  },
  'profile-and-portfolio-building': {
    title: 'Profile & Portfolio Building',
    groups: PORTFOLIO_PACKAGE_GROUPS,
    type: 'profile'
  }
};

async function migrate() {
  console.log('🚀 Starting Aggregated Migration...');

  for (const [slug, config] of Object.entries(AGGREGATE_MAP)) {
    console.log(`\n📦 Building: ${config.title} (${slug})...`);

    // Flatten all tiers from all groups into one big list for Sanity
    // ADDED ': any' here to fix the TypeScript error
    const allPackages = config.groups.flatMap((group: any) => 
      group.tiers.map((tier: any) => ({
        _key: tier._key || tier.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: tier.name,
        tier: tier.tier,
        price: tier.price,
        currency: tier.currency || 'USD',
        billing: tier.billing || 'one_time',
        deliveryTime: tier.deliveryTime,
        popular: tier.popular || false,
        features: tier.features || [],
        groupName: group.name 
      }))
    );

    const doc = {
      _type: 'serviceCategory',
      _id: slug, // Force the specific ID
      title: config.title,
      slug: { _type: 'slug', current: slug },
      description: `Professional ${config.title} services tailored to your needs.`,
      serviceType: config.type,
      packages: allPackages,
    };

    try {
      await client.createOrReplace(doc);
      console.log(`   ✅ Created/Updated: ${slug}`);
    } catch (err: any) {
      console.error(`   ❌ Failed: ${slug}`, err.message);
    }
  }

  console.log('\n🏁 Aggregation Complete!');
}

migrate();