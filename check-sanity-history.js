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
  token: process.env.SANITY_API_TOKEN, // Need token for history
})

async function checkSanityHistory() {
  console.log('🔍 Checking Sanity document history...\n')
  
  try {
    // First, let's see what we currently have
    console.log('📊 Current state:')
    const currentCourses = await client.fetch(`
      *[_type == "course"] | order(title asc) {
        _id,
        title,
        summary,
        description,
        body,
        _createdAt,
        _updatedAt
      }
    `)
    
    console.log(`Found ${currentCourses.length} current courses:`)
    currentCourses.forEach((course, i) => {
      console.log(`   ${i + 1}. ${course.title}`)
      console.log(`      Created: ${new Date(course._createdAt).toLocaleString()}`)
      console.log(`      Updated: ${new Date(course._updatedAt).toLocaleString()}`)
      console.log(`      Has summary: ${course.summary ? 'YES' : 'NO'}`)
      console.log(`      Has rich body: ${course.body && course.body.length > 1 ? 'YES' : 'NO'}`)
      console.log('')
    })

    // Try to get document history (this might not work depending on Sanity plan)
    console.log('📋 Attempting to check document history...')
    
    // Let's check if we can get any transactions or history
    try {
      const history = await client.request({
        url: '/data/history/' + process.env.NEXT_PUBLIC_SANITY_DATASET,
        method: 'GET'
      })
      console.log('✅ History available:', history)
    } catch (historyError) {
      console.log('❌ Cannot access document history:', historyError.message)
      console.log('   This might be a plan limitation or permission issue.')
    }

    // Let's also check what exists in other document types that might have course references
    console.log('\n🔍 Checking for any orphaned or related documents...')
    
    const allDocs = await client.fetch(`
      *[references(*[_type == "course"]._id)] {
        _type,
        _id,
        title
      }
    `)
    
    console.log(`Found ${allDocs.length} documents that reference courses:`)
    allDocs.forEach(doc => {
      console.log(`   - ${doc._type}: ${doc.title || 'Untitled'} (${doc._id})`)
    })

  } catch (error) {
    console.error('❌ Error checking history:', error)
  }
}

// Run the check
checkSanityHistory()
  .then(() => {
    console.log('\n💡 Next steps:')
    console.log('1. Check if Sanity Studio has document history in the UI')
    console.log('2. Consider recovering from Vercel live site data')
    console.log('3. Manual recreation of rich content')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ History check failed:', error)
    process.exit(1)
  })
