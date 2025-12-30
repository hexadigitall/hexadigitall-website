import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_READ_TOKEN,
  useCdn: false,
  apiVersion: '2023-12-30',
});

async function findMissingCourseSchoolOgFields() {
  // Check courses
  const courses = await client.fetch(`*[_type == "course"]{
    _id,
    title,
    school->{_id, title},
    bannerBackgroundImage,
    ogImage,
    ogTitle,
    ogDescription
  }`);

  let missingCourses = [];
  for (const course of courses) {
    const missing = [];
    if (!course.bannerBackgroundImage) missing.push('bannerBackgroundImage');
    if (!course.ogImage) missing.push('ogImage');
    if (!course.ogTitle) missing.push('ogTitle');
    if (!course.ogDescription) missing.push('ogDescription');
    if (missing.length > 0) {
      missingCourses.push({
        course: course.title,
        school: course.school?.title || 'Unknown',
        missing
      });
    }
  }

  // Check schools
  const schools = await client.fetch(`*[_type == "school"]{
    _id,
    title,
    bannerBackgroundImage,
    ogImage,
    ogTitle,
    ogDescription
  }`);

  let missingSchools = [];
  for (const school of schools) {
    const missing = [];
    if (!school.bannerBackgroundImage) missing.push('bannerBackgroundImage');
    if (!school.ogImage) missing.push('ogImage');
    if (!school.ogTitle) missing.push('ogTitle');
    if (!school.ogDescription) missing.push('ogDescription');
    if (missing.length > 0) {
      missingSchools.push({
        school: school.title,
        missing
      });
    }
  }

  if (missingCourses.length === 0) {
    console.log('All courses have required OG/banner fields.');
  } else {
    console.log('Courses missing OG/banner fields:');
    for (const c of missingCourses) {
      console.log(`- [${c.school}] > [${c.course}]: ${c.missing.join(', ')}`);
    }
  }

  if (missingSchools.length === 0) {
    console.log('All schools have required OG/banner fields.');
  } else {
    console.log('Schools missing OG/banner fields:');
    for (const s of missingSchools) {
      console.log(`- [${s.school}]: ${s.missing.join(', ')}`);
    }
  }
}

findMissingCourseSchoolOgFields().catch(console.error);
