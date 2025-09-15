// src/app/courses/page.tsx
import type { Metadata } from 'next';
import ServerCoursesPage from './ServerCoursesPage';

export const metadata: Metadata = {
  title: 'Our Courses | Hexadigitall',
  description: 'Browse our range of professional, tech, and certification courses designed for career growth.',
};

// Add revalidation for better production data fetching
export const revalidate = 300; // Revalidate every 5 minutes
export const dynamic = 'auto';
export const dynamicParams = true;

export default function CoursesPage() {
  return <ServerCoursesPage />;
}
