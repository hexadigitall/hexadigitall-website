#!/usr/bin/env node
/**
 * Generate and upload course images from Unsplash keywords
 * Fallback: placeholder if download fails
 * Default: DRY_RUN=true (set APPLY=1 to write)
 */

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
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
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

function keywordForTitle(title) {
  const lower = title.toLowerCase()
  if (lower.includes('frontend')) return 'frontend developer'
  if (lower.includes('backend')) return 'backend developer'
  if (lower.includes('data')) return 'data engineering'
  if (lower.includes('ai') || lower.includes('ml')) return 'artificial intelligence'
  if (lower.includes('cloud') || lower.includes('devops')) return 'cloud computing'
  if (lower.includes('cyber')) return 'cybersecurity'
  if (lower.includes('design')) return 'ui ux design'
  return 'technology education'
}

async function fetchUnsplashUrl(keyword) {
  if (!UNSPLASH_ACCESS_KEY) return null
  const url = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(keyword)}&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        let raw = ''
        res.on('data', (d) => (raw += d))
        res.on('end', () => {
          try {
            const json = JSON.parse(raw)
            resolve(json?.urls?.regular || null)
          } catch (e) {
            resolve(null)
          }
        })
      })
      .on('error', () => resolve(null))
  })
}

async function downloadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      const chunks = []
      response.on('data', (chunk) => chunks.push(chunk))
      response.on('end', () => resolve(Buffer.concat(chunks)))
      response.on('error', reject)
    }).on('error', reject)
  })
}

async function uploadImage(buffer) {
  const asset = await client.assets.upload('image', buffer, { filename: `course-${Date.now()}.jpg` })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}

function placeholder(title) {
  const colors = ['3498db', 'e74c3c', '2ecc71', 'f39c12', '9b59b6', '1abc9c', 'e67e22', 'c0392b']
  const hash = title.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const color = colors[hash % colors.length]
  return `https://dummyimage.com/800x400/${color}/ffffff&text=${encodeURIComponent(title.substring(0, 20))}`
}

async function main() {
  console.log('\nGenerate images for courses missing mainImage (dry-run by default)')

  const courses = await client.fetch(
    `*[_type == "course" && !defined(mainImage)]{ _id, title } | order(title asc)`
  )

  if (!courses.length) {
    console.log('All courses have mainImage. Nothing to do.')
    return
  }

  console.log(`Found ${courses.length} courses without images`)
  let updated = 0

  for (const course of courses) {
    const keyword = keywordForTitle(course.title)
    let imageUrl = await fetchUnsplashUrl(keyword)
    if (!imageUrl) {
      imageUrl = placeholder(course.title)
    }

    console.log(`→ ${course.title}`)
    if (!APPLY) {
      console.log(`   dry-run: would fetch '${keyword}' -> ${imageUrl}`)
      continue
    }

    try {
      const buffer = await downloadImage(imageUrl)
      const mainImage = await uploadImage(buffer)
      await client.patch(course._id).set({ mainImage, ogImage: mainImage }).commit()
      updated++
      console.log('   updated')
    } catch (e) {
      console.log(`   failed: ${e.message}`)
    }
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
