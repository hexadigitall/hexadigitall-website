'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useHomepage } from '@/contexts/HomepageContext'
import type { WidgetItem } from '@/contexts/HomepageContext'

interface Enrollment {
  _id: string
  status: string
  courseType?: string
  enrolledAt: string
  course?: {
    _id: string
    title: string
    slug: { current: string }
    level?: string
  }
  monthlyAmount?: number
  paymentStatus?: string
}

function EnrolledView({ onLoadingChange }: { onLoadingChange: (v: boolean) => void }) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      onLoadingChange(false)
      return
    }
    fetch('/api/student/enrollments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setEnrollments(d.enrollments || [])
      })
      .catch(() => {})
      .finally(() => onLoadingChange(false))
  }, [onLoadingChange])

  const active = enrollments.filter((e) => e.status === 'active')

  return (
    <>
      {active.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">No active enrollments.</p>
          <Link
            href="/courses"
            className="inline-flex px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {active.slice(0, 3).map((e) => (
            <Link
              key={e._id}
              href={e.course?.slug?.current ? `/courses/${e.course.slug.current}/curriculum` : '#'}
              className="block p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors truncate flex-1">
                  {e.course?.title || 'Course'}
                </p>
                <span className="ml-2 inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 shrink-0">
                  {e.status}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Continue learning →</p>
            </Link>
          ))}
          {active.length > 3 && (
            <p className="text-xs text-gray-400 dark:text-slate-500 text-center pt-1">
              +{active.length - 3} more
            </p>
          )}
        </div>
      )}
    </>
  )
}

export function EnrollmentsWidget({ widget }: { widget: WidgetItem }) {
  const { userRole } = useHomepage()
  const [loading, setLoading] = useState(true)

  if (userRole !== 'student' && userRole !== 'teacher') {
    return (
      <div className="p-5 text-center">
        <p className="text-xs text-gray-400 dark:text-slate-500 mb-3">Sign in to track your enrollments.</p>
        <Link
          href="/student/login"
          className="inline-flex px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
        >
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
          {widget.title || 'My Enrollments'}
        </h3>
        <Link href="/student/dashboard" className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline">
          Dashboard
        </Link>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <EnrolledView onLoadingChange={setLoading} />
      )}
    </div>
  )
}
