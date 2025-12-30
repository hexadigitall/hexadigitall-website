import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_UPDATE_TOKEN,
  useCdn: false,
  apiVersion: '2023-12-30',
});

const COURSE_IMAGE_DIR = path.resolve('public/course-images');
const COURSE_OG_IMAGE_DIR = path.resolve('public/course_og_images');

function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uploadImage(filePath) {
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, { filename: path.basename(filePath) });
  return asset._id;
}

async function patchMissingCourseOgFields() {
  const courses = await client.fetch(`*[_type == "course"]{
    _id,
    title,
    bannerBackgroundImage,
    ogImage,
    ogTitle,
    ogDescription
  }`);

  for (const course of courses) {
    let patch = {};
    const norm = normalize(course.title);
    // Banner image
    if (!course.bannerBackgroundImage) {
      const bannerFile = fs.readdirSync(COURSE_IMAGE_DIR).find(f => normalize(f.replace(/\.(jpg|jpeg|png)$/i, '')) === norm);
      if (bannerFile) {
        const assetId = await uploadImage(path.join(COURSE_IMAGE_DIR, bannerFile));
        patch.bannerBackgroundImage = { asset: { _type: 'reference', _ref: assetId } };
      }
    }
    // OG image
    if (!course.ogImage) {
      const ogFile = fs.readdirSync(COURSE_OG_IMAGE_DIR).find(f => normalize(f.replace(/\.(jpg|jpeg|png)$/i, '')) === norm);
      if (ogFile) {
        const assetId = await uploadImage(path.join(COURSE_OG_IMAGE_DIR, ogFile));
        patch.ogImage = { asset: { _type: 'reference', _ref: assetId } };
      }
    }
    // OG title
    if (!course.ogTitle) {
      patch.ogTitle = `${course.title} | Hexadigitall Course`;
    }
    // OG description
    if (!course.ogDescription) {
      patch.ogDescription = `Learn ${course.title} with expert instruction and hands-on projects at Hexadigitall.`;
    }
    if (Object.keys(patch).length > 0) {
      try {
        await client.patch(course._id).set(patch).commit();
        console.log(`Patched [${course.title}] with missing OG/banner fields.`);
      } catch (err) {
        console.error(`Failed to patch [${course.title}]:`, err.message);
      }
    }
  }
}

patchMissingCourseOgFields().catch(console.error);
