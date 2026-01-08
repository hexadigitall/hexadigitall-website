// scripts/find-affordable-courses.mjs
// Find all courses in NGN 25k-50k/month range (6,250-12,500/hr)

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

const courses = await client.fetch(`
  *[_type == "course" && hourlyRateNGN >= 6250 && hourlyRateNGN <= 12500] | order(hourlyRateNGN asc, title asc) {
    _id,
    title,
    slug,
    summary,
    hourlyRateNGN,
    hourlyRateUSD,
    level,
    featured,
    school-> { title, slug },
    "monthlyPriceNGN": (hourlyRateNGN * 2 * 4),
    "monthlyPriceUSD": (hourlyRateUSD * 2 * 4)
  }
`)

console.log(`📊 Courses in NGN 25k-50k/month range (6,250-12,500/hr):\n`)
console.log(`✅ Total: ${courses.length} courses\n`)

const bySchool = {}
courses.forEach(c => {
  const schoolName = c.school?.title || 'Unknown'
  if (!bySchool[schoolName]) bySchool[schoolName] = []
  bySchool[schoolName].push(c)
})

Object.entries(bySchool).forEach(([school, schoolCourses]) => {
  console.log(`📚 ${school}:`)
  schoolCourses.forEach(c => {
    console.log(`   • ${c.title}`)
    console.log(`     NGN ${c.monthlyPriceNGN?.toLocaleString()}/month | USD $${c.monthlyPriceUSD?.toFixed(2)}/month`)
    console.log(`     Route: /courses/${c.slug?.current} | ${c.level}${c.featured ? ' ⭐' : ''}`)
  })
  console.log('')
})

// Export for use in campaign HTML
const campaignData = {
  totalCourses: courses.length,
  courses: courses,
  bySchool: bySchool,
  generatedAt: new Date().toISOString(),
}

console.log('\n💾 Data ready for campaign generation!')
console.log(`   Total courses: ${courses.length}`)
console.log(`   Schools: ${Object.keys(bySchool).length}`)
console.log(`   Date: ${new Date().toLocaleDateString()}`)

export default campaignData
