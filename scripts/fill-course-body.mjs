#!/usr/bin/env node
/**
 * Fill missing body (portable text) for courses using description/summary
 * Also prints a sample existing body structure for reference
 * Default: DRY_RUN=true (set APPLY=1 to write changes)
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

function toBlock(text) {
  return [
    {
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          marks: [],
          text,
        },
      ],
    },
  ]
}

async function main() {
  console.log('\nFill missing body content (dry-run by default)')

  const sample = await client.fetch(
    `*[_type == "course" && defined(body[0])][0]{title, body}[0]`
  )
  if (sample) {
    console.log(`Sample existing body from: ${sample.title}`)
    console.dir(sample.body, { depth: 4 })
  } else {
    console.log('No course with existing body found to sample.')
  }

  const courses = await client.fetch(
    `*[_type == "course" && (!defined(body) || count(body) == 0)]{
      _id,
      title,
      summary,
      description
    } | order(title asc)`
  )

  if (!courses.length) {
    console.log('All courses already have body content. Nothing to do.')
    return
  }

  console.log(`Found ${courses.length} courses missing body`)
  let updated = 0

  for (const course of courses) {
    const text = course.description || course.summary || course.title
    const body = toBlock(text)

    console.log(`→ ${course.title}`)
    if (!APPLY) {
      console.log('   dry-run: would set body from description/summary')
      continue
    }

    await client.patch(course._id).set({ body }).commit()
    updated++
    console.log('   updated')
  }

  if (APPLY) {
    console.log(`\nDone. Updated ${updated}/${courses.length} courses.`)
  } else {
    console.log('\nDry-run complete. Set APPLY=1 to write changes.')
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
