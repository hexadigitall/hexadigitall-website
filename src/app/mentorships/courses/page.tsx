import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import MentorshipCoursesPageClient from './MentorshipCoursesPageClient'
import { getFallbackCourseCategories } from '@/lib/fallback-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const BASE_URL = 'https://hexadigitall.com'

export const metadata: Metadata = {
  title: 'Course Mentorships | Hexadigitall Academy',
  description: 'Enroll in mentorship-only support for any Hexadigitall textbook course. Get Google Classroom access, graded assessments, and portfolio guidance.',
  openGraph: {
    title: 'Course Mentorships | Hexadigitall Academy',
    description: 'Mentorship-only plans for textbook learners with mentor feedback and portfolio tracking.',
    url: `${BASE_URL}/mentorships/courses`,
    images: [{
      url: `${BASE_URL}/og-images/courses-hub.jpg`,
      width: 1200,
      height: 630,
      alt: 'Hexadigitall Course Mentorships',
      type: 'image/jpeg'
    }],
    type: 'website'
  }
}

interface CourseCardData {
  _id: string
  title: string
  slug: { current: string }
  summary?: string
  description?: string
  mainImage?: string | null
  duration?: string
  level?: string
  instructor?: string
  courseType?: 'self-paced' | 'live' | string
  hourlyRateUSD?: number
  hourlyRateNGN?: number
  mentorshipHourlyRateUSD?: number
  mentorshipHourlyRateNGN?: number
  nairaPrice?: number
  dollarPrice?: number
  price?: number
}

export default async function MentorshipCoursesPage() {
  const query = groq`*[_type == "course"] | order(order asc) {
    _id,
    title,
    slug,
    summary,
    description,
    "mainImage": mainImage.asset->url,
    duration,
    level,
    instructor,
    courseType,
    hourlyRateUSD,
    hourlyRateNGN,
    mentorshipHourlyRateUSD,
    mentorshipHourlyRateNGN,
    nairaPrice,
    dollarPrice,
    price
  }`

  let courses: CourseCardData[] = []

  try {
    courses = await client.fetch(query)
  } catch (error) {
    console.error('Sanity fetch failed, using fallback:', error)
    try {
      const fallback = await getFallbackCourseCategories() as { courses?: CourseCardData[] }[]
      courses = fallback.flatMap((category) => category.courses || [])
    } catch (fallbackError) {
      console.error('Fallback failed:', fallbackError)
      courses = []
    }
  }

  return <MentorshipCoursesPageClient courses={courses} />
}
