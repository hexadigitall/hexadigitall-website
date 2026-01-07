#!/usr/bin/env node
/**
 * Fix course pricing to follow PPP model correctly
 * Pattern from original courses:
 * $15 → 12,500 NGN
 * $25 → 12,500 NGN
 * $30 → 20,000 NGN
 * $37.5 → 25,000 NGN
 * $50 → 31,250 NGN
 * $75 → 62,500-70,000 NGN
 * $87.5 → 70,000 NGN
 *
 * ALL Frontend/Backend courses → 50,000 NGN regardless of USD rate
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

function getNGNPrice(usdRate, courseTitle) {
  const lower = courseTitle.toLowerCase()
  const isFrontend = lower.includes('frontend')
  const isBackend = lower.includes('backend')
  const isMobile = lower.includes('mobile')

  // Frontend, Backend, and Mobile are always NGN 50,000
  if (isFrontend || isBackend || isMobile) {
    return 50000
  }

  // PPP tier mapping based on USD rates
  if (usdRate <= 15) return 12500
  if (usdRate <= 25) return 12500
  if (usdRate <= 30) return 20000
  if (usdRate <= 37.5) return 25000
  if (usdRate <= 50) return 31250
  if (usdRate <= 56.25) return 40625
  if (usdRate <= 62.5) return 50000
  if (usdRate <= 75) return 62500
  if (usdRate >= 87.5) return 70000

  // Fallback interpolation
  return Math.round(usdRate * 625)
}

async function main() {
  console.log('\n� Fix Course Pricing - PPP Model (dry-run by default)\n')

  const courses = await client.fetch(
    `*[_type == "course" && courseType == "live"]{
      _id,
      title,
      hourlyRateUSD,
      hourlyRateNGN
    } | order(title asc)`
  )

  const updates = []
  for (const course of courses) {
    const correctNGN = getNGNPrice(course.hourlyRateUSD, course.title)
    if (course.hourlyRateNGN !== correctNGN) {
      updates.push({ course, correctNGN })
    }
  }

  if (updates.length === 0) {
    console.log('✅ All pricing is correct!\n')
    return
  }

  console.log(`Found ${updates.length}/${courses.length} courses needing pricing fixes\n`)

  for (const { course, correctNGN } of updates) {
    console.log(`${course.title}`)
    console.log(`   Current: $${course.hourlyRateUSD}/hr → ₦${course.hourlyRateNGN}`)
    console.log(`   Correct: $${course.hourlyRateUSD}/hr → ₦${correctNGN}`)

    if (!APPLY) {
      console.log('   [dry-run]\n')
      continue
    }

    await client.patch(course._id).set({ hourlyRateNGN: correctNGN }).commit()
    console.log('   ✅ Updated\n')
  }

  if (APPLY) {
    console.log('✅ All pricing updated based on PPP model.')
  } else {
    console.log('⏭️  Dry-run complete. Set APPLY=1 to write changes.')
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
