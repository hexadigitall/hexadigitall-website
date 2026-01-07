#!/usr/bin/env node
/**
 * Deduplicate specific courses with business rules
 * - Frontend React/Next.js: keep the one priced at ₦50,000/month, remove other duplicates
 * - Professional Data Engineering: keep version with Unsplash image, remove placeholder duplicate
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

function isUnsplashImage(imageRef) {
  // Sanity asset IDs include file name; check for unsplash in original filename if available
  return imageRef?.asset?._ref?.toLowerCase().includes('unsplash') || false
}

async function fetchCoursesByTitles(titles) {
  return client.fetch(
    `*[_type == "course" && title in $titles]{
      _id,
      title,
      hourlyRateNGN,
      hourlyRateUSD,
      mainImage,
      _updatedAt
    }`,
    { titles }
  )
}

async function deleteCourse(id, reason) {
  if (!APPLY) {
    console.log(`   dry-run: would delete ${id} (${reason})`)
    return
  }
  await client.delete(id)
  console.log(`   deleted ${id} (${reason})`)
}

async function dedupeFrontend() {
  const titles = [
    'Frontend Engineering: React & Next.js Mastery',
    'Frontend Mastery with React & Next.js'
  ]
  const courses = await fetchCoursesByTitles(titles)
  if (courses.length <= 1) return

  const target = courses.find((c) => c.hourlyRateNGN === 50000)
  const others = courses.filter((c) => c._id !== target?._id)

  console.log('\nFrontend React/Next.js dedupe')
  if (!target) {
    console.log('   No course priced at ₦50,000 found; skipping deletion.')
    return
  }
  console.log(`   keeping: ${target.title} (${target._id}) at ₦${target.hourlyRateNGN}`)
  for (const c of others) {
    await deleteCourse(c._id, 'duplicate frontend course - keep 50k NGN version')
  }
}

async function dedupeDataEngineering() {
  const titles = ['Professional Data Engineering']
  const courses = await fetchCoursesByTitles(titles)
  if (courses.length <= 1) return

  // prefer course with Unsplash image; else keep latest updated
  let keep = courses.find((c) => isUnsplashImage(c.mainImage))
  if (!keep) {
    keep = courses.slice().sort((a, b) => (a._updatedAt < b._updatedAt ? 1 : -1))[0]
  }
  const others = courses.filter((c) => c._id !== keep._id)

  console.log('\nProfessional Data Engineering dedupe')
  console.log(`   keeping: ${keep.title} (${keep._id})`)
  for (const c of others) {
    await deleteCourse(c._id, 'duplicate Professional Data Engineering')
  }
}

async function main() {
  await dedupeFrontend()
  await dedupeDataEngineering()
  console.log('\nDone. (dry-run unless APPLY=1)')
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
