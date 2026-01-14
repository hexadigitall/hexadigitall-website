import { client } from './lib/sanity-helpers.mjs';

async function checkMissingDurations() {
  console.log('🔍 Checking courses missing duration, modules, lessons, or level...\n');

  // Find courses missing any of the key fields
  const courses = await client.fetch(`
      *[_type == "course"] {
        _id,
        title,
        slug,
        level,
        durationWeeks,
        duration,
        modules,
        lessons
      } | order(title asc)
  `);

  const missing = courses.filter(c => !c.durationWeeks || !c.duration || !c.modules || !c.lessons || !c.level);

  if (missing.length === 0) {
    console.log('✅ All courses have duration, modules, lessons, and level filled.');
    return;
  }

  console.log(`⚠️  Found ${missing.length} courses missing one or more fields:\n`);
  console.log('Title | Level | durationWeeks | duration | modules | lessons');
  console.log('-----|-------|---------------|----------|---------|--------');
  
  missing.forEach(c => {
    const dw = c.durationWeeks ? `${c.durationWeeks} weeks` : 'MISSING';
    const d = c.duration || 'MISSING';
    const m = c.modules ?? 'MISSING';
    const l = c.lessons ?? 'MISSING';
    console.log(`${c.title.substring(0, 40).padEnd(40)} | ${(c.level || 'MISSING').padEnd(12)} | ${dw.padEnd(13)} | ${d.padEnd(8)} | ${String(m).padEnd(7)} | ${String(l).padEnd(7)}`);
  });

  console.log(`\n📊 Summary: ${missing.length} out of ${courses.length} courses need updates`);
}

checkMissingDurations();
