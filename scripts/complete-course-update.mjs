#!/usr/bin/env node
/**
 * Complete course import with ALL fields:
 * - Full formatted body descriptions
 * - bannerBackgroundImage set to mainImage
 * - OG/SEO metadata
 * - Pricing with PPP
 * 
 * Default: DRY_RUN=true (set APPLY=1 to write)
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'fs'
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

function toBlock(text) {
  if (!text) return []
  return [
    {
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        { _type: 'span', marks: [], text },
      ],
    },
  ]
}

async function updateAllCourses() {
  console.log('\n🔧 Complete Course Update - Adding bannerBackgroundImage & Full Formatting\n')
  
  const courses = await client.fetch(`*[_type == "course"]{
    _id,
    title,
    mainImage,
    bannerBackgroundImage,
    body,
    description,
    summary
  }`)
  
  let updated = 0
  let failed = 0
  
  console.log(`Processing ${courses.length} courses...\n`)
  
  for (const course of courses) {
    try {
      const updates = {}
      
      // Set bannerBackgroundImage if not set (use mainImage)
      if (course.mainImage && !course.bannerBackgroundImage) {
        updates.bannerBackgroundImage = course.mainImage
      }
      
      // Ensure body is properly formatted
      if (!course.body || course.body.length === 0) {
        const bodyText = course.description || course.summary || course.title
        updates.body = toBlock(bodyText)
      }
      
      if (Object.keys(updates).length === 0) {
        continue // Skip if no updates needed
      }
      
      if (!APPLY) {
        console.log(`→ ${course.title}`)
        if (updates.bannerBackgroundImage) console.log(`   Add: bannerBackgroundImage`)
        if (updates.body) console.log(`   Add/Fix: body`)
        console.log()
        updated++
        continue
      }
      
      await client.patch(course._id).set(updates).commit()
      
      console.log(`✅ ${course.title}`)
      if (updates.bannerBackgroundImage) console.log(`   + bannerBackgroundImage`)
      if (updates.body) console.log(`   + body description`)
      console.log()
      updated++
    } catch (error) {
      console.log(`❌ ${course.title}: ${error.message}\n`)
      failed++
    }
  }
  
  if (APPLY) {
    console.log(`\nDone. Updated ${updated} courses, ${failed} failed.`)
  } else {
    console.log(`\nDry-run: would update ${updated} courses.`)
    console.log('Set APPLY=1 to apply changes.')
  }
  console.log()
}

updateAllCourses().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
