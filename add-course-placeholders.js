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

// Generate a simple placeholder image data URL (1x1 blue pixel)
const placeholderImageDataUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjNDI5NkY0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Q291cnNlIEltYWdlPC90ZXh0Pgo8L3N2Zz4='

async function addCoursePlaceholders() {
  console.log('📸 Adding placeholder images to courses...\n')
  
  try {
    // Get all courses that don't have mainImage
    const coursesWithoutImages = await client.fetch(`
      *[_type == "course" && !defined(mainImage)] {
        _id,
        title
      }
    `)
    
    console.log(`Found ${coursesWithoutImages.length} courses without images`)
    
    if (coursesWithoutImages.length === 0) {
      console.log('✅ All courses already have images!')
      return
    }

    // Create a simple placeholder image asset
    console.log('📤 Creating placeholder image asset...')
    
    // Convert data URL to buffer
    const base64Data = placeholderImageDataUrl.split(',')[1]
    const imageBuffer = Buffer.from(base64Data, 'base64')
    
    const imageAsset = await writeClient.assets.upload('image', imageBuffer, {
      filename: 'course-placeholder.svg',
      contentType: 'image/svg+xml'
    })
    
    console.log(`✅ Created placeholder image asset: ${imageAsset._id}`)
    
    // Add placeholder image to all courses without images
    for (const course of coursesWithoutImages) {
      console.log(`📸 Adding placeholder to "${course.title}"`)
      
      try {
        await writeClient
          .patch(course._id)
          .set({
            mainImage: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAsset._id
              },
              alt: `${course.title} course image placeholder`
            }
          })
          .commit()
        console.log(`   ✅ Added placeholder to ${course._id}`)
      } catch (error) {
        console.log(`   ❌ Error adding placeholder to ${course._id}:`, error.message)
      }
    }
    
    console.log('\n🎉 Placeholder images added successfully!')
    console.log('💡 You can now replace these with actual course images in Sanity Studio')
    
  } catch (error) {
    console.error('❌ Error adding placeholders:', error)
  }
}

// Run the script
addCoursePlaceholders()
  .then(() => {
    console.log('\n✅ Placeholder addition completed!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Placeholder addition failed:', error)
    process.exit(1)
  })
