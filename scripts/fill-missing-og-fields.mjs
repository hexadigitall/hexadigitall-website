import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  apiVersion: '2023-12-30',
});

// Helper to generate a default OG title/description
function defaultOgTitle(cat, pkg) {
  return pkg ? `${pkg.name} | ${cat.title} | Hexadigitall` : `${cat.title} | Hexadigitall`;
}
function defaultOgDescription(cat, pkg) {
  return pkg
    ? `Explore the ${pkg.name} package in ${cat.title} from Hexadigitall. Professional, fast, and tailored for your needs.`
    : `Explore ${cat.title} services from Hexadigitall. Professional, fast, and tailored for your needs.`;
}

async function fillMissingOgImages() {
  const categories = await client.fetch(`*[_type == "serviceCategory"]{
    _id,
    title,
    ogImage { asset->{url} },
    packageGroups[]{
      key,
      name,
      tiers[]{
        _key,
        name,
        tier,
        ogImage { asset->{url} }
      }
    },
    packages[]{
      _key,
      name,
      ogImage { asset->{url} }
    }
  }`);

  let updates = [];

  for (const cat of categories) {
    // Fill missing ogImage for packages in packageGroups
    if (Array.isArray(cat.packageGroups)) {
      for (const group of cat.packageGroups) {
        if (Array.isArray(group.tiers)) {
          for (const tier of group.tiers) {
            if (!tier.ogImage) {
              const ogTitle = defaultOgTitle(cat, tier);
              const ogDescription = defaultOgDescription(cat, tier);
              // Patch the tier (requires knowing the path in Sanity, so this is a placeholder for manual or batch update)
              updates.push({
                type: 'tier',
                catId: cat._id,
                groupKey: group.key,
                tierKey: tier._key,
                ogTitle,
                ogDescription
              });
            }
          }
        }
      }
    }
    // Fill missing ogImage for legacy packages
    if (Array.isArray(cat.packages)) {
      for (const pkg of cat.packages) {
        if (!pkg.ogImage) {
          const ogTitle = defaultOgTitle(cat, pkg);
          const ogDescription = defaultOgDescription(cat, pkg);
          // Patch the package (requires knowing the path in Sanity, so this is a placeholder for manual or batch update)
          updates.push({
            type: 'package',
            catId: cat._id,
            pkgKey: pkg._key,
            ogTitle,
            ogDescription
          });
        }
      }
    }
  }

  // Print what would be updated (for safety)
  if (updates.length === 0) {
    console.log('✅ All package/tier ogImage fields are set. No updates needed.');
    return;
  }
  console.log('The following ogTitle/ogDescription fields will be set for missing packages/tiers:');
  updates.forEach(u => {
    if (u.type === 'tier') {
      console.log(`- [Tier] Category: ${u.catId}, Group: ${u.groupKey}, Tier: ${u.tierKey} | ogTitle: ${u.ogTitle}`);
    } else {
      console.log(`- [Package] Category: ${u.catId}, Package: ${u.pkgKey} | ogTitle: ${u.ogTitle}`);
    }
  });
  // To actually patch, you would need to use the Sanity API to update the nested fields by their keys.
  // This is non-trivial for deeply nested arrays and may require a custom mutation or manual update in Sanity Studio.
}

fillMissingOgImages().catch(console.error);
