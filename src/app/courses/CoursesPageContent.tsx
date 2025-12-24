"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
// ❌ REMOVED: import { DiscountBanner } from '@/components/ui/DiscountBanner'; 
import CoursePaymentModal from '@/components/courses/CoursePaymentModal';
import CourseCard, { Course } from '@/components/courses/CourseCard';

export interface School {
  _id: string;
  title: string;
  description: string;
  courses: Course[];
}

interface CoursesPageContentProps {
  initialSchools?: School[];
}

export default function CoursesPageContentEnhanced({ initialSchools = [] }: CoursesPageContentProps) {
  // Use server data directly
  const schools = initialSchools;
  const [activeSchoolId, setActiveSchoolId] = useState<string>(schools.length > 0 ? schools[0]._id : '');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
  } 

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Section */}
      <div className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-blue-900 opacity-90" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Master In-Demand Tech Skills
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-8"
          >
            Practical, project-based learning with mentorship from industry experts.
          </motion.p>
          
          {/* ❌ REMOVED: DiscountBanner component was here */}
          
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-20">
        {/* School Filter Tabs */}
        {schools.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {schools.map((school) => (
              <button
                key={school._id}
                onClick={() => setActiveSchoolId(school._id)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all shadow-lg ${
                  activeSchoolId === school._id
                    ? 'bg-accent text-white scale-105 ring-2 ring-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {school.title}
              </button>
            ))}
          </div>
        )}

        {/* Content Area */}
        {schools.length === 0 ? (
          <div className="flex justify-center items-center h-64">
             <div className="text-center py-20 bg-white rounded-xl shadow-sm w-full">
                <p className="text-gray-500 text-lg">Loading courses or no courses available...</p>
             </div>
          </div>
        ) : (
          schools.map((school) => (
            <div 
              key={school._id} 
              className={activeSchoolId === school._id ? 'block' : 'hidden'}
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{school.title}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">{school.description}</p>
              </div>

              {school.courses?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {school.courses.map((course) => (
                    <CourseCard 
                      key={course._id} 
                      course={course} 
                      onEnrollClick={handleEnrollClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                  <p className="text-gray-500 text-lg">No courses available in this school yet.</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Payment Modal */}
      {selectedCourse && (
        <CoursePaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedCourse(null);
          }}
          course={{
            ...selectedCourse,
            description: selectedCourse?.description ?? "",
            courseType:
              selectedCourse?.courseType === "self-paced" || selectedCourse?.courseType === "live"
                ? selectedCourse.courseType
                : undefined,
          }}
        />
      )}
    </div>
  );
}