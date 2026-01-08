#!/usr/bin/env node
/**
 * Adjust pricing for specific courses:
 * 1. Increase 'Advanced CSS Mastery' by NGN 10k/month (35k → 45k)
 * 2. Increase 'Advanced JavaScript Mastery' by NGN 10k/month (35k → 45k)
 * 3. Reduce 'React Native' from NGN 200k/month → NGN 80k/month
 */
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Pricing adjustments (hourly rates for 8 hrs/month)
const ADJUSTMENTS = [
  {
    titleMatch: 'Advanced CSS Mastery',
    oldHourlyNGN: 8750,   // NGN 35k/month
    newHourlyNGN: 11250,  // NGN 45k/month (+10k)
    newHourlyUSD: 9,      // Proportional increase
  },
  {
    titleMatch: 'Advanced JavaScript Mastery',
    oldHourlyNGN: 8750,   // NGN 35k/month
    newHourlyNGN: 11250,  // NGN 45k/month (+10k)
    newHourlyUSD: 9,      // Proportional increase
  },
  {
    titleMatch: 'React Native',
    oldHourlyNGN: 50000,  // NGN 200k/month (estimated)
    newHourlyNGN: 20000,  // NGN 80k/month (-120k)
    newHourlyUSD: 16,     // Proportional decrease
  },
];

async function adjustPricing() {
  console.log('🔧 Adjusting course pricing...\n');

  for (const adjustment of ADJUSTMENTS) {
    try {
      // Find course by title match
      const courses = await client.fetch(`
        *[_type == "course" && title match "${adjustment.titleMatch}*"] {
          _id,
          title,
          "slug": slug.current,
          hourlyRateNGN,
          hourlyRateUSD
        }
      `);

      if (!courses || courses.length === 0) {
        console.log(`⚠️  No course found matching: "${adjustment.titleMatch}"`);
        continue;
      }

      if (courses.length > 1) {
        console.log(`⚠️  Multiple courses found for "${adjustment.titleMatch}":`);
        courses.forEach(c => console.log(`   - ${c.title}`));
        console.log('   Updating all matches...\n');
      }

      for (const course of courses) {
        const oldMonthly = course.hourlyRateNGN * 8;
        const newMonthly = adjustment.newHourlyNGN * 8;
        const change = newMonthly - oldMonthly;
        const changeSymbol = change > 0 ? '+' : '';

        console.log(`📝 ${course.title}`);
        console.log(`   Slug: ${course.slug}`);
        console.log(`   Old: ₦${oldMonthly.toLocaleString()}/month ($${course.hourlyRateUSD}/hr)`);
        console.log(`   New: ₦${newMonthly.toLocaleString()}/month ($${adjustment.newHourlyUSD}/hr)`);
        console.log(`   Change: ${changeSymbol}₦${Math.abs(change).toLocaleString()}/month`);

        // Update pricing
        await client
          .patch(course._id)
          .set({
            hourlyRateNGN: adjustment.newHourlyNGN,
            hourlyRateUSD: adjustment.newHourlyUSD,
          })
          .commit();

        console.log(`   ✅ Updated successfully\n`);
      }

    } catch (err) {
      console.error(`❌ Failed to update "${adjustment.titleMatch}":`, err.message);
    }
  }

  console.log('✨ Pricing adjustments complete!');
}

adjustPricing().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
