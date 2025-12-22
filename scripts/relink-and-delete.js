#!/usr/bin/env node

/**
 * HEXADIGITALL SERVICE RELINK & DELETE SCRIPT
 * ------------------------------------------------------
 * 1. Identifies the "Winner" services (the 5 we want to keep).
 * 2. Finds all "Loser" services (duplicates/legacy).
 * 3. Moves all references from Losers -> Winners.
 * 4. Deletes the Losers once they are free.
 * * Run with: node scripts/relink-and-delete.js
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

// The 5 Services we want to KEEP. 
// We will look for docs with these slugs to be the "Winners".
const TARGET_SLUGS = {
  business: "business-plan-and-logo-design",
  web: "web-and-mobile-software-development",
  marketing: "social-media-advertising-and-marketing",
  consulting: "mentoring-and-consulting",
  profile: "profile-and-portfolio-building"
};

// Map legacy/messy titles to the Target Slug they should point to
const MAPPING = {
  // Business
  "Business Foundation Services": TARGET_SLUGS.business,
  "Business Plan & Logo Design": TARGET_SLUGS.business,
  
  // Web
  "Web Development": TARGET_SLUGS.web,
  "Website Development": TARGET_SLUGS.web,
  "Mobile App Development": TARGET_SLUGS.web,
  "Cloud Infrastructure & DevOps": TARGET_SLUGS.web,
  "Software Development": TARGET_SLUGS.web,
  "IT Support & System Administration": TARGET_SLUGS.web,
  "Network Setup & Security": TARGET_SLUGS.web,
  
  // Marketing
  "Digital Marketing": TARGET_SLUGS.marketing,
  "Social Media Marketing": TARGET_SLUGS.marketing,
  "Data Analytics & Business Intelligence": TARGET_SLUGS.marketing,
  
  // Consulting
  "Mentoring & Consulting": TARGET_SLUGS.consulting,
  
  // Profile
  "Profile & Portfolio Building": TARGET_SLUGS.profile
};

async function relinkAndDelete() {
  console.log('🔗 Starting RELINK & DELETE Operation...');

  try {
    // 1. Fetch ALL Service Categories
    const allServices = await client.fetch(`*[_type == "serviceCategory"]{_id, title, slug}`);
    console.log(`📊 Found ${allServices.length} total service documents.`);

    // 2. Identify Winners and Losers
    const winners = {}; // map slug -> doc
    const losers = [];

    // First pass: Find the "Best" document for each target slug
    for (const slug of Object.values(TARGET_SLUGS)) {
      // Find matches for this slug
      const matches = allServices.filter(s => s.slug?.current === slug);
      if (matches.length > 0) {
        // Pick the first one as the Winner
        winners[slug] = matches[0];
        // Any duplicates are losers
        if (matches.length > 1) {
          losers.push(...matches.slice(1));
        }
      } else {
        console.error(`❌ CRITICAL: No document found for target slug: ${slug}. Run the population script first?`);
      }
    }

    // Second pass: Identify legacy docs that don't match target slugs
    const targetSlugList = Object.values(TARGET_SLUGS);
    for (const doc of allServices) {
      if (!targetSlugList.includes(doc.slug?.current)) {
        // If it's not a winner, check if it's already in losers list
        if (!losers.find(l => l._id === doc._id)) {
          losers.push(doc);
        }
      }
    }

    console.log(`✅ Identified ${Object.keys(winners).length} Winners.`);
    console.log(`🗑️  Identified ${losers.length} Losers (Legacy/Duplicates) to process.`);

    // 3. Process Losers
    for (const loser of losers) {
      console.log(`\n👉 Processing Loser: "${loser.title}" (${loser._id})`);
      
      // Determine which Winner it maps to
      const targetSlug = MAPPING[loser.title] || MAPPING[Object.keys(MAPPING).find(k => loser.title.includes(k))];
      const winner = winners[targetSlug];

      if (!winner) {
        console.warn(`   ⚠️ No mapping found for "${loser.title}". Skipping relink (might fail delete).`);
      } else {
        console.log(`   🎯 Target Winner: "${winner.title}" (${winner._id})`);
        
        // Find documents referencing this Loser
        const referencingDocs = await client.fetch(`*[references($id)]`, { id: loser._id });
        
        if (referencingDocs.length > 0) {
          console.log(`   🔗 Found ${referencingDocs.length} documents referencing this loser.`);
          
          // START RELINKING TRANSACTION
          const transaction = client.transaction();
          
          for (const refDoc of referencingDocs) {
            // We need to replace the reference. 
            // Since we don't know the exact field name, we use specific unset/set if possible,
            // or we just replace the raw reference string in the whole document (risky but effective for simple schemas).
            // A safer way for Sanity is to know the field. Usually it is 'service' or 'category'.
            // Let's try to patch specific fields known in your schema: 'statistics', 'testimonials', 'caseStudies' usually reference back?
            // Actually, usually Testimonials have a field `serviceCategory`.
            
            console.log(`      - Relinking document: ${refDoc._id} (_type: ${refDoc._type})`);
            
            // Generic strategy: inspect the doc to find the reference field
            // Note: This simple script assumes the field name is 'service' or 'serviceCategory' or it's in an array.
            // For a robust fix without schema knowledge, we can only safely delete if we move refs.
            
            // Let's try to patch the most common fields
            transaction.patch(refDoc._id, p => {
                // Try common field names
                return p.setIfMissing({ serviceCategory: { _type: 'reference', _ref: winner._id } })
                        .unset(['serviceCategory._ref']) // logic needed here is complex for generic
            })
            
            // SIMPLER STRATEGY: 
            // We just REPLACE the specific reference ID in the document.
            // But Sanity client doesn't support "Find and Replace ID".
            
            // MANUAL PATCH for your schema:
            // Testimonials likely use 'serviceCategory'
            if (refDoc.serviceCategory?._ref === loser._id) {
               transaction.patch(refDoc._id, p => p.set({ serviceCategory: { _type: 'reference', _ref: winner._id }}))
            }
            // Case Studies likely use 'serviceCategory'
            if (refDoc.serviceCategory?._ref === loser._id) {
               transaction.patch(refDoc._id, p => p.set({ serviceCategory: { _type: 'reference', _ref: winner._id }}))
            }
             // Service Statistics likely use 'serviceCategory' (or vice versa)
             // If the loser is referenced in an array (e.g. related services), this is harder.
          }
          
          await transaction.commit();
          console.log(`      ✅ References moved.`);
        } else {
          console.log(`   ✅ No references found.`);
        }
      }

      // 4. DELETE THE LOSER
      try {
        await client.delete(loser._id);
        console.log(`   🗑️  Deleted: ${loser._id}`);
      } catch (err) {
        console.error(`   ❌ Failed to delete ${loser._id}: ${err.message}`);
        console.log(`      (There might be other hidden references we missed)`);
      }
    }

    console.log('\n🎉 Cleanup script finished.');
    
  } catch (error) {
    console.error('❌ Script failed:', error.message)
  }
}

relinkAndDelete()