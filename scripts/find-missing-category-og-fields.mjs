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

async function findMissingCategoryOgFields() {
  const categories = await client.fetch(`*[_type == "serviceCategory"]{
    _id,
    title,
    ogTitle,
    ogDescription
  }`);

  let missing = [];
  for (const cat of categories) {
    if (!cat.ogTitle || !cat.ogDescription) {
      missing.push({
        category: cat.title,
        ogTitle: cat.ogTitle,
        ogDescription: cat.ogDescription
      });
    }
  }
  if (missing.length === 0) {
    console.log('All service categories have ogTitle and ogDescription.');
  } else {
    console.log('Missing ogTitle/ogDescription in service categories:');
    for (const m of missing) {
      console.log(`- [${m.category}] | ogTitle: ${m.ogTitle ? 'OK' : 'MISSING'} | ogDescription: ${m.ogDescription ? 'OK' : 'MISSING'}`);
    }
  }
}

findMissingCategoryOgFields().catch(console.error);
