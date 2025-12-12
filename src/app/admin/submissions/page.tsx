'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/admin/Breadcrumbs'
import AdminNavbar from '@/components/admin/AdminNavbar'
import {
  ArrowLeftIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline'

interface FormSubmission {
  _id: string
  type: string
  status: string
  priority?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  subject?: string
  message?: string
  formData?: Record<string, unknown>
  submittedAt: string
  ipAddress?: string
  userAgent?: string
}

export default function SubmissionsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

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
          fetchSubmissions()
        } else {
          router.push('/admin/login')
        }
      } catch {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/submissions')
      const data = await response.json()
      if (data.success) {
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })

      if (response.ok) {
        fetchSubmissions()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const exportData = () => {
    const csv = [
      ['Date', 'Type', 'Name', 'Email', 'Phone', 'Status', 'Message'],
      ...submissions.map(s => [
        new Date(s.submittedAt).toLocaleDateString(),
        s.type,
        s.name || '',
        s.email || '',
        s.phone || '',
        s.status,
        s.message || '',
      ]),
    ]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `submissions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const filteredSubmissions = submissions.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter || s.type === filter
    const matchesSearch =
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.message?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Form Submissions</h1>
              <div className="hidden md:block">
                <Breadcrumbs items={[
                  { label: 'Admin', href: '/admin/dashboard' },
                  { label: 'Submissions' },
                ]} />
              </div>
            </div>

            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </header>
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <div className="flex space-x-2">
                <FilterButton active={filter === 'all'} onClick={() => setFilter('all')}>
                  All
                </FilterButton>
                <FilterButton active={filter === 'new'} onClick={() => setFilter('new')}>
                  New
                </FilterButton>
                <FilterButton active={filter === 'in-progress'} onClick={() => setFilter('in-progress')}>
                  In Progress
                </FilterButton>
                <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')}>
                  Completed
                </FilterButton>
              </div>
            </div>

            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full md:w-80"
              />
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <tr key={submission._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {submission.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                        <div className="text-sm text-gray-500">{submission.email}</div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-gray-900 truncate">{submission.message}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={submission.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {submission.status === 'new' && (
                            <button
                              onClick={() => updateStatus(submission._id, 'in-progress')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Mark in progress"
                            >
                              <ClockIcon className="h-5 w-5" />
                            </button>
                          )}
                          {submission.status !== 'completed' && (
                            <button
                              onClick={() => updateStatus(submission._id, 'completed')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark completed"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                          )}
                          <button
                            onClick={() => updateStatus(submission._id, 'archived')}
                            className="text-gray-600 hover:text-gray-900"
                            title="Archive"
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterButton({ active, onClick, children }: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  }

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}
