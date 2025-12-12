'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, BookOpenIcon, CalendarIcon, CreditCardIcon } from '@heroicons/react/24/outline'

export default function StudentDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState<string>('')

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      if (!token) return router.push('/admin/login')
      const res = await fetch('/api/admin/auth', { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) return router.push('/admin/login')
      const data = await res.json()
      if (!data.role || (data.role !== 'student' && data.role !== 'admin')) {
        return router.push('/admin/login')
      }
      setRole(data.role)
      setLoading(false)
    }
    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card icon={<BookOpenIcon className="h-6 w-6 text-primary" />} title="My Courses" desc="Your enrolled courses will appear here." />
          <Card icon={<CalendarIcon className="h-6 w-6 text-purple-600" />} title="Next Due Date" desc="Payment due dates will show here." />
          <Card icon={<CreditCardIcon className="h-6 w-6 text-green-600" />} title="Make a Payment" desc="Click to pay your monthly fee." />
        </div>
      </div>
    </div>
  )
}

function Card({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        {icon}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      </div>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  )
}
