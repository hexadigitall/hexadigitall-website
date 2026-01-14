import path from 'path';
import { fileURLToPath } from 'url';
import { client, guessLocalImagePathFor, guessOgPostImagePathFor, findOrUpload } from './lib/sanity-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

// The 8 courses that need image patching with correct imageSlug values
const coursesToPatch = [
  { slug: 'advanced-excel-business', imageSlug: 'advanced-excel-for-business' },
  { slug: 'business-intelligence-analytics', imageSlug: 'business-intelligence-bi-and-analytics' },
  { slug: 'executive-presentation-public-speaking', imageSlug: 'executive-presentation-and-public-speaking' },
  { slug: 'microsoft-365-ai-integration', imageSlug: 'microsoft-365-and-ai-integration' },
  { slug: 'microsoft-access-business-apps', imageSlug: 'microsoft-access-for-business-apps' },
  { slug: 'nosql-cloud-database-architecture', imageSlug: 'nosql-and-cloud-database-architecture' },
  { slug: 'programming-data-management', imageSlug: 'programming-for-data-management' },
  { slug: 'sql-relational-database-design', imageSlug: 'sql-and-relational-database-design' }
];

async function patchCourseImages() {
  console.log('🔧 Patching images for 8 new courses...\n');
  let patched = 0;
  let errors = 0;

  for (const c of coursesToPatch) {
    try {
      // Find course document
      const course = await client.fetch(`*[_type == "course" && slug.current == $slug][0]{_id, title}`, { slug: c.slug });
      
      if (!course) {
        console.log(`❌ Course not found: ${c.slug}`);
        errors++;
        continue;
      }

      // Resolve image paths using correct imageSlug
      const coverPath = guessLocalImagePathFor('course', c.imageSlug, PROJECT_ROOT);
      const ogPath = guessOgPostImagePathFor(c.imageSlug, PROJECT_ROOT);

      if (!coverPath) {
        console.log(`⚠️  No cover image found for ${c.slug} (imageSlug: ${c.imageSlug})`);
      }
      if (!ogPath) {
        console.log(`⚠️  No OG image found for ${c.slug} (imageSlug: ${c.imageSlug})`);
      }

      // Upload/reuse assets
      const mainImage = coverPath ? await findOrUpload(coverPath) : undefined;
      const bannerBackgroundImage = coverPath ? await findOrUpload(coverPath) : undefined; // same asset
      const ogImage = ogPath ? await findOrUpload(ogPath) : undefined;
      const seoImage = ogPath ? await findOrUpload(ogPath) : undefined;

      // Patch document with images
      await client
        .patch(course._id)
        .set({
          mainImage,
          bannerBackgroundImage,
          ogImage,
          'seo.image': seoImage
        })
        .commit();

      console.log(`✅ Patched: ${course.title} (${c.slug})`);
      patched++;
    } catch (err) {
      console.error(`❌ Error patching ${c.slug}:`, err.message);
      errors++;
    }
  }

  console.log(`\n✅ Done. Patched: ${patched}, Errors: ${errors}`);
}

patchCourseImages();
