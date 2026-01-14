import path from 'path';
import { fileURLToPath } from 'url';
import { client, guessLocalImagePathFor, guessOgPostImagePathFor, findOrUpload } from './lib/sanity-helpers.mjs';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

async function updateCoursesImages() {
  const courses = await client.fetch(`*[_type == "course"]{ _id, title, slug }`);
  let updated = 0;
  for (const c of courses) {
    const slug = c.slug?.current;
    if (!slug) continue;
    const coverPath = guessLocalImagePathFor('course', slug, PROJECT_ROOT);
    const ogPath = guessOgPostImagePathFor(slug, PROJECT_ROOT);
    const sets = {};
    if (coverPath) {
      const img = await findOrUpload(coverPath);
      sets.mainImage = img;
      sets.bannerBackgroundImage = img;
    }
    if (ogPath) {
      const og = await findOrUpload(ogPath);
      sets.ogImage = og;
      sets.seo = { ...(await client.fetch(`*[_id==$id][0]{seo}`, { id: c._id }))?.seo, image: og };
    }
    if (Object.keys(sets).length) {
      await client.patch(c._id).set(sets).commit();
      updated++;
      process.stdout.write('.');
    }
  }
  console.log(`\nCourses updated: ${updated}`);
}

async function updateServiceCategoriesImages() {
  const cats = await client.fetch(`*[_type == "serviceCategory"]{ _id, title, slug }`);
  let updated = 0;
  for (const cat of cats) {
    const slug = cat.slug?.current;
    if (!slug) continue;
    const bannerPath = guessLocalImagePathFor('service', slug, PROJECT_ROOT);
    const ogPath = guessOgPostImagePathFor(slug, PROJECT_ROOT);
    const sets = {};
    if (bannerPath) {
      const img = await findOrUpload(bannerPath);
      sets.bannerBackgroundImage = img;
    }
    if (ogPath) {
      const og = await findOrUpload(ogPath);
      sets.ogImage = og;
    }
    if (Object.keys(sets).length) {
      await client.patch(cat._id).set(sets).commit();
      updated++;
      process.stdout.write('.');
    }
  }
  console.log(`\nService categories updated: ${updated}`);
}

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

function candidateFilesForPackage(catSlug, pkg) {
  const postsDir = path.join(PROJECT_ROOT, 'public/og-images/posts');
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  const base = normalize(`${catSlug}-${pkg?.name || ''}-${pkg?.tier || ''}`);
  const variants = [base, normalize(`${catSlug}-${pkg?.name||''}`), catSlug];
  // also service- prefix variants used by generator
  const withService = variants.flatMap(v => [v, `service-${v}`]);
  return files.filter(f => withService.some(v => f.includes(v)));
}

async function updateServicePackagesImages() {
  const cats = await client.fetch(`*[_type == "serviceCategory"]{ _id, title, slug, packages[]{ _key, name, tier, ogImage } }`);
  let patched = 0;
  for (const cat of cats) {
    const catSlug = cat.slug?.current; if (!catSlug) continue;
    if (!Array.isArray(cat.packages)) continue;
    for (const pkg of cat.packages) {
      if (pkg?.ogImage?.asset?._ref) continue; // already has image
      const files = candidateFilesForPackage(catSlug, pkg);
      if (!files.length) continue;
      const filePath = path.join(PROJECT_ROOT, 'public/og-images/posts', files[0]);
      const og = await findOrUpload(filePath);
      await client.patch(cat._id)
        .set({ [`packages[_key=="${pkg._key}"].ogImage`]: og })
        .commit();
      patched++;
      process.stdout.write('+');
    }
  }
  console.log(`\nService packages ogImages patched: ${patched}`);
}

async function main() {
  console.log('🔧 Updating images for courses, service categories, and packages...');
  await updateCoursesImages();
  await updateServiceCategoriesImages();
  await updateServicePackagesImages();
  console.log('✅ Image updates complete.');
}

main().catch(console.error);
