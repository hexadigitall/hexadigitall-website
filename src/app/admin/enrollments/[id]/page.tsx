'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import AdminNavbar from '@/components/admin/AdminNavbar'

interface Enrollment {
  _id: string
  courseId?: {
    _id: string
    title: string
    slug?: { current: string }
    price?: {
      usd?: number
      ngn?: number
    }
  }
  studentId?: {
    _id: string
    username: string
    email: string
  }
  teacherId?: {
    _id: string
    username: string
    name?: string
    email: string
  }
  studentName: string
  studentEmail: string
  studentPhone?: string
  courseType: string
  paymentStatus: string
  enrolledAt?: string
  isActive?: boolean
  monthlyAmount?: number
  totalHours?: number
  goals?: string
  experience?: string
  hoursPerWeek?: number
  sessionFormat?: string
  preferredSchedule?: string
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-700',
  active: 'bg-blue-100 text-blue-800',
  cancelled: 'bg-gray-100 text-gray-700',
}

export default function EnrollmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      try {
        const response = await fetch('/api/admin/auth', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          router.push('/admin/login')
          return
        }

        fetchEnrollment(token)
      } catch {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router, id])

  const fetchEnrollment = async (token: string) => {
    try {
      const response = await fetch(`/api/admin/enrollments?enrollmentId=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success && data.enrollments.length > 0) {
        setEnrollment(data.enrollments[0])
      }
    } catch (error) {
      console.error('Failed to fetch enrollment:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              href="/admin/enrollments"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 inline-block"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
          </div>
        </header>
        <AdminNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Enrollment not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/enrollments"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Enrollment Details</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      <AdminNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Course Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-start space-x-3">
            <AcademicCapIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{enrollment.courseId?.title || 'Unknown Course'}</h2>
              <p className="text-sm text-gray-500 mt-1">Course Type: {enrollment.courseType === 'live' ? '🎓 Live Sessions' : '📚 Self-Paced'}</p>
            </div>
          </div>
        </div>

        {/* Student Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Name</label>
              <p className="text-sm text-gray-900 mt-1">{enrollment.studentName}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Email</label>
              <p className="text-sm text-gray-900 mt-1">
                <a href={`mailto:${enrollment.studentEmail}`} className="text-primary hover:underline">
                  {enrollment.studentEmail}
                </a>
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Phone</label>
              <p className="text-sm text-gray-900 mt-1">
                {enrollment.studentPhone ? (
                  <a href={`tel:${enrollment.studentPhone}`} className="text-primary hover:underline">
                    {enrollment.studentPhone}
                  </a>
                ) : (
                  '—'
                )}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Experience Level</label>
              <p className="text-sm text-gray-900 mt-1 capitalize">{enrollment.experience || '—'}</p>
            </div>
          </div>
        </div>

        {/* Learning Goals */}
        {enrollment.goals && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Goals</h2>
            <p className="text-sm text-gray-900 whitespace-pre-wrap">{enrollment.goals}</p>
          </div>
        )}

        {/* Course Details (Live Courses) */}
        {enrollment.courseType === 'live' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Course Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase">Hours per Week</label>
                <p className="text-sm text-gray-900 mt-1">{enrollment.hoursPerWeek || '—'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase">Total Hours per Month</label>
                <p className="text-sm text-gray-900 mt-1">{enrollment.totalHours || '—'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase">Session Format</label>
                <p className="text-sm text-gray-900 mt-1 capitalize">{enrollment.sessionFormat || '—'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase">Preferred Schedule</label>
                <p className="text-sm text-gray-900 mt-1">{enrollment.preferredSchedule || '—'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Payment Status</label>
              <div className="mt-1">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    statusColors[enrollment.paymentStatus] || 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {enrollment.paymentStatus}
                </span>
              </div>
            </div>
            {enrollment.monthlyAmount && (
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase">Monthly Amount</label>
                <p className="text-sm text-gray-900 mt-1">${(enrollment.monthlyAmount / 100).toFixed(2)}</p>
              </div>
            )}
            {enrollment.courseId?.price?.usd && (
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase">Course Price (USD)</label>
                <p className="text-sm text-gray-900 mt-1">${enrollment.courseId.price.usd}</p>
              </div>
            )}
            {enrollment.courseId?.price?.ngn && (
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase">Course Price (NGN)</label>
                <p className="text-sm text-gray-900 mt-1">₦{enrollment.courseId.price.ngn.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Enrollment Timeline */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
          <div className="space-y-2 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Enrolled At</label>
              <p className="text-gray-900 mt-1">
                {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleString() : '—'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Status</label>
              <p className="text-gray-900 mt-1">{enrollment.isActive ? '✅ Active' : '⏸️ Inactive'}</p>
            </div>
          </div>
        </div>

        {/* Teacher Assignment */}
        {enrollment.teacherId && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Assigned Teacher</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase">Teacher Name</label>
                <p className="text-sm text-gray-900 mt-1">{enrollment.teacherId.name || enrollment.teacherId.username}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase">Email</label>
                <p className="text-sm text-gray-900 mt-1">
                  <a href={`mailto:${enrollment.teacherId.email}`} className="text-primary hover:underline">
                    {enrollment.teacherId.email}
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
