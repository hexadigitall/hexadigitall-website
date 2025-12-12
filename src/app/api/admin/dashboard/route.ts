import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'

export async function GET() {
  try {
    // Get submissions count
    const submissionsQuery = `{
      "total": count(*[_type == "formSubmission"]),
      "new": count(*[_type == "formSubmission" && status == "new"]),
      "today": count(*[_type == "formSubmission" && submittedAt > $todayStart])
    }`
    
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const submissions = await client.fetch(submissionsQuery, {
      todayStart: todayStart.toISOString(),
    })

    // Get analytics counts
    const analyticsQuery = `{
      "totalViews": count(*[_type == "analyticsEvent" && eventType == "page_view"]),
      "todayViews": count(*[_type == "analyticsEvent" && eventType == "page_view" && timestamp > $todayStart]),
      "conversions": count(*[_type == "analyticsEvent" && eventType == "form_submit"])
    }`
    
    const analytics = await client.fetch(analyticsQuery, {
      todayStart: todayStart.toISOString(),
    })

    // Calculate conversion rate
    const conversionRate = analytics.totalViews > 0
      ? ((analytics.conversions / analytics.totalViews) * 100).toFixed(2)
      : 0

    return NextResponse.json({
      success: true,
      stats: {
        totalSubmissions: submissions.total,
        newSubmissions: submissions.new,
        totalPageViews: analytics.totalViews,
        todayPageViews: analytics.todayViews,
        conversionRate,
        avgSessionDuration: '3m 42s', // Calculate from analytics data
      },
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
