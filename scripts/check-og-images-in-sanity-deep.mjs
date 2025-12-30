import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  apiVersion: '2023-12-30',
});

const OG_IMAGE_DIR = path.resolve('public/og-images');

async function checkOgImagesDeep() {
  // Fetch all service categories with nested packageGroups and tiers/packages
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

  let missing = [];
  let ok = [];

  for (const cat of categories) {
    // Check category ogImage
    const catOgUrl = cat.ogImage?.asset?.url;
    if (!catOgUrl) {
      missing.push({ type: 'category', name: cat.title, id: cat._id, reason: 'No ogImage set' });
    } else if (catOgUrl.startsWith('/og-images/')) {
      const filePath = path.join(OG_IMAGE_DIR, path.basename(catOgUrl));
      if (!fs.existsSync(filePath)) {
        missing.push({ type: 'category', name: cat.title, id: cat._id, reason: `Missing file: ${filePath}` });
      } else {
        ok.push({ type: 'category', name: cat.title, id: cat._id, file: filePath });
      }
    }
    // Check packageGroups/tiers ogImage
    if (Array.isArray(cat.packageGroups)) {
      for (const group of cat.packageGroups) {
        if (Array.isArray(group.tiers)) {
          for (const tier of group.tiers) {
            const tierOgUrl = tier.ogImage?.asset?.url;
            if (!tierOgUrl) {
              missing.push({ type: 'tier', name: `${cat.title} > ${group.name} > ${tier.name || tier.tier}`, id: tier._key, reason: 'No ogImage set' });
            } else if (tierOgUrl.startsWith('/og-images/')) {
              const filePath = path.join(OG_IMAGE_DIR, path.basename(tierOgUrl));
              if (!fs.existsSync(filePath)) {
                missing.push({ type: 'tier', name: `${cat.title} > ${group.name} > ${tier.name || tier.tier}`, id: tier._key, reason: `Missing file: ${filePath}` });
              } else {
                ok.push({ type: 'tier', name: `${cat.title} > ${group.name} > ${tier.name || tier.tier}`, id: tier._key, file: filePath });
              }
            }
          }
        }
      }
    }
    // Check legacy packages ogImage
    if (Array.isArray(cat.packages)) {
      for (const pkg of cat.packages) {
        const pkgOgUrl = pkg.ogImage?.asset?.url;
        if (!pkgOgUrl) {
          missing.push({ type: 'package', name: `${cat.title} > ${pkg.name}`, id: pkg._key, reason: 'No ogImage set' });
        } else if (pkgOgUrl.startsWith('/og-images/')) {
          const filePath = path.join(OG_IMAGE_DIR, path.basename(pkgOgUrl));
          if (!fs.existsSync(filePath)) {
            missing.push({ type: 'package', name: `${cat.title} > ${pkg.name}`, id: pkg._key, reason: `Missing file: ${filePath}` });
          } else {
            ok.push({ type: 'package', name: `${cat.title} > ${pkg.name}`, id: pkg._key, file: filePath });
          }
        }
      }
    }
  }

  console.log('=== Deep OG Image Check Report ===');
  if (missing.length) {
    console.log('❌ Missing or Broken OG Images:');
    missing.forEach(m => {
      console.log(`- [${m.type}] ${m.name} (${m.id}): ${m.reason}`);
    });
  } else {
    console.log('✅ All OG images are present and linked for categories, groups, and tiers/packages.');
  }
  console.log(`\nChecked ${categories.length} service categories.`);
}

checkOgImagesDeep().catch(console.error);
