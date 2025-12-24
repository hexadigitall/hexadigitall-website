"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { fetchWithTimeout } from '@/lib/timeout-utils'
import CoursePaymentModal from '@/components/courses/CoursePaymentModal'
import CourseCard, { Course } from '@/components/courses/CourseCard' 

interface FeaturedCoursesProps {
  className?: string
  id?: string
}

function CourseCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse" aria-hidden="true">
      <div className="aspect-video bg-gray-200" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-200 rounded w-full" />
      </div>
    </div>
  )
}

export default function FeaturedCourses({ className = "", id }: FeaturedCoursesProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  useEffect(() => {
    async function fetchFeaturedCourses() {
      try {
        setLoading(true)
        // INCREASED TIMEOUT to 25s to fix your log errors
        const response = await fetchWithTimeout('/api/featured-courses', { timeout: 25000, retries: 2 })
        
        if (!response.ok) throw new Error('Failed to fetch')
        
        const apiData = await response.json()
        if (apiData.success && Array.isArray(apiData.courses)) {
          setCourses(apiData.courses)
        } else {
          setError('No courses available.')
        }
      } catch (err) {
        console.error('FeaturedCourses Error:', err)
        setError('Failed to load courses.')
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedCourses()
  }, [])

  if (loading) return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1,2,3].map(i => <CourseCardSkeleton key={i}/>)}
        </div>
      </div>
    </section>
  )

  if (error || courses.length === 0) return null

  return (
    <section id={id} className={`relative py-16 md:py-24 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Featured Courses
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Discover our most popular courses with flexible pricing options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard 
              key={course._id} 
              course={course} 
              onEnrollClick={(c) => { 
                setSelectedCourse(c); 
                setShowPaymentModal(true); 
              }}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/courses" className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
            View All Courses
          </Link>
        </div>
      </div>
      
      {selectedCourse && (
        <CoursePaymentModal
          isOpen={showPaymentModal}
          onClose={() => { setShowPaymentModal(false); setSelectedCourse(null); }}
          course={{
            ...selectedCourse,
            description: selectedCourse.description ?? "",
            courseType:
              selectedCourse.courseType === "self-paced" ||
              selectedCourse.courseType === "live"
                ? selectedCourse.courseType
                : undefined,
          }}
        />
      )}
    </section>
  )
}