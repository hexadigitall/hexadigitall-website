import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env.local') })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

const schools = await client.fetch(`*[_type == "school"] | order(title asc) { _id, title, slug }`)
console.log('📚 Existing Schools:\n')
schools.forEach((s, i) => {
  console.log(`${i + 1}. ${s.title}`)
  console.log(`   ID: ${s._id}`)
  console.log(`   Slug: ${s.slug?.current || 'N/A'}\n`)
})
