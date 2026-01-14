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

async function listAllNames() {
  console.log('📋 FETCHING ALL NAMES FROM SANITY\n');
  console.log('='.repeat(80));

  // Fetch all schools
  console.log('\n🏫 SCHOOLS:\n');
  const schools = await client.fetch(
    `*[_type == "school"] | order(name asc) {
      _id,
      name,
      slug
    }`
  );

  schools.forEach((school, i) => {
    console.log(`${i + 1}. "${school.name}"`);
    console.log(`   Slug: ${school.slug?.current || 'N/A'}\n`);
  });

  // Fetch all existing courses
  console.log('\n📚 EXISTING COURSES:\n');
  const courses = await client.fetch(
    `*[_type == "course"] | order(title asc) {
      _id,
      title,
      slug,
      "school": school->name
    }`
  );

  courses.forEach((course, i) => {
    console.log(`${i + 1}. "${course.title}"`);
    console.log(`   Slug: ${course.slug?.current || 'N/A'}`);
    console.log(`   School: ${course.school || 'N/A'}\n`);
  });

  console.log(`Total Courses: ${courses.length}\n`);

  // New courses we're adding
  console.log('\n✨ NEW COURSES TO ADD:\n');
  const newCourses = [
    { title: 'AutoCAD Masterclass', slug: 'autocad-masterclass', school: 'School of Design' },
    { title: 'ArchiCAD Professional', slug: 'archicad-professional', school: 'School of Design' },
    { title: 'Adobe Creative Cloud Suite', slug: 'adobe-creative-cloud-suite', school: 'School of Design' },
    { title: 'Vector Graphics Mastery (CorelDRAW)', slug: 'vector-graphics-mastery-coreldraw', school: 'School of Design' },
    { title: 'Visual Communication & Infographics', slug: 'visual-communication-infographics', school: 'School of Design' },
    { title: 'Business Intelligence (BI) & Analytics', slug: 'business-intelligence-analytics', school: 'School of Data & AI' },
    { title: 'Advanced Excel for Business', slug: 'advanced-excel-business', school: 'School of Data & AI' },
    { title: 'Programming for Data Management', slug: 'programming-data-management', school: 'School of Data & AI' },
    { title: 'SQL & Relational Database Design', slug: 'sql-relational-database-design', school: 'School of Data & AI' },
    { title: 'NoSQL & Cloud Database Architecture', slug: 'nosql-cloud-database-architecture', school: 'School of Cloud & DevOps' },
    { title: 'Rapid App Development (Low-Code/No-Code)', slug: 'rapid-app-development-low-code', school: 'School of Coding & Development' },
    { title: 'Microsoft Access for Business Apps', slug: 'microsoft-access-business-apps', school: 'School of Coding & Development' },
    { title: 'Executive Presentation & Public Speaking', slug: 'executive-presentation-public-speaking', school: 'School of Writing & Communication' },
    { title: 'Microsoft 365 & AI Integration', slug: 'microsoft-365-ai-integration', school: 'School of Software Mastery' },
  ];

  newCourses.forEach((course, i) => {
    console.log(`${i + 1}. "${course.title}"`);
    console.log(`   Slug: ${course.slug}`);
    console.log(`   School: ${course.school}\n`);
  });

  // Fetch services (if they exist)
  console.log('\n💼 SERVICES:\n');
  const services = await client.fetch(
    `*[_type == "service"] | order(title asc) {
      _id,
      title,
      slug
    }`
  );

  if (services.length > 0) {
    services.forEach((service, i) => {
      console.log(`${i + 1}. "${service.title}"`);
      console.log(`   Slug: ${service.slug?.current || 'N/A'}\n`);
    });
  } else {
    console.log('No services found in Sanity.\n');
  }

  console.log('='.repeat(80));
  console.log('\n📊 SUMMARY:');
  console.log(`   Schools: ${schools.length}`);
  console.log(`   Existing Courses: ${courses.length}`);
  console.log(`   New Courses to Add: ${newCourses.length}`);
  console.log(`   Services: ${services.length}`);
  console.log('\n='.repeat(80));
}

listAllNames().catch(console.error);
