import { client } from './lib/sanity-helpers.mjs';

const INTRO_KEYWORDS = /(intro|introduction|fundamental|fundamentals|essential|essentials|basics|foundation|crash course|fast track|quick start|bootcamp|101)/i;

async function findIntroCourses() {
  console.log('🔍 Finding intro/fast-track/crash courses and checking durations (cap 16 weeks)...\n');

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

  const matches = courses.filter(c => {
    const haystack = `${c.title} ${c.slug}`;
    return INTRO_KEYWORDS.test(haystack);
  });

  if (matches.length === 0) {
    console.log('✅ No intro/fast-track/crash courses found.');
    return;
  }

  console.log(`Found ${matches.length} intro-style courses:`);
  console.log('Title | durationWeeks | duration | modules | lessons | over16?');
  console.log('-----|---------------|----------|---------|---------|--------');

  matches.forEach(c => {
    const weeks = c.durationWeeks ?? 'MISSING';
    const over = typeof c.durationWeeks === 'number' && c.durationWeeks > 16 ? 'YES' : '';
    console.log(`${c.title.substring(0, 42).padEnd(42)} | ${String(weeks).padEnd(13)} | ${(c.duration || 'MISSING').padEnd(8)} | ${String(c.modules ?? 'MISSING').padEnd(7)} | ${String(c.lessons ?? 'MISSING').padEnd(7)} | ${over}`);
  });
}

findIntroCourses();
