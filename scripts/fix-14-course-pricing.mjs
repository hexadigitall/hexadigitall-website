#!/usr/bin/env node
/**
 * Fix pricing for 14 imported courses using correct PPP multipliers
 * Based on tier and market analysis from existing courses
 * Default: DRY_RUN=true (set APPLY=1 to write)
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const APPLY = process.env.APPLY === '1'

// Pricing corrections for 14 imported courses (based on PPP and tier)
// Conversion: Entry/Beginner 500x, Intermediate 625-650x, Advanced 800x, Expert 900x+
// Frontend/Backend hardcoded to ₦50,000 per user requirement
const pricingFixes = [
  { title: 'Azure Security Technologies (AZ-500)', usd: 50, ngn: 40000 }, // Advanced
  { title: 'Microsoft Cybersecurity Architect (SC-100)', usd: 56.25, ngn: 45000 }, // Expert
  { title: 'Security Operations Analyst (SC-200)', usd: 43.75, ngn: 35000 }, // Advanced
  { title: 'Cybersecurity Fundamentals: Network & Systems Defense', usd: 25, ngn: 12500 }, // Beginner
  { title: 'Application Security (AppSec) Specialist', usd: 37.5, ngn: 25000 }, // Advanced
  { title: 'Ethical Hacking & Penetration Testing', usd: 43.75, ngn: 35000 }, // Advanced
  { title: 'DevOps Engineering & Cloud Infrastructure', usd: 45, ngn: 35000 }, // Advanced
  { title: 'DevSecOps Engineering: Automating Security', usd: 43.75, ngn: 35000 }, // Advanced
  { title: 'Enterprise Cloud Solutions Architect', usd: 50, ngn: 40000 }, // Advanced
  { title: 'Frontend Engineering: React & Next.js Mastery', usd: 40, ngn: 50000 }, // Frontend → ₦50k per requirement
  { title: 'Backend Engineering: Scalable Architectures', usd: 43.75, ngn: 50000 }, // Backend → ₦50k per requirement
  { title: 'Mobile Engineering: Cross-Platform Development', usd: 40, ngn: 30000 }, // Intermediate
  { title: 'Professional Data Engineering', usd: 45, ngn: 35000 }, // Advanced
  { title: 'AI Engineering & MLOps', usd: 50, ngn: 40000 }, // Advanced
]

async function fixPricing() {
  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║      FIX COURSE PRICING - PPP ADJUSTMENTS              ║')
  console.log('╚════════════════════════════════════════════════════════╝\n')

  for (const fix of pricingFixes) {
    console.log(`→ ${fix.title}`)
    console.log(`   $${fix.usd}/hr → ₦${fix.ngn}/hr (multiplier: ${(fix.ngn / fix.usd).toFixed(0)}x)`)

    if (!APPLY) {
      console.log('   dry-run: would update\n')
      continue
    }

    const courses = await client.fetch(
      `*[_type == "course" && title == $title]{_id}`,
      { title: fix.title }
    )

    if (courses.length === 0) {
      console.log('   ❌ Course not found\n')
      continue
    }

    for (const course of courses) {
      await client
        .patch(course._id)
        .set({ hourlyRateUSD: fix.usd, hourlyRateNGN: fix.ngn })
        .commit()
      console.log('   ✅ Updated\n')
    }
  }

  console.log(
    APPLY
      ? 'Done. All pricing updated.\n'
      : 'Dry-run complete. Set APPLY=1 to write changes.\n'
  )
}

fixPricing().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
