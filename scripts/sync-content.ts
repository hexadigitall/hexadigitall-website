// scripts/sync-content.ts
import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

// Import your REAL data source
import { 
  WEB_DEV_PACKAGE_GROUPS, 
  BUSINESS_PLAN_PACKAGE_GROUPS, 
  BRANDING_PACKAGE_GROUPS, 
  MARKETING_PACKAGE_GROUPS, 
  MENTORING_PACKAGE_GROUPS, 
  PORTFOLIO_PACKAGE_GROUPS 
} from '../src/data/servicePackages';

dotenv.config({ path: '.env.local' });

// Initialize Client with Write Token
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN, // Must be the WRITE token
  useCdn: false,
  apiVersion: '2024-01-01',
});

// Helper to map your data categories to Sanity's 'serviceType'
const getServiceType = (groupName: string, defaultType: string) => {
  const lower = groupName.toLowerCase();
  if (lower.includes('web') || lower.includes('landing') || lower.includes('app')) return 'web';
  if (lower.includes('business') || lower.includes('growth')) return 'business';
  if (lower.includes('logo') || lower.includes('brand')) return 'business'; 
  if (lower.includes('marketing') || lower.includes('social')) return 'marketing';
  if (lower.includes('strategy') || lower.includes('coaching')) return 'consulting';
  if (lower.includes('resume') || lower.includes('portfolio') || lower.includes('linkedin')) return 'profile';
  return defaultType;
};

async function sync() {
  console.log('🔄 Starting Content Sync...');

  const allGroups = [
    ...WEB_DEV_PACKAGE_GROUPS,
    ...BUSINESS_PLAN_PACKAGE_GROUPS,
    ...BRANDING_PACKAGE_GROUPS,
    ...MARKETING_PACKAGE_GROUPS,
    ...MENTORING_PACKAGE_GROUPS,
    ...PORTFOLIO_PACKAGE_GROUPS
  ];

  for (const group of allGroups) {
    // 1. ROBUST SLUG DETECTION (Fixes the crash)
    // Checks for 'key.current' OR 'slug' OR '_id'
    // @ts-ignore - Ignoring TS warning because data shapes differ slightly
    const rawSlug = group.key?.current || group.slug || group._id;
    
    if (!rawSlug) {
      console.error(`❌ Skipping ${group.name}: No slug found`);
      continue;
    }

    const slug = rawSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    console.log(`\n📦 Processing: ${group.name} (${slug})...`);

    // 2. Transform Local Data -> Sanity Schema Format
    // Removed explicit ': Tier' type to avoid import errors
    const sanityPackages = group.tiers.map((tier: any) => ({
      _key: tier._key || tier.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: tier.name,
      tier: tier.tier, // 'basic', 'standard', 'premium'
      price: tier.price,
      currency: tier.currency || 'USD',
      billing: tier.billing || 'one_time',
      deliveryTime: tier.deliveryTime,
      popular: tier.popular || false,
      features: tier.features || [],
      addOns: [] 
    }));

    // 3. Prepare the Sanity Document
    const doc = {
      _type: 'serviceCategory',
      _id: slug, 
      title: group.name,
      slug: { _type: 'slug', current: slug },
      description: group.description,
      serviceType: getServiceType(group.name, 'general'),
      packages: sanityPackages,
      packageGroups: undefined // Cleans up legacy data
    };

    // 4. Push to Sanity
    try {
      await client.createOrReplace(doc);
      console.log(`   ✅ Synced: ${group.name}`);
    } catch (err: any) {
      console.error(`   ❌ Error syncing ${group.name}:`, err.message);
    }
  }

  console.log('\n🎉 Sync Complete! Sanity now matches your src/data.');
}

sync();