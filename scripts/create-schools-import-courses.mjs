#!/usr/bin/env node
/**
 * Create 3 new schools and import 12 high-demand courses
 * Schools: Algorithms, Writing, Design
 * Pricing: DSA 12.5k-25k, Writing 12.5k, Design 12.5k
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

// School definitions
const newSchools = [
  {
    title: 'School of Algorithms & Problem Solving',
    slug: 'school-of-algorithms',
    displayOrder: 11,
    description: 'Master data structures, algorithms, and problem-solving. Prepare for technical interviews at top tech companies.',
  },
  {
    title: 'School of Writing & Communication',
    slug: 'school-of-writing',
    displayOrder: 12,
    description: 'Master written communication. Technical writing, business writing, copywriting, and personal branding.',
  },
  {
    title: 'School of Design & Creative',
    slug: 'school-of-design',
    displayOrder: 13,
    description: 'Master visual design and UX. Create beautiful, functional interfaces and brand experiences.',
  },
]

async function createSchools() {
  console.log('\n🏫 Creating 3 new schools...\n')

  const schools = {}
  for (const schoolData of newSchools) {
    console.log(`Creating: ${schoolData.title}`)

    if (!APPLY) {
      console.log('   [dry-run]\n')
      continue
    }

    const doc = {
      _type: 'school',
      title: schoolData.title,
      slug: { _type: 'slug', current: schoolData.slug },
      displayOrder: schoolData.displayOrder,
      description: schoolData.description,
    }

    const created = await client.create(doc)
    schools[schoolData.title] = created._id
    console.log(`   ✅ Created ${created._id}\n`)
  }

  return schools
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

async function importCourses(schoolIds) {
  console.log('📚 Importing 12 new courses...\n')

  const dataPath = path.join(__dirname, '..', 'data', 'new-dsa-writing-design-courses.json')
  if (!fs.existsSync(dataPath)) {
    console.error(`Data file not found: ${dataPath}`)
    process.exit(1)
  }

  const courses = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

  let success = 0
  for (const course of courses) {
    const schoolId = schoolIds[course.school]
    if (!schoolId) {
      console.log(`${course.title}`)
      console.log(`   ❌ School not found: ${course.school}`)
      continue
    }

    console.log(`${course.title}`)

    if (!APPLY) {
      console.log(`   [dry-run] $${course.hourlyRateUSD}/hr → ₦${course.hourlyRateNGN}\n`)
      success++
      continue
    }

    const doc = {
      _type: 'course',
      title: course.title,
      slug: { _type: 'slug', current: course.slug },
      school: { _type: 'reference', _ref: schoolId },
      summary: course.summary,
      description: course.description,
      body: Array.isArray(course.body) ? course.body : toBlock(course.body || course.description),
      courseType: course.courseType,
      hourlyRateUSD: course.hourlyRateUSD,
      hourlyRateNGN: course.hourlyRateNGN,
      level: course.level,
      durationWeeks: course.durationWeeks || 8,
      hoursPerWeek: course.hoursPerWeek || 3,
      modules: course.modules || 5,
      lessons: course.lessons || 15,
      prerequisites: course.prerequisites,
      ogTitle: course.ogTitle,
      ogDescription: course.ogDescription,
      seo: {
        title: course.ogTitle,
        description: course.ogDescription,
      },
    }

    const created = await client.create(doc)
    console.log(`   ✅ Created ${created._id}`)
    console.log(`   💰 $${course.hourlyRateUSD}/hr USD → ₦${course.hourlyRateNGN} NGN\n`)
    success++
  }

  return success
}

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║  CREATE 3 SCHOOLS + IMPORT 12 HIGH-DEMAND COURSES    ║')
  console.log('╚════════════════════════════════════════════════════════╝')

  let schoolIds = {}
  if (APPLY) {
    schoolIds = await createSchools()
  } else {
    console.log('\n🏫 Would create 3 new schools:')
    newSchools.forEach((s) => {
      console.log(`   • ${s.title}`)
    })
    console.log()
  }

  const success = await importCourses(APPLY ? schoolIds : {
    'School of Algorithms & Problem Solving': 'temp-algo-id',
    'School of Writing & Communication': 'temp-writing-id',
    'School of Design & Creative': 'temp-design-id',
  })

  if (APPLY) {
    console.log(`\n✅ Success: created 3 schools + imported ${success} courses`)
  } else {
    console.log(`\nDry-run: would create 3 schools + import ${success} courses`)
    console.log('Set APPLY=1 to write changes.')
  }
  console.log()
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
