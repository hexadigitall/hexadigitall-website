// check-schools.js
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function checkSchools() {
  try {
    console.log('🏫 Checking Schools in Sanity...\n');
    
    console.log('📊 Environment Variables:');
    console.log(`   Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
    console.log(`   Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
    console.log(`   Has Token: ${process.env.SANITY_API_TOKEN ? 'Yes' : 'No'}\n`);

    // Fetch all schools
    const schools = await client.fetch(`*[_type == "school"] | order(title asc) { _id, title, slug, description }`);
    
    console.log(`📚 Schools Found: ${schools.length}\n`);
    
    if (schools.length === 0) {
      console.log('   No schools found.');
      return;
    }

    schools.forEach((school, index) => {
      console.log(`${index + 1}. ${school.title}`);
      console.log(`   ID: ${school._id}`);
      console.log(`   Slug: ${school.slug?.current || 'N/A'}`);
      console.log(`   Description: ${school.description?.substring(0, 60) || 'N/A'}...`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkSchools();
