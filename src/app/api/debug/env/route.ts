import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'

export async function GET() {
  try {
    const envCheck = {
      nodeEnv: process.env.NODE_ENV,
      hasProjectId: !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      hasDataset: !!process.env.NEXT_PUBLIC_SANITY_DATASET,
      hasApiVersion: !!process.env.NEXT_PUBLIC_SANITY_API_VERSION,
      hasToken: !!process.env.SANITY_API_TOKEN,
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.substring(0, 3) + '***',
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    }

    // Test Sanity connection
    let sanityTest
    try {
      const testQuery = '*[_type == "course"][0...1]{_id, title}'
      const testResult = await client.fetch(testQuery)
      sanityTest = {
        success: true,
        documentsFound: testResult.length
      }
    } catch (error) {
      sanityTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test featured courses
    let featuredCoursesTest
    try {
      const featuredQuery = '*[_type == "course" && featured == true][0...3]{_id, title, nairaPrice, dollarPrice}'
      const featured = await client.fetch(featuredQuery)
      featuredCoursesTest = {
        success: true,
        count: featured.length,
        courses: featured.map((c: any) => ({
          title: c.title,
          hasPrice: !!(c.nairaPrice || c.dollarPrice)
        }))
      }
    } catch (error) {
      featuredCoursesTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    // Test service categories
    let serviceCategoriesTest
    try {
      const categoriesQuery = '*[_type == "serviceCategory"][0...3]{_id, title}'
      const categories = await client.fetch(categoriesQuery)
      serviceCategoriesTest = {
        success: true,
        count: categories.length
      }
    } catch (error) {
      serviceCategoriesTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }

    return NextResponse.json({
      environment: envCheck,
      sanityConnection: sanityTest,
      featuredCourses: featuredCoursesTest,
      serviceCategories: serviceCategoriesTest,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Debug endpoint failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
