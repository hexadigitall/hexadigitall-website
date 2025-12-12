'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/admin/Breadcrumbs'
import AdminNavbar from '@/components/admin/AdminNavbar'
import {
  ArrowLeftIcon,
  AcademicCapIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

interface Teacher {
  _id: string
  username: string
  name?: string
  email: string
}

interface Enrollment {
  _id: string
  courseId?: {
    _id: string
    title: string
    slug: { current: string }
  }
  studentId?: {
    _id: string
    username: string
    email: string
  }
  teacherId?: Teacher
  studentName: string
  studentEmail: string
  studentPhone?: string
  courseType: string
  paymentStatus: string
  enrolledAt?: string
  isActive?: boolean
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-700',
  active: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-700',
}

export default function AdminEnrollmentsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [assigningId, setAssigningId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      const session = localStorage.getItem('admin_session')

      if (!token || !session) {
        router.push('/admin/login')
        return
      }

      try {
        const res = await fetch('/api/admin/auth', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          setIsAuthenticated(true)
          await Promise.all([loadEnrollments(), loadTeachers()])
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    void checkAuth()
  }, [router])

  const loadEnrollments = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const res = await fetch('/api/admin/enrollments', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setEnrollments(data.enrollments || [])
      }
    } catch (error) {
      console.error('Failed to load enrollments:', error)
    }
  }

  const loadTeachers = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        const teacherUsers = (data.users || []).filter((u: { role: string }) => u.role === 'teacher')
        setTeachers(teacherUsers)
      }
    } catch (error) {
      console.error('Failed to load teachers:', error)
    }
  }

  const handleAssignTeacher = async (enrollmentId: string, teacherId: string) => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    if (!teacherId) {
      setFeedback({ type: 'error', message: 'Please select a teacher.' })
      return
    }

    setAssigningId(enrollmentId)
    setFeedback(null)

    try {
      const res = await fetch(`/api/admin/enrollments/${enrollmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ teacherId }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: 'Teacher assigned.' })
        await loadEnrollments()
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to assign teacher.' })
      }
    } catch (error) {
      console.error('Assign teacher failed:', error)
      setFeedback({ type: 'error', message: 'Failed to assign teacher.' })
    } finally {
      setAssigningId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
                <p className="text-sm text-gray-600">Manage course enrollments and teacher assignments</p>
              </div>
            </div>
            <div className="hidden md:block">
              <Breadcrumbs
                items={[
                  { label: 'Admin', href: '/admin/dashboard' },
                  { label: 'Enrollments' },
                ]}
              />
            </div>
          </div>
        </div>
      </header>

      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {feedback && (
          <div
            className={`px-4 py-3 rounded-lg border ${
              feedback.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <AcademicCapIcon className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">All Enrollments</h2>
            </div>
            <span className="text-sm text-gray-600">{enrollments.length} total</span>
          </div>

          {enrollments.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No enrollments yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{enrollment.studentName}</div>
                        <div className="text-xs text-gray-500">{enrollment.studentEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {enrollment.courseId?.title || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {enrollment.courseType === 'live' ? '🎓 Live' : '📚 Self-paced'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            statusColors[enrollment.paymentStatus] || 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {enrollment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {enrollment.courseType === 'live' ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={enrollment.teacherId?._id || ''}
                              onChange={(e) => handleAssignTeacher(enrollment._id, e.target.value)}
                              disabled={assigningId === enrollment._id}
                              className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                            >
                              <option value="">Select teacher</option>
                              {teachers.map((t) => (
                                <option key={t._id} value={t._id}>
                                  {t.name || t.username}
                                </option>
                              ))}
                            </select>
                            {enrollment.teacherId && (
                              <div className="flex items-center space-x-1 text-xs text-gray-600">
                                <UserGroupIcon className="h-4 w-4" />
                                <span>{enrollment.teacherId.name || enrollment.teacherId.username}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
