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

async function listEverythingFull() {
  console.log('📋 COMPLETE LIST - ALL NAMES (NO SUMMARIES)\n');
  console.log('='.repeat(80));

  let counter = 1;

  // 1. SCHOOLS
  console.log('\n🏫 SCHOOLS:\n');
  const schools = await client.fetch(
    `*[_type == "school"] | order(name asc) {
      name,
      slug
    }`
  );

  schools.forEach((school) => {
    const name = school.name || `School (${school.slug?.current})`;
    console.log(`${counter.toString().padStart(3, ' ')}. ${name}`);
    counter++;
  });

  // 2. EXISTING COURSES
  console.log('\n\n📚 EXISTING COURSES:\n');
  const courses = await client.fetch(
    `*[_type == "course"] | order(title asc) {
      title
    }`
  );

  courses.forEach((course) => {
    console.log(`${counter.toString().padStart(3, ' ')}. ${course.title}`);
    counter++;
  });

  // 3. NEW COURSES TO ADD
  console.log('\n\n✨ NEW COURSES TO ADD:\n');
  const newCourses = [
    'AutoCAD Masterclass',
    'ArchiCAD Professional',
    'Adobe Creative Cloud Suite',
    'Vector Graphics Mastery (CorelDRAW)',
    'Visual Communication & Infographics',
    'Business Intelligence (BI) & Analytics',
    'Advanced Excel for Business',
    'Programming for Data Management',
    'SQL & Relational Database Design',
    'NoSQL & Cloud Database Architecture',
    'Rapid App Development (Low-Code/No-Code)',
    'Microsoft Access for Business Apps',
    'Executive Presentation & Public Speaking',
    'Microsoft 365 & AI Integration'
  ];

  newCourses.forEach((course) => {
    console.log(`${counter.toString().padStart(3, ' ')}. ${course}`);
    counter++;
  });

  // 4. ALL SERVICE PACKAGES
  console.log('\n\n📦 SERVICE PACKAGES:\n');
  const allPackages = await client.fetch(
    `*[_type == "serviceCategory"] | order(title asc) {
      title,
      "packages": packages[] {
        name
      }
    }`
  );

  allPackages.forEach((cat) => {
    cat.packages.forEach((pkg) => {
      console.log(`${counter.toString().padStart(3, ' ')}. ${pkg.name}`);
      counter++;
    });
  });

  console.log('\n' + '='.repeat(80));
  console.log(`\nTOTAL ITEMS: ${counter - 1}`);
  console.log('='.repeat(80));
}

listEverythingFull().catch(console.error);
