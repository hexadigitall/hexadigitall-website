import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_UPDATE_TOKEN,
  useCdn: false,
  apiVersion: '2023-12-30',
});

const OG_IMAGE_DIR = path.resolve('public/og-images');

// Synonym map for fallback matching
const SYNONYMS = [
  ['starter', 'basic', 'essential'],
  ['standard', 'regular', 'core'],
  ['premium', 'pro', 'advanced'],
  ['growth', 'accelerator'],
  ['business', 'biz'],
  ['plan', 'package'],
  ['cv', 'resume'],
  ['linkedin', 'profile'],
  ['strategy', 'consult', 'session'],
  ['logo', 'brand'],
  ['web', 'website'],
  ['ecommerce', 'store'],
  ['social', 'sm'],
  ['marketing', 'dm'],
];

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getSynonymVariants(base) {
  let variants = [base];
  for (const group of SYNONYMS) {
    for (const word of group) {
      if (base.includes(word)) {
        for (const alt of group) {
          if (alt !== word) {
            variants.push(base.replace(word, alt));
          }
        }
      }
    }
  }
  return [...new Set(variants)];
}

function findBestOgImage(pkgName, ogImages) {
  const base = normalize(pkgName);
  const candidates = getSynonymVariants(base);
  for (const candidate of candidates) {
    const found = ogImages.find(img => img.startsWith(candidate));
    if (found) return found;
  }
  // fallback: partial match
  for (const candidate of candidates) {
    const found = ogImages.find(img => img.includes(candidate));
    if (found) return found;
  }
  return null;
}

async function patchOgImages() {
  const ogImages = fs.readdirSync(OG_IMAGE_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
  const categories = await client.fetch(`*[_type == "serviceCategory"]{
    _id,
    title,
    packages[]{ _key, name, ogImage { asset->{url} } }
  }`);
  let totalPatched = 0;
  for (const cat of categories) {
    if (Array.isArray(cat.packages)) {
      for (const pkg of cat.packages) {
        if (!pkg.ogImage || !pkg.ogImage.asset || !pkg.ogImage.asset.url) {
          const bestImg = findBestOgImage(pkg.name, ogImages);
          if (bestImg) {
            try {
              await client.patch(cat._id)
                .set({ [`packages[_key==\"${pkg._key}\"].ogImage`]: {
                  asset: { _type: 'reference', _ref: await uploadOgImage(bestImg) }
                } })
                .commit();
              console.log(`Patched [${cat.title}] > [${pkg.name}] with ogImage: ${bestImg}`);
              totalPatched++;
            } catch (err) {
              console.error(`Failed to patch [${cat.title}] > [${pkg.name}]:`, err.message);
            }
          } else {
            console.warn(`No suitable ogImage found for [${cat.title}] > [${pkg.name}]`);
          }
        }
      }
    }
  }
  if (totalPatched === 0) {
    console.log('No missing ogImage fields needed patching.');
  } else {
    console.log(`Patched ${totalPatched} package(s) with missing ogImage.`);
  }
}

async function uploadOgImage(filename) {
  const filePath = path.join(OG_IMAGE_DIR, filename);
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, { filename });
  return asset._id;
}

patchOgImages().catch(console.error);
