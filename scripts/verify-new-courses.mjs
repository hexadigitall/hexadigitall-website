import { client } from './lib/sanity-helpers.mjs';

const NEW_SLUGS = [
  'autocad-masterclass','archicad-professional','adobe-creative-cloud-suite','vector-graphics-mastery-coreldraw','visual-communication-infographics','business-intelligence-analytics','advanced-excel-business','programming-data-management','sql-relational-database-design','nosql-cloud-database-architecture','rapid-app-development-low-code','microsoft-access-business-apps','executive-presentation-public-speaking','microsoft-365-ai-integration'
];

async function verifyNewCourses() {
  const issues = [];
  const courses = await client.fetch(`*[_type == "course" && slug.current in $slugs]{
    title, slug, hourlyRateUSD, hourlyRateNGN, pricePerMonth, pricePerMonthNGN, price, priceNGN,
    mainImage, bannerBackgroundImage, ogImage, seo
  }`, { slugs: NEW_SLUGS });

  const foundSlugs = new Set(courses.map(c => c.slug?.current));
  for (const s of NEW_SLUGS) {
    if (!foundSlugs.has(s)) issues.push(`Missing course: ${s}`);
  }

  for (const c of courses) {
    const missing = [];
    if (!c.hourlyRateUSD) missing.push('hourlyRateUSD');
    if (!c.hourlyRateNGN) missing.push('hourlyRateNGN');
    if (!c.pricePerMonth) missing.push('pricePerMonth');
    if (!c.pricePerMonthNGN) missing.push('pricePerMonthNGN');
    if (!c.price) missing.push('price');
    if (!c.priceNGN) missing.push('priceNGN');
    if (!c.mainImage) missing.push('mainImage');
    if (!c.bannerBackgroundImage) missing.push('bannerBackgroundImage');
    if (!c.ogImage) missing.push('ogImage');
    if (!c.seo || !c.seo.title || !c.seo.description || !c.seo.url) missing.push('seo');
    if (!c.seo || !c.seo.image) missing.push('seo.image');
    if (missing.length) issues.push(`${c.slug?.current}: Missing ${missing.join(', ')}`);
  }

  // duplicates by title or slug
  const dupTitle = Object.entries(courses.reduce((a,c)=>{const t=c.title?.toLowerCase();a[t]=(a[t]||0)+1;return a;},{})).filter(([_,n])=>n>1);
  const dupSlug = Object.entries(courses.reduce((a,c)=>{const s=c.slug?.current;a[s]=(a[s]||0)+1;return a;},{})).filter(([_,n])=>n>1);
  dupTitle.forEach(([t])=>issues.push(`Duplicate title: ${t}`));
  dupSlug.forEach(([s])=>issues.push(`Duplicate slug: ${s}`));

  if (issues.length) {
    console.log('⚠️ Issues found:');
    issues.forEach(i => console.log(' - ' + i));
    process.exitCode = 1;
  } else {
    console.log('✅ All new courses look good.');
  }
}

verifyNewCourses().catch(console.error);
