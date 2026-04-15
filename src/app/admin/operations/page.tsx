'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/admin/Breadcrumbs'
import AdminNavbar from '@/components/admin/AdminNavbar'
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

type Severity = 'ok' | 'warning' | 'critical'

type OperationsPayload = {
  metrics: {
    totalStudents: number
    activeStudents: number
    totalTeachers: number
    activeTeachers: number
    totalCourses: number
    coursesWithNoTeacher: number
    activeEnrollments: number
    assessmentAttemptsTracked: number
  }
  teachers: Array<{
    _id: string
    name: string
    username: string
    email: string
    status: string
    assignedCourseCount: number
    assignedCourses: string[]
    activeStudentCount: number
  }>
  students: Array<{
    _id: string
    name: string
    username: string
    email: string
    status: string
    assignedCourseCount: number
    courses: string[]
  }>
  courses: Array<{
    _id: string
    title: string
    slug: string
    courseType: string
    assignedTeacherCount: number
    assignedTeachers: string[]
    activeStudentCount: number
  }>
  attempts: Array<{
    _id: string
    courseTitle: string
    assessmentTitle: string
    phaseLabel: string
    studentName: string
    studentEmail: string
    status: string
    scorePercent: number | null
    passed: boolean | null
    submittedAt: string | null
    startedAt: string | null
  }>
  alerts: Array<{
    key: string
    label: string
    severity: Severity
    count: number
  }>
  generatedAt: string
}

const severityStyles: Record<Severity, string> = {
  ok: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  critical: 'bg-red-50 text-red-700 border-red-100',
}

export default function AdminOperationsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [data, setData] = useState<OperationsPayload | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'teachers' | 'students' | 'courses' | 'attempts'>('teachers')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      const session = localStorage.getItem('admin_session')

      if (!token || !session) {
        router.push('/admin/login')
        return
      }

      try {
        const authRes = await fetch('/api/admin/auth', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!authRes.ok) {
          router.push('/admin/login')
          return
        }

        setIsAuthenticated(true)
        await loadOperations(token)
      } catch (err) {
        console.error('Auth check failed:', err)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    void checkAuth()
  }, [router])

  const loadOperations = async (token: string) => {
    try {
      const res = await fetch('/api/admin/operations', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const payload = await res.json()
      if (!res.ok || !payload.success) {
        throw new Error(payload.message || 'Failed to load operations data')
      }
      setData(payload)
      setError(null)
    } catch (err) {
      console.error('Operations load failed:', err)
      setError('Operations data is not available right now.')
    }
  }

  const filteredTeachers = useMemo(() => {
    if (!data) return []
    const term = search.toLowerCase().trim()
    if (!term) return data.teachers
    return data.teachers.filter(
      (teacher) =>
        teacher.name.toLowerCase().includes(term) ||
        teacher.email.toLowerCase().includes(term) ||
        teacher.assignedCourses.some((course) => course.toLowerCase().includes(term))
    )
  }, [data, search])

  const filteredStudents = useMemo(() => {
    if (!data) return []
    const term = search.toLowerCase().trim()
    if (!term) return data.students
    return data.students.filter(
      (student) =>
        student.name.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term) ||
        student.courses.some((course) => course.toLowerCase().includes(term))
    )
  }, [data, search])

  const filteredCourses = useMemo(() => {
    if (!data) return []
    const term = search.toLowerCase().trim()
    if (!term) return data.courses
    return data.courses.filter(
      (course) =>
        course.title.toLowerCase().includes(term) ||
        course.slug.toLowerCase().includes(term) ||
        course.assignedTeachers.some((teacher) => teacher.toLowerCase().includes(term))
    )
  }, [data, search])

  const filteredAttempts = useMemo(() => {
    if (!data) return []
    const term = search.toLowerCase().trim()
    if (!term) return data.attempts
    return data.attempts.filter(
      (attempt) =>
        attempt.studentName.toLowerCase().includes(term) ||
        attempt.studentEmail.toLowerCase().includes(term) ||
        attempt.courseTitle.toLowerCase().includes(term) ||
        attempt.assessmentTitle.toLowerCase().includes(term)
    )
  }, [data, search])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) return null

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
                <h1 className="text-2xl font-bold text-gray-900">Operations Console</h1>
                <p className="text-sm text-gray-600">Unified view of teacher loads, student access, course assignment, and assessment attempts.</p>
              </div>
            </div>
            <div className="hidden md:block">
              <Breadcrumbs
                items={[
                  { label: 'Admin', href: '/admin/dashboard' },
                  { label: 'Operations' },
                ]}
              />
            </div>
          </div>
        </div>
      </header>

      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {error && (
          <div className="px-4 py-3 rounded-lg border bg-red-50 border-red-200 text-red-700">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <MetricCard label="Students" value={`${data.metrics.activeStudents}/${data.metrics.totalStudents}`} icon={<UserGroupIcon className="h-5 w-5" />} />
              <MetricCard label="Teachers" value={`${data.metrics.activeTeachers}/${data.metrics.totalTeachers}`} icon={<AcademicCapIcon className="h-5 w-5" />} />
              <MetricCard label="Active Enrollments" value={String(data.metrics.activeEnrollments)} icon={<ChartBarIcon className="h-5 w-5" />} />
              <MetricCard label="Assessment Attempts" value={String(data.metrics.assessmentAttemptsTracked)} icon={<ChartBarIcon className="h-5 w-5" />} />
            </div>

            <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <ExclamationTriangleIcon className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-semibold text-gray-900">Operational Alerts</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {data.alerts.map((alert) => (
                  <div key={alert.key} className={`rounded-lg border px-4 py-3 ${severityStyles[alert.severity]}`}>
                    <p className="text-sm font-medium">{alert.label}</p>
                    <p className="text-xl font-bold mt-1">{alert.count}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex gap-2 flex-wrap">
                  {[
                    { key: 'teachers', label: 'Teachers' },
                    { key: 'students', label: 'Students' },
                    { key: 'courses', label: 'Courses' },
                    { key: 'attempts', label: 'Attempts' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key as 'teachers' | 'students' | 'courses' | 'attempts')}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                        activeTab === tab.key ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search current tab..."
                  className="w-full sm:w-72 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div className="overflow-x-auto">
                {activeTab === 'teachers' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Courses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Students</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTeachers.map((teacher) => (
                        <tr key={teacher._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                            <div className="text-xs text-gray-500">{teacher.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{teacher.status}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{teacher.assignedCourseCount}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{teacher.activeStudentCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'students' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Courses</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            <div className="text-xs text-gray-500">{student.email}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.status}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.assignedCourseCount}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                            <div className="line-clamp-2">{student.courses.join(', ') || '—'}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'courses' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Teachers</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active Students</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCourses.map((course) => (
                        <tr key={course._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                            <div className="text-xs text-gray-500">/{course.slug}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{course.courseType}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{course.assignedTeacherCount}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{course.activeStudentCount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {activeTab === 'attempts' && (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAttempts.map((attempt) => (
                        <tr key={attempt._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{attempt.studentName}</div>
                            <div className="text-xs text-gray-500">{attempt.studentEmail || 'No email snapshot'}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{attempt.phaseLabel}</div>
                            <div className="text-xs text-gray-500">{attempt.courseTitle}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{attempt.status}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {attempt.scorePercent === null ? 'Pending' : `${attempt.scorePercent}%`}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="text-primary">{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
