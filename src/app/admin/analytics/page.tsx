'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/admin/Breadcrumbs'
import AdminNavbar from '@/components/admin/AdminNavbar'
import {
  ArrowLeftIcon,
  ChartBarIcon,
  UsersIcon,
  CursorArrowRaysIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

interface RecentEvent {
  eventType: string
  eventName?: string
  page: string
  deviceType: string
  browser?: string
  timestamp: string
}

interface AnalyticsData {
  pageViews: { page: string; count: number }[]
  topServices: { service: string; count: number }[]
  topCourses: { course: string; count: number }[]
  eventsByType: { type: string; count: number }[]
  recentEvents: RecentEvent[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [data, setData] = useState<AnalyticsData | null>(null)
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

        if (response.ok) {
          fetchAnalytics()
        } else {
          router.push('/admin/login')
        }
      } catch {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/dashboard"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <div className="hidden md:block">
              <Breadcrumbs items={[
                { label: 'Admin', href: '/admin/dashboard' },
                { label: 'Analytics' },
              ]} />
            </div>
          </div>
        </div>
      </header>
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Pages */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Popular Pages</h2>
            </div>
            <div className="space-y-3">
              {data?.pageViews?.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{item.page}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count} views</span>
                </div>
              )) || <p className="text-gray-500">No data available</p>}
            </div>
          </div>

          {/* Top Services */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Top Services</h2>
            </div>
            <div className="space-y-3">
              {data?.topServices?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{item.service}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count} views</span>
                </div>
              )) || <p className="text-gray-500">No data available</p>}
            </div>
          </div>

          {/* Top Courses */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <UsersIcon className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Top Courses</h2>
            </div>
            <div className="space-y-3">
              {data?.topCourses?.slice(0, 5).map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{item.course}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count} views</span>
                </div>
              )) || <p className="text-gray-500">No data available</p>}
            </div>
          </div>

          {/* Event Types */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <CursorArrowRaysIcon className="h-6 w-6 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Event Types</h2>
            </div>
            <div className="space-y-3">
              {data?.eventsByType?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700 capitalize">{item.type.replace('_', ' ')}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
              )) || <p className="text-gray-500">No data available</p>}
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data?.recentEvents?.slice(0, 20).map((event, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{event.eventName || event.eventType}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{event.page}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{event.deviceType}</td>
                  </tr>
                )) || <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No events yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
