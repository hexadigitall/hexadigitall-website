import { client } from './lib/sanity-helpers.mjs';

const INTRO_KEYWORDS = /(intro|introduction|fundamental|fundamentals|essential|essentials|basics|foundation|crash course|fast track|quick start|bootcamp|101)/i;

function deriveModulesAndLessons(weeks) {
  const modules = Math.max(6, Math.round(weeks / 2));
  const lessons = modules * 3;
  return { modules, lessons };
}

async function updateIntroCourses() {
  console.log('🔧 Capping intro/fast-track/crash courses to max 16 weeks...\n');

  const courses = await client.fetch(`
    *[_type == "course"] {
      _id,
      title,
      slug,
      durationWeeks,
      duration,
      modules,
      lessons
    } | order(title asc)
  `);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const course of courses) {
    const haystack = `${course.title} ${course.slug}`;
    if (!INTRO_KEYWORDS.test(haystack)) {
      skipped++;
      continue;
    }

    const currentWeeks = course.durationWeeks || 12;
    const cappedWeeks = Math.max(8, Math.min(currentWeeks, 16));

    const patch = {};
    if (course.durationWeeks !== cappedWeeks) {
      patch.durationWeeks = cappedWeeks;
      patch.duration = `${cappedWeeks} Weeks`;
      const { modules, lessons } = deriveModulesAndLessons(cappedWeeks);
      patch.modules = modules;
      patch.lessons = lessons;
    } else if (!course.duration) {
      patch.duration = `${cappedWeeks} Weeks`;
    }

    if (Object.keys(patch).length === 0) {
      skipped++;
      continue;
    }

    try {
      await client.patch(course._id).set(patch).commit();
      console.log(`✅ ${course.title.substring(0, 50).padEnd(50)} → ${cappedWeeks} Weeks`);
      updated++;
    } catch (err) {
      console.error(`❌ Error updating ${course.title}:`, err.message);
      errors++;
    }
  }

  console.log(`\nSummary: Updated ${updated}, Skipped ${skipped}, Errors ${errors}`);
}

updateIntroCourses();
