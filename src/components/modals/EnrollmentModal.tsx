'use client';
import { useEffect } from 'react';

interface Course {
  _id: string;
  title: string;
  slug: string; // Simple string (already converted from { current: string })
  mainImage?: string;
  description?: string;
  courseType?: string;
  duration?: string;
  level?: string;
  instructor?: string;
  hourlyRateUSD?: number;
  hourlyRateNGN?: number;
  nairaPrice?: number;
  dollarPrice?: number;
  price?: number;
  durationWeeks?: number;
  hoursPerWeek?: number;
  includes?: string[];
}

interface EnrollmentModalProps {
  course: Course;
  schoolSlug: string;
  onClose: () => void;
}

/**
 * Bridge component that redirects to course detail page with payment section
 * The full payment modal is handled on the CourseEnrollment component on the course detail page
 */
export default function EnrollmentModal({ course, schoolSlug, onClose }: EnrollmentModalProps) {
  useEffect(() => {
    // Redirect to course page with payment section anchor
    const safeSlug = course.slug || '#';
    
    window.location.href = `/courses/${safeSlug}#payment`;
  }, [course]);

  // Fallback UI while redirecting
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md">
        <h2 className="text-xl font-bold mb-2">Opening enrollment...</h2>
        <p className="text-gray-600">Redirecting you to complete your enrollment.</p>
        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

