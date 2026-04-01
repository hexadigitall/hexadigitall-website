'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/imageUrlBuilder'
import SubscriptionCard from '@/components/student/SubscriptionCard'
import {
  BookOpenIcon,
  CalendarIcon,
  CreditCardIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon,
} from '@heroicons/react/24/outline'

interface Enrollment {
  _id: string
  courseType: string
  status: string
  enrolledAt: string
  expiryDate?: string
  monthlyAmount?: number
  totalPrice?: number
  nextPaymentDue?: string
  paymentStatus?: string
  course?: {
    _id: string
    title: string
    slug: { current: string }
    description?: string
    level?: string
    mainImage?: { asset: { _ref: string } }
    contentPdf?: { asset: { _ref: string; url?: string } }
    roadmapPdf?: { asset: { _ref: string; url?: string } }
    courseType?: string
  }
  teacher?: {
    _id: string
    name?: string
    email?: string
  }
}

export default function StudentDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [student, setStudent] = useState<{ username: string; name?: string } | null>(null)
  const [sessionRole, setSessionRole] = useState<string | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      const session = localStorage.getItem('admin_session')
      if (!token || !session) {
        return router.push('/student/login')
      }

      try {
        const res = await fetch('/api/admin/auth', { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) return router.push('/student/login')
        
        const data = await res.json()
        if (!data.role || (data.role !== 'student' && data.role !== 'admin')) {
          return router.push('/student/login')
        }
        setSessionRole(data.role)

        const sessionData = JSON.parse(session)
        setStudent({ username: sessionData.username, name: data.name || sessionData.name })
        setPhotoUrl(data.profilePhotoUrl || null)

        await fetchEnrollments(token)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/student/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchEnrollments = async (token: string) => {
    try {
      const res = await fetch('/api/student/enrollments', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setEnrollments(data.enrollments || [])
      }
    } catch (error) {
      console.error('Failed to fetch enrollments:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_session')
    // Clear cookie used by middleware
    document.cookie = 'admin_token=; Path=/; Max-Age=0; SameSite=Lax'
    router.push('/student/login')
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
    
    const url = pdfAsset.asset.url || `https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${pdfAsset.asset._ref.replace('file-', '').replace('-pdf', '.pdf')}`
    
    const a = document.createElement('a')
    a.href = url
    a.download = filename || 'download.pdf'
    a.target = '_blank'
    a.click()
  }

  const handlePayment = async (enrollment: Enrollment) => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/student/login')
      return
    }

    setPaymentLoading(enrollment._id)
    try {
      const res = await fetch('/api/student/renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          enrollmentId: enrollment._id,
          amount: enrollment.monthlyAmount,
          currency: 'NGN',
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        if (data.paymentUrl && data.paymentUrl !== '#') {
          window.location.href = data.paymentUrl
        } else if (data.authorization_url) {
          window.location.href = data.authorization_url
        } else {
          alert(data.message || 'Payment system not yet configured. Contact admin.')
        }
      } else {
        alert(data.message || 'Failed to initiate payment')
      }
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Failed to initiate payment. Please try again.')
    } finally {
      setPaymentLoading(null)
    }
  }

  const getNextPaymentDue = () => {
    const activeLive = enrollments.filter(e => e.status === 'active' && e.courseType === 'live')
    if (activeLive.length === 0) return null
    
    const nextDue = activeLive
      .map(e => e.nextPaymentDue)
      .filter(Boolean)
      .sort()[0]
    
    return nextDue ? new Date(nextDue) : null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  const nextPayment = getNextPaymentDue()
  const activeCount = enrollments.filter(e => e.status === 'active').length
  const studentDisplayName = student?.name || student?.username || 'Student'

  return (
    <div className="min-h-screen bg-[#f5f5f7]">

      {/* Profile hero */}
      <div className="bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-20 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/[0.03] -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">

            {/* Avatar — click to upload */}
            <div
              className="relative group shrink-0 cursor-pointer"
              title="Click to change profile photo"
              onClick={() => !photoUploading && photoInputRef.current?.click()}
            >
              <div className="w-24 h-24 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-2xl overflow-hidden">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt={studentDisplayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white select-none">
                    {studentDisplayName.charAt(0).toUpperCase()}
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
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-violet-900 shadow" />
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
                {studentDisplayName}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white border border-white/20 backdrop-blur-sm">
                  Student
                </span>
                {student?.username && (
                  <span className="text-sm text-purple-300">@{student.username}</span>
                )}
              </div>
            </div>

            <div className="flex-1 hidden sm:block" />

            {sessionRole === 'admin' && (
              <Link
                href="/admin/dashboard"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/15 backdrop-blur-sm transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/15 backdrop-blur-sm transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              Sign out
            </button>

            {/* Inline hero stats */}
            <div className="flex items-center gap-8 text-center">
              <div>
                <p className="text-3xl font-bold text-white">{activeCount}</p>
                <p className="text-xs text-purple-300 uppercase tracking-widest mt-0.5">Active</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div>
                <p className="text-3xl font-bold text-white">{enrollments.length}</p>
                <p className="text-xs text-purple-300 uppercase tracking-widest mt-0.5">Enrolled</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="sm:hidden px-4 pt-4">
        {sessionRole === 'admin' && (
          <Link
            href="/admin/dashboard"
            className="mb-3 w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-gray-700 text-sm font-medium border border-gray-200 shadow-sm"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Admin
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white text-gray-700 text-sm font-medium border border-gray-200 shadow-sm"
        >
          <ArrowRightOnRectangleIcon className="h-4 w-4" />
          Sign out
        </button>
      </div>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={<BookOpenIcon className="h-5 w-5" />}
            title="Active Courses"
            value={activeCount.toString()}
            color="purple"
          />
          <StatCard
            icon={<CalendarIcon className="h-5 w-5" />}
            title="Next Payment"
            value={nextPayment ? nextPayment.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
            color="blue"
          />
          <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-5 shadow-sm overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-xl">
                <CreditCardIcon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-white/90">Billing</h3>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center px-4 py-2 bg-white text-emerald-700 rounded-xl hover:bg-emerald-50 transition-colors text-sm font-semibold shadow-sm"
            >
              Renew Subscription
            </Link>
          </div>
        </div>

        {/* Courses section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Enrolled Courses</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {enrollments.length} course{enrollments.length !== 1 ? 's' : ''} total
              </p>
            </div>
            <Link
              href="/courses"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
            >
              Browse more →
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookOpenIcon className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6 text-sm max-w-xs mx-auto">
                Enroll in your first course to get started on your learning journey.
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all font-medium text-sm shadow-sm"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-8">

              {/* Active subscription cards */}
              {enrollments.filter(e => e.status === 'active' && e.expiryDate && e.monthlyAmount).length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Active Subscriptions</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {enrollments
                      .filter(e => e.status === 'active' && e.expiryDate && e.monthlyAmount)
                      .map((enrollment) => (
                        <SubscriptionCard
                          key={enrollment._id}
                          enrollmentId={enrollment._id}
                          expiryDate={enrollment.expiryDate || ''}
                          monthlyAmount={enrollment.monthlyAmount || 0}
                          paymentStatus={enrollment.paymentStatus || enrollment.status}
                          courseTitle={enrollment.course?.title}
                          courseSlug={enrollment.course?.slug?.current}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Course cards */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">All Courses</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment._id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      {enrollment.course?.mainImage ? (
                        <div className="relative h-44 w-full">
                          <Image
                            src={urlFor(enrollment.course.mainImage).width(600).height(400).url()}
                            alt={enrollment.course.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className="absolute bottom-3 left-4 flex gap-1.5">
                            {enrollment.course?.level && (
                              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-white/90 text-gray-800 capitalize">
                                {enrollment.course.level}
                              </span>
                            )}
                            <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full capitalize ${
                              enrollment.status === 'active'
                                ? 'bg-emerald-500/90 text-white'
                                : 'bg-gray-500/80 text-white'
                            }`}>
                              {enrollment.status}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="h-16 bg-gradient-to-r from-purple-600 to-indigo-600 relative">
                          <div className="absolute bottom-3 left-4 flex gap-1.5">
                            {enrollment.course?.level && (
                              <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-white/20 text-white capitalize">
                                {enrollment.course.level}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="p-5">
                        <h3 className="text-base font-bold text-gray-900 mb-0.5">
                          {enrollment.course?.title || 'Course'}
                        </h3>
                        {enrollment.teacher && (
                          <p className="text-xs text-gray-400 mb-3">
                            with{' '}
                            <span className="font-medium text-gray-600">
                              {enrollment.teacher.name || enrollment.teacher.email}
                            </span>
                          </p>
                        )}
                        {enrollment.course?.description && (
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                            {enrollment.course.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-400 mb-4 pb-4 border-b border-gray-100">
                          <span>Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                          {enrollment.expiryDate && (
                            <span className="text-indigo-600 font-medium">
                              Expires {new Date(enrollment.expiryDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          {enrollment.course?.contentPdf && (
                            <button
                              onClick={() => downloadPdf(enrollment.course?.contentPdf, `${enrollment.course?.title || 'course'}-content.pdf`)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-xs font-semibold"
                            >
                              <ArrowDownTrayIcon className="h-4 w-4" />
                              Course Content PDF
                            </button>
                          )}
                          {enrollment.course?.roadmapPdf && (
                            <button
                              onClick={() => downloadPdf(enrollment.course?.roadmapPdf, `${enrollment.course?.title || 'course'}-roadmap.pdf`)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-colors text-xs font-semibold border border-indigo-100"
                            >
                              <ArrowDownTrayIcon className="h-4 w-4" />
                              Roadmap PDF
                            </button>
                          )}
                          {enrollment.monthlyAmount && (
                            <p className="text-xs text-gray-400 text-center pt-1">
                              ₦{enrollment.monthlyAmount.toLocaleString()}/month
                              {enrollment.totalPrice ? ` · ₦${enrollment.totalPrice.toLocaleString()} total` : ''}
                            </p>
                          )}
                          {enrollment.status === 'active' && enrollment.courseType === 'live' && enrollment.monthlyAmount && (
                            <button
                              onClick={() => handlePayment(enrollment)}
                              disabled={paymentLoading === enrollment._id}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <CreditCardIcon className="h-4 w-4" />
                              {paymentLoading === enrollment._id
                                ? 'Processing...'
                                : `Pay ₦${enrollment.monthlyAmount.toLocaleString()}`}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  const gradients: Record<string, string> = {
    purple: 'from-violet-600 via-purple-600 to-indigo-700',
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-emerald-500 to-teal-600',
  }

  return (
    <div className={`relative bg-gradient-to-br ${gradients[color] || gradients.purple} rounded-2xl p-5 shadow-sm overflow-hidden`}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white/20 rounded-xl text-white">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-white/80">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}
