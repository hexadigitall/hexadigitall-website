"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchWithTimeout } from '@/lib/timeout-utils'
import { useCurrency } from '@/contexts/CurrencyContext'
import CoursePaymentModal from '@/components/courses/CoursePaymentModal'

interface Course {
  _id: string
  title: string
  slug: { current: string }
  mainImage: string
  description: string
  duration: string
  level: string
  instructor: string
  courseType?: 'self-paced' | 'live'
  // Legacy pricing
  nairaPrice?: number
  dollarPrice?: number
  price?: number
  // Live course pricing
  hourlyRateUSD?: number
  hourlyRateNGN?: number
  schedulingOptions?: {
    minHoursPerSession: number
    maxHoursPerSession: number
    minSessionsPerWeek: number
    maxSessionsPerWeek: number
    defaultHours: number
  }
  featured: boolean
}

interface FeaturedCoursesProps {
  className?: string
}

function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse" aria-hidden="true">
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
  )
}

function CourseCard({ course, onEnrollClick }: { course: Course; onEnrollClick: (course: Course) => void }) {
  const fallbackImage = '/digitall_partner.png'
  const { formatPriceWithDiscount, isLocalCurrency } = useCurrency()
  
  // Emergency fallback for invalid course data
  if (!course) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-xl p-6 text-center">
        <p className="text-gray-600">Invalid course data</p>
      </div>
    )
  }
  
  const safeTitle = course.title || 'Untitled Course'
  const safeSlug = course.slug?.current || '#'
  const safeImage = course.mainImage || fallbackImage
  const isLiveCourse = course.courseType === 'live'
  
  // Calculate display price based on course type
  const getDisplayPrice = (): {
    price: number;
    isLive: true;
    currency: string;
  } | {
    priceInfo: { hasDiscount: boolean; discountPercentage?: number; originalPrice: string; discountedPrice: string; };
    isLive: false;
  } | null => {
    if (isLiveCourse && course.hourlyRateUSD && course.hourlyRateNGN) {
      // Show starting price for live courses (1 hour per week default)
      const baseHourlyRate = isLocalCurrency() ? course.hourlyRateNGN : course.hourlyRateUSD
      const defaultHours = course.schedulingOptions?.defaultHours || 1
      const monthlyPrice = baseHourlyRate * defaultHours * 4 // 4 weeks per month
      
      return {
        price: monthlyPrice,
        isLive: true as const,
        currency: isLocalCurrency() ? 'NGN' : 'USD'
      }
    } else if (course.dollarPrice) {
      // Legacy self-paced pricing
      const priceInfo = formatPriceWithDiscount(course.dollarPrice, { applyNigerianDiscount: true })
      return {
        priceInfo,
        isLive: false as const
      }
    } else if (course.nairaPrice || course.price) {
      // Convert NGN to USD first, then format in selected currency
      const nairaAmount = course.nairaPrice || course.price || 0;
      const usdEquivalent = nairaAmount / 1650;
      const priceInfo = formatPriceWithDiscount(usdEquivalent, { applyNigerianDiscount: true })
      return {
        priceInfo,
        isLive: false as const
      }
    }
    
    return null
  }

  const displayPrice = getDisplayPrice()
  
  return (
    <article 
      className="course-card rounded-2xl overflow-hidden hover:scale-105 hover:shadow-2xl transition-all duration-300 group relative"
      role="article"
      aria-labelledby={`course-${course._id}-title`}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={safeImage}
          alt={`${safeTitle} course preview`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={false}
          loading="lazy"
        />
        <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
          {course.level || 'Course'}
        </div>
        {isLiveCourse && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Live Sessions
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 
          id={`course-${course._id}-title`}
          className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-primary transition-colors"
        >
          {safeTitle}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3" aria-describedby={`course-${course._id}-title`}>
          {course.description || 'Course description coming soon...'}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center" aria-label={`Course duration: ${course.duration}`}>
            <svg 
              className="w-4 h-4 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{course.duration}</span>
          </div>
          
          {course.instructor && (
            <div className="flex items-center" aria-label={`Instructor: ${course.instructor}`}>
              <svg 
                className="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{course.instructor}</span>
            </div>
          )}
        </div>
        
        {/* Price Section - Enhanced for live courses */}
        <div className="mb-4">
          {displayPrice ? (
            displayPrice.isLive ? (
              <div className="space-y-1">
                <div className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat(displayPrice.currency === 'NGN' ? 'en-NG' : 'en-US', {
                    style: 'currency',
                    currency: displayPrice.currency,
                    minimumFractionDigits: 0
                  }).format(displayPrice.price)}
                  <span className="text-sm font-normal text-gray-600">/month</span>
                </div>
                <p className="text-xs text-gray-500">
                  Starting from 1 hour/week • Flexible scheduling
                </p>
              </div>
            ) : displayPrice.priceInfo ? (
              displayPrice.priceInfo.hasDiscount ? (
                <div className="space-y-2">
                  {isLocalCurrency() && (
                    <span className="inline-block bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                      🔥 {displayPrice.priceInfo.discountPercentage}% OFF
                    </span>
                  )}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <span className="text-lg text-gray-500 line-through">
                      {displayPrice.priceInfo.originalPrice}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {displayPrice.priceInfo.discountedPrice}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-2xl font-bold text-primary">
                  {displayPrice.priceInfo.discountedPrice}
                </span>
              )
            ) : null
          ) : (
            <span className="text-2xl font-bold text-green-600">Free</span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="text-center space-y-2">
          <button
            onClick={() => onEnrollClick(course)}
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`${isLiveCourse ? 'Start live sessions for' : 'Enroll in'} ${safeTitle}`}
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>{isLiveCourse ? 'Start Live Sessions' : 'Enroll Now'}</span>
          </button>
          
          <Link
            href={`/courses/${safeSlug}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={`Learn more about ${safeTitle}`}
          >
            <span>Learn More</span>
            <svg 
              className="w-4 h-4 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function FeaturedCourses({ className = "" }: FeaturedCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    async function fetchFeaturedCourses() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 [API] Fetching featured courses via API route...')
        
        const response = await fetchWithTimeout('/api/featured-courses', {
          timeout: 15000, // 15 second timeout
          retries: 2 // Retry twice on failure
        })
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`)
        }
        
        const apiData = await response.json()
        console.log('🎆 [API] Featured courses response:', apiData)
        
        if (!apiData.success) {
          throw new Error(apiData.error || 'API returned error status')
        }
        
        const data = apiData.courses
        console.log('🎆 [API] Featured courses data:', data)
        console.log('🎆 [API] Data length:', data?.length || 0)
        
        if (!data) {
          console.warn('⚠️ No data returned from Sanity')
          setError('No featured courses found. Check Sanity configuration.')
          return
        }
        
        if (!Array.isArray(data)) {
          console.warn('⚠️ Data is not an array:', typeof data, data)
          setError('Invalid data format received from Sanity.')
          return
        }
        
        if (data.length === 0) {
          console.warn('⚠️ Empty data array received')
          setError('No featured courses available.')
          return
        }
        
        console.log('✅ [SUCCESS] Setting courses:', data.length, 'courses')
        
        // Debug: Log pricing data for featured courses
        data?.forEach(course => {
          console.log(`🎆 [FEATURED PRICING DEBUG] ${course.title}:`, {
            courseType: course.courseType,
            nairaPrice: course.nairaPrice,
            dollarPrice: course.dollarPrice,
            price: course.price,
            hourlyRateUSD: course.hourlyRateUSD,
            hourlyRateNGN: course.hourlyRateNGN
          });
        });
        
        setCourses(data)
      } catch (err) {
        console.error('💥 Error fetching featured courses:', err)
        
        let errorMessage = 'Failed to load featured courses. Please try again later.'
        
        if (err instanceof Error) {
          console.error('Error details:', {
            name: err.name,
            message: err.message,
            stack: err.stack,
          })
          
          if (err.message.includes('projectId')) {
            errorMessage = 'Sanity configuration error. Please check environment variables.'
          } else if (err.message.includes('fetch')) {
            errorMessage = 'Network error. Please check your connection and try again.'
          }
        }
        
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedCourses()
  }, [])

  if (error) {
    return (
      <section 
        className={`py-16 bg-gray-50 ${className}`}
        aria-labelledby="featured-courses-error"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 id="featured-courses-error" className="text-3xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto" role="alert">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-800">{error}</p>
              </div>
            </div>
            <Link
              href="/courses"
              className="inline-block mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>
    )
  }

  if (courses.length === 0 && !loading) {
    return (
      <section 
        className={`py-16 bg-gray-50 ${className}`}
        aria-labelledby="no-featured-courses"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 id="no-featured-courses" className="text-3xl font-bold text-gray-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-gray-600 mb-8">
              No featured courses available at the moment. Check back soon for new offerings!
            </p>
            <Link
              href="/courses"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section 
      className={`relative py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 overflow-hidden ${className}`}
      aria-labelledby="featured-courses-heading"
      role="region"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 id="featured-courses-heading" className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Discover our most popular courses with flexible pricing options - from self-paced learning to personalized live sessions
          </p>
          
          {/* Temporary Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 rounded-lg text-left text-sm">
              <p><strong>Debug Info:</strong></p>
              <p>Project ID: {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '❌ Missing'}</p>
              <p>Dataset: {process.env.NEXT_PUBLIC_SANITY_DATASET || '❌ Missing'}</p>
              <p>Courses count: {courses.length}</p>
              <p>Loading: {loading.toString()}</p>
              <p>Error: {error || 'None'}</p>
            </div>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            Array.from({ length: 4 }, (_, index) => (
              <CourseCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : courses && courses.length > 0 ? (
            courses.map((course) => {
              try {
                return (
                  <CourseCard 
                    key={course._id || `course-${Math.random()}`} 
                    course={course} 
                    onEnrollClick={(course) => {
                      setSelectedCourse(course)
                      setShowPaymentModal(true)
                    }}
                  />
                )
              } catch (cardError) {
                console.error('Error rendering course card:', cardError, course)
                return (
                  <div key={course._id || `error-${Math.random()}`} className="bg-red-50 border border-red-200 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-red-800 mb-2">
                      {course.title || 'Course Title Missing'}
                    </h3>
                    <p className="text-red-600 text-sm mb-4">
                      Error rendering course card. Check console for details.
                    </p>
                    {(course.nairaPrice || course.hourlyRateNGN) && (
                      <p className="text-primary font-bold">
                        {course.courseType === 'live' && course.hourlyRateNGN
                          ? `₦${course.hourlyRateNGN.toLocaleString()}/hour`
                          : `₦${(course.nairaPrice || 0).toLocaleString()}`
                        }
                      </p>
                    )}
                  </div>
                )
              }
            })
          ) : (
            <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-xl p-8 text-center">
              <h3 className="text-lg font-bold text-yellow-800 mb-2">
                No Featured Courses Found
              </h3>
              <p className="text-yellow-700 text-sm mb-4">
                Courses: {courses?.length || 0} | Loading: {loading.toString()}
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>

        {/* View All Courses CTA */}
        {courses.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-label="View all available courses"
            >
              <span>View All Courses</span>
              <svg 
                className="w-5 h-5 ml-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
      
      {/* Course Payment Modal */}
      {selectedCourse && (
        <CoursePaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedCourse(null)
          }}
          course={selectedCourse}
        />
      )}
    </section>
  )
}
