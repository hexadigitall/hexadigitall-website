#!/usr/bin/env node
/**
 * Robust bulk importer with validation for required fields and pricing rules
 * Usage: node scripts/import-new-courses.mjs [path/to/new-courses.json]
 * Default: reads ./data/new-courses.json (create this file with course objects)
 * Safety: DRY_RUN=true by default (set APPLY=1 to write)
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fs from 'fs'
import https from 'https'
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
const dataPath = process.argv[2] || path.join(__dirname, '..', 'data', 'new-courses.json')

const codingKeywords = ['frontend', 'backend', 'fullstack', 'full-stack', 'data', 'ai', 'ml', 'devops', 'dev sec ops', 'cloud', 'mobile', 'react', 'next', 'node', 'python', 'java', 'javascript', 'typescript']

function isCodingCourse(title) {
  const lower = title.toLowerCase()
  return codingKeywords.some((kw) => lower.includes(kw))
}

function validateCourse(course) {
  const required = ['title', 'school', 'summary', 'description', 'courseType', 'hourlyRateUSD', 'hourlyRateNGN', 'level']
  const missing = required.filter((key) => !course[key])
  if (missing.length) return `Missing fields: ${missing.join(', ')}`

  if (course.courseType === 'live') {
    if (isCodingCourse(course.title)) {
      if (course.hourlyRateNGN < 50000 || course.hourlyRateNGN > 80000) {
        return 'Coding course NGN rate must be between ₦50,000 and ₦80,000'
      }
    }
  }

  return null
}

async function uploadImage(imageUrl) {
  if (!imageUrl) return null
  const buffer = await new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      const chunks = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => resolve(Buffer.concat(chunks)))
      response.on('error', reject)
    }).on('error', reject)
  })

  const asset = await client.assets.upload('image', buffer, { filename: `course-${Date.now()}.jpg` })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

function toBlock(text) {
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

async function main() {
  if (!fs.existsSync(dataPath)) {
    console.error(`Data file not found: ${dataPath}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(dataPath, 'utf-8')
  const courses = JSON.parse(raw)
  if (!Array.isArray(courses) || courses.length === 0) {
    console.error('Data file must contain a non-empty array of courses')
    process.exit(1)
  }

  console.log(`Loaded ${courses.length} courses from ${dataPath}`)

  const schools = await client.fetch(`*[_type == "school"]{_id, title}`)
  const schoolMap = Object.fromEntries(schools.map((s) => [s.title, s._id]))

  let success = 0
  let skipped = 0

  for (const course of courses) {
    console.log(`\n→ ${course.title}`)
    const validationError = validateCourse(course)
    if (validationError) {
      console.log(`   ❌ Skipped: ${validationError}`)
      skipped++
      continue
    }

    const schoolId = schoolMap[course.school]
    if (!schoolId) {
      console.log(`   ❌ Skipped: school not found (${course.school})`)
      skipped++
      continue
    }

    const mainImage = await uploadImage(course.mainImageUrl).catch(() => null)
    const ogTitle = course.ogTitle || course.title
    const ogDescription = course.ogDescription || course.summary || course.description

    const doc = {
      _type: 'course',
      title: course.title,
      slug: {
        _type: 'slug',
        current: course.slug || course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      },
      school: { _type: 'reference', _ref: schoolId },
      summary: course.summary,
      description: course.description,
      body: course.body && Array.isArray(course.body) ? course.body : toBlock(course.body || course.description || course.summary),
      courseType: course.courseType,
      hourlyRateUSD: course.hourlyRateUSD,
      hourlyRateNGN: course.hourlyRateNGN,
      level: course.level,
      durationWeeks: course.durationWeeks || 8,
      hoursPerWeek: course.hoursPerWeek || 2,
      duration: course.duration || course.durationWeeks ? `${course.durationWeeks} weeks` : undefined,
      modules: course.modules || 8,
      lessons: course.lessons || 24,
      includes: course.includes || undefined,
      prerequisites: course.prerequisites || undefined,
      instructor: course.instructor || undefined,
      mainImage: mainImage || undefined,
      ogTitle,
      ogDescription,
      ogImage: course.ogImage ? course.ogImage : mainImage || undefined,
      seo: {
        title: ogTitle,
        description: ogDescription,
        image: course.ogImage ? course.ogImage : mainImage || undefined,
        url: course.seoUrl,
      },
    }

    if (!APPLY) {
      console.log('   dry-run: would create course with full metadata')
      success++
      continue
    }

    const created = await client.create(doc)
    console.log(`   ✅ Created ${created._id}`)
    success++
  }

  if (APPLY) {
    console.log(`\nDone. Created ${success} courses, skipped ${skipped}.`)
  } else {
    console.log(`\nDry-run complete. Would create ${success} courses, skipped ${skipped}. Set APPLY=1 to write.`)
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
