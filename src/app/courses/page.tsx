// src/app/courses/page.tsx
import type { Metadata } from 'next';
import ServerCoursesPage from './ServerCoursesPage';

const BASE_URL = 'https://hexadigitall.com'
const COURSES_OG_IMAGE = `${BASE_URL}/og-images/courses-hub.jpg`

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

export default function CoursesPage() {
  return <ServerCoursesPage />;
}
