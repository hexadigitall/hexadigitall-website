#!/usr/bin/env node
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'g72lqidr',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function fetchCourseData(courseTitle) {
  try {
    const query = `*[_type == "course" && title == $title][0]{
      title,
      slug,
      summary,
      description,
      level,
      duration,
      durationWeeks,
      hoursPerWeek,
      modules,
      lessons,
      prerequisites,
      includes,
      instructor,
      school->{
        title,
        slug
      },
      body,
      "hourlyRateNGN": hourlyRateNGN,
      "hourlyRateUSD": hourlyRateUSD,
      courseType
    }`;

    const course = await client.fetch(query, { title: courseTitle });
    
    if (!course) {
      console.error(`❌ Course "${courseTitle}" not found in Sanity`);
      return null;
    }

    console.log(`✅ Found course: ${course.title}`);
    console.log(`📊 Course Details:`);
    console.log(`   - Level: ${course.level}`);
    console.log(`   - Duration: ${course.duration || `${course.durationWeeks} weeks`}`);
    console.log(`   - Hours/Week: ${course.hoursPerWeek || 'Not specified'}`);
    console.log(`   - Modules: ${course.modules || 'Not specified'}`);
    console.log(`   - Lessons: ${course.lessons || 'Not specified'}`);
    console.log(`   - School: ${course.school?.title || 'Not assigned'}`);
    console.log(`   - Prerequisites: ${course.prerequisites?.length || 0} items`);
    console.log(`   - Instructor: ${course.instructor || 'Not specified'}`);
    
    return course;
  } catch (error) {
    console.error('❌ Error fetching course:', error.message);
    return null;
  }
}

async function main() {
  console.log('🔍 Fetching course data from Sanity...\n');
  
  const courses = [
    'Azure Security Technologies (AZ-500)',
    'Linux Administration & Shell Scripting Pro'
  ];

  const courseData = {};

  for (const courseTitle of courses) {
    const data = await fetchCourseData(courseTitle);
    if (data) {
      courseData[courseTitle] = data;
    }
    console.log('─'.repeat(60));
  }

  return courseData;
}

// Export for use in other scripts
export { fetchCourseData };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
