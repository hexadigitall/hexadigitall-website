#!/usr/bin/env node
/**
 * Auto-generate OG Metadata for courses
 * Populates ogTitle, ogDescription, ogImage from existing fields
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function autoGenerateOGMetadata() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║      AUTO-GENERATE OG METADATA                         ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    // Fetch courses without OG metadata
    const coursesWithoutOG = await client.fetch(`
      *[_type == "course" && !ogTitle] {
        _id,
        title,
        summary,
        description,
        mainImage,
        slug
      } | order(title asc)
    `);

    console.log(`📚 Found ${coursesWithoutOG.length} courses needing OG metadata\n`);

    if (coursesWithoutOG.length === 0) {
      console.log('✅ All courses have OG metadata!\n');
      return;
    }

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < coursesWithoutOG.length; i++) {
      const course = coursesWithoutOG[i];
      console.log(`[${i + 1}/${coursesWithoutOG.length}] Processing: ${course.title}`);

      try {
        // Generate OG metadata from existing fields
        const ogTitle = course.title;
        const ogDescription = course.summary || course.description || `Learn ${course.title} with industry experts. Professional training with flexible scheduling.`;
        const ogImage = course.mainImage;

        // Update course with OG metadata
        const updated = await client
          .patch(course._id)
          .set({
            ogTitle,
            ogDescription,
            ...(ogImage && { ogImage }), // Only set if exists
          })
          .commit();

        console.log(`   ✅ Updated: "${ogTitle}"\n`);
        successCount++;
      } catch (error) {
        console.log(`   ❌ Failed: ${error.message}\n`);
        failureCount++;
      }
    }

    console.log('\n' + '═'.repeat(60));
    console.log('\n📊 GENERATION SUMMARY:\n');
    console.log(`   ✅ Successfully generated: ${successCount} courses`);
    console.log(`   ❌ Failed: ${failureCount} courses`);
    console.log(`   📝 Total: ${coursesWithoutOG.length} courses\n`);

    if (successCount === coursesWithoutOG.length) {
      console.log('🎉 All OG metadata generated successfully!\n');
    }

  } catch (error) {
    console.error('\n❌ Error during OG generation:', error.message);
    process.exit(1);
  }
}

await autoGenerateOGMetadata();
