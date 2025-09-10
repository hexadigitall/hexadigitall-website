import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'

const SERVICE_CATEGORIES_QUERY = `*[_type == "serviceCategory"] | order(order asc, _createdAt desc) {
  _id,
  title,
  slug,
  description,
  icon,
  featured,
  packages,
  requirements,
  faq
}`

const SERVICES_QUERY = `*[_type == "service"]{
  _id,
  title,
  slug,
  overview
}`

export async function GET() {
  try {
    console.log('🛠️ [API] Fetching service categories and services via server-side...')
    
    const [serviceCategories, services] = await Promise.all([
      client.fetch(SERVICE_CATEGORIES_QUERY),
      client.fetch(SERVICES_QUERY)
    ])
    
    console.log('✅ [API] Service data fetched:', {
      categories: serviceCategories?.length || 0,
      services: services?.length || 0
    })
    
    return NextResponse.json({
      success: true,
      serviceCategories: serviceCategories || [],
      services: services || [],
      categoriesCount: serviceCategories?.length || 0,
      servicesCount: services?.length || 0,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ [API] Error fetching service data:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      serviceCategories: [],
      services: [],
      categoriesCount: 0,
      servicesCount: 0,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic' // Ensure fresh data on each request
