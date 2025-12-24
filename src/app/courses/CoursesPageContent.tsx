"use client"

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CoursePaymentModal from '@/components/courses/CoursePaymentModal';
import CourseCard, { Course } from '@/components/courses/CourseCard';
import { IoSchoolOutline, IoCodeSlash, IoBusinessOutline, IoBrushOutline, IoCloudOutline } from 'react-icons/io5';
import { useCurrency } from '@/contexts/CurrencyContext';

export interface School {
  _id: string;
  title: string;
  description: string;
  courses: Course[];
}

interface CoursesPageContentProps {
  initialSchools?: School[];
}

// Map icons to school titles for a visual touch
const getSchoolIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('code') || t.includes('software') || t.includes('web')) return <IoCodeSlash />;
  if (t.includes('business')) return <IoBusinessOutline />;
  if (t.includes('design') || t.includes('creative')) return <IoBrushOutline />;
  if (t.includes('cloud') || t.includes('data')) return <IoCloudOutline />;
  return <IoSchoolOutline />;
};

export default function CoursesPageContentEnhanced({ initialSchools = [] }: CoursesPageContentProps) {
  const schools = initialSchools;
  
  // Hooks
  const { currentCurrency } = useCurrency();
  
  // State
  const [activeSchoolId, setActiveSchoolId] = useState<string>(schools.length > 0 ? schools[0]._id : '');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Hydration safe currency check
  const [isNigeria, setIsNigeria] = useState(false);
  useEffect(() => {
    if (currentCurrency?.code === 'NGN') {
      setIsNigeria(true);
    } else {
      setIsNigeria(false);
    }
  }, [currentCurrency]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
  };

  const activeSchool = schools.find(s => s._id === activeSchoolId);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* 1. Immersive Header Section */}
      {/* FIX: Increased pb-32 to pb-48 on mobile to prevent overlap */}
      <div className="relative bg-primary text-white pt-24 pb-48 md:pb-32 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          {/* FIX: Improved Contrast for Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white text-sm font-bold mb-6 shadow-sm"
          >
            🚀 Launch Your Tech Career
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight"
          >
            World-Class Skills.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-300">
              {/* FIX: Conditional Rendering for Pricing Text */}
              {isNigeria ? "Nigerian Prices." : "Transparent Pricing."}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-50 mb-8 leading-relaxed max-w-2xl mx-auto font-medium"
          >
            Stop watching tutorials. Start building projects with live mentorship 
            from industry experts. Get certified and get hired.
          </motion.p>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-white/90"
          >
            <span className="flex items-center bg-white/10 px-3 py-1 rounded-lg"><span className="text-accent mr-2">✓</span> Live Mentorship</span>
            <span className="flex items-center bg-white/10 px-3 py-1 rounded-lg"><span className="text-accent mr-2">✓</span> Project-Based</span>
            <span className="flex items-center bg-white/10 px-3 py-1 rounded-lg"><span className="text-accent mr-2">✓</span> Recognized Certificates</span>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-20 -mt-20 md:-mt-16">
        {/* 2. Modern Sticky Navigation (Fixed Scroll Issues) */}
        <div className="sticky top-4 z-30 mb-12">
           <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-2 md:p-3 overflow-hidden">
              <div 
                ref={scrollRef}
                className="flex overflow-x-auto gap-2 md:justify-center pb-2 md:pb-0 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {schools.map((school) => {
                  const isActive = activeSchoolId === school._id;
                  return (
                    <button
                      key={school._id}
                      onClick={() => {
                         setActiveSchoolId(school._id);
                         if(window.innerWidth < 768) {
                            const elem = document.getElementById(`school-${school._id}`);
                            // Slight offset for sticky header
                            const y = (elem?.getBoundingClientRect().top ?? 0) + window.scrollY - 100;
                            window.scrollTo({top: y, behavior: 'smooth'});
                         }
                      }}
                      // FIX: Added flex-shrink-0 so items don't squeeze
                      className={`
                        flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 snap-center
                        font-medium text-sm md:text-base border
                        ${isActive 
                          ? 'bg-primary text-white border-primary shadow-md scale-100' 
                          : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-100 hover:text-primary'}
                      `}
                    >
                      <span className="text-lg opacity-80">{getSchoolIcon(school.title)}</span>
                      {school.title}
                    </button>
                  )
                })}
              </div>
           </div>
        </div>

        {/* 3. Content Area */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {schools.length > 0 && activeSchool ? (
               <motion.div
                 key={activeSchoolId}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 transition={{ duration: 0.3 }}
                 id={`school-${activeSchool._id}`}
               >
                 <div className="text-center mb-10 max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">{activeSchool.title}</h2>
                    <p className="text-gray-600 text-lg leading-relaxed">{activeSchool.description}</p>
                 </div>

                 {activeSchool.courses?.length > 0 ? (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {activeSchool.courses.map((course, index) => (
                       <motion.div
                         key={course._id}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: index * 0.1 }}
                       >
                         <CourseCard 
                           course={course} 
                           onEnrollClick={handleEnrollClick}
                         />
                       </motion.div>
                     ))}
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                      <IoSchoolOutline className="text-6xl text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">New courses coming soon to this school.</p>
                   </div>
                 )}
               </motion.div>
            ) : (
              <div className="text-center py-20">
                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                 <p className="mt-4 text-gray-500">Loading schools...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
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