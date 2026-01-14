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

async function listSlugs() {
  const BASE_URL = 'https://www.hexadigitall.com';
  
  console.log('🔗 CORRECT SHARABLE URLS WITH SLUGS\n');

  // Schools
  const schools = await client.fetch(`*[_type == "school"] { slug }`);
  console.log('SCHOOLS:');
  schools.forEach(s => {
    const slug = s.slug?.current;
    console.log(`${BASE_URL}/schools/${slug}`);
  });

  // Courses
  const courses = await client.fetch(`*[_type == "course"] { slug }`);
  console.log('\nCOURSES:');
  courses.forEach(c => {
    const slug = c.slug?.current;
    console.log(`${BASE_URL}/courses/${slug}`);
  });

  // Service Categories
  const categories = await client.fetch(`*[_type == "serviceCategory"] { slug }`);
  console.log('\nSERVICE CATEGORIES:');
  categories.forEach(cat => {
    const slug = cat.slug?.current;
    console.log(`${BASE_URL}/services/${slug}`);
  });

  // Service Packages
  const packages = await client.fetch(`*[_type == "serviceCategory"] { slug, packages[] { slug } }`);
  console.log('\nSERVICE PACKAGES:');
  packages.forEach(cat => {
    cat.packages.forEach(pkg => {
      const catSlug = cat.slug?.current;
      const pkgSlug = pkg.slug?.current;
      console.log(`${BASE_URL}/services/${catSlug}/${pkgSlug}`);
    });
  });

  console.log('\nNEW COURSES (14):');
  const newCourses = [
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
  newCourses.forEach(slug => {
    console.log(`${BASE_URL}/courses/${slug}`);
  });
}

listSlugs().catch(console.error);
