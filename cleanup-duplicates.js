import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Create clients directly here
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

async function cleanupDuplicates() {
  console.log('🔍 Starting duplicate cleanup...')

  try {
    // Find duplicate course categories
    console.log('\n📚 Checking course categories...')
    const courseCategories = await client.fetch(`
      *[_type == "courseCategory"] {
        _id,
        _createdAt,
        title,
        slug
      }
    `)

    console.log(`Found ${courseCategories.length} course categories`)

    // Group by title to find duplicates
    const categoryGroups = {}
    courseCategories.forEach(category => {
      const title = category.title?.toLowerCase().trim()
      if (title) {
        if (!categoryGroups[title]) {
          categoryGroups[title] = []
        }
        categoryGroups[title].push(category)
      }
    })

    // Find duplicates and keep the oldest one
    const categoryDuplicatesToDelete = []
    Object.entries(categoryGroups).forEach(([title, categories]) => {
      if (categories.length > 1) {
        console.log(`\n⚠️  Found ${categories.length} duplicate course categories for: "${title}"`)
        // Sort by creation date (oldest first)
        categories.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt))
        
        const keepCategory = categories[0]
        const duplicates = categories.slice(1)
        
        console.log(`   ✅ Keeping: ${keepCategory._id} (created: ${keepCategory._createdAt})`)
        duplicates.forEach(dup => {
          console.log(`   ❌ Will delete: ${dup._id} (created: ${dup._createdAt})`)
          categoryDuplicatesToDelete.push(dup._id)
        })
      }
    })

    // Find duplicate courses
    console.log('\n📖 Checking courses...')
    const courses = await client.fetch(`
      *[_type == "course"] {
        _id,
        _createdAt,
        title,
        slug,
        courseCategory
      }
    `)

    console.log(`Found ${courses.length} courses`)

    // Group by title to find duplicates
    const courseGroups = {}
    courses.forEach(course => {
      const title = course.title?.toLowerCase().trim()
      if (title) {
        if (!courseGroups[title]) {
          courseGroups[title] = []
        }
        courseGroups[title].push(course)
      }
    })

    // Find duplicates and keep the oldest one
    const courseDuplicatesToDelete = []
    Object.entries(courseGroups).forEach(([title, coursesGroup]) => {
      if (coursesGroup.length > 1) {
        console.log(`\n⚠️  Found ${coursesGroup.length} duplicate courses for: "${title}"`)
        // Sort by creation date (oldest first)
        coursesGroup.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt))
        
        const keepCourse = coursesGroup[0]
        const duplicates = coursesGroup.slice(1)
        
        console.log(`   ✅ Keeping: ${keepCourse._id} (created: ${keepCourse._createdAt})`)
        duplicates.forEach(dup => {
          console.log(`   ❌ Will delete: ${dup._id} (created: ${dup._createdAt})`)
          courseDuplicatesToDelete.push(dup._id)
        })
      }
    })

    // Summary
    console.log('\n📊 SUMMARY:')
    console.log(`Course categories to delete: ${categoryDuplicatesToDelete.length}`)
    console.log(`Courses to delete: ${courseDuplicatesToDelete.length}`)

    if (categoryDuplicatesToDelete.length === 0 && courseDuplicatesToDelete.length === 0) {
      console.log('✅ No duplicates found!')
      return
    }

    console.log('\n❓ Would you like to proceed with deletion? (This will be done automatically in 5 seconds)')
    
    // Auto-proceed after 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000))
    
    // Delete duplicate courses first (to avoid reference issues)
    if (courseDuplicatesToDelete.length > 0) {
      console.log(`\n🗑️  Deleting ${courseDuplicatesToDelete.length} duplicate courses...`)
      for (const courseId of courseDuplicatesToDelete) {
        try {
          await writeClient.delete(courseId)
          console.log(`   ✅ Deleted course: ${courseId}`)
        } catch (error) {
          console.log(`   ❌ Error deleting course ${courseId}:`, error.message)
        }
      }
    }

    // Delete duplicate course categories
    if (categoryDuplicatesToDelete.length > 0) {
      console.log(`\n🗑️  Deleting ${categoryDuplicatesToDelete.length} duplicate course categories...`)
      for (const categoryId of categoryDuplicatesToDelete) {
        try {
          await writeClient.delete(categoryId)
          console.log(`   ✅ Deleted course category: ${categoryId}`)
        } catch (error) {
          console.log(`   ❌ Error deleting course category ${categoryId}:`, error.message)
        }
      }
    }

    console.log('\n🎉 Cleanup completed!')

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

// Also create a function to check for other potential issues
async function checkDataIntegrity() {
  console.log('\n🔍 Checking data integrity...')
  
  try {
    // Check for courses without categories
    const coursesWithoutCategory = await client.fetch(`
      *[_type == "course" && !defined(courseCategory)] {
        _id,
        title
      }
    `)

    if (coursesWithoutCategory.length > 0) {
      console.log(`\n⚠️  Found ${coursesWithoutCategory.length} courses without categories:`)
      coursesWithoutCategory.forEach(course => {
        console.log(`   - ${course.title} (${course._id})`)
      })
    }

    // Check for broken category references
    const coursesWithBrokenRefs = await client.fetch(`
      *[_type == "course" && defined(courseCategory) && !defined(courseCategory->title)] {
        _id,
        title,
        courseCategory
      }
    `)

    if (coursesWithBrokenRefs.length > 0) {
      console.log(`\n⚠️  Found ${coursesWithBrokenRefs.length} courses with broken category references:`)
      coursesWithBrokenRefs.forEach(course => {
        console.log(`   - ${course.title} (${course._id}) -> ${course.courseCategory._ref}`)
      })
    }

    // Check for empty or invalid slugs
    const invalidSlugs = await client.fetch(`
      *[_type in ["course", "courseCategory"] && (!defined(slug.current) || slug.current == "")] {
        _type,
        _id,
        title,
        slug
      }
    `)

    if (invalidSlugs.length > 0) {
      console.log(`\n⚠️  Found ${invalidSlugs.length} documents with invalid slugs:`)
      invalidSlugs.forEach(doc => {
        console.log(`   - ${doc._type}: ${doc.title} (${doc._id})`)
      })
    }

  } catch (error) {
    console.error('❌ Error checking data integrity:', error)
  }
}

// Run the cleanup
cleanupDuplicates()
  .then(() => checkDataIntegrity())
  .then(() => {
    console.log('\n✅ All done!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
