'use client'

import { useEffect, useRef, useState } from 'react'
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
  CameraIcon,
  ClipboardDocumentIcon,
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

interface AssessmentQuickCopyPanel {
  courseTitle: string
  courseSlug: string
  assessments: Array<{
    slug: string
    title: string
    phaseLabel: string
    relativeUrl: string
  }>
}

interface AssessmentAttemptSnapshot {
  _id: string
  courseSlug: string
  courseTitle: string
  assessmentSlug: string
  assessmentTitle: string
  phaseLabel: string
  status: 'in_progress' | 'submitted' | 'expired'
  scorePercent?: number
  passed?: boolean
  startedAt: string
  submittedAt?: string
  studentNameSnapshot?: string
  studentEmailSnapshot?: string
  resultCode?: string
}

export default function TeacherDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [teacher, setTeacher] = useState<{ username: string; name?: string } | null>(null)
  const [sessionRole, setSessionRole] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [assessmentQuickCopyPanels, setAssessmentQuickCopyPanels] = useState<AssessmentQuickCopyPanel[]>([])
  const [assessmentAttempts, setAssessmentAttempts] = useState<AssessmentAttemptSnapshot[]>([])
  const [copyMessage, setCopyMessage] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

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
        setSessionRole(data.role)

        const sessionData = JSON.parse(session)
        setTeacher({ username: sessionData.username, name: data.name || sessionData.name })
        setPhotoUrl(data.profilePhotoUrl || null)

        // Fetch courses and students
        await Promise.all([fetchCourses(token), fetchStudents(token), fetchAssessments(token)])
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

  const fetchAssessments = async (token: string) => {
    try {
      const res = await fetch('/api/teacher/assessments', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAssessmentQuickCopyPanels(data.quickCopyPanels || [])
        setAssessmentAttempts(data.attempts || [])
      }
    } catch (error) {
      console.error('Failed to fetch teacher assessment data:', error)
    }
  }

  const copyAssessmentLink = async (relativeUrl: string) => {
    const absoluteUrl = `${window.location.origin}${relativeUrl}`
    try {
      await navigator.clipboard.writeText(absoluteUrl)
      setCopyMessage('Assessment link copied.')
      setTimeout(() => setCopyMessage(null), 2000)
    } catch {
      setCopyMessage('Failed to copy. Copy manually from browser URL.')
      setTimeout(() => setCopyMessage(null), 2500)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_session')
    // Clear cookie used by middleware
    document.cookie = 'admin_token=; Path=/; Max-Age=0; SameSite=Lax'
    router.push('/teacher/login')
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const token = localStorage.getItem('admin_token')
    if (!token) return
    setPhotoUploading(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)
      const res = await fetch('/api/user/profile-photo', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setPhotoUrl(data.url)
      } else {
        alert(data.error || 'Upload failed. Please try again.')
      }
    } catch {
      alert('Upload failed. Please try again.')
    } finally {
      setPhotoUploading(false)
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
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
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    )
  }

  const teacherDisplayName = teacher?.name || teacher?.username || 'Teacher'

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-slate-950">

      {/* Profile hero */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 dark:from-slate-950 dark:via-teal-950 dark:to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white dark:bg-slate-900/5" />
          <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-white dark:bg-slate-900/5" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white dark:bg-slate-900/[0.03] -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">

            {/* Avatar — click to upload */}
            <div
              className="relative group shrink-0 cursor-pointer"
              title="Click to change profile photo"
              onClick={() => !photoUploading && photoInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-900/15 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl overflow-hidden">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt={teacherDisplayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white select-none">
                    {teacherDisplayName.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 bg-black/30 ${
                  photoUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {photoUploading
                    ? <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    : <CameraIcon className="h-7 w-7 text-white/90" />}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-400 rounded-full border-2 border-teal-900 shadow" />
            </div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoUpload}
            />

            {/* Name & role */}
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-none">
                {teacherDisplayName}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white dark:bg-slate-900/20 text-white border border-white/20 backdrop-blur-sm">
                  Instructor
                </span>
                {teacher?.username && (
                  <span className="text-sm text-teal-300">@{teacher.username}</span>
                )}
              </div>
            </div>

            <div className="flex-1 hidden sm:block" />

            {sessionRole === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/15 backdrop-blur-sm transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium border border-white/15 backdrop-blur-sm transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Sign out
            </button>

            {/* Inline hero stats */}
            <div className="flex items-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-white">{courses.length}</p>
                <p className="text-xs text-teal-300 uppercase tracking-widest mt-0.5">Courses</p>
              </div>
              <div className="h-10 w-px bg-white dark:bg-slate-900/20" />
              <div>
                <p className="text-3xl font-bold text-white">{students.length}</p>
                <p className="text-xs text-teal-300 uppercase tracking-widest mt-0.5">Students</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="sm:hidden px-4 pt-4">
        {sessionRole === 'admin' && (
          <Link
            href="/admin/dashboard"
            className="mb-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 text-sm font-medium border border-gray-200 dark:border-slate-700 shadow-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Admin
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300 text-sm font-medium border border-gray-200 dark:border-slate-700 shadow-sm"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          Sign out
        </button>
      </div>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<AcademicCapIcon className="h-5 w-5" />} title="Courses Taught" value={courses.length} color="teal" />
          <StatCard icon={<UsersIcon className="h-5 w-5" />} title="Total Students" value={students.length} color="blue" />
          <StatCard icon={<UsersIcon className="h-5 w-5" />} title="Active Enrollments" value={students.filter(s => s.status === 'active').length} color="purple" />
        </div>

        {/* My Courses */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">My Courses</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{courses.length} course{courses.length !== 1 ? 's' : ''} assigned</p>
          </div>
          {courses.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AcademicCapIcon className="h-8 w-8 text-teal-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">No courses assigned</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Contact admin to get assigned to courses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {course.mainImage ? (
                    <div className="relative h-44 w-full">
                      <Image
                        src={urlFor(course.mainImage).width(600).height(400).url()}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-4">
                        {course.level && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-white dark:bg-slate-900/90 dark:bg-slate-700 text-gray-800 dark:text-gray-200 dark:text-slate-200 dark:text-slate-100 capitalize">
                            {course.level}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-16 bg-gradient-to-r from-teal-600 to-cyan-600 relative">
                      <div className="absolute bottom-3 left-4">
                        {course.level && (
                          <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-white dark:bg-slate-900/20 text-white capitalize">
                            {course.level}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100 mb-2">{course.title}</h3>
                    {course.description && (
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2">{course.description}</p>
                    )}
                    <div className="space-y-2 mb-4">
                      {course.contentPdf && (
                        <button
                          onClick={() => downloadPdf(course.contentPdf, `${course.title}-content.pdf`)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors text-xs font-semibold"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Download Course Content
                        </button>
                      )}
                      {course.roadmapPdf && (
                        <button
                          onClick={() => downloadPdf(course.roadmapPdf, `${course.title}-roadmap.pdf`)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-50 text-teal-700 rounded-xl hover:bg-teal-100 transition-colors text-xs font-semibold border border-teal-100"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                          Download Roadmap
                        </button>
                      )}
                    </div>
                    <div className="pt-3 border-t border-gray-100 dark:border-slate-700">
                      <p className="text-xs text-gray-400 dark:text-slate-400">
                        <span className="font-semibold text-gray-700 dark:text-slate-300">{course.enrollmentCount || 0}</span> enrolled students
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
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">My Students</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              {students.filter(s => s.status === 'active').length} active · {students.length} total
            </p>
          </div>
          {students.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">No students yet</h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Students will appear here once they enroll in your courses.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-700">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Course</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Enrolled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {students.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-teal-700">
                                {student.studentName?.charAt(0)?.toUpperCase() || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{student.studentName}</p>
                              <p className="text-xs text-gray-400 dark:text-slate-400">{student.studentEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{student.course?.title || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                            student.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-slate-400'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
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

        {/* Assessment Quick Copy */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Phase Assessment Links</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
              Quick-copy URLs for your assigned course assessments
            </p>
          </div>

          {copyMessage && (
            <div className="mb-4 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm text-teal-800">
              {copyMessage}
            </div>
          )}

          {assessmentQuickCopyPanels.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 text-center shadow-sm text-gray-500 dark:text-slate-400">
              No configured assessments found for your assigned courses.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {assessmentQuickCopyPanels.map((panel) => (
                <div key={panel.courseSlug} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-slate-100">{panel.courseTitle}</h3>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">/{panel.courseSlug}</p>
                  <div className="mt-4 space-y-2">
                    {panel.assessments.map((assessment) => (
                      <div key={assessment.slug} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 dark:border-slate-700 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{assessment.phaseLabel}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{assessment.title}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyAssessmentLink(assessment.relativeUrl)}
                          className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 hover:bg-teal-100"
                        >
                          <ClipboardDocumentIcon className="h-4 w-4" />
                          Copy URL
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Assessment Attempts */}
        <section>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Assessment Attempts</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Student attempt status and score snapshots</p>
          </div>

          {assessmentAttempts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 text-center shadow-sm text-gray-500 dark:text-slate-400">
              No assessment attempts yet.
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-slate-700">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Student</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Assessment</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Score</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                    {assessmentAttempts.slice(0, 120).map((attempt) => (
                      <tr key={attempt._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{attempt.studentNameSnapshot || 'Unknown Student'}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-400">{attempt.studentEmailSnapshot || 'No email snapshot'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{attempt.phaseLabel}</p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">{attempt.courseTitle}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                            attempt.status === 'submitted'
                              ? 'bg-emerald-100 text-emerald-700'
                              : attempt.status === 'in_progress'
                                ? 'bg-amber-100 text-amber-700 dark:text-amber-400'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-slate-400'
                          }`}>
                            {attempt.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                          {typeof attempt.scorePercent === 'number'
                            ? `${attempt.scorePercent}%${attempt.passed ? ' (Pass)' : ' (Fail)'}`
                            : 'Pending'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-slate-400">
                          {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : 'Not submitted'}
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
  const gradients: Record<string, string> = {
    teal: 'from-teal-600 via-teal-700 to-cyan-800',
    blue: 'from-blue-500 to-indigo-600',
    purple: 'from-violet-600 to-purple-700',
    green: 'from-emerald-500 to-teal-600',
  }

  return (
    <div className={`relative bg-gradient-to-br ${gradients[color] || gradients.teal} rounded-2xl p-5 shadow-sm overflow-hidden`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white dark:bg-slate-900/10 -translate-y-8 translate-x-8" />
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white dark:bg-slate-900/20 rounded-xl text-white">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-white/80">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}
