import { createClient } from '@sanity/client';

const client = createClient({
  projectId: 'puzezel0',
  dataset: 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
});

async function fetchAllCourses() {
  console.log('🔍 Fetching all courses from Sanity...\n');

  const query = `*[_type == "course"] | order(title asc) {
    _id,
    title,
    slug,
    level,
    duration,
    hoursPerWeek,
    numberOfModules,
    numberOfLessons,
    school->{
      title
    },
    prerequisites,
    overview,
    courseCurriculum,
    learningOutcomes,
    targetAudience
  }`;

  try {
    const courses = await client.fetch(query);
    
    console.log(`✅ Found ${courses.length} courses total\n`);
    console.log('='.repeat(80));
    
    // Output as JSON for easy parsing
    console.log(JSON.stringify(courses, null, 2));
    
  } catch (error) {
    console.error('❌ Error fetching courses:', error.message);
    process.exit(1);
  }
}

fetchAllCourses();
