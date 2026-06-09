import type { Metadata } from 'next'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import { notFound } from 'next/navigation'
import MentorshipCoursePageClient from './MentorshipCoursePageClient'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface CourseDetail {
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
  includes?: string[]
  prerequisites?: string[]
  durationWeeks?: number
  hoursPerWeek?: number
  modules?: number
  lessons?: number
  ogTitle?: string
  ogDescription?: string
  ogImage?: { asset?: { url?: string } }
}

type Props = {
  params: Promise<{ slug: string }>
}

function getMentorshipOgImage(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hexadigitall.com'
  return `${baseUrl}/og-images/course-${slug}.jpg`
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const slug = params.slug

  const query = groq`*[_type == "course" && slug.current == $slug][0]{
    title,
    summary,
    description,
    ogTitle,
    ogDescription,
    ogImage{asset->{url}},
    mainImage{asset->{url}}
  }`

  const course = await client.fetch(query, { slug })

  if (!course) {
    return { title: 'Mentorship Not Found | Hexadigitall' }
  }

  const title = course.ogTitle || `${course.title} Mentorship | Hexadigitall`
  const baseDescription = course.ogDescription || course.description || course.summary ||
    `Mentorship support for ${course.title} textbook learners.`

  const imageUrl = course.ogImage?.asset?.url || course.mainImage?.asset?.url || getMentorshipOgImage(slug)

  return {
    title,
    description: `${baseDescription} Monthly mentorship with assessments and portfolio guidance.`,
    openGraph: {
      title,
      description: baseDescription,
      url: `https://hexadigitall.com/mentorships/courses/${slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${course.title} mentorship` }],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: baseDescription,
      images: [imageUrl]
    },
    alternates: {
      canonical: `https://hexadigitall.com/mentorships/courses/${slug}`
    }
  }
}

export default async function MentorshipCoursePage(props: Props) {
  const params = await props.params
  const slug = params.slug

  const query = groq`*[_type == "course" && slug.current == $slug][0]{
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
    price,
    includes,
    prerequisites,
    durationWeeks,
    hoursPerWeek,
    modules,
    lessons,
    ogTitle,
    ogDescription,
    ogImage{asset->{url}}
  }`

  let course: CourseDetail | null = null

  try {
    course = await client.fetch(query, { slug })
  } catch (error) {
    console.error('Failed to fetch mentorship course:', error)
  }

  if (!course) {
    notFound()
  }

  return <MentorshipCoursePageClient course={course} />
}
