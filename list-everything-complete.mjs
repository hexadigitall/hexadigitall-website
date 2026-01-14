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

async function listEverything() {
  console.log('📋 COMPLETE LIST OF ALL NAMES FROM SANITY\n');
  console.log('='.repeat(80));

  // 1. SCHOOLS
  console.log('\n🏫 SCHOOLS (12):\n');
  const schools = await client.fetch(
    `*[_type == "school"] | order(name asc) {
      name,
      slug
    }`
  );

  schools.forEach((school, i) => {
    const name = school.name || `School (${school.slug?.current})`;
    console.log(`${(i + 1).toString().padStart(2, ' ')}. ${name}`);
  });

  // 2. EXISTING COURSES
  console.log('\n\n📚 EXISTING COURSES (110):\n');
  const courses = await client.fetch(
    `*[_type == "course"] | order(title asc) {
      title,
      slug,
      "school": school->name
    }`
  );

  courses.forEach((course, i) => {
    console.log(`${(i + 1).toString().padStart(3, ' ')}. ${course.title}`);
  });

  // 3. NEW COURSES TO ADD
  console.log('\n\n✨ NEW COURSES TO ADD (14):\n');
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

  newCourses.forEach((course, i) => {
    console.log(`${(i + 1).toString().padStart(2, ' ')}. ${course}`);
  });

  // 4. SERVICE CATEGORIES
  console.log('\n\n💼 SERVICE CATEGORIES (5):\n');
  const categories = await client.fetch(
    `*[_type == "serviceCategory"] | order(title asc) {
      title,
      "packages": packages[].name
    }`
  );

  categories.forEach((cat, i) => {
    console.log(`${i + 1}. ${cat.title} (${cat.packages?.length || 0} packages)`);
  });

  // 5. ALL SERVICE PACKAGES
  console.log('\n\n📦 ALL SERVICE PACKAGES (45):\n');
  const allPackages = await client.fetch(
    `*[_type == "serviceCategory"] | order(title asc) {
      title,
      "packages": packages[] {
        name,
        tier
      }
    }`
  );

  let pkgCount = 1;
  allPackages.forEach((cat) => {
    console.log(`\n${cat.title}:`);
    cat.packages.forEach((pkg) => {
      console.log(`  ${pkgCount.toString().padStart(2, ' ')}. ${pkg.name}`);
      pkgCount++;
    });
  });

  // SUMMARY
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 SUMMARY:');
  console.log('='.repeat(80));
  console.log(`Schools:                    ${schools.length}`);
  console.log(`Existing Courses:           ${courses.length}`);
  console.log(`New Courses to Add:         ${newCourses.length}`);
  console.log(`Service Categories:         ${categories.length}`);
  console.log(`Service Packages:           45`);
  console.log(`\nTOTAL ITEMS:                ${schools.length + courses.length + newCourses.length + 45}`);
  console.log('='.repeat(80));
}

listEverything().catch(console.error);
