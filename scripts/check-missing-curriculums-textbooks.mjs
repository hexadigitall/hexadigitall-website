import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '..', '.env.local');
dotenv.config({ path: envPath });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

async function runAudit() {
  console.log('🔍 Starting Curriculum and Textbook Audit...\n');

  // Fetch all courses
  const courses = await client.fetch(`*[_type == "course"]{ title, "slug": slug.current }`);
  console.log(`Found ${courses.length} courses in Sanity.`);

  // Fetch all books
  const books = await client.fetch(`*[_type == "book"]{ "slug": slug.current, status }`);
  const bookMap = new Map(books.map(b => [b.slug, b.status]));

  // Directories
  const curriculumsDir = path.join(__dirname, '..', 'public', 'curriculums');
  const textbooksDir = path.join(__dirname, '..', 'public', 'textbooks', 'kdp');

  const missingCurriculums = [];
  const missingTextbooks = [];
  const missingBoth = [];
  const missingTextbookSchemaOnly = []; // Has content locally but no schema in sanity

  for (const course of courses) {
    const slug = course.slug;
    
    // Check curriculum HTML
    const curriculumPath = path.join(curriculumsDir, `curriculum-${slug}.html`);
    const hasCurriculum = fs.existsSync(curriculumPath);

    // Check textbook HTML content (using KDP structure as reference)
    const textbookPath = path.join(textbooksDir, slug, `${slug}-textbook.html`);
    const hasTextbookContent = fs.existsSync(textbookPath);

    // Check Sanity textbook schema
    const hasTextbookSchema = bookMap.has(slug);

    if (!hasCurriculum && !hasTextbookSchema && !hasTextbookContent) {
      missingBoth.push(slug);
    } else {
      if (!hasCurriculum) missingCurriculums.push(slug);
      if (!hasTextbookSchema && !hasTextbookContent) missingTextbooks.push(slug);
      if (hasTextbookContent && !hasTextbookSchema) missingTextbookSchemaOnly.push(slug);
    }
  }

  console.log(`\n📋 Audit Results:\n`);
  
  console.log(`🚨 Missing Both Curriculums and Textbooks (${missingBoth.length}):`);
  missingBoth.slice(0, 10).forEach(s => console.log(`   - ${s}`));
  if (missingBoth.length > 10) console.log(`   ...and ${missingBoth.length - 10} more`);

  console.log(`\n📄 Missing Curriculums Only (${missingCurriculums.length}):`);
  missingCurriculums.slice(0, 10).forEach(s => console.log(`   - ${s}`));
  if (missingCurriculums.length > 10) console.log(`   ...and ${missingCurriculums.length - 10} more`);

  console.log(`\n📚 Missing Textbooks Entirely (${missingTextbooks.length}):`);
  missingTextbooks.slice(0, 10).forEach(s => console.log(`   - ${s}`));
  if (missingTextbooks.length > 10) console.log(`   ...and ${missingTextbooks.length - 10} more`);

  console.log(`\n⚠️ Has Local Textbook HTML but Missing Sanity Book Schema (${missingTextbookSchemaOnly.length}):`);
  missingTextbookSchemaOnly.forEach(s => console.log(`   - ${s}`));

}

runAudit().catch(console.error);