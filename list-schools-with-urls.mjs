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

async function listSchoolsWithUrls() {
  console.log('🏫 Fetching all schools with URLs...\n');

  try {
    const schools = await client.fetch(
      `*[_type == "school"] {
        _id,
        name,
        slug,
        "courseCount": count(*[_type == "course" && references(^._id)])
      } | order(name asc)`
    );

    if (schools.length === 0) {
      console.log('❌ No schools found.');
      return;
    }

    console.log(`✅ Found ${schools.length} school(s):\n`);
    console.log('='.repeat(100));

    schools.forEach((school, index) => {
      const slug = school.slug?.current || 'N/A';
      const url = slug !== 'N/A' ? `https://www.hexadigitall.com/schools/${slug}` : 'N/A';
      
      console.log(`\n${index + 1}. ${school.name}`);
      console.log(`   Slug: ${slug}`);
      console.log(`   URL:  ${url}`);
      console.log(`   Courses: ${school.courseCount}`);
    });

    console.log('\n' + '='.repeat(100));
    console.log('\n📋 Quick Reference List:\n');
    
    schools.forEach((school, index) => {
      const slug = school.slug?.current || 'N/A';
      const url = slug !== 'N/A' ? `https://www.hexadigitall.com/schools/${slug}` : 'N/A';
      console.log(`${index + 1}. ${school.name}`);
      console.log(`   ${url}\n`);
    });

    console.log('='.repeat(100));
    console.log('\n📊 Summary:');
    console.log(`Total Schools: ${schools.length}`);
    console.log(`Total Courses: ${schools.reduce((sum, s) => sum + s.courseCount, 0)}`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

listSchoolsWithUrls().catch(console.error);
