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

// Define unique, compelling overviews for each service
const serviceOverviews = {
  'business-plan-and-logo-design': 'Launch your venture with confidence through comprehensive business planning and distinctive brand identity design. We transform your vision into actionable strategies and memorable visual assets.',
  
  'profile-and-portfolio-building': 'Showcase your expertise and attract opportunities with professionally crafted online profiles and portfolios. Stand out from the competition with compelling personal branding.',
  
  'mentoring-and-consulting': 'Accelerate your success with expert guidance tailored to your unique challenges. Get strategic insights, technical expertise, and actionable advice from seasoned professionals.',
  
  'web-and-mobile-software-development': 'Bring your digital ideas to life with cutting-edge web and mobile applications. From concept to deployment, we deliver robust, scalable solutions that engage your audience.',
  
  'social-media-advertising-and-marketing': 'Maximize your reach and ROI with data-driven social media strategies. We create compelling campaigns that convert followers into customers across all major platforms.'
}

async function updateServiceOverviews() {
  console.log('📝 Updating service overviews...')

  try {
    // Fetch all services
    const services = await client.fetch(`
      *[_type == "service"] {
        _id,
        title,
        slug,
        overview,
        mainContent
      }
    `)

    console.log(`Found ${services.length} services to update`)

    for (const service of services) {
      const slug = service.slug?.current
      
      if (!slug) {
        console.log(`⚠️  Service "${service.title}" has no slug, skipping...`)
        continue
      }

      // Check if we have a predefined overview for this slug
      const newOverview = serviceOverviews[slug]
      
      if (newOverview) {
        // Only update if the overview is different
        if (service.overview !== newOverview) {
          console.log(`\n📝 Updating overview for "${service.title}"`)
          console.log(`   Old: "${service.overview?.substring(0, 100)}${service.overview?.length > 100 ? '...' : ''}"`)
          console.log(`   New: "${newOverview.substring(0, 100)}${newOverview.length > 100 ? '...' : ''}"`)
          
          try {
            await writeClient
              .patch(service._id)
              .set({
                overview: newOverview
              })
              .commit()
            console.log(`   ✅ Updated successfully`)
          } catch (error) {
            console.log(`   ❌ Error updating service ${service._id}:`, error.message)
          }
        } else {
          console.log(`✅ Service "${service.title}" already has the correct overview`)
        }
      } else {
        console.log(`⚠️  No predefined overview for service "${service.title}" (slug: ${slug})`)
        
        // Generate a generic overview if the current one seems to be duplicated content
        if (service.overview && service.overview.length > 200) {
          const genericOverview = `Professional ${service.title.toLowerCase()} services tailored to your business needs. Contact us to discuss your project requirements and get a custom solution.`
          
          console.log(`   📝 Setting generic overview for "${service.title}"`)
          
          try {
            await writeClient
              .patch(service._id)
              .set({
                overview: genericOverview
              })
              .commit()
            console.log(`   ✅ Updated with generic overview`)
          } catch (error) {
            console.log(`   ❌ Error updating service ${service._id}:`, error.message)
          }
        }
      }
    }

    console.log('\n🎉 Service overview updates completed!')

    // Show final summary
    const updatedServices = await client.fetch(`
      *[_type == "service"] | order(title asc) {
        title,
        slug,
        overview
      }
    `)

    console.log('\n📊 Updated service overviews:')
    updatedServices.forEach((service, index) => {
      console.log(`   ${index + 1}. ${service.title}`)
      console.log(`      Overview: "${service.overview?.substring(0, 80)}${service.overview?.length > 80 ? '...' : ''}"`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error updating service overviews:', error)
  }
}

// Run the update
updateServiceOverviews()
  .then(() => {
    console.log('\n✅ All service overview updates completed!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Service overview update failed:', error)
    process.exit(1)
  })
