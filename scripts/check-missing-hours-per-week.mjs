import { client } from './lib/sanity-helpers.mjs';

async function checkHoursPerWeek() {
  console.log('🔍 Checking courses missing recommended hoursPerWeek (min 2)...\n');

  const courses = await client.fetch(`
    *[_type == "course"] {
      _id,
      title,
      slug,
      hoursPerWeek
    } | order(title asc)
  `);

  const missing = courses.filter(c => !c.hoursPerWeek || c.hoursPerWeek < 2);

  if (missing.length === 0) {
    console.log('✅ All courses have hoursPerWeek set to at least 2.');
    return;
  }

  console.log(`⚠️  Found ${missing.length} courses with missing/low hoursPerWeek:\n`);
  console.log('Title | hoursPerWeek');
  console.log('-----|-------------');

  missing.forEach(c => {
    console.log(`${c.title.substring(0, 50).padEnd(50)} | ${String(c.hoursPerWeek ?? 'MISSING')}`);
  });
}

checkHoursPerWeek();
