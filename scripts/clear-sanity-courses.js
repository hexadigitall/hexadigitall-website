#!/usr/bin/env node

/**
 * HEXADIGITALL DATA CLEANUP SCRIPT
 * --------------------------------
 * Deletes all 'course' and 'school' documents from Sanity.
 * Run this BEFORE repopulating to ensure a clean slate.
 */

import { createClient } from 'next-sanity';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// --- VALIDATION ---
if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ Missing SANITY_API_TOKEN. Please add it to your .env.local file.');
  process.exit(1);
}

// --- CONFIGURATION ---
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function main() {
  console.log('🗑️  Starting Sanity Cleanup...');
  console.log('    Target: All Courses and Schools');

  try {
    // 1. Delete all Courses
    console.log('\n... Deleting Courses');
    const courseDelete = await client.delete({ query: '*[_type == "course"]' });
    console.log(`    ✅ Courses deleted`);

    // 2. Delete all Schools
    console.log('\n... Deleting Schools');
    const schoolDelete = await client.delete({ query: '*[_type == "school"]' });
    console.log(`    ✅ Schools deleted`);

    console.log('\n✨ Sanity is now clean. You can safe run your population scripts.');
  } catch (err) {
    console.error('❌ Error clearing data:', err.message);
  }
}

main().catch(console.error);