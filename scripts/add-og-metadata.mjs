#!/usr/bin/env node
/**
 * Populate missing OG metadata (ogTitle, ogDescription, ogImage) and SEO fields
 * Source fields: title, summary, description, mainImage
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

function buildOgDescription(course) {
  return (
    course.ogDescription ||
    course.summary ||
    course.description ||
    `Learn ${course.title} with industry experts. Flexible mentoring with certifications.`
  )
}

async function main() {
  console.log('\nOG metadata fill (dry-run by default)')

  const courses = await client.fetch(
    `*[_type == "course" && (!defined(ogTitle) || !defined(ogDescription) || !defined(ogImage))]{
      _id,
      title,
      summary,
      description,
      mainImage,
      ogTitle,
      ogDescription,
      ogImage,
      seo
    } | order(title asc)`
  )

  if (!courses.length) {
    console.log('All courses already have OG metadata. Nothing to do.')
    return
  }

  console.log(`Found ${courses.length} courses missing some OG fields`)
  let updated = 0
  for (const course of courses) {
    const ogTitle = course.ogTitle || course.title
    const ogDescription = buildOgDescription(course)
    const ogImage = course.ogImage || course.mainImage || null

    const seo = {
      title: course.seo?.title || ogTitle,
      description: course.seo?.description || ogDescription,
      image: course.seo?.image || ogImage || undefined,
      url: course.seo?.url,
    }

    console.log(`→ ${course.title}`)
    if (!APPLY) {
      console.log('   dry-run: would set ogTitle/ogDescription/ogImage and seo title/description')
      continue
    }

    await client
      .patch(course._id)
      .set({ ogTitle, ogDescription, ...(ogImage && { ogImage }), seo })
      .commit()

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
