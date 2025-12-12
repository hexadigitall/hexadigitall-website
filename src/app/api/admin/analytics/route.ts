import { NextResponse } from 'next/server'
import { client } from '@/sanity/client'

interface PageItem {
  page: string
}

interface ServiceItem {
  service?: string
}

interface CourseItem {
  course?: string
}

interface EventItem {
  eventType: string
}

export async function GET() {
  try {
    // Get page view counts
    const pageViewsQuery = `{
      "pages": *[_type == "analyticsEvent" && eventType == "page_view"] | order(timestamp desc) {
        page
      }
    }`
    const pageViewsData = await client.fetch<{ pages: PageItem[] }>(pageViewsQuery)
    const pageViewCounts = pageViewsData.pages.reduce((acc: Record<string, number>, item: PageItem) => {
      acc[item.page] = (acc[item.page] || 0) + 1
      return acc
    }, {})
    const pageViews = Object.entries(pageViewCounts)
      .map(([page, count]) => ({ page, count: count as number }))
      .sort((a, b) => b.count - a.count)

    // Get top services
    const servicesQuery = `{
      "services": *[_type == "analyticsEvent" && eventType == "service_view"] {
        "service": eventData.serviceName
      }
    }`
    const servicesData = await client.fetch<{ services: ServiceItem[] }>(servicesQuery)
    const serviceCounts = servicesData.services.reduce((acc: Record<string, number>, item: ServiceItem) => {
      if (item.service) {
        acc[item.service] = (acc[item.service] || 0) + 1
      }
      return acc
    }, {})
    const topServices = Object.entries(serviceCounts)
      .map(([service, count]) => ({ service, count: count as number }))
      .sort((a, b) => b.count - a.count)

    // Get top courses
    const coursesQuery = `{
      "courses": *[_type == "analyticsEvent" && eventType == "course_view"] {
        "course": eventData.courseName
      }
    }`
    const coursesData = await client.fetch<{ courses: CourseItem[] }>(coursesQuery)
    const courseCounts = coursesData.courses.reduce((acc: Record<string, number>, item: CourseItem) => {
      if (item.course) {
        acc[item.course] = (acc[item.course] || 0) + 1
      }
      return acc
    }, {})
    const topCourses = Object.entries(courseCounts)
      .map(([course, count]) => ({ course, count: count as number }))
      .sort((a, b) => b.count - a.count)

    // Get events by type
    const eventsQuery = `{
      "events": *[_type == "analyticsEvent"] {
        eventType
      }
    }`
    const eventsData = await client.fetch<{ events: EventItem[] }>(eventsQuery)
    const eventTypeCounts = eventsData.events.reduce((acc: Record<string, number>, item: EventItem) => {
      acc[item.eventType] = (acc[item.eventType] || 0) + 1
      return acc
    }, {})
    const eventsByType = Object.entries(eventTypeCounts)
      .map(([type, count]) => ({ type, count: count as number }))
      .sort((a, b) => b.count - a.count)

    // Get recent events
    const recentEventsQuery = `*[_type == "analyticsEvent"] | order(timestamp desc)[0...50] {
      eventType,
      eventName,
      page,
      deviceType,
      browser,
      timestamp
    }`
    const recentEvents = await client.fetch(recentEventsQuery)

    return NextResponse.json({
      success: true,
      data: {
        pageViews,
        topServices,
        topCourses,
        eventsByType,
        recentEvents,
      },
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
