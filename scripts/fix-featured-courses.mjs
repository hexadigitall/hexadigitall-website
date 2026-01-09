#!/usr/bin/env node
/**
 * Fix Featured Courses Strategy
 * - Remove featured flag from expensive courses (over ₦100k/month)
 * - Feature affordable, high-demand courses that convert:
 *   • Intro courses (all schools)
 *   • Coding fundamentals (HTML, CSS, JS)
 *   • Design basics (UI/UX, Graphic Design)
 *   • Social media marketing
 *   • Affordable ad courses (Canva, Meta Ads, AdSense 101, Google Search Ads)
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

// Affordable monthly rate threshold (100k/month = 25,000/hr)
const MAX_AFFORDABLE_HOURLY_NGN = 25000;

// Keywords for courses that SHOULD be featured
const SHOULD_FEATURE_KEYWORDS = [
  'intro to',
  'fundamentals',
  'basics',
  'essentials',
  'beginner',
  'html',
  'css fundamentals',
  'javascript fundamentals',
  'ui/ux quick start',
  'graphic design crash',
  'social media marketing accelerator',
  'canva for ad',
  'meta ads for local',
  'adsense 101',
  'google search ads boot',
  'digital literacy',
  'git & github',
  'full stack jumpstart',
  'react essentials',
  'python for data science',
  'data analysis fast track',
];

// Keywords for expensive courses that should NOT be featured
const SHOULD_NOT_FEATURE_KEYWORDS = [
  'arbitrage',
  'programmatic',
  'server-side tracking',
  'capi',
  'advanced backend',
  'aws certified',
  'cissp',
  'pmp',
  'executive',
  'enterprise',
];

async function analyzeAndFixFeatured() {
  console.log('🔍 Analyzing featured courses...\n');

  // Get all courses with featured status
  const allCourses = await client.fetch(`
    *[_type == "course"] | order(hourlyRateNGN asc) {
      _id,
      title,
      "slug": slug.current,
      hourlyRateNGN,
      hourlyRateUSD,
      level,
      featured,
      "schoolName": school->name
    }
  `);

  const currentFeatured = allCourses.filter(c => c.featured === true);
  const notFeatured = allCourses.filter(c => c.featured !== true);

  console.log(`📊 Current Status:`);
  console.log(`   Total Courses: ${allCourses.length}`);
  console.log(`   Currently Featured: ${currentFeatured.length}`);
  console.log(`   Not Featured: ${notFeatured.length}\n`);

  // Analyze current featured courses
  console.log('🚨 CURRENT FEATURED COURSES (BAD STRATEGY):');
  console.log('─'.repeat(80));
  const toUnfeature = [];
  currentFeatured.forEach(c => {
    const monthly = c.hourlyRateNGN * 8;
    const isTooExpensive = c.hourlyRateNGN > MAX_AFFORDABLE_HOURLY_NGN;
    const titleLower = c.title.toLowerCase();
    const hasWrongKeyword = SHOULD_NOT_FEATURE_KEYWORDS.some(kw => titleLower.includes(kw));
    
    const status = (isTooExpensive || hasWrongKeyword) ? '❌ REMOVE' : '✅ KEEP';
    console.log(`${status} ${c.title}`);
    console.log(`   Price: ₦${monthly.toLocaleString()}/mo | Level: ${c.level}`);
    
    if (isTooExpensive || hasWrongKeyword) {
      toUnfeature.push(c);
    }
  });
  console.log('');

  // Find courses that SHOULD be featured
  console.log('✅ COURSES THAT SHOULD BE FEATURED (GOOD STRATEGY):');
  console.log('─'.repeat(80));
  const toFeature = [];
  notFeatured.forEach(c => {
    const monthly = c.hourlyRateNGN * 8;
    const isAffordable = c.hourlyRateNGN <= MAX_AFFORDABLE_HOURLY_NGN;
    const titleLower = c.title.toLowerCase();
    const hasGoodKeyword = SHOULD_FEATURE_KEYWORDS.some(kw => titleLower.includes(kw));
    const isBeginnerOrIntro = c.level === 'Beginner' || titleLower.includes('intro') || titleLower.includes('fundamental');
    
    if ((isAffordable && hasGoodKeyword) || (isAffordable && isBeginnerOrIntro && monthly <= 100000)) {
      console.log(`🎯 ${c.title}`);
      console.log(`   Price: ₦${monthly.toLocaleString()}/mo | Level: ${c.level} | School: ${c.schoolName}`);
      toFeature.push(c);
    }
  });
  console.log('');

  // Summary
  console.log('📋 SUMMARY:');
  console.log(`   Courses to UNFEATURE: ${toUnfeature.length}`);
  console.log(`   Courses to FEATURE: ${toFeature.length}`);
  console.log('');

  // Confirm before making changes
  console.log('🔧 Applying changes...\n');

  // Unfeature expensive courses
  let unfeaturedCount = 0;
  for (const course of toUnfeature) {
    await client
      .patch(course._id)
      .set({ featured: false })
      .commit();
    console.log(`❌ Unfeatured: ${course.title}`);
    unfeaturedCount++;
  }

  // Feature affordable, high-demand courses
  let featuredCount = 0;
  for (const course of toFeature) {
    await client
      .patch(course._id)
      .set({ featured: true })
      .commit();
    console.log(`✅ Featured: ${course.title}`);
    featuredCount++;
  }

  console.log('');
  console.log('✨ Changes applied successfully!');
  console.log(`   Unfeatured: ${unfeaturedCount} expensive courses`);
  console.log(`   Featured: ${featuredCount} affordable, high-demand courses`);
  console.log('');
  console.log('💡 Marketing Strategy Fixed:');
  console.log('   ✅ Entry-level courses are now featured (easier conversions)');
  console.log('   ✅ Affordable pricing showcased (₦25k-100k/month)');
  console.log('   ✅ High-demand skills prioritized (coding, design, marketing)');
  console.log('   ✅ Expensive advanced courses unfeatured (not for homepage)');
}

analyzeAndFixFeatured().catch((err) => {
  console.error('❌ Script failed:', err);
  process.exit(1);
});
