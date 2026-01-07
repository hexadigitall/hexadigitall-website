// scripts/listSanitySlugs.cjs
// Node.js script to list all slugs from all documents in Sanity (CommonJS)

const { createClient } = require('@sanity/client');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.replace(/"/g, '');
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.replace(/"/g, '');
const token = process.env.SANITY_API_READ_TOKEN?.replace(/"/g, '') || process.env.SANITY_API_TOKEN?.replace(/"/g, '');

if (!projectId || !dataset) {
  console.error('Missing Sanity projectId or dataset.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-01-01',
  useCdn: false,
  token,
});

async function listAllSlugs() {
  // Query for all documents with a slug field
  const query = '*[_type != "system" && defined(slug.current)]{_type, _id, slug}';
  const results = await client.fetch(query);
  if (!results.length) {
    console.log('No slugs found.');
    return;
  }
  const grouped = results.reduce((acc, doc) => {
    if (!acc[doc._type]) acc[doc._type] = [];
    acc[doc._type].push(doc.slug.current);
    return acc;
  }, {});
  Object.entries(grouped).forEach(([type, slugs]) => {
    console.log(`\nType: ${type}`);
    slugs.forEach(slug => console.log(`  - ${slug}`));
  });
}

listAllSlugs().catch(err => {
  console.error('Error fetching slugs:', err);
  process.exit(1);
});
