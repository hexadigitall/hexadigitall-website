import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Create clients
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

async function forceCleanupCourses() {
  console.log('🔥 FORCE CLEANUP: Removing all course references and duplicates...\n')
  
  try {
    // Step 1: Delete all enrollments that reference courses
    console.log('🗑️  Step 1: Deleting all enrollments...')
    const enrollments = await client.fetch(`*[_type == "enrollment"]{ _id }`)
    console.log(`   Found ${enrollments.length} enrollments to delete`)
    
    for (const enrollment of enrollments) {
      try {
        await writeClient.delete(enrollment._id)
        console.log(`   ✅ Deleted enrollment: ${enrollment._id}`)
      } catch (error) {
        console.log(`   ❌ Error deleting enrollment ${enrollment._id}: ${error.message}`)
      }
    }
    
    // Step 2: Delete any pending enrollments
    console.log('\n🗑️  Step 2: Deleting pending enrollments...')
    const pendingEnrollments = await client.fetch(`*[_type == "pendingEnrollment"]{ _id }`)
    console.log(`   Found ${pendingEnrollments.length} pending enrollments to delete`)
    
    for (const pendingEnrollment of pendingEnrollments) {
      try {
        await writeClient.delete(pendingEnrollment._id)
        console.log(`   ✅ Deleted pending enrollment: ${pendingEnrollment._id}`)
      } catch (error) {
        console.log(`   ❌ Error deleting pending enrollment ${pendingEnrollment._id}: ${error.message}`)
      }
    }

    // Step 3: Now delete all courses
    console.log('\n🗑️  Step 3: Deleting all courses...')
    const courses = await client.fetch(`*[_type == "course"]{ _id, title }`)
    console.log(`   Found ${courses.length} courses to delete`)
    
    for (const course of courses) {
      try {
        await writeClient.delete(course._id)
        console.log(`   ✅ Deleted course: ${course.title} (${course._id})`)
      } catch (error) {
        console.log(`   ❌ Error deleting course ${course._id}: ${error.message}`)
      }
    }

    // Step 4: Delete all course categories
    console.log('\n🗑️  Step 4: Deleting all course categories...')
    const categories = await client.fetch(`*[_type == "courseCategory"]{ _id, title }`)
    console.log(`   Found ${categories.length} categories to delete`)
    
    for (const category of categories) {
      try {
        await writeClient.delete(category._id)
        console.log(`   ✅ Deleted category: ${category.title} (${category._id})`)
      } catch (error) {
        console.log(`   ❌ Error deleting category ${category._id}: ${error.message}`)
      }
    }
    
    console.log('\n✅ Force cleanup completed!')
    
    // Verification
    const remainingCourses = await client.fetch(`*[_type == "course"]{ _id }`)
    const remainingCategories = await client.fetch(`*[_type == "courseCategory"]{ _id }`)
    
    console.log(`\n📊 Verification:`)
    console.log(`   Remaining courses: ${remainingCourses.length}`)
    console.log(`   Remaining categories: ${remainingCategories.length}`)
    
    if (remainingCourses.length === 0 && remainingCategories.length === 0) {
      console.log('✅ All courses and categories successfully deleted!')
    } else {
      console.log('⚠️  Some items still remain - may need manual cleanup in Sanity Studio')
    }
    
  } catch (error) {
    console.error('❌ Force cleanup failed:', error)
  }
}

// Run force cleanup
forceCleanupCourses()
  .then(() => {
    console.log('\n✅ Force cleanup script completed!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Force cleanup script failed:', error)
    process.exit(1)
  })
