import { client } from './lib/sanity-helpers.mjs';

async function checkDurationMismatch() {
  console.log('🔍 Checking for duration display text mismatches (durationWeeks vs duration field)...\n');

  const courses = await client.fetch(`
    *[_type == "course"] {
      _id,
      title,
      slug,
      durationWeeks,
      duration
    } | order(title asc)
  `);

  const mismatches = courses.filter(c => {
    if (!c.durationWeeks || !c.duration) return false;
    const expectedText = `${c.durationWeeks} Weeks`;
    return c.duration !== expectedText;
  });

  if (mismatches.length === 0) {
    console.log('✅ All courses have matching duration display text.');
    return;
  }

  console.log(`⚠️  Found ${mismatches.length} courses with mismatched duration text:\n`);
  console.log('Title | durationWeeks | Current duration | Expected duration');
  console.log('-----|---------------|------------------|------------------');

  mismatches.forEach(c => {
    const expected = `${c.durationWeeks} Weeks`;
    console.log(`${c.title.substring(0, 40).padEnd(40)} | ${String(c.durationWeeks).padEnd(13)} | ${c.duration.padEnd(16)} | ${expected}`);
  });

  console.log(`\n📊 Summary: ${mismatches.length} out of ${courses.length} courses have mismatched duration text`);
}

checkDurationMismatch();
