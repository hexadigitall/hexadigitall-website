"use client"

import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import { getFallbackCourseCategories } from '@/lib/fallback-data'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import CoursePaymentModal from '@/components/courses/CoursePaymentModal';
import Breadcrumb from '@/components/ui/Breadcrumb';

// Define types for our data with PPP pricing
interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  mainImage: string | null;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  courseType?: 'live' | 'self-paced';
  // PPP Pricing (for live courses)
  hourlyRateUSD?: number;
  hourlyRateNGN?: number;
  // Legacy pricing (for self-paced courses)
  nairaPrice?: number;
  dollarPrice?: number;
  price?: number;
  featured: boolean;
  durationWeeks?: number;
  hoursPerWeek?: number;
  modules?: number;
  lessons?: number;
  includes?: string[];
  certificate?: boolean;
  maxStudents?: number;
  currentEnrollments?: number;
}

interface School {
  _id: string;
  title: string;
  description: string;
  courses: Course[];
}

interface CoursesPageContentProps {
  initialData?: School[];
}

function CoursesPageContentEnhanced({ initialData }: CoursesPageContentProps = {}) {
  const [schools, setSchools] = useState<School[]>(
    (initialData || []).filter(school => school.courses && school.courses.length > 0)
  );
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const { formatPriceWithDiscount, convertPrice, currentCurrency } = useCurrency();

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      const filtered = initialData.filter(school => school.courses && school.courses.length > 0);
      setSchools(filtered);
      console.log('✅ [COURSES] Using server-side initial data:', filtered.length, 'schools');
      return;
    }
    let isMounted = true;
    async function fetchSchools() {
      try {
        setLoading(true);
        setError(null);
        const schoolsQuery = groq`*[_type == "school"] | order(title asc) {
          _id,
          title,
          description[0...200],
          "courses": *[_type == "course" && references(^._id)] | order(title asc) {
            _id,
            title,
            slug,
            summary[0...200],
            "mainImage": mainImage.asset->url,
            description[0...300],
            duration,
            level,
            instructor,
            courseType,
            hourlyRateUSD,
            hourlyRateNGN,
            nairaPrice,
            dollarPrice,
            price,
            featured,
            durationWeeks,
            hoursPerWeek,
            modules,
            lessons,
            includes,
            certificate
          }
        }`;
        const data: School[] = await client.fetch(schoolsQuery);
        if (!isMounted) return;
        setSchools((data || []).filter(school => school.courses && school.courses.length > 0));
      } catch (err) {
        console.error('❌ [COURSES] Error fetching schools:', err);
        try {
          if (isMounted) {
            const fallbackData: School[] = await getFallbackCourseCategories() as unknown as School[];
            setSchools((fallbackData || []).filter(school => school.courses && school.courses.length > 0));
          }
        } catch (fallbackErr) {
          if (isMounted) {
            setError('Failed to load courses. Please try again later.');
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchSchools();
    return () => { isMounted = false; };
  }, [initialData]);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setShowEnrollmentModal(true);
  };

  const handleCloseModal = () => {
    setShowEnrollmentModal(false);
    setSelectedCourse(null);
  };

  if (loading) {
    return (
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Courses</h1>
            <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
              Invest in your future with our expert-led courses designed for career growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={`skeleton-${index}`} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-6 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Courses</h1>
            <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
              Invest in your future with our expert-led courses designed for career growth.
            </p>
          </div>
          <div className="text-center py-16">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Breadcrumb items={[{ label: 'Courses' }]} />
        </div>
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Enhanced Courses</h1>
          <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
            Choose from flexible learning options: fixed-price courses, per-session booking, or hourly rates. 
            Customize your learning experience to fit your schedule and budget.
          </p>
        </div>
        {schools.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-darkText mb-4">No courses are currently available.</p>
            <p className="text-sm text-gray-500">Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {schools.filter(school => school.courses && school.courses.length > 0).map((school) => (
              <div key={school._id}>
                <h2 className="text-3xl font-bold font-heading border-b-2 border-primary pb-2 mb-8">{school.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {school.courses.map((course) => (
                    <article 
                      key={course._id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                      role="article"
                      aria-labelledby={`course-${course._id}-title`}
                    >
                      <div className="relative aspect-video overflow-hidden">
                        {course.mainImage ? (
                          <Image
                            src={course.mainImage}
                            alt={`${course.title} course preview`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            priority={course.featured || false}
                            loading={course.featured ? "eager" : "lazy"}
                            quality={75}
                            onError={(e) => {
                              console.log(`❌ [IMAGE ERROR] Failed to load image: ${course.mainImage}`);
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center text-primary"><svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg></div>';
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-lightGray flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}
                        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                          {course.level || 'Course'}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 
                          id={`course-${course._id}-title`}
                          className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors"
                        >
                          {course.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {course.description || course.summary || 'Course description coming soon...'}
                        </p>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                          <div className="flex items-center" aria-label={`Course duration: ${course.duration}`}>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{course.duration}</span>
                          </div>
                          
                          {course.instructor && (
                            <div className="flex items-center" aria-label={`Instructor: ${course.instructor}`}>
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              <span>{course.instructor}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* PPP Pricing Section */}
                        <div className="mb-4">
                          {(() => {
                            // Live courses with PPP pricing
                            if (course.courseType === 'live' && course.hourlyRateUSD && course.hourlyRateNGN) {
                              const defaultSessions = 1; // 1 session per week
                              const defaultHours = 1; // 1 hour per session
                              const monthlyUsd = course.hourlyRateUSD * defaultSessions * defaultHours * 4; // 4 weeks
                              const monthlyNgn = course.hourlyRateNGN * defaultSessions * defaultHours * 4;
                              const currency = currentCurrency?.code || 'USD';

                              // Use PPP NGN rate when NGN is selected, otherwise convert USD to the selected currency
                              const monthlyPrice = currency === 'NGN'
                                ? monthlyNgn
                                : convertPrice(monthlyUsd, currency);

                              return (
                                <div className="space-y-2">
                                  <div className="inline-block bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold mb-2">
                                    💡 Monthly Subscription
                                  </div>
                                  <div className="text-2xl font-bold text-primary">
                                    {new Intl.NumberFormat(undefined, {
                                      style: 'currency',
                                      currency,
                                      currencyDisplay: 'symbol',
                                      minimumFractionDigits: currency === 'NGN' ? 0 : 2,
                                      maximumFractionDigits: currency === 'NGN' ? 0 : 2
                                    }).format(monthlyPrice)}
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    Starting from {defaultSessions}hr/week • Customize sessions & hours when you enroll
                                  </p>
                                </div>
                              );
                            }
                            
                            // Legacy self-paced courses
                            if (course.dollarPrice && course.dollarPrice > 0) {
                              const priceInfo = formatPriceWithDiscount(course.dollarPrice, { applyNigerianDiscount: false })
                              
                              return (
                                <div className="space-y-2">
                                  <div className="inline-block bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold mb-2">
                                    📚 One-time Payment
                                  </div>
                                  <span className="text-2xl font-bold text-primary">
                                    {priceInfo.discountedPrice}
                                  </span>
                                </div>
                              )
                            } else if (course.nairaPrice || course.price) {
                              const nairaAmount = course.nairaPrice || course.price || 0;
                              const usdEquivalent = nairaAmount / 1650;
                              const priceInfo = formatPriceWithDiscount(usdEquivalent, { applyNigerianDiscount: false })
                              
                              return (
                                <div className="space-y-2">
                                  <div className="inline-block bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold mb-2">
                                    📚 One-time Payment
                                  </div>
                                  <span className="text-2xl font-bold text-primary">
                                    {priceInfo.discountedPrice}
                                  </span>
                                </div>
                              )
                            } else {
                              return <span className="text-2xl font-bold text-green-600">Free</span>
                            }
                          })()}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="text-center space-y-2">
                          <button
                            onClick={() => handleEnrollClick(course)}
                            className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-label={`Enroll in ${course.title}`}
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>
                              {course.courseType === 'live' 
                                ? 'Customize & Subscribe' 
                                : 'Enroll Now'
                              }
                            </span>
                          </button>
                          
                          <Link
                            href={`/courses/${course.slug.current}`}
                            className="inline-flex items-center justify-center w-full px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            aria-label={`Learn more about ${course.title}`}
                          >
                            <span>Learn More</span>
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Payment Modal with PPP Pricing Calculator */}
        {selectedCourse && (
          <CoursePaymentModal
            isOpen={showEnrollmentModal}
            onClose={handleCloseModal}
            course={selectedCourse}
          />
        )}
      </div>
    </section>
  );
}

export default CoursesPageContentEnhanced;