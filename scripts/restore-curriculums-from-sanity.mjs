#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'public', 'curriculums');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
});

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toSlug(course) {
  const source = course?.slug?.current || course?.slug || course?.title || course?._id || 'course';
  return String(source)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

function list(items) {
  if (!Array.isArray(items) || !items.length) {
    return '<li>Not specified</li>';
  }
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join('\n');
}

function renderCourseHtml(course) {
  const title = escapeHtml(course.title || 'Untitled Course');
  const school = escapeHtml(course.school?.title || 'Hexadigitall Academy');
  const level = escapeHtml(course.level || 'Not specified');
  const duration = escapeHtml(course.duration || (course.durationWeeks ? `${course.durationWeeks} Weeks` : 'Not specified'));
  const hoursPerWeek = escapeHtml(course.hoursPerWeek || 'Not specified');
  const modules = escapeHtml(course.modules || course.numberOfModules || 'Not specified');
  const lessons = escapeHtml(course.lessons || course.numberOfLessons || 'Not specified');
  const overview = escapeHtml(course.overview || course.summary || course.description || 'Curriculum details are available through the course sessions and lab guides.');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - Curriculum</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; margin: 0; color: #0f172a; background: #f8fafc; }
    .wrap { max-width: 900px; margin: 0 auto; padding: 32px 20px 48px; }
    .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; }
    h1 { margin: 0 0 8px; font-size: 30px; line-height: 1.2; }
    .meta { color: #475569; margin-bottom: 18px; }
    .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 18px 0 22px; }
    .stat { background: #f1f5f9; border-radius: 10px; padding: 12px; }
    .label { font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #64748b; }
    .value { font-weight: 700; margin-top: 2px; }
    h2 { margin: 20px 0 10px; font-size: 20px; }
    ul { margin: 10px 0 0 20px; }
    li { margin: 4px 0; }
    .footer { margin-top: 22px; color: #64748b; font-size: 14px; }
    @media print { body { background: white; } .card { border: 0; padding: 0; } .wrap { max-width: none; padding: 0.35in; } }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>${title}</h1>
      <p class="meta">${school}</p>
      <p>${overview}</p>

      <div class="grid">
        <div class="stat"><div class="label">Level</div><div class="value">${level}</div></div>
        <div class="stat"><div class="label">Duration</div><div class="value">${duration}</div></div>
        <div class="stat"><div class="label">Hours per Week</div><div class="value">${hoursPerWeek}</div></div>
        <div class="stat"><div class="label">Modules / Lessons</div><div class="value">${modules} / ${lessons}</div></div>
      </div>

      <h2>Prerequisites</h2>
      <ul>
        ${list(course.prerequisites)}
      </ul>

      <h2>Learning Outcomes</h2>
      <ul>
        ${list(course.learningOutcomes)}
      </ul>

      <h2>Target Audience</h2>
      <ul>
        ${list(course.targetAudience)}
      </ul>

      <p class="footer">Generated from Sanity course data for restoration on ${new Date().toISOString().slice(0, 10)}.</p>
    </div>
  </div>
</body>
</html>`;
}

async function main() {
  const overwrite = process.argv.includes('--overwrite');

  const query = `*[_type == "course"] | order(title asc) {
    _id,
    title,
    slug,
    level,
    duration,
    durationWeeks,
    hoursPerWeek,
    modules,
    lessons,
    numberOfModules,
    numberOfLessons,
    summary,
    overview,
    description,
    prerequisites,
    learningOutcomes,
    targetAudience,
    school->{ title }
  }`;

  const courses = await client.fetch(query);

  if (!Array.isArray(courses) || !courses.length) {
    throw new Error('No courses returned from Sanity.');
  }

  fs.mkdirSync(outDir, { recursive: true });

  let created = 0;
  let skipped = 0;

  for (const course of courses) {
    const slug = toSlug(course);
    const outPath = path.join(outDir, `curriculum-${slug}.html`);

    if (!overwrite && fs.existsSync(outPath)) {
      skipped += 1;
      continue;
    }

    fs.writeFileSync(outPath, renderCourseHtml(course), 'utf-8');
    created += 1;
  }

  console.log(`Restoration complete. Courses fetched: ${courses.length}`);
  console.log(`Curriculum files created: ${created}`);
  console.log(`Curriculum files skipped (already existed): ${skipped}`);
  console.log(`Output directory: ${outDir}`);
}

main().catch((error) => {
  console.error('Failed to restore curriculums:', error.message);
  process.exit(1);
});
