#!/usr/bin/env node
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

async function checkOGFields() {
  try {
    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║      OG/SEO METADATA AUDIT                             ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');

    const courses = await client.fetch(`
      *[_type == "course"] | order(title asc) {
        _id,
        title,
        slug,
        ogTitle,
        ogDescription,
        ogImage,
        seo,
        summary,
        description
      }
    `);

    console.log(`📚 Checking ${courses.length} courses...\n`);

    let withOG = 0, withoutOG = 0, partialOG = 0;
    const coursesWithoutOG = [];
    const coursesWithPartialOG = [];

    courses.forEach((course, idx) => {
      const hasOgTitle = !!course.ogTitle;
      const hasOgDesc = !!course.ogDescription;
      const hasOgImage = !!course.ogImage;
      const hasSeo = !!(course.seo?.title && course.seo?.description);

      if (hasOgTitle && hasOgDesc && hasOgImage && hasSeo) {
        withOG++;
      } else if (hasOgTitle || hasOgDesc || hasOgImage || hasSeo) {
        partialOG++;
        coursesWithPartialOG.push({
          title: course.title,
          ogTitle: hasOgTitle ? '✅' : '❌',
          ogDesc: hasOgDesc ? '✅' : '❌',
          ogImage: hasOgImage ? '✅' : '❌',
          seo: hasSeo ? '✅' : '❌',
        });
      } else {
        withoutOG++;
        coursesWithoutOG.push(course.title);
      }
    });

    console.log('📊 SUMMARY:\n');
    console.log(`   ✅ Complete OG/SEO metadata: ${withOG} courses`);
    console.log(`   ⚠️  Partial OG/SEO metadata: ${partialOG} courses`);
    console.log(`   ❌ No OG/SEO metadata: ${withoutOG} courses\n`);

    if (withoutOG > 0) {
      console.log(`🔴 COURSES WITHOUT OG/SEO (${withoutOG}):\n`);
      coursesWithoutOG.slice(0, 10).forEach(title => {
        console.log(`   • ${title}`);
      });
      if (coursesWithoutOG.length > 10) {
        console.log(`   ... and ${coursesWithoutOG.length - 10} more\n`);
      } else {
        console.log();
      }
    }

    if (partialOG > 0) {
      console.log(`🟡 COURSES WITH PARTIAL OG/SEO (${partialOG}):\n`);
      console.log('   Title                                    | OG Title | OG Desc | OG Img | SEO');
      console.log('   ' + '─'.repeat(85));
      coursesWithPartialOG.slice(0, 10).forEach(course => {
        const title = course.title.substring(0, 38).padEnd(40);
        console.log(`   ${title} | ${course.ogTitle.padEnd(8)} | ${course.ogDesc.padEnd(7)} | ${course.ogImage.padEnd(6)} | ${course.seo}`);
      });
      if (partialOG > 10) {
        console.log(`   ... and ${partialOG - 10} more\n`);
      } else {
        console.log();
      }
    }

    console.log('═'.repeat(60) + '\n');
    console.log('💡 RECOMMENDATION:\n');
    console.log(`   • Auto-generate OG fields from existing title/description/mainImage`);
    console.log(`   • Use this script to populate missing OG metadata`);
    console.log(`   • Prioritize newly imported courses for OG generation\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

await checkOGFields();
