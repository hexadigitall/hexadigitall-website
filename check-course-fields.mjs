// Quick script to check what fields exist in actual course documents
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function checkFields() {
  try {
    console.log('🔍 Checking actual course documents in Sanity...\n');
    
    const courses = await client.fetch(`*[_type == "course"][0...3] {
      _id,
      title,
      order,
      slug,
      curriculum,
      monthlyScheduling,
      "allFields": *[_id == ^._id][0]
    }`);
    
    if (courses.length === 0) {
      console.log('⚠️  No course documents found');
      return;
    }
    
    console.log(`Found ${courses.length} courses\n`);
    
    courses.forEach((course, idx) => {
      console.log(`\n📚 Course ${idx + 1}: ${course.title}`);
      console.log('─'.repeat(50));
      
      if (course.order !== undefined) {
        console.log(`  ✓ order: ${course.order}`);
      }
      if (course.slug) {
        console.log(`  ✓ slug: ${JSON.stringify(course.slug)}`);
      }
      if (course.curriculum) {
        console.log(`  ✓ curriculum: ${JSON.stringify(course.curriculum, null, 2)}`);
      }
      if (course.monthlyScheduling) {
        console.log(`  ✓ monthlyScheduling: ${JSON.stringify(course.monthlyScheduling, null, 2)}`);
      }
    });
    
    // Get all field names from first course
    if (courses[0]?.allFields) {
      console.log('\n\n📋 All fields in first document:');
      console.log('─'.repeat(50));
      const fieldNames = Object.keys(courses[0].allFields).filter(k => !k.startsWith('_'));
      fieldNames.forEach(field => console.log(`  - ${field}`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkFields();
