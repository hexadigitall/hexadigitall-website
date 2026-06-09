import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'
import { requireAdmin } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (!auth.ok) return auth.response

  try {
    const courses = await client.fetch(
      `*[_type == "course"] | order(title asc) {
        _id,
        title,
        "slug": slug.current
      }`
    )
    return NextResponse.json({ success: true, courses })
  } catch (error) {
    console.error('Failed to fetch courses:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch courses' }, { status: 500 })
  }
}
