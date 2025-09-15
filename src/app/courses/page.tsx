// src/app/courses/page.tsx
import type { Metadata } from 'next';
import CoursesPageContent from './CoursesPageContent';
// import DebugCoursesPageContent from './DebugCoursesPageContent';

export const metadata: Metadata = {
  title: 'Our Courses | Hexadigitall',
  description: 'Browse our range of professional, tech, and certification courses designed for career growth.',
};

export default function CoursesPage() {
  return <CoursesPageContent />;
}
