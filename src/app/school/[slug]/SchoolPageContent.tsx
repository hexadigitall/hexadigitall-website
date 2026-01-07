"use client"

import { useState } from 'react';
import CoursePaymentModal from '@/components/courses/CoursePaymentModal';
import CourseCard, { Course } from '@/components/courses/CourseCard';

interface School {
  _id: string;
  title: string;
  description?: string;
  courses: Course[];
}

interface SchoolPageContentProps {
  school: School;
}

export default function SchoolPageContent({ school }: SchoolPageContentProps) {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
    setSelectedCourse(null);
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">{school.title}</h1>
          {school.description && (
            <p className="text-xl text-blue-100 max-w-2xl">{school.description}</p>
          )}
          {school.courses && school.courses.length > 0 && (
            <p className="text-lg text-blue-100 mt-4">
              {school.courses.length} courses available
            </p>
          )}
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {school.courses && school.courses.length > 0 ? (
            <>
              <h2 className="text-3xl font-bold mb-12">Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {school.courses.map((course) => (
                  <CourseCard
                    key={course._id}
                    course={course}
                    onEnrollClick={handleEnrollClick}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg italic">
                No courses available at this school yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Payment Modal - Same as used in CoursesPageContent */}
      {showPaymentModal && selectedCourse && (
        <CoursePaymentModal
          isOpen={showPaymentModal}
          course={selectedCourse}
          onClose={handleCloseModal}
        />
      )}
    </main>
  );
}
