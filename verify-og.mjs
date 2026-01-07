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

const courses = await client.fetch(`*[_type == "course"] | order(_createdAt desc) | [0..5] { title, ogTitle }`);
console.log('Recent 6 courses:');
courses.forEach(c => console.log(`  ${c.title}: ogTitle=${c.ogTitle ? '✅' : '❌'}`));

const withoutOG = await client.fetch(`*[_type == "course" && !defined(ogTitle)]`);
console.log(`\nCourses without ogTitle: ${withoutOG.length}`);
