import { client } from './lib/sanity-helpers.mjs';

async function fixDurationTextMismatch() {
  console.log('🔧 Fixing duration display text to match durationWeeks...\n');

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

  let updated = 0;
  let errors = 0;

  for (const course of mismatches) {
    try {
      const newDuration = `${course.durationWeeks} Weeks`;
      await client
        .patch(course._id)
        .set({ duration: newDuration })
        .commit();

      console.log(`✅ ${course.title.substring(0, 50).padEnd(50)} → "${newDuration}"`);
      updated++;
    } catch (err) {
      console.error(`❌ Error updating ${course.title}:`, err.message);
      errors++;
    }
  }

  console.log(`\n✅ Done. Updated: ${updated}, Errors: ${errors}`);
}

fixDurationTextMismatch();
