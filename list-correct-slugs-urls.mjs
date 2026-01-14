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

async function listCorrectSlugsAndUrls() {
  console.log('📋 CORRECT SHARABLE LINKS WITH SLUGS\n');
  console.log('='.repeat(80));
  
  const BASE_URL = 'https://www.hexadigitall.com';
  let counter = 1;

  // 1. SCHOOLS
  console.log('\n🏫 SCHOOLS:\n');
  const schools = await client.fetch(
    `*[_type == "school"] | order(slug.current asc) {
      name,
      slug
    }`
  );

  const schoolUrls = [];
  schools.forEach((school) => {
    const slug = school.slug?.current;
    const url = `${BASE_URL}/schools/${slug}`;
    schoolUrls.push({ slug, url, name: school.name });
    console.log(`${counter.toString().padStart(2, ' ')}. ${school.name}`);
    console.log(`    Slug: ${slug}`);
    console.log(`    URL: ${url}\n`);
    counter++;
  });

  // 2. EXISTING COURSES
  console.log('\n📚 EXISTING COURSES:\n');
  const courses = await client.fetch(
    `*[_type == "course"] | order(slug.current asc) {
      title,
      slug
    }`
  );

  const courseUrls = [];
  courses.forEach((course) => {
    const slug = course.slug?.current;
    const url = `${BASE_URL}/courses/${slug}`;
    courseUrls.push({ slug, url, title: course.title });
    console.log(`${counter.toString().padStart(3, ' ')}. ${course.title}`);
    console.log(`     Slug: ${slug}`);
    console.log(`     URL: ${url}\n`);
    counter++;
  });

  // 3. NEW COURSES (14)
  console.log('\n✨ NEW COURSES TO ADD (14):\n');
  const newCourses = [
    { title: 'AutoCAD Masterclass', slug: 'autocad-masterclass' },
    { title: 'ArchiCAD Professional', slug: 'archicad-professional' },
    { title: 'Adobe Creative Cloud Suite', slug: 'adobe-creative-cloud-suite' },
    { title: 'Vector Graphics Mastery (CorelDRAW)', slug: 'vector-graphics-mastery-coreldraw' },
    { title: 'Visual Communication & Infographics', slug: 'visual-communication-infographics' },
    { title: 'Business Intelligence (BI) & Analytics', slug: 'business-intelligence-analytics' },
    { title: 'Advanced Excel for Business', slug: 'advanced-excel-business' },
    { title: 'Programming for Data Management', slug: 'programming-data-management' },
    { title: 'SQL & Relational Database Design', slug: 'sql-relational-database-design' },
    { title: 'NoSQL & Cloud Database Architecture', slug: 'nosql-cloud-database-architecture' },
    { title: 'Rapid App Development (Low-Code/No-Code)', slug: 'rapid-app-development-low-code' },
    { title: 'Microsoft Access for Business Apps', slug: 'microsoft-access-business-apps' },
    { title: 'Executive Presentation & Public Speaking', slug: 'executive-presentation-public-speaking' },
    { title: 'Microsoft 365 & AI Integration', slug: 'microsoft-365-ai-integration' }
  ];

  const newCourseUrls = [];
  newCourses.forEach((course) => {
    const url = `${BASE_URL}/courses/${course.slug}`;
    newCourseUrls.push({ slug: course.slug, url, title: course.title });
    console.log(`${counter.toString().padStart(3, ' ')}. ${course.title}`);
    console.log(`     Slug: ${course.slug}`);
    console.log(`     URL: ${url}\n`);
    counter++;
  });

  // 4. SERVICE CATEGORIES
  console.log('\n💼 SERVICE CATEGORIES:\n');
  const categories = await client.fetch(
    `*[_type == "serviceCategory"] | order(slug.current asc) {
      title,
      slug
    }`
  );

  const categoryUrls = [];
  categories.forEach((cat) => {
    const slug = cat.slug?.current;
    const url = `${BASE_URL}/services/${slug}`;
    categoryUrls.push({ slug, url, title: cat.title });
    console.log(`${counter.toString().padStart(3, ' ')}. ${cat.title}`);
    console.log(`     Slug: ${slug}`);
    console.log(`     URL: ${url}\n`);
    counter++;
  });

  // 5. SERVICE PACKAGES
  console.log('\n📦 SERVICE PACKAGES:\n');
  const packages = await client.fetch(
    `*[_type == "serviceCategory"] | order(title asc) {
      title,
      slug,
      "packages": packages[] {
        name,
        slug
      }
    }`
  );

  const packageUrls = [];
  packages.forEach((cat) => {
    cat.packages.forEach((pkg) => {
      const categorySlug = cat.slug?.current;
      const packageSlug = pkg.slug?.current;
      const url = `${BASE_URL}/services/${categorySlug}/${packageSlug}`;
      packageUrls.push({ categorySlug, packageSlug, url, name: pkg.name });
      console.log(`${counter.toString().padStart(3, ' ')}. ${pkg.name}`);
      console.log(`     Category Slug: ${categorySlug}`);
      console.log(`     Package Slug: ${packageSlug}`);
      console.log(`     URL: ${url}\n`);
      counter++;
    });
  });

  // EXPORT MAPPING
  console.log('\n' + '='.repeat(80));
  console.log('\n📋 SLUG MAPPING FOR QR CODE GENERATION:\n');
  
  console.log('SCHOOLS:');
  schoolUrls.forEach(item => {
    console.log(`  '${item.slug}': '${item.url}',`);
  });

  console.log('\nCOURSES (EXISTING):');
  courseUrls.forEach(item => {
    console.log(`  '${item.slug}': '${item.url}',`);
  });

  console.log('\nCOURSES (NEW):');
  newCourseUrls.forEach(item => {
    console.log(`  '${item.slug}': '${item.url}',`);
  });

  console.log('\nSERVICE CATEGORIES:');
  categoryUrls.forEach(item => {
    console.log(`  '${item.slug}': '${item.url}',`);
  });

  console.log('\nSERVICE PACKAGES:');
  packageUrls.forEach(item => {
    console.log(`  '${item.categorySlug}/${item.packageSlug}': '${item.url}',`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n📊 SUMMARY:');
  console.log(`   Schools: ${schoolUrls.length}`);
  console.log(`   Existing Courses: ${courseUrls.length}`);
  console.log(`   New Courses: ${newCourseUrls.length}`);
  console.log(`   Service Categories: ${categoryUrls.length}`);
  console.log(`   Service Packages: ${packageUrls.length}`);
  console.log(`   TOTAL: ${schoolUrls.length + courseUrls.length + newCourseUrls.length + categoryUrls.length + packageUrls.length}`);
  console.log('='.repeat(80));
}

listCorrectSlugsAndUrls().catch(console.error);
