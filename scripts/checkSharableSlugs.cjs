// scripts/checkSharableSlugs.cjs
// Checks which slugs have valid sharable links and OG metadata in a Next.js + Sanity project
// Usage: node scripts/checkSharableSlugs.cjs [baseUrl]

const { createClient } = require('@sanity/client');
const fetch = require('node-fetch');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env.local') });

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.replace(/"/g, '');
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.replace(/"/g, '');
const token = process.env.SANITY_API_READ_TOKEN?.replace(/"/g, '') || process.env.SANITY_API_TOKEN?.replace(/"/g, '');
const baseUrl = process.argv[2] || 'https://hexadigitall.com';

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2023-01-01',
  useCdn: false,
  token,
});

const slugTypes = [
  { type: 'course', route: '/courses/' },
  { type: 'school', route: '/school/' },
  { type: 'courseCategory', route: '/courses/category/' },
  { type: 'serviceCategory', route: '/services/' },
];

async function checkOGMeta(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();
    const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/);
    const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/);
    const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/);
    return {
      ogImage: ogImage ? ogImage[1] : null,
      ogTitle: ogTitle ? ogTitle[1] : null,
      ogDescription: ogDesc ? ogDesc[1] : null,
    };
  } catch (e) {
    return null;
  }
}

async function main() {
  for (const { type, route } of slugTypes) {
    const docs = await client.fetch(`*[_type == "${type}" && defined(slug.current)]{slug}`);
    if (!docs.length) continue;
    console.log(`\nType: ${type}`);
    for (const doc of docs) {
      const slug = doc.slug.current;
      const url = baseUrl + route + slug;
      const meta = await checkOGMeta(url);
      if (meta && meta.ogImage && meta.ogTitle && meta.ogDescription) {
        console.log(`  ✔ ${url} [OG: ok]`);
      } else if (meta) {
        console.log(`  ⚠ ${url} [OG missing: ${!meta.ogImage ? 'image ' : ''}${!meta.ogTitle ? 'title ' : ''}${!meta.ogDescription ? 'desc' : ''}]`);
      } else {
        console.log(`  ✖ ${url} [Not reachable]`);
      }
    }
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
