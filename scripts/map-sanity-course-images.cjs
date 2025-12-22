// map-sanity-course-images.cjs
// Maps old course names to their Sanity asset IDs for image reuse
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function mapCourseImages() {
  // Fetch all courses with their title and mainImage asset ref
  const courses = await client.fetch(`*[_type == "course" && defined(mainImage.asset._ref)]{ title, "assetId": mainImage.asset._ref }`);
  const mapping = {};
  for (const course of courses) {
    mapping[course.title.trim().toLowerCase()] = course.assetId;
  }
  fs.writeFileSync(
    __dirname + '/sanity-course-image-map.json',
    JSON.stringify(mapping, null, 2),
    'utf8'
  );
  console.log('✅ sanity-course-image-map.json written with', Object.keys(mapping).length, 'entries');
}

mapCourseImages();
