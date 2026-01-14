import { client } from './lib/sanity-helpers.mjs';

// Keywords to classify courses for duration/level heuristics
const ADVANCED_KEYWORDS = /advanced|expert|mastery|architecture|mlops|devops|devsecops|cybersecurity architect/i;
const LAB_KEYWORDS = /lab|hands-on|practical|project-based|capstone|engineering/i;
const CODING_KEYWORDS = /coding|programming|development|backend|frontend|fullstack|react|django|node|python|java|system design|leetcode/i;
const INTENSIVE_KEYWORDS = /intensive|immersive|bootcamp/i;
const BEGINNER_KEYWORDS = /beginner|fundamentals|intro|essentials|foundation|basics/i;

function determineDuration(course) {
  const combinedText = `${course.title} ${course.description || ''}`.toLowerCase();

  const isAdvanced = ADVANCED_KEYWORDS.test(combinedText);
  const isLab = LAB_KEYWORDS.test(combinedText);
  const isCoding = CODING_KEYWORDS.test(combinedText);
  const isIntensive = INTENSIVE_KEYWORDS.test(combinedText);
  const levelStr = (course.level || '').toLowerCase();

  // If already has a durationWeeks value that meets the minimum, reuse it
  if (course.durationWeeks && course.durationWeeks >= 12) {
    return course.durationWeeks;
  }

  // Heavy-weight courses: 20-24 weeks
  if ((isAdvanced || levelStr === 'expert' || levelStr === 'advanced') && (isCoding || isLab || isIntensive)) {
    return 24;
  }

  // Intermediate advanced: 16-20 weeks
  if ((isAdvanced || isCoding || isIntensive) && !levelStr.includes('beginner')) {
    return 20;
  }

  // Regular intermediate: 12-16 weeks
  if (levelStr.includes('intermediate') || levelStr.includes('advanced')) {
    return 14;
  }

  // Beginner or all-levels: minimum 12 weeks
  if (levelStr.includes('beginner') || levelStr === 'all levels' || BEGINNER_KEYWORDS.test(combinedText)) {
    return 12;
  }

  // Default minimum
  return 12;
}

function inferLevel(course) {
  if (course.level) return course.level;
  const combinedText = `${course.title} ${course.description || ''}`.toLowerCase();
  if (ADVANCED_KEYWORDS.test(combinedText)) return 'Advanced';
  if (BEGINNER_KEYWORDS.test(combinedText)) return 'Beginner';
  return 'Intermediate';
}

function deriveModulesAndLessons(weeks) {
  // Keep modules/lessons proportional, with sensible minimums
  const modules = Math.max(8, Math.round(weeks / 2));
  const lessons = modules * 3;
  return { modules, lessons };
}

async function addMissingDurations() {
  console.log('🔧 Adding missing duration, modules, lessons, and level fields to courses...\n');

  const courses = await client.fetch(`
    *[_type == "course"] {
      _id,
      title,
      slug,
      level,
      description,
      durationWeeks,
      duration,
      modules,
      lessons
    } | order(title asc)
  `);

  let updated = 0;
  let errors = 0;

  for (const course of courses) {
    try {
      const nextLevel = inferLevel(course);
      const weeks = Math.max(12, determineDuration(course));
      const durationDisplay = `${weeks} Weeks`;
      const { modules, lessons } = deriveModulesAndLessons(weeks);

      const patch = {};

      // Fill duration fields if missing or below minimum
      if (!course.durationWeeks || course.durationWeeks < 12) patch.durationWeeks = weeks;
      if (!course.duration) patch.duration = durationDisplay;

      // Fill modules/lessons if missing
      if (!course.modules) patch.modules = modules;
      if (!course.lessons) patch.lessons = lessons;

      // Fill level if missing
      if (!course.level) patch.level = nextLevel;

      if (Object.keys(patch).length === 0) {
        continue;
      }

      await client.patch(course._id).set(patch).commit();

      console.log(
        `✅ ${course.title.substring(0, 50).padEnd(50)} ` +
        `${patch.duration ? '→ ' + durationDisplay : ''}`
      );
      updated++;
    } catch (err) {
      console.error(`❌ Error updating ${course.title}:`, err.message);
      errors++;
    }
  }

  console.log(`\n✅ Done. Updated: ${updated}, Errors: ${errors}`);
}

addMissingDurations();
