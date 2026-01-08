// scripts/verify-affordable-courses.mjs
// Verify all NGN 25k-50k/month courses have proper OG images and metadata

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

console.log('🔍 Verifying all affordable courses (NGN 25k-50k/month)...\n')

const courses = await client.fetch(`
  *[_type == "course" && hourlyRateNGN >= 6250 && hourlyRateNGN <= 12500] | order(title asc) {
    _id,
    title,
    slug,
    hourlyRateNGN,
    ogTitle,
    ogDescription,
    ogImage,
    description,
    summary,
    body,
    school-> { title }
  }
`)

let issues = 0
let healthy = 0

const results = {
  total: courses.length,
  healthy: 0,
  missingOgTitle: [],
  missingOgDescription: [],
  missingOgImage: [],
  missingDescription: [],
  missingBody: [],
  complete: []
}

courses.forEach(course => {
  const courseIssues = []
  
  if (!course.ogTitle) {
    courseIssues.push('Missing ogTitle')
    results.missingOgTitle.push(course.title)
  }
  if (!course.ogDescription) {
    courseIssues.push('Missing ogDescription')
    results.missingOgDescription.push(course.title)
  }
  if (!course.ogImage) {
    courseIssues.push('Missing ogImage')
    results.missingOgImage.push(course.title)
  }
  if (!course.description) {
    courseIssues.push('Missing description')
    results.missingDescription.push(course.title)
  }
  if (!course.body || !Array.isArray(course.body) || course.body.length === 0) {
    courseIssues.push('Missing/empty body')
    results.missingBody.push(course.title)
  }
  
  if (courseIssues.length === 0) {
    results.healthy++
    healthy++
    console.log(`✅ ${course.title} (${course.school?.title})`)
  } else {
    issues++
    console.log(`⚠️  ${course.title} (${course.school?.title})`)
    courseIssues.forEach(issue => console.log(`     └─ ${issue}`))
  }
})

console.log(`\n📊 Summary:`)
console.log(`   Total Courses: ${results.total}`)
console.log(`   ✅ Healthy (All metadata): ${results.healthy}`)
console.log(`   ⚠️  Issues Found: ${issues}`)

if (results.missingOgTitle.length > 0) {
  console.log(`\n🚨 Missing OG Title (${results.missingOgTitle.length}):`)
  results.missingOgTitle.forEach(t => console.log(`   - ${t}`))
}
if (results.missingOgDescription.length > 0) {
  console.log(`\n🚨 Missing OG Description (${results.missingOgDescription.length}):`)
  results.missingOgDescription.forEach(t => console.log(`   - ${t}`))
}
if (results.missingOgImage.length > 0) {
  console.log(`\n🚨 Missing OG Image (${results.missingOgImage.length}):`)
  results.missingOgImage.forEach(t => console.log(`   - ${t}`))
}
if (results.missingDescription.length > 0) {
  console.log(`\n🚨 Missing Description (${results.missingDescription.length}):`)
  results.missingDescription.forEach(t => console.log(`   - ${t}`))
}
if (results.missingBody.length > 0) {
  console.log(`\n🚨 Missing/Empty Body (${results.missingBody.length}):`)
  results.missingBody.forEach(t => console.log(`   - ${t}`))
}

console.log(`\n📍 Course Links for Campaign:`)
const bySchool = {}
courses.forEach(c => {
  const school = c.school?.title || 'Unknown'
  if (!bySchool[school]) bySchool[school] = []
  bySchool[school].push(c)
})

Object.entries(bySchool).forEach(([school, schoolCourses]) => {
  console.log(`\n${school}:`)
  schoolCourses.forEach(c => {
    const health = results.missingOgTitle.includes(c.title) || results.missingOgDescription.includes(c.title) || results.missingOgImage.includes(c.title) ? '⚠️' : '✅'
    console.log(`   ${health} https://hexadigitall.com/courses/${c.slug?.current}`)
  })
})

console.log(`\n✨ Campaign Ready: ${results.healthy === results.total ? 'YES - All courses are SEO-optimized!' : `PARTIALLY - ${results.total - results.healthy} courses need fixes.`}`)
