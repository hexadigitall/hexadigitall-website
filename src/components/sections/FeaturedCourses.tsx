"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/client'

interface Course {
  _id: string
  title: string
  slug: { current: string }
  mainImage: string
  description: string
  duration: string
  level: string
  instructor: string
  nairaPrice: number
  dollarPrice: number
  featured: boolean
}

interface FeaturedCoursesProps {
  className?: string
}

const FEATURED_COURSES_QUERY = `*[_type == "course" && featured == true] | order(_createdAt desc)[0...4] {
  _id,
  title,
  slug,
  "mainImage": mainImage.asset->url,
  description,
  duration,
  level,
  instructor,
  nairaPrice,
  dollarPrice,
  featured
}`

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

function CourseCard({ course }: { course: Course }) {
  const fallbackImage = '/digitall_partner.png'
  
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
  
  return (
    <article 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 focus-within:shadow-xl"
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
        
        {/* Price Section */}
        <div className="mb-4">
          <div className="text-left" aria-label={`Course price: ${course.nairaPrice || 'Free'} Naira or ${course.dollarPrice || 'Free'} dollars`}>
            {course.nairaPrice ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                <span className="text-2xl font-bold text-primary">
                  <span className="text-lg">₦</span>{course.nairaPrice.toLocaleString()}
                </span>
                {course.dollarPrice && (
                  <span className="text-sm text-gray-500">${course.dollarPrice}</span>
                )}
              </div>
            ) : course.dollarPrice ? (
              <span className="text-2xl font-bold text-primary">${course.dollarPrice}</span>
            ) : (
              <span className="text-2xl font-bold text-green-600">Free</span>
            )}
          </div>
        </div>
        
        {/* Action Button */}
        <div className="text-center">
          <Link
            href={`/courses/${safeSlug}`}
            className="inline-flex items-center justify-center w-full px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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

  useEffect(() => {
    async function fetchFeaturedCourses() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 [API] Fetching featured courses via API route...')
        
        const response = await fetch('/api/featured-courses')
        
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
      className={`py-16 bg-gray-50 ${className}`}
      aria-labelledby="featured-courses-heading"
      role="region"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 id="featured-courses-heading" className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and highly-rated courses designed to advance your digital skills
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
                return <CourseCard key={course._id || `course-${Math.random()}`} course={course} />
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
                    {course.nairaPrice && (
                      <p className="text-primary font-bold">
                        ₦{course.nairaPrice.toLocaleString()}
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
    </section>
  )
}
