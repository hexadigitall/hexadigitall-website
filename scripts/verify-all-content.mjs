import { client } from './lib/sanity-helpers.mjs';

async function verifyCourses() {
  const issues = [];
  const docs = await client.fetch(`*[_type == "course"]{
    title, slug, mainImage, bannerBackgroundImage, ogImage, seo
  }`);
  for (const d of docs) {
    const s = d.slug?.current;
    if (!s) issues.push('Course missing slug');
    if (!d.mainImage) issues.push(`${s}: missing mainImage`);
    if (!d.bannerBackgroundImage) issues.push(`${s}: missing bannerBackgroundImage`);
    if (!d.ogImage) issues.push(`${s}: missing ogImage`);
    if (!d.seo || !d.seo.image) issues.push(`${s}: missing seo.image`);
  }
  return issues;
}

async function verifyServiceCategories() {
  const issues = [];
  const docs = await client.fetch(`*[_type == "serviceCategory"]{
    title, slug, bannerBackgroundImage, ogImage, packages[]{ _key, name, ogImage }
  }`);
  for (const d of docs) {
    const s = d.slug?.current;
    if (!s) issues.push('ServiceCategory missing slug');
    if (!d.bannerBackgroundImage) issues.push(`${s}: missing bannerBackgroundImage`);
    if (!d.ogImage) issues.push(`${s}: missing ogImage`);
    if (Array.isArray(d.packages)) {
      for (const p of d.packages) {
        if (!p.ogImage) issues.push(`${s} > ${p.name || p._key}: missing package ogImage`);
      }
    }
  }
  return issues;
}

async function main() {
  console.log('🔎 Verifying content integrity...');
  const courseIssues = await verifyCourses();
  const serviceIssues = await verifyServiceCategories();
  const issues = [...courseIssues, ...serviceIssues];
  if (issues.length) {
    console.log(`⚠️ Found ${issues.length} issues:`);
    issues.forEach(i => console.log(' - ' + i));
    process.exitCode = 1;
  } else {
    console.log('✅ All content types look good.');
  }
}

main().catch(console.error);
