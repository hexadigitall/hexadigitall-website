'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/admin/Breadcrumbs'
import AdminNavbar from '@/components/admin/AdminNavbar'
import {
  ChartBarIcon,
  InboxIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalSubmissions: number
  newSubmissions: number
  totalPageViews: number
  todayPageViews: number
  conversionRate: number
  avgSessionDuration: string
}

interface NotificationItem {
  _id: string
  name?: string
  email?: string
  type: string
  submittedAt: string
  subject?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [adminUser, setAdminUser] = useState('')
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notificationsLoading, setNotificationsLoading] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      const session = localStorage.getItem('admin_session')

      if (!token || !session) {
        router.push('/admin/login')
        return
      }

      try {
        const response = await fetch('/api/admin/auth', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.ok) {
          setIsAuthenticated(true)
          const sessionData = JSON.parse(session)
          setAdminUser(sessionData.username)
          fetchDashboardData()
          fetchNotifications()
        } else {
          router.push('/admin/login')
        }
      } catch {
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard')
      const data = await response.json()
      setStats(data.stats)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const fetchNotifications = async () => {
    setNotificationsLoading(true)
    try {
      const res = await fetch('/api/admin/submissions?status=new&limit=5')
      const data = await res.json()
      if (data.success && Array.isArray(data.submissions)) {
        setNotifications(data.submissions)
        setHasUnread(data.submissions.length > 0)
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setNotificationsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_session')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex items-center justify-between w-full md:w-auto gap-3">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Hexadigitall Admin
              </h1>
              <div className="hidden md:block">
                <Breadcrumbs
                  items={[
                    { label: 'Admin', href: '/admin/dashboard' },
                    { label: 'Dashboard' },
                  ]}
                />
              </div>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen((prev) => !prev)
                    setHasUnread(false)
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 relative rounded-lg hover:bg-gray-100"
                  aria-haspopup="true"
                  aria-expanded={notificationsOpen}
                >
                  <BellIcon className="h-6 w-6" />
                  {hasUnread && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white shadow-lg border border-gray-200 rounded-lg z-20 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                      <span className="text-sm font-semibold text-gray-900">Notifications</span>
                      <button
                        onClick={fetchNotifications}
                        className="text-xs text-primary hover:text-primary/80"
                      >
                        Refresh
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                      {notificationsLoading && (
                        <div className="px-4 py-3 text-sm text-gray-500">Loading...</div>
                      )}
                      {!notificationsLoading && notifications.length === 0 && (
                        <div className="px-4 py-4 text-sm text-gray-500">No new submissions.</div>
                      )}
                      {!notificationsLoading && notifications.map((item) => (
                        <div key={item._id} className="px-4 py-3 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{item.name || 'Unknown sender'}</p>
                              <p className="text-xs text-gray-500">{item.email || 'No email'}</p>
                              <p className="text-xs text-gray-500 mt-1 capitalize">{item.type}</p>
                            </div>
                            <div className="text-right text-xs text-gray-500 whitespace-nowrap">
                              {new Date(item.submittedAt).toLocaleDateString()}
                            </div>
                          </div>
                          {item.subject && (
                            <p className="mt-1 text-xs text-gray-700 line-clamp-2">{item.subject}</p>
                          )}
                          <div className="mt-2 flex justify-end">
                            <Link
                              href={`/admin/submissions/${item._id}`}
                              className="text-xs text-primary hover:text-primary/80"
                            >
                              View details
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 border-l pl-3 sm:pl-4">
                <UserCircleIcon className="h-8 w-8 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">{adminUser}</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <StatCard
            title="Total Submissions"
            value={stats?.totalSubmissions || 0}
            change="+12%"
            icon={<InboxIcon className="h-6 w-6" />}
            color="blue"
          />
          <StatCard
            title="New Today"
            value={stats?.newSubmissions || 0}
            change="+5"
            icon={<BellIcon className="h-6 w-6" />}
            color="green"
          />
          <StatCard
            title="Page Views"
            value={stats?.todayPageViews || 0}
            change="+23%"
            icon={<ChartBarIcon className="h-6 w-6" />}
            color="purple"
          />
          <StatCard
            title="Conversion Rate"
            value={`${stats?.conversionRate || 0}%`}
            change="+2.5%"
            icon={<ChartBarIcon className="h-6 w-6" />}
            color="orange"
          />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <NavCard
            title="Form Submissions"
            description="View and manage all form submissions"
            icon={<InboxIcon className="h-8 w-8" />}
            href="/admin/submissions"
            count={stats?.newSubmissions || 0}
            color="blue"
          />
          <NavCard
            title="Analytics"
            description="View detailed site analytics and insights"
            icon={<ChartBarIcon className="h-8 w-8" />}
            href="/admin/analytics"
            color="purple"
          />
          <NavCard
            title="Enrollments"
            description="Manage enrollments and assign teachers"
            icon={<ChartBarIcon className="h-8 w-8" />}
            href="/admin/enrollments"
            color="blue"
          />
          <NavCard
            title="Users"
            description="Manage admins, teachers, and students"
            icon={<UserCircleIcon className="h-8 w-8" />}
            href="/admin/users"
            color="purple"
          />
          <NavCard
            title="Settings"
            description="Configure admin settings and preferences"
            icon={<Cog6ToothIcon className="h-8 w-8" />}
            href="/admin/settings"
            color="gray"
          />
          <NavCard
            title="Teacher Portal"
            description="Manage courses and students you teach"
            icon={<UserCircleIcon className="h-8 w-8" />}
            href="/teacher/dashboard"
            color="blue"
          />
          <NavCard
            title="Student Portal"
            description="View enrollments, payments and updates"
            icon={<UserCircleIcon className="h-8 w-8" />}
            href="/student/dashboard"
            color="purple"
          />
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <ActivityItem
              title="New contact form submission"
              time="2 minutes ago"
              user="John Doe"
            />
            <ActivityItem
              title="Course enrollment request"
              time="15 minutes ago"
              user="Jane Smith"
            />
            <ActivityItem
              title="Service request - Web Development"
              time="1 hour ago"
              user="Michael Johnson"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, change, icon, color }: {
  title: string
  value: string | number
  change: string
  icon: React.ReactNode
  color: string
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue} text-white`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-green-600">{change}</span>
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

function NavCard({ title, description, icon, href, count, color }: {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  count?: number
  color: string
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    gray: 'from-gray-500 to-gray-600',
  }

  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color] || colorClasses.blue} text-white group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          {count !== undefined && (
            <span className="px-3 py-1 bg-red-100 text-red-600 text-sm font-medium rounded-full">
              {count} new
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </Link>
  )
}

function ActivityItem({ title, time, user }: {
  title: string
  time: string
  user: string
}) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">
          {user} • {time}
        </p>
      </div>
    </div>
  )
}
