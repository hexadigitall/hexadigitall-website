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

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

async function fixRemainingIssues() {
  console.log('🔧 Fixing remaining issues...')

  try {
    // Step 1: Fix invalid slugs for course categories
    console.log('\n🏷️  Fixing invalid slugs for course categories...')
    const categoriesWithoutSlugs = await client.fetch(`
      *[_type == "courseCategory" && (!defined(slug.current) || slug.current == "")] {
        _id,
        title
      }
    `)

    for (const category of categoriesWithoutSlugs) {
      const slug = generateSlug(category.title)
      console.log(`   📝 Fixing slug for "${category.title}" -> "${slug}"`)
      
      try {
        await writeClient
          .patch(category._id)
          .set({
            slug: {
              current: slug,
              _type: 'slug'
            }
          })
          .commit()
        console.log(`   ✅ Updated slug for ${category._id}`)
      } catch (error) {
        console.log(`   ❌ Error updating slug for ${category._id}:`, error.message)
      }
    }

    // Step 2: Get all valid course categories for reference
    console.log('\n📚 Getting valid course categories...')
    const validCategories = await client.fetch(`
      *[_type == "courseCategory" && defined(title)] {
        _id,
        title,
        slug
      } | order(title asc)
    `)

    console.log('Available categories:')
    validCategories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.title} (${cat._id})`)
    })

    // Create a mapping for common course titles to category IDs
    const categoryMapping = {
      // Web & Mobile Development
      'web development bootcamp: from zero to hero': 'f3534095-c1de-4979-b466-e0275cfb344d',
      'react native: build mobile apps for ios & android': 'f3534095-c1de-4979-b466-e0275cfb344d',
      
      // Business & Entrepreneurship  
      'project management fundamentals': 'e0a332e5-baa4-4159-9dd5-09a4ccae2c4b',
      'the lean startup: build your mvc': 'e0a332e5-baa4-4159-9dd5-09a4ccae2c4b',
      'digital marketing for small businesses': 'e0a332e5-baa4-4159-9dd5-09a4ccae2c4b',
      
      // Foundational Tech Skills
      'mastering the command line': 'qCF9frKmsSZv1McT5Ufs5N',
      'git & github for beginners': 'qCF9frKmsSZv1McT5Ufs5N',
      
      // Digital Marketing & SEO
      'advanced seo: rank #1 on google': 'IdchENUh6rxYSaCTvrXE6c',
      
      // Data & Analytics
      'data analysis with python': 'qCF9frKmsSZv1McT5UfsBx',
      'google analytics 4: from beginner to expert': 'qCF9frKmsSZv1McT5UfsBx',
      
      // Cybersecurity
      'cissp certification prep course': 'j5sZiVQRUGkThv45CBJL65',
      'ethical hacking for beginners': 'j5sZiVQRUGkThv45CBJL65'
    }

    // Step 3: Fix courses without categories
    console.log('\n🔗 Fixing courses without categories...')
    const coursesWithoutCategories = await client.fetch(`
      *[_type == "course" && !defined(courseCategory)] {
        _id,
        title
      }
    `)

    for (const course of coursesWithoutCategories) {
      const courseTitle = course.title.toLowerCase()
      const categoryId = categoryMapping[courseTitle]
      
      if (categoryId) {
        console.log(`   🔗 Assigning "${course.title}" to category ${categoryId}`)
        
        try {
          await writeClient
            .patch(course._id)
            .set({
              courseCategory: {
                _type: 'reference',
                _ref: categoryId
              }
            })
            .commit()
          console.log(`   ✅ Updated category for ${course._id}`)
        } catch (error) {
          console.log(`   ❌ Error updating category for ${course._id}:`, error.message)
        }
      } else {
        console.log(`   ⚠️  No mapping found for "${course.title}"`)
      }
    }

    // Step 4: Now try to delete duplicate categories that should no longer have references
    console.log('\n🗑️  Attempting to delete duplicate categories...')
    const duplicateCategories = [
      'IdchENUh6rxYSaCTvrXDze', // duplicate Web & Mobile Development
      'IdchENUh6rxYSaCTvrXEDa'  // duplicate Business & Entrepreneurship
    ]

    for (const categoryId of duplicateCategories) {
      try {
        await writeClient.delete(categoryId)
        console.log(`   ✅ Deleted duplicate category: ${categoryId}`)
      } catch (error) {
        console.log(`   ❌ Still cannot delete ${categoryId}:`, error.message)
      }
    }

    console.log('\n🎉 Issue fixing completed!')

    // Final verification
    console.log('\n🔍 Final verification...')
    const remainingIssues = await client.fetch(`
      *[_type == "course" && !defined(courseCategory)] {
        _id,
        title
      }
    `)

    if (remainingIssues.length > 0) {
      console.log(`⚠️  ${remainingIssues.length} courses still without categories:`)
      remainingIssues.forEach(course => {
        console.log(`   - ${course.title} (${course._id})`)
      })
    } else {
      console.log('✅ All courses now have categories assigned!')
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

// Run the fix
fixRemainingIssues()
  .then(() => {
    console.log('\n✅ All fixes completed!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
