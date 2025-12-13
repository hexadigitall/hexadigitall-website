// src/app/courses/page.tsx
import type { Metadata } from 'next';
import ServerCoursesPage from './ServerCoursesPage';

export const metadata: Metadata = {
  title: 'Professional Courses | Tech, Business & Certification Training | Hexadigitall',
  description: 'Explore our comprehensive range of professional development courses including web development, digital marketing, business strategy, and industry certifications. Learn from experts and advance your career.',
  keywords: 'online courses, professional development, tech training, business courses, certification programs, hexadigitall',
  openGraph: {
    title: 'Professional Development Courses',
    description: 'Learn professional skills from industry experts with our comprehensive course offerings.',
    images: [{ url: '/og-images/courses-hub.jpg', width: 1200, height: 630, alt: 'Hexadigitall Courses' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Professional Development Courses',
    description: 'Live mentoring and self‑paced options across tech and business.',
    images: ['/og-images/courses-hub.jpg']
  }
};

export default function CoursesPage() {
  return <ServerCoursesPage />;
}
