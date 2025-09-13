import { NextResponse } from 'next/server'
import { getCachedFeaturedCourses } from '@/lib/cached-api'

export async function GET() {
  try {
    console.log('🎓 [API] Fetching featured courses via server-side...')
    
    const courses = await getCachedFeaturedCourses() as unknown[]
    
    console.log('✅ [API] Featured courses fetched:', courses?.length || 0, 'courses')
    
    return NextResponse.json({
      success: true,
      courses: courses || [],
      count: courses?.length || 0,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ [API] Error fetching featured courses:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      courses: [],
      count: 0,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic' // Ensure fresh data on each request
