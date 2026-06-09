import { NextResponse } from 'next/server'
import { getCachedServiceCategories, getCachedServices } from '@/lib/cached-api'

export async function GET() {
  try {
    console.log('🛠️ [API] Fetching service categories and services via server-side...')
    
    const [serviceCategories, services] = await Promise.all([
      getCachedServiceCategories(),
      getCachedServices()
    ]) as [unknown[], unknown[]]
    
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
