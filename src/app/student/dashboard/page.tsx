'use client'

import { useEffect, useState } from 'react'
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
  ArrowRightOnRectangleIcon,
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
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null)

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

        const sessionData = JSON.parse(session)
        setStudent({ username: sessionData.username, name: data.name })

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  const nextPayment = getNextPaymentDue()
  const activeCount = enrollments.filter(e => e.status === 'active').length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              {student?.name && (
                <span className="text-sm text-gray-600">Welcome, {student.name}</span>
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
          <StatCard
            icon={<BookOpenIcon className="h-6 w-6" />}
            title="Active Courses"
            value={activeCount.toString()}
            color="purple"
          />
          <StatCard
            icon={<CalendarIcon className="h-6 w-6" />}
            title="Next Payment"
            value={nextPayment ? nextPayment.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
            color="blue"
          />
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500 text-white">
                <CreditCardIcon className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Make Payment</h3>
            </div>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              Renew Subscription
            </Link>
          </div>
        </div>

        {/* My Courses */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Enrolled Courses</h2>
          {enrollments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">You haven&apos;t enrolled in any courses yet.</p>
              <Link
                href="/courses"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors font-medium"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Subscription Cards for Active Courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              {/* Course Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrollments.map((enrollment) => (
                  <div key={enrollment._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    {enrollment.course?.mainImage && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={urlFor(enrollment.course.mainImage).width(600).height(400).url()}
                          alt={enrollment.course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {enrollment.course?.title || 'Course'}
                          </h3>
                          <div className="flex items-center gap-2">
                            {enrollment.course?.level && (
                              <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                                {enrollment.course.level}
                              </span>
                            )}
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              enrollment.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {enrollment.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {enrollment.course?.description}
                      </p>
                      
                      {enrollment.teacher && (
                        <p className="text-xs text-gray-500 mb-4">
                          Instructor: <span className="font-medium text-gray-700">{enrollment.teacher.name || enrollment.teacher.email}</span>
                        </p>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        {enrollment.course?.contentPdf && (
                          <button
                            onClick={() => downloadPdf(enrollment.course?.contentPdf, `${enrollment.course?.title || 'course'}-content.pdf`)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Download Course Content
                          </button>
                        )}
                        {enrollment.course?.roadmapPdf && (
                          <button
                            onClick={() => downloadPdf(enrollment.course?.roadmapPdf, `${enrollment.course?.title || 'course'}-roadmap.pdf`)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                            Download Roadmap
                          </button>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-3">
                          <p>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</p>
                          {enrollment.monthlyAmount && (
                            <p className="mt-1">Monthly: ₦{enrollment.monthlyAmount.toLocaleString()}</p>
                          )}
                          {enrollment.totalPrice && (
                            <p className="mt-1">Total: ₦{enrollment.totalPrice.toLocaleString()}</p>
                          )}
                          {enrollment.expiryDate && (
                            <p className="mt-1 font-medium text-blue-600">
                              Expires: {new Date(enrollment.expiryDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        {enrollment.status === 'active' && enrollment.courseType === 'live' && enrollment.monthlyAmount && (
                          <button
                            onClick={() => handlePayment(enrollment)}
                            disabled={paymentLoading === enrollment._id}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CreditCardIcon className="h-4 w-4" />
                            {paymentLoading === enrollment._id ? 'Processing...' : 'Pay Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className={`p-2 rounded-lg ${colors[color] || colors.purple} text-white`}>
          {icon}
        </div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}
