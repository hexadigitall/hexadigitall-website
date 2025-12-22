// src/app/courses/page.tsx
import type { Metadata } from 'next';
import CoursesPageContentEnhanced from './CoursesPageContent';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';

const BASE_URL = 'https://hexadigitall.com';
const COURSES_OG_IMAGE = `${BASE_URL}/og-images/courses-hub.jpg`;

// 🚀 FORCE DYNAMIC: This prevents Next.js from serving old/stale data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Professional Courses | Tech, Business & Certification Training | Hexadigitall',
  description: 'Tech, business, and certification training with live mentoring and self‑paced options. Clear Nigerian pricing, fast enrollment, and expert support to help you level up your career.',
  keywords: 'online courses, professional development, tech training, business courses, certification programs, hexadigitall',
  openGraph: {
    title: 'Professional Development Courses',
    description: 'Learn professional skills from industry experts with live mentoring, self‑paced tracks, and clear Nigerian pricing. From ₦15,000 with fast enrollment and ongoing support.',
    images: [{ url: COURSES_OG_IMAGE, width: 1200, height: 630, alt: 'Hexadigitall Courses', type: 'image/jpeg' }],
    type: 'website',
    siteName: 'Hexadigitall',
    url: `${BASE_URL}/courses`,
    locale: 'en_NG',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Development Courses',
    description: 'Live mentoring and self‑paced options across tech and business. From ₦15,000 with clear Nigerian pricing and fast enrollment.',
    images: [COURSES_OG_IMAGE],
    creator: '@hexadigitall',
    site: '@hexadigitall'
  },
  alternates: { canonical: `${BASE_URL}/courses` }
};

export default async function CoursesPage() {
  // 🔍 FETCH DATA DIRECTLY
  // This query explicitly asks for 'summary' and 'description'
  const query = groq`*[_type == "school"] | order(order asc) {
    _id,
    title,
    description,
    "courses": *[_type == "course" && references(^._id)] | order(order asc) {
      _id,
      title,
      slug,
      summary,      // We ensure this is fetched
      description,  // We ensure this is fetched
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

  const initialData = await client.fetch(query);

  return <CoursesPageContentEnhanced initialData={initialData} />;
}