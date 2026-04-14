#!/usr/bin/env node
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import path from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(PROJECT_ROOT, '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const TIERS = {
  Beginner: { ngn: 10000, usd: 15 },
  Intermediate: { ngn: 25000, usd: 40 },
  Advanced: { ngn: 40000, usd: 65 }
};

const PRICE_BAND_MULTIPLIERS = {
  low: 0.9,
  standard: 1.0,
  premium: 1.1
};

const PREMIUM_KEYWORDS = [
  'enterprise', 'architecture', 'system design', 'scalability', 'mlops', 'cybersecurity',
  'security', 'machine learning', 'data science', 'ai', 'artificial intelligence',
  'optimization', 'performance', 'advanced', 'masterclass', 'capstone', 'portfolio',
  'senior', 'executive'
];

const LOW_COMPLEXITY_KEYWORDS = [
  'intro to', 'fundamentals', 'basics', 'quick start', 'beginner', '101',
  'getting started', 'easy', 'first steps', 'starter'
];

// Courses whose TITLES contain these keywords are always in the premium band,
// regardless of complexity scoring — they have high market demand and serve as
// gateways into high-paying careers (Data, ML, AI, SQL/DB, BI).
const DATA_DOMAIN_TITLE_KEYWORDS = [
  'python', 'data science', 'machine learning', 'deep learning',
  'sql', 'business intelligence', 'data engineer', 'data analysis',
  'power bi', 'tableau', 'statistics', 'big data', 'data management',
  'data structures', 'algorithms'
];

const MENTORSHIP_MULTIPLIERS = {
  oneOnOneMultiplier: 2.5,
  smallGroupMultiplier: 1.8,
  largeGroupMultiplier: 1.2
};

function normalizeLevel(level) {
  const value = (level || '').toString().toLowerCase().trim();
  if (value.includes('beginner')) return 'Beginner';
  if (value.includes('intermediate')) return 'Intermediate';
  if (value.includes('advanced') || value.includes('expert')) return 'Advanced';
  if (value === 'all levels') return 'Intermediate';
  return 'Intermediate';
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function countMatches(text, keywords) {
  return keywords.reduce((count, keyword) => text.includes(keyword) ? count + 1 : count, 0);
}

function estimateCourseValue(course) {
  const text = `${course.title || ''} ${course.description || ''} ${course.summary || ''}`.toLowerCase();
  const premiumMatches = countMatches(text, PREMIUM_KEYWORDS);
  const lowMatches = countMatches(text, LOW_COMPLEXITY_KEYWORDS);

  const durationWeeks = typeof course.durationWeeks === 'number' ? course.durationWeeks : 8;
  const hoursPerWeek = typeof course.hoursPerWeek === 'number' ? course.hoursPerWeek : 2;
  const modules = typeof course.modules === 'number' ? course.modules : 8;
  const lessons = typeof course.lessons === 'number' ? course.lessons : 24;

  const durationScore = clamp((durationWeeks - 4) / 12, 0, 1);
  const weeklyIntensity = clamp((hoursPerWeek - 1) / 5, 0, 1);
  const moduleDepth = clamp((modules - 6) / 18, 0, 1);
  const lessonDetail = clamp((lessons - 12) / 36, 0, 1);

  return (
    durationScore * 0.35 +
    weeklyIntensity * 0.25 +
    moduleDepth * 0.2 +
    lessonDetail * 0.15 +
    Math.min(premiumMatches * 0.1, 0.2) -
    Math.min(lowMatches * 0.08, 0.16)
  );
}

function selectPriceBand(course) {
  // Data-domain courses always get the premium band within their tier.
  // These courses have outsized career-path value and market demand regardless of entry level.
  const titleText = (course.title || '').toLowerCase();
  const isDataDomain = DATA_DOMAIN_TITLE_KEYWORDS.some(k => titleText.includes(k));
  if (isDataDomain) return 'premium';

  const valueScore = estimateCourseValue(course);
  if (valueScore >= 0.65) return 'premium';
  if (valueScore <= 0.35) return 'low';
  return 'standard';
}

function computeRates(baseRate, multiplier) {
  return {
    ngn: Math.round(baseRate.ngn * multiplier),
    usd: Math.round(baseRate.usd * multiplier * 100) / 100
  };
}

async function main() {
  const hasCommitFlag = process.argv.includes('--commit');
  const hasDryRunFlag = process.argv.includes('--dry-run');
  if (hasCommitFlag && hasDryRunFlag) {
    throw new Error('Use either --commit or --dry-run, not both.');
  }

  const dryRun = !hasCommitFlag;

  const courses = await client.fetch(`*[_type == "course" && defined(slug.current)]{ _id, title, "slug": slug.current, courseType, level, hourlyRateNGN, hourlyRateUSD, durationWeeks, hoursPerWeek, modules, lessons, summary, description }`);

  console.log(`Applying tier + band pricing to ${courses.length} courses...\n`);

  const updates = [];
  for (const course of courses) {
    if (course.courseType !== 'live') {
      console.log(`⏭ Skipping self-paced course ${course.slug}`);
      continue;
    }

    const normalizedLevel = normalizeLevel(course.level);
    const tier = TIERS[normalizedLevel];
    if (!tier) {
      console.log(`⚠️ Unknown level "${course.level}" for ${course.slug}, skipping.`);
      continue;
    }

    const band = selectPriceBand(course);
    const multiplier = PRICE_BAND_MULTIPLIERS[band];
    const { ngn: newNGN, usd: newUSD } = computeRates(tier, multiplier);

    if (course.hourlyRateNGN !== newNGN || course.hourlyRateUSD !== newUSD) {
      updates.push({ course, normalizedLevel, band, newNGN, newUSD });
      console.log(`💰 ${course.slug} (${normalizedLevel}, ${band} band): ₦${course.hourlyRateNGN || 'N/A'} → ₦${newNGN}, $${course.hourlyRateUSD || 'N/A'} → $${newUSD}`);
    }
  }

  console.log(`\nFound ${updates.length} courses needing price updates.`);

  if (updates.length === 0) {
    console.log('✅ All live course prices already match the tier + band model.');
    return;
  }

  if (dryRun) {
    console.log('\n⚠️ Dry run mode (default) enabled. No changes were committed. Use --commit to apply updates.');
    return;
  }

  for (const { course, newNGN, newUSD } of updates) {
    await client.patch(course._id).set({
      hourlyRateNGN: newNGN,
      hourlyRateUSD: newUSD,
      monthlyScheduling: {
        billingType: 'monthly',
        sessionMatrix: {
          sessionsPerWeek: { min: 1, max: 5, default: 2 },
          hoursPerSession: { min: 1, max: 3, default: 1.5 },
          totalHoursLimit: 40
        },
        availabilityWindow: {
          daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          timeSlots: ['morning', 'afternoon', 'evening']
        },
        sessionPricing: MENTORSHIP_MULTIPLIERS
      }
    }).commit();
    console.log(`✅ Updated pricing for ${course.slug}`);
  }

  console.log(`\n✅ Completed. Updated ${updates.length} courses with tier + band pricing.`);
}

main().catch(console.error);
