import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { client, guessLocalImagePathFor, guessOgPostImagePathFor, findOrUpload } from './lib/sanity-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

const FALLBACKS = {
  courseBanner: path.join(PROJECT_ROOT, 'public/assets/images/courses/courses.jpg'),
  courseOg: path.join(PROJECT_ROOT, 'public/og-images/posts/courses.jpg'),
  serviceBanner: path.join(PROJECT_ROOT, 'public/assets/images/services/services.jpg'),
  serviceOg: path.join(PROJECT_ROOT, 'public/og-images/posts/services.jpg'),
};

function exists(p) { try { return fs.existsSync(p); } catch { return false; } }

async function updateCoursesImages() {
  const courses = await client.fetch(`*[_type == "course"]{ _id, title, slug }`);
  let updated = 0;
  for (const c of courses) {
    const slug = c.slug?.current;
    if (!slug) continue;
    const coverPath = guessLocalImagePathFor('course', slug, PROJECT_ROOT);
    const ogPath = guessOgPostImagePathFor(slug, PROJECT_ROOT);

    const sets = {};
    if (coverPath && exists(coverPath)) {
      const img = await findOrUpload(coverPath);
      sets.mainImage = img;
      sets.bannerBackgroundImage = img;
    } else if (exists(FALLBACKS.courseBanner)) {
      const img = await findOrUpload(FALLBACKS.courseBanner);
      sets.bannerBackgroundImage = img;
      // only set mainImage if totally missing
      const current = await client.fetch(`*[_id==$id][0]{ mainImage }`, { id: c._id });
      if (!current?.mainImage) sets.mainImage = img;
    }

    if (ogPath && exists(ogPath)) {
      const og = await findOrUpload(ogPath);
      sets.ogImage = og;
      const currentSeo = await client.fetch(`*[_id==$id][0]{ seo }`, { id: c._id });
      sets.seo = { ...(currentSeo?.seo || {}), image: og };
    } else if (exists(FALLBACKS.courseOg)) {
      const og = await findOrUpload(FALLBACKS.courseOg);
      sets.ogImage = og;
      const currentSeo = await client.fetch(`*[_id==$id][0]{ seo }`, { id: c._id });
      sets.seo = { ...(currentSeo?.seo || {}), image: og };
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
    if (bannerPath && exists(bannerPath)) {
      const img = await findOrUpload(bannerPath);
      sets.bannerBackgroundImage = img;
    } else if (exists(FALLBACKS.serviceBanner)) {
      const img = await findOrUpload(FALLBACKS.serviceBanner);
      sets.bannerBackgroundImage = img;
    }

    if (ogPath && exists(ogPath)) {
      const og = await findOrUpload(ogPath);
      sets.ogImage = og;
    } else if (exists(FALLBACKS.serviceOg)) {
      const og = await findOrUpload(FALLBACKS.serviceOg);
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

function normalize(str) { return str.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

function candidateFilesForPackage(catSlug, pkg) {
  const postsDir = path.join(PROJECT_ROOT, 'public/og-images/posts');
  if (!exists(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  const base = normalize(`${catSlug}-${pkg?.name || ''}-${pkg?.tier || ''}`);
  const variants = [base, normalize(`${catSlug}-${pkg?.name||''}`), catSlug, normalize(pkg?.name||'')];
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
      let picked;
      if (files.length) picked = path.join(PROJECT_ROOT, 'public/og-images/posts', files[0]);
      else if (exists(FALLBACKS.serviceOg)) picked = FALLBACKS.serviceOg;
      if (!picked) continue;
      const og = await findOrUpload(picked);
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
  console.log('🔧 Updating images (robust) for courses, service categories, and packages...');
  await updateCoursesImages();
  await updateServiceCategoriesImages();
  await updateServicePackagesImages();
  console.log('✅ Robust image updates complete.');
}

main().catch(console.error);
