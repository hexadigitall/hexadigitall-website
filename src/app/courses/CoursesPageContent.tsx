"use client"

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CoursePaymentModal from '@/components/courses/CoursePaymentModal';
import CourseCard, { Course } from '@/components/courses/CourseCard';
import { 
  IoSchoolOutline, 
  IoCodeSlash, 
  IoBusinessOutline, 
  IoBrushOutline, 
  IoCloudOutline, 
  IoChevronBack, 
  IoChevronForward,
  IoSearchOutline,
  IoCloseCircle,
  IoCloseOutline
} from 'react-icons/io5';
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

// 🎨 THEME CONFIGURATION
const getSchoolTheme = (index: number) => {
  const themes = [
    { 
      id: 'blue',
      bg: 'from-blue-600 to-indigo-700', 
      shadow: 'shadow-blue-500/30',
      lightBg: 'from-blue-50 via-indigo-50/50 to-white', // Page Background
      borderColor: 'border-blue-100'
    },
    { 
      id: 'emerald',
      bg: 'from-emerald-600 to-teal-700', 
      shadow: 'shadow-emerald-500/30',
      lightBg: 'from-emerald-50 via-teal-50/50 to-white',
      borderColor: 'border-emerald-100'
    },
    { 
      id: 'orange',
      bg: 'from-orange-500 to-red-600', 
      shadow: 'shadow-orange-500/30',
      lightBg: 'from-orange-50 via-red-50/50 to-white',
      borderColor: 'border-orange-100'
    },
    { 
      id: 'purple',
      bg: 'from-violet-600 to-purple-700', 
      shadow: 'shadow-purple-500/30',
      lightBg: 'from-violet-50 via-purple-50/50 to-white',
      borderColor: 'border-violet-100'
    },
    { 
      id: 'cyan',
      bg: 'from-cyan-600 to-blue-700', 
      shadow: 'shadow-cyan-500/30',
      lightBg: 'from-cyan-50 via-blue-50/50 to-white',
      borderColor: 'border-cyan-100'
    },
  ];
  return themes[index % themes.length];
};

const getSchoolIcon = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('code') || t.includes('software') || t.includes('web')) return <IoCodeSlash />;
  if (t.includes('business') || t.includes('executive')) return <IoBusinessOutline />;
  if (t.includes('design') || t.includes('creative')) return <IoBrushOutline />;
  if (t.includes('cloud') || t.includes('data') || t.includes('devops')) return <IoCloudOutline />;
  return <IoSchoolOutline />;
};

export default function CoursesPageContentEnhanced({ initialSchools = [] }: CoursesPageContentProps) {
  const schools = initialSchools;
  const { currentCurrency } = useCurrency();
  const isNigeria = currentCurrency.code === 'NGN';
  
  // State
  const [activeSchoolId, setActiveSchoolId] = useState<string>(schools.length > 0 ? schools[0]._id : '');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Refs
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const schoolRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Derived Data
  const activeIndex = schools.findIndex(s => s._id === activeSchoolId);
  const activeSchool = schools[activeIndex];
  const activeTheme = getSchoolTheme(activeIndex >= 0 ? activeIndex : 0);
  const prevSchool = schools[activeIndex - 1];
  const nextSchool = schools[activeIndex + 1];

  // 🔍 SEARCH LOGIC
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return schools.flatMap(school => 
      school.courses.map(course => ({
        ...course,
        schoolName: school.title
      }))
    ).filter(course => 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, schools]);

  // Focus Input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Mobile: Auto-scroll to active item
  useEffect(() => {
    if (activeSchoolId && mobileContainerRef.current && schoolRefs.current[activeSchoolId]) {
      const container = mobileContainerRef.current;
      const item = schoolRefs.current[activeSchoolId];
      if (item) {
        const scrollLeft = item.offsetLeft - (container.offsetWidth / 2) + (item.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }
  }, [activeSchoolId]);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setShowPaymentModal(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* 1. IMMERSIVE HEADER SECTION */}
      <div className="relative bg-primary text-white pt-24 pb-32 md:pb-24 overflow-hidden mb-16">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          {/* Badge */}
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

      <div className="container mx-auto px-4">
        
        {/* 2. EXPANDABLE SEARCH INTERFACE (Clean UI) */}
        <div className="flex justify-center mb-12 relative z-20 -mt-20">
          <AnimatePresence mode="wait">
            {!isSearchOpen ? (
              /* --- STATE A: FLOATING ICON BUTTON --- */
              <motion.button
                key="search-icon"
                layoutId="search-container"
                onClick={() => setIsSearchOpen(true)}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center gap-3 bg-white text-gray-600 px-8 py-4 rounded-full shadow-2xl hover:shadow-primary/20 border border-white/50 backdrop-blur-sm transition-all cursor-pointer"
              >
                <IoSearchOutline className="text-2xl text-primary group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-lg text-gray-700">Find a Course</span>
              </motion.button>
            ) : (
              /* --- STATE B: EXPANDED SEARCH BAR --- */
              <motion.div
                key="search-bar"
                layoutId="search-container"
                initial={{ width: 60, opacity: 0 }}
                animate={{ width: "100%", maxWidth: "672px", opacity: 1 }}
                exit={{ width: 60, opacity: 0 }}
                className="relative bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-gray-100"
              >
                <div className="relative flex items-center">
                  <IoSearchOutline className="absolute left-6 text-gray-400 text-xl" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for 'React', 'Design', or 'Security'..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-14 pr-14 py-5 border-none outline-none text-lg text-gray-800 placeholder-gray-400 bg-transparent"
                  />
                  
                  {/* Close/Collapse Button */}
                  <button 
                    onClick={handleCloseSearch}
                    className="absolute right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    title="Close Search"
                  >
                    {searchQuery ? <IoCloseCircle size={24} /> : <IoCloseOutline size={24} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONDITIONAL RENDER: Search Results OR School Carousel */}
        <AnimatePresence mode="wait">
          {searchQuery ? (
            /* --- SEARCH RESULTS VIEW --- */
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-[400px]"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-800">
                  Found {filteredCourses?.length} results
                </h2>
                <button 
                  onClick={handleCloseSearch}
                  className="text-primary font-medium hover:underline text-sm"
                >
                  Back to Schools
                </button>
              </div>
              
              {filteredCourses && filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCourses.map((course) => (
                    <CourseCard 
                      key={course._id}
                      course={course}
                      onEnrollClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <IoSearchOutline className="text-6xl text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No courses found matching "<span className="font-bold">{searchQuery}</span>"</p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-primary font-bold hover:underline"
                  >
                    Clear search term
                  </button>
                </div>
              )}
            </motion.div>

          ) : (
            /* --- SCHOOL BROWSER VIEW --- */
            <motion.div
              key="schools"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* 3. SCHOOL CAROUSEL (Coverflow) */}
              <div className="mb-8 relative">
                {/* DESKTOP CAROUSEL */}
                <div className="hidden md:flex items-center justify-center relative min-h-[220px] max-w-6xl mx-auto">
                  {/* Left Arrow */}
                  {prevSchool && (
                    <button 
                      onClick={() => setActiveSchoolId(prevSchool._id)}
                      className="absolute left-0 lg:left-10 z-20 p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-gray-700 hover:text-primary transition-all hover:scale-110 border border-gray-100"
                    >
                      <IoChevronBack size={28} />
                    </button>
                  )}

                  {/* Cards Container */}
                  <div className="flex items-center justify-center gap-4 lg:gap-12 w-full px-4 overflow-hidden py-10">
                    <AnimatePresence mode="popLayout" initial={false}>
                      
                      {/* Previous (Left) */}
                      {prevSchool && (
                        <motion.div
                          key={prevSchool._id}
                          layoutId={prevSchool._id}
                          initial={{ opacity: 0, x: -100, scale: 0.8 }}
                          animate={{ opacity: 0.5, x: 0, scale: 0.85, zIndex: 0 }}
                          exit={{ opacity: 0, x: -100, scale: 0.8 }}
                          onClick={() => setActiveSchoolId(prevSchool._id)}
                          className="cursor-pointer bg-white p-6 rounded-3xl border border-gray-200 shadow-md flex flex-col items-center justify-center text-center w-64 h-40 hover:opacity-80 transition-opacity grayscale"
                        >
                          <span className="text-4xl text-gray-400 mb-2">{getSchoolIcon(prevSchool.title)}</span>
                          <h3 className="font-bold text-gray-500 text-sm line-clamp-2">{prevSchool.title}</h3>
                        </motion.div>
                      )}

                      {/* Active (Center) */}
                      {activeSchool && (
                        <motion.div
                          key={activeSchool._id}
                          layoutId={activeSchool._id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1.1, zIndex: 10 }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          className={`relative w-80 h-52 rounded-3xl shadow-2xl flex flex-col items-center justify-center text-center p-6 cursor-default bg-gradient-to-br ${activeTheme.bg} ring-4 ring-white ring-offset-4 ring-offset-slate-50`}
                        >
                          <motion.div 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-6xl text-white mb-4 drop-shadow-md"
                          >
                            {getSchoolIcon(activeSchool.title)}
                          </motion.div>
                          <motion.h3 
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="font-extrabold text-white text-xl px-2 leading-tight drop-shadow-sm"
                          >
                            {activeSchool.title}
                          </motion.h3>
                          <div className="absolute bottom-4 text-[10px] font-bold tracking-widest text-white/60 uppercase">
                            Currently Viewing
                          </div>
                        </motion.div>
                      )}

                      {/* Next (Right) */}
                      {nextSchool && (
                        <motion.div
                          key={nextSchool._id}
                          layoutId={nextSchool._id}
                          initial={{ opacity: 0, x: 100, scale: 0.8 }}
                          animate={{ opacity: 0.5, x: 0, scale: 0.85, zIndex: 0 }}
                          exit={{ opacity: 0, x: 100, scale: 0.8 }}
                          onClick={() => setActiveSchoolId(nextSchool._id)}
                          className="cursor-pointer bg-white p-6 rounded-3xl border border-gray-200 shadow-md flex flex-col items-center justify-center text-center w-64 h-40 hover:opacity-80 transition-opacity grayscale"
                        >
                          <span className="text-4xl text-gray-400 mb-2">{getSchoolIcon(nextSchool.title)}</span>
                          <h3 className="font-bold text-gray-500 text-sm line-clamp-2">{nextSchool.title}</h3>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right Arrow */}
                  {nextSchool && (
                    <button 
                      onClick={() => setActiveSchoolId(nextSchool._id)}
                      className="absolute right-0 lg:right-10 z-20 p-4 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white text-gray-700 hover:text-primary transition-all hover:scale-110 border border-gray-100"
                    >
                      <IoChevronForward size={28} />
                    </button>
                  )}
                </div>

                {/* MOBILE CAROUSEL */}
                <div className="md:hidden relative">
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
                  
                  <div 
                    ref={mobileContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory py-6 px-4 gap-4 no-scrollbar"
                  >
                    {schools.map((school, idx) => {
                      const isActive = school._id === activeSchoolId;
                      const theme = getSchoolTheme(idx);
                      return (
                        <div
                          key={school._id}
                          ref={(el) => { if (el) schoolRefs.current[school._id] = el; }}
                          onClick={() => setActiveSchoolId(school._id)}
                          className={`snap-center shrink-0 w-[70vw] p-6 rounded-3xl transition-all duration-500 flex flex-col items-center justify-center text-center gap-3 border shadow-sm ${
                            isActive 
                              ? `bg-gradient-to-br ${theme.bg} scale-100 border-transparent shadow-xl ring-4 ring-white` 
                              : 'bg-white scale-90 border-gray-100 opacity-60 grayscale'
                          }`}
                        >
                          <span className={`text-4xl ${isActive ? 'text-white' : 'text-gray-400'}`}>
                            {getSchoolIcon(school.title)}
                          </span>
                          <h3 className={`font-bold text-lg ${isActive ? 'text-white' : 'text-gray-700'}`}>
                            {school.title}
                          </h3>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. DYNAMIC COURSES GRID (With Harmony Gradient) */}
              <div className="min-h-[400px] transition-colors duration-700 ease-in-out">
                <AnimatePresence mode="wait">
                  {activeSchool ? (
                    <motion.div
                      key={activeSchool._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      // 🎨 HARMONY: Apply the light gradient theme here
                      className={`rounded-[3rem] p-6 md:p-10 bg-gradient-to-b ${activeTheme.lightBg} border ${activeTheme.borderColor} shadow-sm`}
                    >
                      <div className="mb-10 text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">{activeSchool.title}</h2>
                        <p className="text-gray-600 text-lg leading-relaxed">{activeSchool.description}</p>
                      </div>

                      {activeSchool.courses && activeSchool.courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                          {activeSchool.courses.map((course, i) => (
                            <motion.div
                              key={course._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.05 }}
                            >
                              <CourseCard 
                                course={course}
                                onEnrollClick={() => handleCourseClick(course)}
                              />
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
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
            </motion.div>
          )}
        </AnimatePresence>
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
            description: selectedCourse.description ?? "",
            courseType: 
              selectedCourse.courseType === "self-paced" || selectedCourse.courseType === "live"
                ? selectedCourse.courseType
                : undefined,
          }}
        />
      )}
    </div>
  );
}