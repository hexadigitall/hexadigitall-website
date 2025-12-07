// scripts/migrate-courses-regional.js
// Migration script to apply Regional Pricing (PPP) Model to courses
// This implements the "Netflix Model" - different rates per region, not direct currency conversion
// Floor: ₦50,000 | Ceiling: ₦280,000

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Default scheduling constraints
const DEFAULT_SCHEDULING = {
  sessionsPerWeek: { min: 1, max: 3, default: 1 },
  hoursPerSession: { min: 1, max: 3, default: 1 },
  totalHoursLimit: 9  // 3 sessions × 3 hours max
};

async function migrateCourses() {
  console.log('\n🌍 Starting Regional Pricing (PPP) Migration...\n');
  console.log('💰 Floor: ₦50,000 | Ceiling: ₦280,000');
  console.log('━'.repeat(70));
  
  try {
    // Fetch all courses
    const courses = await client.fetch(`*[_type == "course"]{ _id, title, slug, category->{title} }`);
    
    if (!courses || courses.length === 0) {
      console.log('⚠️  No courses found in Sanity.');
      return;
    }

    console.log(`📚 Found ${courses.length} courses to migrate\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const course of courses) {
      try {
        let hourlyNGN = 12500; // Tier 4 Floor (₦50k/mo base)
        let hourlyUSD = 15;
        let tier = 'Tier 4: Fundamentals';

        const title = course.title.toLowerCase();

        // ----------------------------------------------------
        // TIER 1: EXECUTIVE & CORPORATE (₦180k - ₦280k)
        // ----------------------------------------------------
        if (title.includes('pmp') || title.includes('agile leadership') || title.includes('aws solutions architect') || title.includes('cissp')) {
            hourlyNGN = 70000; // ₦280k/mo base (PMP, Agile Leadership, AWS, CISSP)
            hourlyUSD = title.includes('cissp') ? 87.5 : 75;
            tier = 'Tier 1: Executive (₦280k)';
        } 
        else if (title.includes('devops') || title.includes('kubernetes') || title.includes('ai engineering') || title.includes('llm')) {
            hourlyNGN = 62500; // ₦250k/mo base (DevOps, AI Engineering)
            hourlyUSD = 75;
            tier = 'Tier 1: Executive (₦250k)';
        }
        else if (title.includes('ethical hacking') || title.includes('ceh') || title.includes('machine learning')) {
            hourlyNGN = 50000; // ₦200k/mo base (Ethical Hacking, ML Engineering)
            hourlyUSD = 62.5;
            tier = 'Tier 1: Executive (₦200k)';
        }
        else if (title.includes('ansible')) {
            hourlyNGN = 45000; // ₦180k/mo base (Advanced Ansible)
            hourlyUSD = 50;
            tier = 'Tier 1: Executive (₦180k)';
        }

        // ----------------------------------------------------
        // TIER 2: HIGH-DEMAND CAREER (₦100k - ₦125k)
        // ----------------------------------------------------
        else if (title.includes('full stack') || title.includes('mobile app') || title.includes('react native')) {
            hourlyNGN = 31250; // ₦125k/mo base
            hourlyUSD = 50;
            tier = 'Tier 2: High-Demand (₦125k)';
        }
        else if (title.includes('scrum master') || title.includes('csm')) {
            hourlyNGN = 30000; // ₦120k/mo base (Scrum Master)
            hourlyUSD = 45;
            tier = 'Tier 2: High-Demand (₦120k)';
        }
        else if (title.includes('backend') || title.includes('frontend') || title.includes('node') || 
                 title.includes('react.js') || title.includes('python for data') || title.includes('ccna') || 
                 title.includes('cisco networking')) {
            hourlyNGN = 25000; // ₦100k/mo base
            hourlyUSD = title.includes('ccna') || title.includes('cisco') ? 37.5 : 40;
            tier = 'Tier 2: High-Demand (₦100k)';
        }

        // ----------------------------------------------------
        // TIER 3: PROFESSIONAL SKILLS (₦60k - ₦80k)
        // ----------------------------------------------------
        else if (title.includes('technical writing') || title.includes('ui/ux') || title.includes('product design')) {
            hourlyNGN = 20000; // ₦80k/mo base
            hourlyUSD = 30;
            tier = 'Tier 3: Professional (₦80k)';
        }
        else if (title.includes('graphic design') || title.includes('digital marketing') || title.includes('seo') || 
                 title.includes('hardware') || title.includes('maintenance')) {
            hourlyNGN = 15000; // ₦60k/mo base
            hourlyUSD = 25;
            tier = 'Tier 3: Professional (₦60k)';
        }

        // ----------------------------------------------------
        // TIER 4: FUNDAMENTALS (₦50k) - DEFAULT
        // ----------------------------------------------------
        else if (title.includes('computer appreciation') || title.includes('smartphone') || 
                 title.includes('microsoft office') || title.includes('fundamentals')) {
            hourlyNGN = 12500; // ₦50k/mo base (explicitly set for fundamentals)
            hourlyUSD = 15;
            tier = 'Tier 4: Fundamentals (₦50k)';
        }

        // ----------------------------------------------------
        // TIER 4: FUNDAMENTALS (₦50k) - DEFAULT
        // ----------------------------------------------------
        // Falls through to hourlyNGN = 12500

        // Calculate monthly price for display (1 session/week × 1 hour × 4 weeks)
        const monthlyNGN = hourlyNGN * 4;
        const monthlyUSD = hourlyUSD * 4;

        console.log(`📘 ${course.title}`);
        console.log(`   ${tier}`);
        console.log(`   Category: ${course.category?.title || 'Uncategorized'}`);
        console.log(`   🇳🇬 Nigeria: ₦${hourlyNGN.toLocaleString()}/hr → ₦${monthlyNGN.toLocaleString()}/mo (base)`);
        console.log(`   🌎 Global:   $${hourlyUSD}/hr → $${monthlyUSD}/mo (base)`);
        console.log(`   💡 PPP Multiplier: ${((hourlyUSD * 1650) / hourlyNGN).toFixed(1)}x more affordable`);

        // Apply migration to Sanity
        await client
          .patch(course._id)
          .set({
            courseType: 'live',
            hourlyRateNGN: hourlyNGN,
            hourlyRateUSD: hourlyUSD,
            monthlyScheduling: DEFAULT_SCHEDULING
          })
          .commit();

        console.log(`   ✅ Migrated successfully\n`);
        successCount++;

      } catch (err) {
        console.error(`   ❌ Error migrating "${course.title}":`, err.message, '\n');
        errorCount++;
      }
    }

    console.log('━'.repeat(70));
    console.log(`\n✅ Migration Complete!`);
    console.log(`   Success: ${successCount} courses`);
    if (errorCount > 0) {
      console.log(`   Failed:  ${errorCount} courses`);
    }
    console.log('\n📊 Pricing Summary:');
    console.log('   Tier 1 (Executive):     ₦180k - ₦280k/mo');
    console.log('   Tier 2 (High-Demand):   ₦100k - ₦125k/mo');
    console.log('   Tier 3 (Professional):  ₦60k  - ₦80k/mo');
    console.log('   Tier 4 (Fundamentals):  ₦50k/mo');
    console.log('\n📌 Next Steps:');
    console.log('   1. Verify pricing in Sanity Studio');
    console.log('   2. Test CoursePricingCalculator with USD/NGN switching');
    console.log('   3. Check that "Regional Pricing Applied" badge appears\n');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateCourses();
