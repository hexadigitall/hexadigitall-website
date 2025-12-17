'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/sanity/imageUrlBuilder'
import {
  ArrowLeftIcon,
  AcademicCapIcon,
  UsersIcon,
  ArrowDownTrayIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

interface Course {
  _id: string
  title: string
  slug: { current: string }
  description?: string
  level?: string
  courseType?: string
  mainImage?: { asset: { _ref: string } }
  contentPdf?: { asset: { _ref: string; url?: string } }
  roadmapPdf?: { asset: { _ref: string; url?: string } }
  enrollmentCount?: number
  activeEnrollments?: Array<{
    _id: string
    studentName: string
    studentEmail: string
    status: string
  }>
}

interface Student {
  _id: string
  studentName: string
  studentEmail: string
  studentPhone?: string
  status: string
  enrolledAt: string
  experience?: string
  goals?: string
  course?: {
    _id: string
    title: string
    slug: { current: string }
    level?: string
  }
}

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [teacher, setTeacher] = useState<{ username: string; name?: string } | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      const session = localStorage.getItem('admin_session')
      if (!token || !session) {
        return router.push('/teacher/login')
      }

      try {
        const res = await fetch('/api/admin/auth', { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) return router.push('/teacher/login')
        
        const data = await res.json()
        if (!data.role || (data.role !== 'teacher' && data.role !== 'admin')) {
          return router.push('/teacher/login')
        }

        const sessionData = JSON.parse(session)
        setTeacher({ username: sessionData.username, name: data.name })

        // Fetch courses and students
        await Promise.all([fetchCourses(token), fetchStudents(token)])
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/teacher/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchCourses = async (token: string) => {
    try {
      const res = await fetch('/api/teacher/courses', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const fetchStudents = async (token: string) => {
    try {
      const res = await fetch('/api/teacher/students', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setStudents(data.students || [])
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_session')
    // Clear cookie used by middleware
    document.cookie = 'admin_token=; Path=/; Max-Age=0; SameSite=Lax'
    router.push('/teacher/login')
  }

  const downloadPdf = (pdfAsset?: { asset: { url?: string; _ref: string } }, filename?: string) => {
    if (!pdfAsset?.asset?.url && !pdfAsset?.asset?._ref) return
    
    // Construct Sanity file URL if not provided
    const url = pdfAsset.asset.url || `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${pdfAsset.asset._ref.replace('file-', '').replace('-pdf', '.pdf')}`
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'download.pdf'
    a.target = '_blank'
    a.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Teacher Dashboard
              </h1>
              {teacher?.name && (
                <span className="text-sm text-gray-600">Welcome, {teacher.name}</span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<AcademicCapIcon className="h-6 w-6" />} title="Courses Taught" value={courses.length} color="blue" />
          <StatCard icon={<UsersIcon className="h-6 w-6" />} title="Total Students" value={students.length} color="purple" />
          <StatCard icon={<UsersIcon className="h-6 w-6" />} title="Active Enrollments" value={students.filter(s => s.status === 'active').length} color="green" />
        </div>

        {/* My Courses */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Courses</h2>
          {courses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No courses assigned yet. Contact admin to get assigned.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {course.mainImage && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={urlFor(course.mainImage).width(600).height(400).url()}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.title}</h3>
                        {course.level && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                            {course.level}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {course.contentPdf && (
                        <button
                          onClick={() => downloadPdf(course.contentPdf, `${course.title}-content.pdf`)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Download Course Content
                        </button>
                      )}
                      {course.roadmapPdf && (
                        <button
                          onClick={() => downloadPdf(course.roadmapPdf, `${course.title}-roadmap.pdf`)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Download Roadmap
                        </button>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">{course.enrollmentCount || 0}</span> enrolled students
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* My Students */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Students</h2>
          {students.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No students enrolled yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{student.studentName}</p>
                            <p className="text-xs text-gray-500">{student.studentEmail}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{student.course?.title || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(student.enrolledAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className={`p-2 rounded-lg ${colors[color] || colors.blue} text-white`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
