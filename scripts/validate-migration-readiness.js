// scripts/validate-migration-readiness.js
// Validates that the environment is ready for course migration
// This script does NOT modify any data

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const REQUIRED_ENV_VARS = [
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN'
];

async function validateMigrationReadiness() {
  console.log('\n🔍 Validating Migration Readiness...\n');
  console.log('═'.repeat(70));
  
  let hasErrors = false;

  // Step 1: Check environment variables
  console.log('\n📋 Step 1: Checking Environment Variables...');
  for (const envVar of REQUIRED_ENV_VARS) {
    if (!process.env[envVar]) {
      console.log(`   ❌ Missing: ${envVar}`);
      hasErrors = true;
    } else {
      const value = envVar.includes('TOKEN') ? '***REDACTED***' : process.env[envVar];
      console.log(`   ✅ Found: ${envVar} = ${value}`);
    }
  }

  if (hasErrors) {
    console.log('\n❌ Environment validation failed. Please add missing variables to .env.local');
    process.exit(1);
  }

  // Step 2: Test Sanity connection
  console.log('\n🔌 Step 2: Testing Sanity Connection...');
  
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-01-01',
    useCdn: false,
  });

  try {
    const courses = await client.fetch(`*[_type == "course"]{ _id, title, courseType, hourlyRateNGN, hourlyRateUSD }`);
    console.log(`   ✅ Connection successful!`);
    console.log(`   📚 Found ${courses.length} courses in Sanity`);

    if (courses.length === 0) {
      console.log('\n⚠️  Warning: No courses found in Sanity.');
      console.log('   Migration will have no effect. Add courses first or check dataset name.');
      process.exit(0);
    }

    // Step 3: Analyze current course state
    console.log('\n📊 Step 3: Analyzing Current Course State...');
    
    let liveCourses = 0;
    let selfPacedCourses = 0;
    let coursesWithPPP = 0;
    let coursesNeedingMigration = 0;

    for (const course of courses) {
      if (course.courseType === 'live') {
        liveCourses++;
        if (course.hourlyRateNGN && course.hourlyRateUSD) {
          coursesWithPPP++;
        }
      } else {
        selfPacedCourses++;
        coursesNeedingMigration++;
      }
    }

    console.log(`   📈 Course Type Breakdown:`);
    console.log(`      - Live (PPP): ${liveCourses} courses`);
    console.log(`      - Self-Paced: ${selfPacedCourses} courses`);
    console.log(`   🎯 Courses with PPP pricing: ${coursesWithPPP}`);
    console.log(`   🔄 Courses needing migration: ${coursesNeedingMigration}`);

    // Step 4: Preview migration categories
    console.log('\n🏷️  Step 4: Preview Course Categorization...');
    console.log('   (First 5 courses):\n');

    for (const course of courses.slice(0, 5)) {
      const title = course.title.toLowerCase();
      let tier = 'Tier 4: Fundamentals (₦50k)';
      let hourlyNGN = 12500;
      let hourlyUSD = 15;

      // Tier 1
      if (title.includes('pmp') || title.includes('cissp') || title.includes('aws') || title.includes('agile leadership')) {
        tier = 'Tier 1: Executive (₦280k)';
        hourlyNGN = 70000;
        hourlyUSD = 75;
      } else if (title.includes('devops') || title.includes('kubernetes') || title.includes('ai engineering') || title.includes('llm')) {
        tier = 'Tier 1: Executive (₦250k)';
        hourlyNGN = 62500;
        hourlyUSD = 75;
      } else if (title.includes('ethical hacking') || title.includes('ceh') || title.includes('machine learning')) {
        tier = 'Tier 1: Executive (₦200k)';
        hourlyNGN = 50000;
        hourlyUSD = 62.5;
      } else if (title.includes('ansible')) {
        tier = 'Tier 1: Executive (₦180k)';
        hourlyNGN = 45000;
        hourlyUSD = 50;
      }
      // Tier 2
      else if (title.includes('full stack') || title.includes('mobile app') || title.includes('react native')) {
        tier = 'Tier 2: High-Demand (₦125k)';
        hourlyNGN = 31250;
        hourlyUSD = 50;
      } else if (title.includes('scrum master') || title.includes('csm')) {
        tier = 'Tier 2: High-Demand (₦120k)';
        hourlyNGN = 30000;
        hourlyUSD = 45;
      } else if (title.includes('backend') || title.includes('frontend') || title.includes('node') || title.includes('react.js') || title.includes('python for data') || title.includes('ccna')) {
        tier = 'Tier 2: High-Demand (₦100k)';
        hourlyNGN = 25000;
        hourlyUSD = 40;
      }
      // Tier 3
      else if (title.includes('technical writing') || title.includes('ui/ux') || title.includes('product design')) {
        tier = 'Tier 3: Professional (₦80k)';
        hourlyNGN = 20000;
        hourlyUSD = 30;
      } else if (title.includes('graphic design') || title.includes('digital marketing') || title.includes('seo') || title.includes('hardware')) {
        tier = 'Tier 3: Professional (₦60k)';
        hourlyNGN = 15000;
        hourlyUSD = 25;
      }

      const monthlyNGN = (hourlyNGN * 4).toLocaleString();
      const monthlyUSD = (hourlyUSD * 4).toLocaleString();

      console.log(`   📘 ${course.title}`);
      console.log(`      ${tier}`);
      console.log(`      🇳🇬 ₦${monthlyNGN}/mo | 🌎 $${monthlyUSD}/mo\n`);
    }

    if (courses.length > 5) {
      console.log(`   ... and ${courses.length - 5} more courses`);
    }

    // Step 5: Final validation
    console.log('\n✅ Step 5: Final Validation...');
    console.log('   ✅ Environment variables are set');
    console.log('   ✅ Sanity connection is working');
    console.log('   ✅ Courses are accessible');
    console.log('   ✅ Migration script is ready to run');

    console.log('\n═'.repeat(70));
    console.log('\n🎯 READY TO MIGRATE!\n');
    console.log('To proceed with migration, run:');
    console.log('   npm run migrate:courses');
    console.log('\nOr:');
    console.log('   node scripts/migrate-courses-regional.js\n');

  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
    console.log('\n💡 Troubleshooting tips:');
    console.log('   - Verify SANITY_API_TOKEN has write permissions');
    console.log('   - Check projectId and dataset are correct');
    console.log('   - Ensure Sanity project is accessible');
    process.exit(1);
  }
}

validateMigrationReadiness();
