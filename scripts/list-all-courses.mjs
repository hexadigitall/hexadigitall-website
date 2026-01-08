// scripts/list-all-courses.mjs
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

const schools = await client.fetch(`
  *[_type == "school"] | order(title asc) {
    _id,
    title,
    "courses": *[_type == "course" && references(^._id)] | order(order asc) {
      title,
      slug,
      hourlyRateNGN,
      hourlyRateUSD,
      level
    }
  }
`)

console.log('📚 All Courses by School:\n')
schools.forEach((school, i) => {
  console.log(`${i + 1}. ${school.title}`)
  if (school.courses?.length > 0) {
    school.courses.forEach((course, j) => {
      console.log(`   ${j + 1}. ${course.title}`)
      console.log(`      NGN ${course.hourlyRateNGN?.toLocaleString()}/hr | USD $${course.hourlyRateUSD}/hr | ${course.level}`)
    })
  } else {
    console.log('   (No courses)')
  }
  console.log('')
})
