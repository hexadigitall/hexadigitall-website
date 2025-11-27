#!/usr/bin/env node
// scripts/migrate-packageGroups-and-features.js
// Migrate legacy `packages` -> `packageGroups` on serviceCategory documents in Sanity.
// Dry-run by default. To apply changes, set SANITY_API_TOKEN in your environment (or .env.local).

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'
})

const createStats = process.argv.includes('--create-stats')

async function run() {
  console.log('Migrate legacy packages -> packageGroups')
  console.log('Dry run unless SANITY_API_TOKEN is set in your environment (.env.local will be loaded).')

  const categories = await client.fetch(`*[_type == "serviceCategory"]{_id, title, slug, packages, packageGroups, testimonials, caseStudies, statistics}`)
  console.log(`Found ${categories.length} service categories`)

  for (const cat of categories) {
    const slug = (cat.slug && cat.slug.current) || cat.title || cat._id

    // If packageGroups already exist, skip
    if (Array.isArray(cat.packageGroups) && cat.packageGroups.length > 0) {
      console.log(`Skipping ${slug} — packageGroups already present (${cat.packageGroups.length})`)
    } else if (Array.isArray(cat.packages) && cat.packages.length > 0) {
      // Build a single package group from existing packages
      const groupKey = `${(cat.slug && cat.slug.current) || slug}`.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-default'
      const group = {
        key: { _type: 'slug', current: groupKey },
        name: 'Default Packages',
        description: 'Automatically migrated from legacy packages',
        tiers: cat.packages.map((p, i) => ({
          _key: p._key || `tier-${i}`,
          name: p.name || `Package ${i+1}`,
          tier: p.tier || 'standard',
          price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
          currency: p.currency || 'USD',
          billing: p.billing || 'one_time',
          deliveryTime: p.deliveryTime || '',
          features: Array.isArray(p.features) ? p.features : [],
          popular: !!p.popular,
          addOns: Array.isArray(p.addOns) ? p.addOns : []
        }))
      }

      console.log(`Will patch ${slug} (${cat._id}) with packageGroups: 1 group, ${group.tiers.length} tiers`)

      if (process.env.SANITY_API_TOKEN) {
        try {
          const res = await client.patch(cat._id).set({ packageGroups: [group] }).commit({ autoGenerateArrayKeys: true })
          console.log(`✅ Patched ${slug} -> ${res._id}`)

          // Optionally create a minimal statistics doc and attach it
          if (createStats && !cat.statistics) {
            const statsDoc = {
              _type: 'serviceStatistics',
              metrics: {
                projectsCompleted: group.tiers.length,
                clientSatisfaction: 90,
                averageDeliveryTime: 'N/A',
                teamSize: 1
              },
              performance: [],
              clientMetrics: [],
              techStack: [],
              lastUpdated: new Date().toISOString()
            }
            const created = await client.create(statsDoc)
            await client.patch(cat._id).set({ statistics: { _ref: created._id, _type: 'reference' } }).commit()
            console.log(`👉 Created statistics doc ${created._id} and linked to ${slug}`)
          }
        } catch (err) {
          console.error(`❌ Failed to patch ${slug}:`, err)
        }
      } else {
        console.log('(dry-run) set SANITY_API_TOKEN to actually patch this document')
      }
    } else {
      console.log(`Skipping ${slug} — no legacy packages to migrate`)
    }
  }

  console.log('Migration complete (dry-run may have been used).')
}

run().catch(err => {
  console.error('Unexpected error during migration:', err)
  process.exit(1)
})
