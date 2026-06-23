'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { client } from '@/sanity/client'
import { useHomepage } from '@/contexts/HomepageContext'
import type { WidgetItem } from '@/contexts/HomepageContext'

interface Course {
  _id: string
  title: string
  slug: { current: string }
  level?: string
}

export function TrackedCoursesWidget({ widget }: { widget: WidgetItem }) {
  const { userRole } = useHomepage()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userRole === 'student') {
      const token = localStorage.getItem('admin_token')
      if (token) {
        fetch('/api/student/enrollments', {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.json())
          .then((d) => {
            if (d.success) {
              const enrolled = (d.enrollments || [])
                .map((e: any) => e.course)
                .filter(Boolean)
              setCourses(enrolled.slice(0, 3))
            }
          })
          .catch(() => {})
          .finally(() => setLoading(false))
        return
      }
    }

    client
      .fetch<Course[]>(`*[_type == "course"]{_id, title, slug, level} | order(_createdAt desc)[0...4]`)
      .then(setCourses)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userRole])

  if (loading) {
    return (
      <div className="p-5 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
          {widget.title || 'Tracked Courses'}
        </h3>
        <Link href="/courses" className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline">
          Browse all
        </Link>
      </div>
      {courses.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">No courses yet.</p>
          <Link
            href="/courses"
            className="inline-flex px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {courses.map((c) => (
            <Link
              key={c._id}
              href={`/courses/${c.slug.current}`}
              className="block p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors truncate flex-1">
                  {c.title}
                </p>
                {c.level && (
                  <span className="ml-2 text-[10px] font-medium text-gray-400 dark:text-slate-500 uppercase shrink-0">
                    {c.level}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">View course →</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
