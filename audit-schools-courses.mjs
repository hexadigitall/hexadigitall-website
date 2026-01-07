#!/usr/bin/env node
/**
 * Audit existing schools and courses
 * Checks what schools and courses currently exist in Sanity
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function auditSchoolsAndCourses() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║      SCHOOLS & COURSES AUDIT                           ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Fetch all schools
    console.log('📚 FETCHING SCHOOLS...\n');
    const schools = await client.fetch(`*[_type == "school"] | order(title asc)`);
    
    if (schools.length === 0) {
      console.log('⚠️  No schools found in Sanity\n');
    } else {
      console.log(`✅ Found ${schools.length} School(s):\n`);
      schools.forEach((school, idx) => {
        console.log(`   ${idx + 1}. ${school.title}`);
        console.log(`      ID: ${school._id}`);
        if (school.description) {
          console.log(`      Description: ${school.description.substring(0, 60)}...`);
        }
      });
    }

    console.log('\n' + '─'.repeat(60) + '\n');

    // Fetch all courses with their schools
    console.log('📖 FETCHING COURSES...\n');
    const courses = await client.fetch(`
      *[_type == "course"] | order(title asc) {
        _id,
        title,
        slug,
        courseType,
        school-> { title, _id },
        nairaPrice,
        dollarPrice,
        hourlyRateUSD,
        hourlyRateNGN
      }
    `);

    if (courses.length === 0) {
      console.log('⚠️  No courses found in Sanity\n');
    } else {
      console.log(`✅ Found ${courses.length} Course(s):\n`);
      
      // Group by school
      const coursesBySchool = {};
      courses.forEach(course => {
        const schoolName = course.school?.title || 'NO SCHOOL ASSIGNED';
        if (!coursesBySchool[schoolName]) {
          coursesBySchool[schoolName] = [];
        }
        coursesBySchool[schoolName].push(course);
      });

      // Display grouped by school
      Object.entries(coursesBySchool).forEach(([schoolName, schoolCourses]) => {
        console.log(`\n🏫 ${schoolName}`);
        console.log(`   ${schoolCourses.length} course(s):`);
        schoolCourses.forEach((course, idx) => {
          console.log(`\n   ${idx + 1}. ${course.title}`);
          console.log(`      Slug: ${course.slug?.current}`);
          console.log(`      Type: ${course.courseType}`);
          if (course.courseType === 'self-paced') {
            console.log(`      Price: ₦${course.nairaPrice?.toLocaleString() || 'N/A'} / $${course.dollarPrice?.toLocaleString() || 'N/A'}`);
          } else {
            console.log(`      Rate: $${course.hourlyRateUSD?.toLocaleString() || 'N/A'}/hr (USD) / ₦${course.hourlyRateNGN?.toLocaleString() || 'N/A'}/hr (NGN)`);
          }
        });
      });
    }

    console.log('\n' + '─'.repeat(60) + '\n');

    // Summary
    console.log('📊 SUMMARY:\n');
    console.log(`   Total Schools: ${schools.length}`);
    console.log(`   Total Courses: ${courses.length}`);
    
    const liveCount = courses.filter(c => c.courseType === 'live').length;
    const selfPacedCount = courses.filter(c => c.courseType === 'self-paced').length;
    console.log(`   Live/Mentorship Courses: ${liveCount}`);
    console.log(`   Self-Paced Courses: ${selfPacedCount}`);

    console.log('\n' + '═'.repeat(60) + '\n');
    console.log('📋 COURSES TO ADD (14 total):\n');
    
    const coursesToAdd = [
      'Azure Security Technologies (AZ-500)',
      'Microsoft Cybersecurity Architect (SC-100)',
      'Security Operations Analyst (SC-200)',
      'Cybersecurity Fundamentals: Network & Systems Defense',
      'Application Security (AppSec) Specialist',
      'Ethical Hacking & Penetration Testing',
      'DevOps Engineering & Cloud Infrastructure',
      'DevSecOps Engineering: Automating Security',
      'Enterprise Cloud Solutions Architect',
      'Frontend Engineering: React & Next.js Mastery',
      'Backend Engineering: Scalable Architectures',
      'Mobile Engineering: Cross-Platform Development',
      'Professional Data Engineering',
      'AI Engineering & MLOps'
    ];

    coursesToAdd.forEach((title, idx) => {
      const exists = courses.some(c => c.title.toLowerCase() === title.toLowerCase());
      const status = exists ? '✅ EXISTS' : '⭕ NEW';
      console.log(`   ${idx + 1}. [${status}] ${title}`);
    });

    const newCoursesCount = coursesToAdd.filter(
      title => !courses.some(c => c.title.toLowerCase() === title.toLowerCase())
    ).length;

    console.log(`\n📝 Courses to be added: ${newCoursesCount}/${coursesToAdd.length}\n`);

  } catch (error) {
    console.error('\n❌ Error during audit:', error.message);
    process.exit(1);
  }
}

await auditSchoolsAndCourses();
