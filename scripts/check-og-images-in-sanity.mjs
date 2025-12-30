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

async function checkOgImages() {
  // Adjust the GROQ query to match your schema structure
  const docs = await client.fetch(`*[_type in ["serviceCategory", "serviceTier", "servicesPage"]]{
    _type,
    _id,
    title,
    ogImage {
      asset->{url}
    }
  }`);

  let missing = [];
  let ok = [];

  for (const doc of docs) {
    const url = doc.ogImage?.asset?.url;
    if (!url) {
      missing.push({ id: doc._id, type: doc._type, title: doc.title, reason: 'No ogImage set' });
      continue;
    }
    // Only check local images
    if (url.startsWith('/og-images/')) {
      const filePath = path.join(OG_IMAGE_DIR, path.basename(url));
      if (!fs.existsSync(filePath)) {
        missing.push({ id: doc._id, type: doc._type, title: doc.title, reason: `Missing file: ${filePath}` });
      } else {
        ok.push({ id: doc._id, type: doc._type, title: doc.title, file: filePath });
      }
    } else {
      ok.push({ id: doc._id, type: doc._type, title: doc.title, file: url });
    }
  }

  console.log('=== OG Image Check Report ===');
  if (missing.length) {
    console.log('❌ Missing or Broken OG Images:');
    missing.forEach(m => {
      console.log(`- [${m.type}] ${m.title} (${m.id}): ${m.reason}`);
    });
  } else {
    console.log('✅ All OG images are present and linked.');
  }
  console.log(`\nChecked ${docs.length} Sanity documents.`);
}

checkOgImages().catch(console.error);
