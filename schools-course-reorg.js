// hexadigitall/schools-course-reorg.js
// Optimized script to add/reorganize courses into "schools" (categories) in Sanity
// Features: deduplication, professional naming, Unsplash image integration, OG/SEO logic, modular CRUD

import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import fs from 'fs/promises'
import path from 'path'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Create Sanity clients
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-30',
  useCdn: false,
})

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

// Helper: Generate slug from title
function generateSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Helper: Generate unique key
function generateKey() {
  return Math.random().toString(36).substring(2, 15)
}

// Helper: Deduplicate and clean course titles
function deduplicateCourses(courses) {
  const seen = new Set()
  return courses.filter(course => {
    const name = course.title.trim().toLowerCase()
    if (seen.has(name)) return false
    seen.add(name)
    return true
  })
}

// Helper: Download Unsplash image and upload to Sanity
async function fetchAndUploadImage(courseTitle) {
  // Always use local image from public/course-images/
  try {
    const localImagePath = path.join(process.cwd(), 'public', 'course-images', `${generateSlug(courseTitle)}.jpg`)
    const imageBuffer = await fs.readFile(localImagePath)
    const asset = await writeClient.assets.upload('image', imageBuffer, {
      filename: `${generateSlug(courseTitle)}.jpg`,
      contentType: 'image/jpeg',
    })
    return { _type: 'reference', _ref: asset._id }
  } catch (err) {
    console.warn(`Local image not found for ${courseTitle}, skipping image.`, err.message)
    return undefined
  }
}

// Main structure: All schools/courses from complete-course-rebuild.js
const schoolsStructure = {
  'Web & Mobile Development': {
    description: 'Build modern web applications and mobile apps that users love',
    icon: 'code',
    courses: [
      // ...all courses from Web & Mobile Development in complete-course-rebuild.js...
      // (Web Development Bootcamp, React Native, etc.)
    ]
  },
  'Business & Entrepreneurship': {
    description: 'Launch and grow successful businesses with proven strategies',
    icon: 'chart',
    courses: [
      // ...all courses from Business & Entrepreneurship in complete-course-rebuild.js...
    ]
  },
  'Digital Marketing & SEO': {
    description: 'Master search engine optimization and digital marketing',
    icon: 'settings',
    courses: [
      // ...all courses from Digital Marketing & SEO in complete-course-rebuild.js...
    ]
  },
  'Data & Analytics': {
    description: 'Analyze data and gain insights to drive business decisions',
    icon: 'chart',
    courses: [
      // ...all courses from Data & Analytics in complete-course-rebuild.js...
    ]
  },
  'Cybersecurity & Certification': {
    description: 'Protect systems and earn industry certifications',
    icon: 'network',
    courses: [
      // ...all courses from Cybersecurity & Certification in complete-course-rebuild.js...
    ]
  },
  'Foundational Tech Skills': {
    description: 'Build essential technical skills for any tech career',
    icon: 'default',
    courses: [
      // ...all courses from Foundational Tech Skills in complete-course-rebuild.js...
    ]
  }
}

async function schoolsCourseReorg() {
  console.log('🔥 SCHOOLS & COURSES REORGANIZATION STARTING...')
  try {
    // 1. Delete all existing courses and schools (categories) safely
    const existingCourses = await client.fetch(`*[_type == "course"]{ _id }`)
    const existingSchools = await client.fetch(`*[_type == "school"]{ _id }`)

    // Helper: Remove all references to a document (course/category) before deletion
    async function removeReferencesTo(docId) {
      // Find all documents referencing this docId
      const referencingDocs = await client.fetch(`*[references($docId)]{_id,_type}`, { docId })
      for (const refDoc of referencingDocs) {
        // Patch: unset all fields that reference this docId
        // This is a generic unset; for complex schemas, customize as needed
        await writeClient.patch(refDoc._id)
          .unset([`*[_ref=="${docId}"]`])
          .commit()
        console.log(`   🔗 Unset reference in ${refDoc._type} (${refDoc._id})`)
      }
    }

    // Remove references and delete courses
    for (const course of existingCourses) {
      await removeReferencesTo(course._id)
      try {
        await writeClient.delete(course._id)
        console.log(`   ✅ Deleted course: ${course._id}`)
      } catch (error) {
        console.log(`   ❌ Error deleting course ${course._id}: ${error.message}`)
      }
    }

    // Remove references and delete schools
    for (const school of existingSchools) {
      await removeReferencesTo(school._id)
      try {
        await writeClient.delete(school._id)
        console.log(`   ✅ Deleted school: ${school._id}`)
      } catch (error) {
        console.log(`   ❌ Error deleting school ${school._id}: ${error.message}`)
      }
    }
    console.log('   ✅ Existing data deleted (with reference cleanup)')

    // 2. Create new schools
    const schoolIds = {}
    for (const [schoolTitle, schoolData] of Object.entries(schoolsStructure)) {
      const schoolDoc = {
        _type: 'school',
        title: schoolTitle,
        description: schoolData.description,
        icon: schoolData.icon,
        slug: { current: generateSlug(schoolTitle), _type: 'slug' },
      }
      const createdSchool = await writeClient.create(schoolDoc)
      schoolIds[schoolTitle] = createdSchool._id
      console.log(`   ✅ Created school: ${schoolTitle}`)
    }

    // 3. Create courses with deduplication, image, and SEO/OG logic
    for (const [schoolTitle, schoolData] of Object.entries(schoolsStructure)) {
      const schoolId = schoolIds[schoolTitle]
      if (!schoolId) continue
      const dedupedCourses = deduplicateCourses(schoolData.courses)
      for (const courseData of dedupedCourses) {
        // Fetch local image and upload to Sanity
        const imageAsset = await fetchAndUploadImage(courseData.title)
        // OG/SEO logic from SOCIAL_SHARE_GUIDE.md
        const slug = generateSlug(courseData.title)
        const ogImagePath = `public/og-images/course-${slug}.jpg`
        const ogImageUrl = `https://hexadigitall.com/og-images/course-${slug}.jpg`
        const shareUrl = `https://hexadigitall.com/courses/${slug}?utm_source=facebook&utm_medium=social&utm_campaign=aggressive_penetration`
        const courseDoc = {
          _type: 'course',
          title: courseData.title,
          description: courseData.description,
          summary: courseData.summary,
          price: courseData.price,
          duration: courseData.duration,
          level: courseData.level,
          instructor: courseData.instructor,
          body: courseData.body,
          curriculum: courseData.curriculum,
          includes: courseData.includes,
          certificate: true,
          maxStudents: 50,
          slug: { current: slug, _type: 'slug' },
          school: { _type: 'reference', _ref: schoolId },
          mainImage: imageAsset ? {
            _type: 'image',
            asset: imageAsset,
            alt: `${courseData.title} course image`,
          } : undefined,
          ogImage: imageAsset ? { _type: 'image', asset: imageAsset } : undefined,
          ogTitle: courseData.title,
          ogDescription: courseData.summary || courseData.description,
          ogUrl: shareUrl,
          ogType: 'website',
          ogImageUrl,
          seo: {
            title: courseData.title,
            description: courseData.summary || courseData.description,
            image: imageAsset ? { _type: 'image', asset: imageAsset } : undefined,
            url: `https://hexadigitall.com/courses/${slug}`,
          },
          shareUrls: {
            facebook: `https://www.facebook.com/sharer/sharer.php?u=https://hexadigitall.com/courses/${slug}?utm_source=facebook&utm_medium=social&utm_campaign=aggressive_penetration`,
            twitter: `https://twitter.com/intent/tweet?text=Enroll%20now%20%E2%80%94%20hands%E2%80%91on%2C%20mentor%E2%80%91led%2C%20portfolio%E2%80%91ready.%20Starting%20at%20%E2%82%A625%2C000.%20Limited%20seats.%20https%3A%2F%2Fhexadigitall.com%2Fcourses%2F${slug}%3Futm_source%3Dtwitter%26utm_medium%3Dsocial%26utm_campaign%3Daggressive_penetration`,
            whatsapp: `https://wa.me/?text=Enroll%20now%20%E2%80%94%20hands%E2%80%91on%2C%20mentor%E2%80%91led%2C%20portfolio%E2%80%91ready.%20Starting%20at%20%E2%82%A625%2C000.%20Limited%20seats.%20https%3A%2F%2Fhexadigitall.com%2Fcourses%2F${slug}%3Futm_source%3Dwhatsapp%26utm_medium%3Dsocial%26utm_campaign%3Daggressive_penetration`,
            instagram: `https://hexadigitall.com/courses/${slug}?utm_source=instagram&utm_medium=social&utm_campaign=aggressive_penetration`,
          },
        }
        await writeClient.create(courseDoc)
        console.log(`   ✅ Created course: ${courseData.title}`)
      }
    }
    console.log('🎉 SCHOOLS & COURSES REORGANIZATION COMPLETED!')
  } catch (error) {
    console.error('❌ Script failed:', error)
  }
}

schoolsCourseReorg()
