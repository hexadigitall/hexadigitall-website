import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'p03v5d5t',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
});

async function listCorrectUrls() {
  console.log('🔗 CORRECT SHARABLE URLS WITH VERIFIED ROUTES\n');

  try {
    // SCHOOLS - Uses /school/ (singular)
    console.log('SCHOOLS:');
    const schools = await client.fetch(`*[_type == "school"] | order(name asc) { name, slug }`);
    for (const school of schools) {
      if (school.slug?.current) {
        console.log(`https://www.hexadigitall.com/school/${school.slug.current}`);
      }
    }

    // COURSES - Uses /courses/ (plural)
    console.log('\nCOURSES:');
    const courses = await client.fetch(`*[_type == "course"] | order(title asc) { title, slug }`);
    for (const course of courses) {
      if (course.slug?.current) {
        console.log(`https://www.hexadigitall.com/courses/${course.slug.current}`);
      }
    }

    // SERVICES - Uses /services/ (plural)
    console.log('\nSERVICES:');
    const services = await client.fetch(`*[_type == "serviceCategory"] | order(name asc) { name, slug }`);
    for (const service of services) {
      if (service.slug?.current) {
        console.log(`https://www.hexadigitall.com/services/${service.slug.current}`);
      }
    }

    // SERVICE PACKAGES
    console.log('\nSERVICE PACKAGES:');
    const packages = await client.fetch(`*[_type == "servicePackage"] | order(_createdAt asc) { title, slug, category->{ slug } }`);
    for (const pkg of packages) {
      if (pkg.slug?.current && pkg.category?.slug?.current) {
        console.log(`https://www.hexadigitall.com/services/${pkg.category.slug.current}/${pkg.slug.current}`);
      }
    }

  } catch (error) {
    console.error('❌ Error fetching data:', error.message);
  }

  process.exit(0);
}

listCorrectUrls();
