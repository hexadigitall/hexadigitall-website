#!/usr/bin/env node
import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createClient } from '@sanity/client';
import { findOrUpload } from './lib/sanity-helpers.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(PROJECT_ROOT, '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const OG_DIR = path.join(PROJECT_ROOT, 'public/og-images');
const GENERATOR_SCRIPT = path.join(PROJECT_ROOT, 'scripts/generate-og-generator3-course-bg.mjs');

function parseArgs(argv) {
  return {
    patch: argv.includes('--patch'),
    generateMissing: argv.includes('--generate-missing'),
    dryRun: argv.includes('--dry-run'),
    slugs: argv
      .filter((arg) => arg.startsWith('--slugs='))
      .flatMap((arg) => arg.slice('--slugs='.length).split(','))
      .map((slug) => slug.trim())
      .filter(Boolean),
  };
}

function exists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

function findGeneratorImagePath(slug) {
  const candidates = [
    `course-${slug}.jpg`,
    `${slug}.jpg`,
    `course-${slug}.jpeg`,
    `${slug}.jpeg`,
    `course-${slug}.png`,
    `${slug}.png`,
  ];

  for (const candidate of candidates) {
    const p = path.join(OG_DIR, candidate);
    if (exists(p)) return p;
  }

  const files = fs.readdirSync(OG_DIR).filter((file) => /\.(jpg|jpeg|png|webp)$/i.test(file));
  const matchedFile = files.find((file) => {
    const name = path.parse(file).name.toLowerCase();
    return (
      name === slug ||
      name === `course-${slug}` ||
      name.startsWith(`${slug}-`) ||
      name.startsWith(`course-${slug}-`) ||
      name.includes(`-${slug}-`) ||
      name.endsWith(`-${slug}`) ||
      name.includes(slug)
    );
  });
  return matchedFile ? path.join(OG_DIR, matchedFile) : null;
}

function currentImageUsesGenerator(asset, slug, imagePath) {
  if (!asset) return false;
  const generatorName = path.parse(imagePath).name.toLowerCase();
  const originalFilename = (asset.originalFilename || '').toLowerCase();
  const url = (asset.url || '').toLowerCase();
  return (
    originalFilename.includes(generatorName) ||
    originalFilename.includes(slug.toLowerCase()) ||
    url.includes(generatorName) ||
    url.includes(slug.toLowerCase())
  );
}

function spawnGeneratorForSlugs(slugs) {
  return new Promise((resolve, reject) => {
    const args = ['node', GENERATOR_SCRIPT, `--slugs=${slugs.join(',')}`];
    const child = spawn(args[0], args.slice(1), {
      cwd: PROJECT_ROOT,
      stdio: 'inherit',
      shell: false,
    });

    child.on('exit', (code) => {
      if (code === 0) return resolve();
      reject(new Error(`Generator exited with code ${code}`));
    });

    child.on('error', reject);
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const allSlugsLimit = args.slugs.length > 0 ? new Set(args.slugs) : null;

  console.log('🔎 Auditing course mainImage usage for Generator 3 images...');

  const courses = await client.fetch(`*[_type == 'course' && defined(slug.current)]{ _id, title, "slug": slug.current, mainImage{ asset->{ _id, originalFilename, url } } }`);
  const coursesBySlug = courses.filter((course) => !!course.slug);

  const missingGeneratorFiles = [];
  const patchCandidates = [];
  const alreadyUsingGenerator = [];
  const skipped = [];

  for (const course of coursesBySlug) {
    if (allSlugsLimit && !allSlugsLimit.has(course.slug)) {
      skipped.push(course.slug);
      continue;
    }

    const generatorPath = findGeneratorImagePath(course.slug);
    if (!generatorPath) {
      missingGeneratorFiles.push(course.slug);
      continue;
    }

    if (currentImageUsesGenerator(course.mainImage?.asset, course.slug, generatorPath)) {
      alreadyUsingGenerator.push(course.slug);
      continue;
    }

    patchCandidates.push({ course, generatorPath });
  }

  console.log(`
✅ Audit results:`);
  console.log(`  Courses already using generator images as mainImage: ${alreadyUsingGenerator.length}`);
  console.log(`  Courses needing mainImage update: ${patchCandidates.length}`);
  console.log(`  Courses missing generator source files: ${missingGeneratorFiles.length}`);

  if (missingGeneratorFiles.length) {
    console.log('\n⚠️ Missing generator images for these slugs:');
    missingGeneratorFiles.forEach((slug) => console.log(`  - ${slug}`));
  }

  if (patchCandidates.length) {
    console.log('\n🔧 Courses flagged for patching:');
    patchCandidates.forEach(({ course }) => console.log(`  - ${course.slug} (${course.title})`));
  }

  if (!args.patch) {
    console.log('\nℹ️ Run this script with --patch to update the listed courses.');
    console.log('ℹ️ Add --generate-missing to generate missing images before patching.');
    return;
  }

  if (args.generateMissing && missingGeneratorFiles.length > 0) {
    console.log('\n⚙️ Generating missing Generator 3 images...');
    await spawnGeneratorForSlugs(missingGeneratorFiles);
    console.log('✅ Generator output complete. Re-running audit on missing files...');

    patchCandidates.length = 0;
    missingGeneratorFiles.length = 0;

    for (const course of coursesBySlug) {
      if (allSlugsLimit && !allSlugsLimit.has(course.slug)) continue;
      const generatorPath = findGeneratorImagePath(course.slug);
      if (!generatorPath) {
        missingGeneratorFiles.push(course.slug);
        continue;
      }
      if (!currentImageUsesGenerator(course.mainImage?.asset, course.slug, generatorPath)) {
        patchCandidates.push({ course, generatorPath });
      }
    }

    if (missingGeneratorFiles.length) {
      console.log('\n⚠️ Still missing generator files for these slugs after generation:');
      missingGeneratorFiles.forEach((slug) => console.log(`  - ${slug}`));
    }
  }

  if (patchCandidates.length === 0) {
    console.log('\n✅ Nothing to patch. The selected courses are already using Generator 3 mainImage assets.');
    return;
  }

  console.log(`\n⬆️ Patching ${patchCandidates.length} course(s) to use Generator 3 mainImage assets...`);
  let patched = 0;

  for (const { course, generatorPath } of patchCandidates) {
    const imageRef = await findOrUpload(generatorPath);
    await client
      .patch(course._id)
      .set({ mainImage: imageRef })
      .commit();
    patched += 1;
    console.log(`  ✅ Patched ${course.slug}`);
  }

  console.log(`\n✨ Done. Patched ${patched} course(s).`);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
