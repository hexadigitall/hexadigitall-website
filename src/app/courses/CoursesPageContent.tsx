// src/app/courses/CoursesPageContent.tsx
"use client"

import { getCachedCourseCategories } from '@/lib/cached-api'
import { getFallbackCourseCategories } from '@/lib/fallback-data'
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';
import CoursePaymentModal from '@/components/courses/CoursePaymentModal';

// Define types for our data
interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  mainImage: string;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  nairaPrice?: number;
  dollarPrice?: number;
  price?: number; // Legacy field for backward compatibility
  featured: boolean;
}

interface Category {
  _id: string;
  title: string;
  description: string;
  courses: Course[];
}

// Using cached API for consistent data fetching

function CoursesPageContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { formatPriceWithDiscount, isLocalCurrency } = useCurrency();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    async function fetchCourses() {
      try {
        if (!isMounted) return;
        setLoading(true);
        setError(null);
        
        console.log('👩‍🎓 [COURSES] Fetching course categories via cached API...');
        // Set a longer timeout for fetching courses
        const fetchPromise = getCachedCourseCategories();
        
        // Create a timeout in case the fetch takes too long
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            if (isMounted) {
              reject(new Error('Fetching courses timed out. Please try again.'));
            }
          }, 20000); // 20 second timeout
        });
        
        // Race the fetch against the timeout
        const data: Category[] = await Promise.race([
          fetchPromise,
          timeoutPromise
        ]) as Category[];
        
        if (!isMounted) return;
        
        console.log('✅ [COURSES] Course categories fetched:', data?.length || 0, 'categories');
        
        // Debug: Log pricing data for each course
        data?.forEach(category => {
          category.courses?.forEach(course => {
            console.log(`📊 [PRICING DEBUG] ${course.title}:`, {
              nairaPrice: course.nairaPrice,
              dollarPrice: course.dollarPrice,
              price: course.price
            });
          });
        });
        
        if (!isMounted) return;
        setCategories(data || []);
      } catch (err) {
        console.error('❌ [COURSES] Error fetching courses:', err);
        console.log('🔄 [COURSES] Attempting to use fallback data...');
        
        try {
          // Try to use fallback data
          if (isMounted) {
            const fallbackData: Category[] = await getFallbackCourseCategories() as Category[];
            console.log('✅ [FALLBACK] Using fallback course data');
            setCategories(fallbackData || []);
          }
        } catch (fallbackErr) {
          console.error('❌ [FALLBACK] Fallback data also failed:', fallbackErr);
          if (isMounted) {
            setError('Failed to load courses. Please try again later.');
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    fetchCourses();
    
    // Return cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Courses</h1>
          <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
            Invest in your future with our expert-led courses designed for career growth.
          </p>
        </div>
        
        {!categories || categories.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-darkText mb-4">No courses are currently available.</p>
            <p className="text-sm text-gray-500">Please check back later or contact us for more information.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {categories.map((category) => (
              <div key={category._id}>
                <h2 className="text-3xl font-bold font-heading border-b-2 border-primary pb-2 mb-8">{category.title}</h2>
                {!category.courses || category.courses.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No courses available in this category.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {category.courses.map((course) => (
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
                              priority={false}
                              loading="lazy"
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
                          
                          {/* Price Section - Same as Featured Courses */}
                          <div className="mb-4">
                            {(() => {
                              // Debug: Log what pricing fields are available
                              console.log(`💰 [COURSE PRICING] ${course.title} - dollarPrice: ${course.dollarPrice}, nairaPrice: ${course.nairaPrice}, price: ${course.price}`);
                              
                              // Prioritize dollarPrice for consistency and currency conversion
                              if (course.dollarPrice) {
                                const priceInfo = formatPriceWithDiscount(course.dollarPrice, { applyNigerianDiscount: true })
                                
                                if (priceInfo.hasDiscount) {
                                  return (
                                    <div className="space-y-2">
                                      {isLocalCurrency() && (
                                        <span className="inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                                          🔥 {priceInfo.discountPercentage}% OFF
                                        </span>
                                      )}
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                        <span className="text-lg text-gray-500 line-through">
                                          {priceInfo.originalPrice}
                                        </span>
                                        <span className="text-2xl font-bold text-green-600">
                                          {priceInfo.discountedPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                } else {
                                  return (
                                    <span className="text-2xl font-bold text-primary">
                                      {priceInfo.discountedPrice}
                                    </span>
                                  )
                                }
                              } else if (course.nairaPrice || course.price) {
                                // Convert NGN to USD first, then format in selected currency
                                const nairaAmount = course.nairaPrice || course.price || 0;
                                const usdEquivalent = nairaAmount / 1650;
                                const priceInfo = formatPriceWithDiscount(usdEquivalent, { applyNigerianDiscount: true })
                                
                                if (priceInfo.hasDiscount) {
                                  return (
                                    <div className="space-y-2">
                                      {isLocalCurrency() && (
                                        <span className="inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                                          🔥 {priceInfo.discountPercentage}% OFF
                                        </span>
                                      )}
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                        <span className="text-lg text-gray-500 line-through">
                                          {priceInfo.originalPrice}
                                        </span>
                                        <span className="text-2xl font-bold text-green-600">
                                          {priceInfo.discountedPrice}
                                        </span>
                                      </div>
                                    </div>
                                  )
                                } else {
                                  return (
                                    <span className="text-2xl font-bold text-primary">
                                      {priceInfo.discountedPrice}
                                    </span>
                                  )
                                }
                              } else {
                                return <span className="text-2xl font-bold text-green-600">Free</span>
                              }
                            })()}
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="text-center space-y-2">
                            <button
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowPaymentModal(true);
                              }}
                              className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                              aria-label={`Enroll in ${course.title}`}
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <span>Enroll Now</span>
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
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Course Payment Modal */}
        {selectedCourse && (
          <CoursePaymentModal
            isOpen={showPaymentModal}
            onClose={() => {
              setShowPaymentModal(false);
              setSelectedCourse(null);
            }}
            course={selectedCourse}
          />
        )}
      </div>
    </section>
  );
}

export default CoursesPageContent;
