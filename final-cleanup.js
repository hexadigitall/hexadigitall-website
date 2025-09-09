import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Create clients
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

async function finalCleanup() {
  console.log('🎯 Final cleanup...')

  try {
    // Step 1: Fix the remaining course without category
    console.log('\n🔗 Fixing the remaining course without category...')
    
    // Assign "The Lean Startup: Build Your MVP" to Business & Entrepreneurship
    const courseId = 'j5sZiVQRUGkThv45CBJMpS'
    const categoryId = 'e0a332e5-baa4-4159-9dd5-09a4ccae2c4b' // Business & Entrepreneurship (original)
    
    try {
      await writeClient
        .patch(courseId)
        .set({
          courseCategory: {
            _type: 'reference',
            _ref: categoryId
          }
        })
        .commit()
      console.log('   ✅ Assigned "The Lean Startup: Build Your MVP" to Business & Entrepreneurship')
    } catch (error) {
      console.log('   ❌ Error assigning category:', error.message)
    }

    // Step 2: Update course references to point to original categories
    console.log('\n🔄 Updating course references to original categories...')
    
    // Update "React Native" course to point to original Web & Mobile Development category
    try {
      await writeClient
        .patch('j5sZiVQRUGkThv45CBJLfs')
        .set({
          courseCategory: {
            _type: 'reference',
            _ref: 'f3534095-c1de-4979-b466-e0275cfb344d' // original Web & Mobile Development
          }
        })
        .commit()
      console.log('   ✅ Updated React Native course to original Web & Mobile category')
    } catch (error) {
      console.log('   ❌ Error updating React Native course:', error.message)
    }

    // Step 3: Now try to delete the duplicate categories again
    console.log('\n🗑️  Final attempt to delete duplicate categories...')
    const duplicateCategories = [
      'IdchENUh6rxYSaCTvrXDze', // duplicate Web & Mobile Development
      'IdchENUh6rxYSaCTvrXEDa'  // duplicate Business & Entrepreneurship
    ]

    for (const categoryId of duplicateCategories) {
      try {
        await writeClient.delete(categoryId)
        console.log(`   ✅ Successfully deleted duplicate category: ${categoryId}`)
      } catch (error) {
        console.log(`   ❌ Still cannot delete ${categoryId}:`, error.message)
      }
    }

    console.log('\n🎉 Final cleanup completed!')

  } catch (error) {
    console.error('❌ Error during final cleanup:', error)
  }
}

// Run the final cleanup
finalCleanup()
  .then(() => {
    console.log('\n✅ All cleanup operations completed!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Final cleanup failed:', error)
    process.exit(1)
  })
