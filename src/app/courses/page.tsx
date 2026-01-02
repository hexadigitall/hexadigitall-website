// src/app/courses/page.tsx
import type { Metadata } from 'next';
import CoursesPageContentEnhanced from './CoursesPageContent';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import { getFallbackCourseCategories } from '@/lib/fallback-data';

const BASE_URL = 'https://hexadigitall.com';
const COURSES_OG_IMAGE = `${BASE_URL}/og-images/courses-hub.jpg`;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Professional Courses | Tech, Business & Certification Training | Hexadigitall',
  description: 'Tech, business, and certification training with live mentoring and self‑paced options. Clear Nigerian pricing, fast enrollment, and expert support to help you level up your career.',
  openGraph: {
    title: 'Professional Development Courses',
    description: 'Learn professional skills from industry experts.',
    images: [{ url: 'https://hexadigitall.com/og-images/courses-hub.jpg', width: 1200, height: 630, alt: 'Hexadigitall Courses', type: 'image/jpeg' }],
    type: 'website',
    siteName: 'Hexadigitall',
    url: 'https://hexadigitall.com/courses',
    locale: 'en_NG',
  },
};

export default async function CoursesPage() {
  const query = groq`*[_type == "school"] | order(order asc) {
    _id,
    title,
    description,
    "courses": *[_type == "course" && references(^._id)] | order(order asc) {
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
      nairaPrice,
      dollarPrice,
      price,
      featured,
      durationWeeks,
      hoursPerWeek,
      modules,
      lessons,
      includes,
      certificate
    }
  }`;

  let initialData = [];

  try {
    initialData = await client.fetch(query);
  } catch (error) {
    console.error("Sanity fetch failed, using fallback:", error);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      initialData = await getFallbackCourseCategories() as any;
    } catch (fallbackError) {
      console.error("Fallback failed:", fallbackError);
      initialData = [];
    }
  }

  return <CoursesPageContentEnhanced initialSchools={initialData} />;
}