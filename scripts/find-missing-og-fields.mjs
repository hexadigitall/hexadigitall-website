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

async function findMissingOgFields() {
  const categories = await client.fetch(`*[_type == "serviceCategory"]{
    _id,
    title,
    packages[]{
      _key,
      name,
      ogTitle,
      ogDescription
    }
  }`);

  let missing = [];
  for (const cat of categories) {
    if (Array.isArray(cat.packages)) {
      for (const pkg of cat.packages) {
        if (!pkg.ogTitle || !pkg.ogDescription) {
          missing.push({
            category: cat.title,
            package: pkg.name,
            ogTitle: pkg.ogTitle,
            ogDescription: pkg.ogDescription
          });
        }
      }
    }
  }
  if (missing.length === 0) {
    console.log('All packages have ogTitle and ogDescription.');
  } else {
    console.log('Missing ogTitle/ogDescription:');
    for (const m of missing) {
      console.log(`- [${m.category}] > [${m.package}] | ogTitle: ${m.ogTitle ? 'OK' : 'MISSING'} | ogDescription: ${m.ogDescription ? 'OK' : 'MISSING'}`);
    }
  }
}

findMissingOgFields().catch(console.error);
