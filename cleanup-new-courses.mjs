import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-01-11',
  token: process.env.SANITY_API_TOKEN,
});

const courseSlugs = [
  'autocad-masterclass',
  'archicad-professional',
  'adobe-creative-cloud-suite',
  'vector-graphics-mastery-coreldraw',
  'visual-communication-infographics',
  'business-intelligence-analytics',
  'advanced-excel-business',
  'programming-data-management',
  'sql-relational-database-design',
  'nosql-cloud-database-architecture',
  'rapid-app-development-low-code',
  'microsoft-access-business-apps',
  'executive-presentation-public-speaking',
  'microsoft-365-ai-integration'
];

async function removeNewCourses() {
  console.log('🗑️  Removing all newly created courses...\n');

  let removed = 0;
  let errors = 0;

  for (const slug of courseSlugs) {
    try {
      console.log(`Removing: ${slug}`);
      
      // Find the course by slug
      const course = await client.fetch(
        `*[_type == "course" && slug.current == $slug][0]`,
        { slug }
      );

      if (!course) {
        console.log(`  ⚠️  Not found\n`);
        continue;
      }

      // Delete it
      await client.delete(course._id);
      console.log(`  ✅ Deleted\n`);
      removed++;

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}\n`);
      errors++;
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ Successfully removed: ${removed} courses`);
  console.log(`❌ Errors: ${errors}`);
  console.log(`${'='.repeat(60)}\n`);
}

removeNewCourses().catch(console.error);
