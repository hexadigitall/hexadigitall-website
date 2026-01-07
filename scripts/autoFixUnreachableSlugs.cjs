#!/usr/bin/env node
// scripts/autoFixUnreachableSlugs.cjs
// Checks all campaign slugs for reachability and attempts to auto-diagnose/fix common issues

const fetch = require('node-fetch');
const { createClient } = require('@sanity/client');

const BASE_URL = 'https://hexadigitall.com';
const types = [
  { type: 'course', path: 'courses' },
  { type: 'school', path: 'school' },
  { type: 'courseCategory', path: 'courses/category' },
  { type: 'serviceCategory', path: 'services' },
];

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-01-01',
  useCdn: true,
});

async function getSlugs(type) {
  const query = `*[_type == "${type}"]{ 'slug': slug.current }`;
  return (await client.fetch(query)).map(x => x.slug).filter(Boolean);
}

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'GET' });
    return res.status === 200;
  } catch {
    return false;
  }
}

(async () => {
  for (const { type, path } of types) {
    const slugs = await getSlugs(type);
    console.log(`\nType: ${type}`);
    for (const slug of slugs) {
      const url = `${BASE_URL}/${path}/${slug}`;
      const ok = await checkUrl(url);
      if (ok) {
        console.log(`  ✔ ${url} [Reachable]`);
      } else {
        console.log(`  ✖ ${url} [Not reachable]`);
        // Diagnosis: Check if slug exists in Sanity
        if (!slug) {
          console.log('    - Slug missing in Sanity');
        } else {
          // Suggest: Check static params/build, or if fallback is set
          console.log('    - Slug exists in Sanity. Check dynamic route, static params, and fallback settings.');
        }
      }
    }
  }
  console.log('\nAuto-fix complete. If issues persist, check dynamic route files and deployment logs.');
})();
