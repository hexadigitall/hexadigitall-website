#!/usr/bin/env node

/**
 * HEXADIGITALL NUCLEAR CLEANUP SCRIPT
 * ------------------------------------------------------
 * 1. "Neuters" the Stubborn Legacy Categories by unsetting their fields.
 * (This breaks the deadlock preventing deletion).
 * 2. Deletes the Legacy "_type: service" documents.
 * 3. Deletes the Empty Legacy Categories.
 * * Run with: node scripts/nuclear-cleanup.js
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

// The Stubborn Categories holding the references
const STUBBORN_CATEGORIES = [
  "6tPnkrpFCc1QvMkh69g3J1", // Business Foundation Services
  "IdchENUh6rxYSaCTvrXFpS", // Digital Marketing
  "j5sZiVQRUGkThv45CBJNz2"  // Web Development
];

async function nuclearCleanup() {
  console.log('☢️  Starting NUCLEAR Cleanup...');

  try {
    // STEP 1: NEUTER THE CATEGORIES (Break the Link)
    console.log('\n✂️  Severing references in Stubborn Categories...');
    const tx = client.transaction();
    
    for (const id of STUBBORN_CATEGORIES) {
      // We unset ANY field that might contain a reference
      tx.patch(id, p => p.unset([
        'packages', 
        'services', 
        'individualServices', 
        'relatedServices',
        'packageGroups', 
        'testimonials', 
        'caseStudies'
      ]));
    }
    
    await tx.commit();
    console.log('   ✅ Links severed. Deadlock broken.');

    // Wait for consistency
    await new Promise(r => setTimeout(r, 1000));

    // STEP 2: DELETE LEGACY SERVICES
    console.log('\n🗑️  Deleting Legacy Services (_type: service)...');
    const legacyServices = await client.fetch(`*[_type == "service"]{_id, title}`);
    
    if (legacyServices.length > 0) {
      const deleteTx = client.transaction();
      legacyServices.forEach(doc => {
        console.log(`   - Deleting: ${doc.title} (${doc._id})`);
        deleteTx.delete(doc._id);
      });
      await deleteTx.commit();
      console.log(`   ✅ ${legacyServices.length} Legacy Services deleted.`);
    } else {
      console.log(`   ✅ No Legacy Services found.`);
    }

    // STEP 3: DELETE THE STUBBORN CATEGORIES
    console.log('\n🗑️  Deleting Stubborn Categories...');
    const finalTx = client.transaction();
    for (const id of STUBBORN_CATEGORIES) {
        console.log(`   - Deleting: ${id}`);
        finalTx.delete(id);
    }
    await finalTx.commit();
    console.log(`   ✅ Stubborn Categories deleted.`);

    console.log('\n🎉 CLEANUP SUCCESSFUL!');
    console.log('👉 Verify your site. It should now match the local structure.');

  } catch (error) {
    console.error('❌ Script failed:', error.message)
  }
}

nuclearCleanup();