import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-01-11',
  token: process.env.SANITY_API_TOKEN,
});

async function listServiceCategories() {
  console.log('📋 FETCHING SERVICE CATEGORIES & PACKAGES FROM SANITY\n');
  console.log('='.repeat(80));

  // Fetch all service categories with their packages
  const categories = await client.fetch(
    `*[_type == "serviceCategory"] | order(title asc) {
      _id,
      title,
      slug,
      description,
      "packages": packages[] {
        _key,
        title,
        slug,
        tagline,
        price,
        features
      }
    }`
  );

  if (categories.length === 0) {
    console.log('\n❌ No service categories found in Sanity.\n');
    return;
  }

  console.log(`\n✅ Found ${categories.length} Service Categories:\n`);

  categories.forEach((category, i) => {
    console.log(`\n${i + 1}. SERVICE CATEGORY: "${category.title}"`);
    console.log(`   Slug: ${category.slug?.current || 'N/A'}`);
    console.log(`   Description: ${category.description?.substring(0, 100) || 'N/A'}...`);
    
    if (category.packages && category.packages.length > 0) {
      console.log(`\n   📦 SERVICE PACKAGES (${category.packages.length}):`);
      category.packages.forEach((pkg, j) => {
        console.log(`\n   ${j + 1}. "${pkg.title}"`);
        console.log(`      Slug: ${pkg.slug?.current || 'N/A'}`);
        console.log(`      Tagline: ${pkg.tagline || 'N/A'}`);
        console.log(`      Price: ${pkg.price ? `₦${pkg.price.toLocaleString()}` : 'N/A'}`);
        if (pkg.features && pkg.features.length > 0) {
          console.log(`      Features: ${pkg.features.length} items`);
        }
      });
    } else {
      console.log(`\n   ⚠️  No packages found for this category`);
    }
    console.log('\n' + '-'.repeat(80));
  });

  // Summary
  const totalPackages = categories.reduce((sum, cat) => sum + (cat.packages?.length || 0), 0);
  
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY:');
  console.log(`   Service Categories: ${categories.length}`);
  console.log(`   Total Service Packages: ${totalPackages}`);
  console.log('\n' + '='.repeat(80));
}

listServiceCategories().catch(console.error);
