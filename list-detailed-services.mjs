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

async function listDetailedServices() {
  console.log('📋 DETAILED SERVICE CATEGORIES & PACKAGES\n');
  console.log('='.repeat(80));

  const categories = await client.fetch(
    `*[_type == "serviceCategory"] | order(title asc) {
      _id,
      title,
      slug,
      "packages": packages[] {
        _key,
        name,
        title,
        tier,
        price,
        description
      }
    }`
  );

  console.log(`\n✅ Found ${categories.length} Service Categories:\n`);

  let allPackages = [];

  categories.forEach((category, i) => {
    console.log(`\n${i + 1}. "${category.title}"`);
    console.log(`   Slug: ${category.slug?.current || 'N/A'}`);
    
    if (category.packages && category.packages.length > 0) {
      console.log(`\n   SERVICE PACKAGES (${category.packages.length}):\n`);
      category.packages.forEach((pkg, j) => {
        const name = pkg.name || pkg.title || 'Unnamed';
        console.log(`   ${j + 1}. "${name}"`);
        console.log(`      Tier: ${pkg.tier || 'N/A'}`);
        console.log(`      Price: ${pkg.price ? `₦${pkg.price.toLocaleString()}` : 'N/A'}`);
        if (pkg.description) {
          console.log(`      Description: ${pkg.description.substring(0, 60)}...`);
        }
        
        allPackages.push({
          category: category.title,
          categorySlug: category.slug?.current,
          name: name,
          tier: pkg.tier,
          price: pkg.price
        });
      });
    }
    console.log('\n' + '-'.repeat(80));
  });

  // Summary table
  console.log('\n' + '='.repeat(80));
  console.log('\n📊 ALL SERVICE PACKAGES (For OG Image Generation):\n');
  
  allPackages.forEach((pkg, i) => {
    console.log(`${i + 1}. "${pkg.name}" - ${pkg.tier || 'No Tier'}`);
    console.log(`   Category: ${pkg.category}`);
    console.log(`   Price: ₦${pkg.price?.toLocaleString() || 'N/A'}\n`);
  });

  console.log('='.repeat(80));
  console.log(`\nTotal Service Packages: ${allPackages.length}`);
  console.log('='.repeat(80));
}

listDetailedServices().catch(console.error);
