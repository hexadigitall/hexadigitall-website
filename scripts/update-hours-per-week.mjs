import { client } from './lib/sanity-helpers.mjs';

async function updateHoursPerWeek() {
  console.log('🔧 Setting minimum recommended hoursPerWeek (>=2) where missing...\n');

  const courses = await client.fetch(`
    *[_type == "course"] {
      _id,
      title,
      slug,
      hoursPerWeek
    } | order(title asc)
  `);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const course of courses) {
    const current = course.hoursPerWeek;
    const next = current && current >= 2 ? current : 2;
    if (current === next) {
      skipped++;
      continue;
    }

    try {
      await client.patch(course._id).set({ hoursPerWeek: next }).commit();
      console.log(`✅ ${course.title.substring(0, 50).padEnd(50)} → ${next} hrs/week`);
      updated++;
    } catch (err) {
      console.error(`❌ Error updating ${course.title}:`, err.message);
      errors++;
    }
  }

  console.log(`\nSummary: Updated ${updated}, Skipped ${skipped}, Errors ${errors}`);
}

updateHoursPerWeek();
