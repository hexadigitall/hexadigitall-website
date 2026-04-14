#!/usr/bin/env node
/**
 * fix-course-levels.mjs
 * Normalizes all non-canonical level values in Sanity course documents.
 * Applies explicit, justified mappings for each compound or cased variant.
 * Run: node scripts/fix-course-levels.mjs          -- dry-run (default)
 *      node scripts/fix-course-levels.mjs --commit  -- write to Sanity
 */
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

const CANONICAL_LEVELS = new Set(['Beginner', 'Intermediate', 'Advanced']);

/**
 * Normalize a level string to a canonical Sanity value.
 * Explicit course-slug overrides take priority over generic rules.
 */
const SLUG_OVERRIDES = {
  // "expert" slug → Advanced (enterprise / senior architect content)
  'enterprise-cloud-solutions-architect': 'Advanced',
  'microsoft-cybersecurity-architect-sc-100': 'Advanced',
  // "Intermediate to Advanced" → Advanced (the course content is at senior level)
  'nosql-cloud-database-architecture': 'Advanced',
  // "All Levels" courses: bootcamp spans all but final value is Intermediate
  'full-stack-web-development': 'Intermediate',
  'technical-writing-api-docs': 'Intermediate',
  // "Beginner to Intermediate" → Beginner (accessible entry-level)
  'microsoft-365-ai-integration': 'Beginner',
  'rapid-app-development-low-code': 'Beginner',
};

function normalizeLevel(level, slug) {
  if (CANONICAL_LEVELS.has(level)) return level; // already good
  if (SLUG_OVERRIDES[slug]) return SLUG_OVERRIDES[slug];
  const lv = (level || '').toLowerCase().trim();
  if (lv === 'beginner') return 'Beginner';
  if (lv === 'intermediate') return 'Intermediate';
  if (lv === 'advanced' || lv === 'expert') return 'Advanced';
  if (lv.startsWith('beginner')) return 'Beginner';
  if (lv.startsWith('intermediate')) return 'Intermediate';
  if (lv.startsWith('advanced')) return 'Advanced';
  if (lv === 'all levels') return 'Intermediate';
  return null; // unknown — skip
}

async function main() {
  const hasCommitFlag = process.argv.includes('--commit');
  const hasDryRunFlag = process.argv.includes('--dry-run');
  if (hasCommitFlag && hasDryRunFlag) throw new Error('Use --commit or --dry-run, not both.');
  const dryRun = !hasCommitFlag;

  const courses = await client.fetch(
    `*[_type == "course" && defined(slug.current)]{ _id, title, "slug": slug.current, level }`
  );

  console.log(`Checking ${courses.length} courses for non-canonical level values...\n`);

  const fixes = [];
  for (const course of courses) {
    if (CANONICAL_LEVELS.has(course.level)) continue;
    const fixed = normalizeLevel(course.level, course.slug);
    if (!fixed) {
      console.log(`⚠️  Cannot map level "${course.level}" for ${course.slug} — skipping.`);
      continue;
    }
    fixes.push({ course, from: course.level, to: fixed });
    console.log(`🔄 ${course.slug}:\n   "${course.level}" → "${fixed}"\n   (${course.title})\n`);
  }

  console.log(`Found ${fixes.length} courses needing level correction.`);
  if (fixes.length === 0) {
    console.log('✅ All course levels are already canonical.');
    return;
  }

  if (dryRun) {
    console.log('\n⚠️ Dry run (default). No changes committed. Use --commit to apply.');
    return;
  }

  for (const { course, to } of fixes) {
    await client.patch(course._id).set({ level: to }).commit();
    console.log(`✅ Fixed level for ${course.slug} → ${to}`);
  }
  console.log(`\n✅ Completed. Fixed ${fixes.length} course levels.`);
}

main().catch(console.error);
