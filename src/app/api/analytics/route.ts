import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/client'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Create analytics event in Sanity
    await writeClient.create({
      _type: 'analyticsEvent',
      ...data,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics error:', error)
    // Don't fail the request - analytics should be non-blocking
    return NextResponse.json({ success: false }, { status: 200 })
  }
}
