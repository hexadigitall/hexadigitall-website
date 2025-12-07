// src/app/courses/page.tsx
import type { Metadata } from 'next';
import ComingSoon from '@/components/sections/ComingSoon';

export const metadata: Metadata = {
  title: 'Courses Coming Soon | Hexadigitall',
  description: 'Our courses page is being updated. Check back soon for our range of professional, tech, and certification courses designed for career growth.',
};

export default function CoursesPage() {
  return (
    <ComingSoon 
      title="Courses Coming Soon"
      message="We're currently updating our course offerings and resolving technical issues. Please check back soon for an enhanced learning experience!"
      showContactLink={true}
    />
  );
}
