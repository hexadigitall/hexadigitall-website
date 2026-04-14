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

// Standardize level names
function standardizeLevel(level) {
  const lvl = (level || '').toLowerCase().trim();
  if (lvl.includes('beginner')) return 'Beginner';
  if (lvl.includes('intermediate')) return 'Intermediate';
  if (lvl.includes('advanced') || lvl.includes('expert')) return 'Advanced';
  if (lvl === 'all levels') return 'Intermediate'; // Default to Intermediate
  return 'Beginner'; // Default
}

// Classify based on title and description
function classifyLevel(title, description, currentLevel) {
  const text = `${title} ${description || ''}`.toLowerCase();
  const keywords = {
    Beginner: ['intro to', 'fundamentals', 'basics', 'quick start', 'crash course', 'for beginners', '101'],
    Intermediate: ['intermediate', 'advanced', 'mastery', 'professional', 'engineering', 'architecture'],
    Advanced: ['expert', 'enterprise', 'architect', 'masterclass', 'scalability', 'system design', 'mlops']
  };

  let score = { Beginner: 0, Intermediate: 0, Advanced: 0 };

  for (const [level, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (text.includes(word)) score[level]++;
    }
  }

  // Prioritize highest score
  const maxScore = Math.max(...Object.values(score));
  const candidates = Object.keys(score).filter(k => score[k] === maxScore);

  if (candidates.length === 1) return candidates[0];

  // Tiebreaker: prefer current level if valid
  const stdCurrent = standardizeLevel(currentLevel);
  if (candidates.includes(stdCurrent)) return stdCurrent;

  // Default to Intermediate for ties
  return 'Intermediate';
}

async function main() {
  const courses = await client.fetch(`*[_type == "course" && defined(slug.current)]{ _id, title, "slug": slug.current, level, description }`);

  console.log(`Auditing ${courses.length} courses for level categorization...\n`);

  const updates = [];
  for (const course of courses) {
    const currentStd = standardizeLevel(course.level);
    const suggested = classifyLevel(course.title, course.description, course.level);

    if (currentStd !== suggested) {
      updates.push({ course, current: currentStd, suggested });
      console.log(`🔄 ${course.slug}: "${course.title}"`);
      console.log(`   Current: ${currentStd} → Suggested: ${suggested}`);
      console.log(`   Reason: Based on title/description analysis\n`);
    }
  }

  console.log(`Found ${updates.length} courses needing level updates.`);

  if (updates.length === 0) {
    console.log('✅ All levels appear correctly categorized.');
    return;
  }

  // Apply updates
  console.log('Applying updates...');
  for (const { course, suggested } of updates) {
    await client.patch(course._id).set({ level: suggested }).commit();
    console.log(`✅ Updated ${course.slug} to ${suggested}`);
  }

  console.log(`\n✅ Completed. Updated ${updates.length} courses.`);
}

main().catch(console.error);
