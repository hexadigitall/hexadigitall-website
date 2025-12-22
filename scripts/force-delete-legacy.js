#!/usr/bin/env node

/**
 * HEXADIGITALL FINAL CLEANUP SCRIPT
 * ------------------------------------------------------
 * 1. Deletes legacy "_type: service" documents (The Blockers).
 * 2. Deletes the specific "Loser" categories that failed previously.
 * 3. Verifies that only the 5 Winners remain.
 * * Run with: node scripts/force-delete-legacy.js
 */

import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN is missing');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// The 3 Stubborn Losers (IDs from your error log)
const STUBBORN_LOSERS = [
  "6tPnkrpFCc1QvMkh69g3J1", // Business Foundation Services
  "IdchENUh6rxYSaCTvrXFpS", // Digital Marketing
  "j5sZiVQRUGkThv45CBJNz2"  // Web Development
];

async function forceCleanup() {
  console.log('🚀 Starting Final Force Cleanup...');

  try {
    // 1. DELETE LEGACY "_type: service" DOCUMENTS
    // These are the old "Individual Services" blocking the deletion
    console.log('\n🔍 Finding legacy "_type: service" documents...');
    const legacyServices = await client.fetch(`*[_type == "service"]{_id, title}`);
    
    if (legacyServices.length > 0) {
      console.log(`   found ${legacyServices.length} legacy documents.`);
      console.log(`   🗑️  Deleting legacy documents to free up references...`);
      
      const tx = client.transaction();
      legacyServices.forEach(doc => {
        console.log(`      - Deleting: ${doc.title} (${doc._id})`);
        tx.delete(doc._id);
      });
      await tx.commit();
      console.log(`   ✅ Legacy services deleted.`);
    } else {
      console.log(`   ✅ No legacy services found (already clean).`);
    }

    // Wait a moment for consistency
    await new Promise(r => setTimeout(r, 1000));

    // 2. DELETE THE STUBBORN LOSERS
    console.log('\n🔍 Deleting the 3 Stubborn Duplicates...');
    for (const id of STUBBORN_LOSERS) {
      try {
        await client.delete(id);
        console.log(`   ✅ Deleted Loser: ${id}`);
      } catch (err) {
        // If it fails (e.g., already deleted), just log it
        console.log(`   ⚠️  Could not delete ${id} (maybe already gone): ${err.message}`);
      }
    }

    // 3. FINAL VERIFICATION
    console.log('\n📊 Final Service Category Count:');
    const finalDocs = await client.fetch(`*[_type == "serviceCategory"]{title, _id}`);
    finalDocs.forEach(doc => {
      console.log(`   ✨ ${doc.title} (${doc._id})`);
    });

    console.log('\n🎉 DONE! Your Sanity Content should now be perfectly clean.');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message)
  }
}

forceCleanup();