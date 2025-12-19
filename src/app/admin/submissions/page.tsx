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
  EyeIcon,
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
  service?: string
  city?: string
  subject?: string
  message?: string
  formData?: Record<string, unknown>
  submittedAt: string
  ipAddress?: string
  userAgent?: string
  campaignName?: string
  campaignSource?: string
  campaignMedium?: string
  campaignContent?: string
  campaignTerm?: string
  landingPage?: string
}

export default function SubmissionsPage() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [campaignFilter, setCampaignFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')

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
    const matchesCampaign = campaignFilter === 'all' || s.campaignName === campaignFilter
    const matchesSource = sourceFilter === 'all' || s.campaignSource === sourceFilter
    const matchesService = serviceFilter === 'all' || s.service === serviceFilter
    const matchesSearch =
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.message?.toLowerCase().includes(search.toLowerCase()) ||
      s.city?.toLowerCase().includes(search.toLowerCase()) ||
      s.service?.toLowerCase().includes(search.toLowerCase()) ||
      s.campaignName?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesCampaign && matchesSource && matchesService && matchesSearch
  })

  const campaigns = Array.from(new Set(submissions.map(s => s.campaignName).filter(Boolean)))
  const sources = Array.from(new Set(submissions.map(s => s.campaignSource).filter(Boolean)))
  const services = Array.from(new Set(submissions.map(s => s.service).filter(Boolean)))

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
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/admin/dashboard"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Form Submissions</h1>
                <div className="hidden md:block">
                  <Breadcrumbs
                    items={[
                      { label: 'Admin', href: '/admin/dashboard' },
                      { label: 'Submissions' },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <button
                onClick={exportData}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div className="flex items-center space-x-3">
              <FunnelIcon className="h-5 w-5 text-gray-400" />
              <div className="flex flex-wrap gap-2">
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

            <div className="grid sm:grid-cols-3 gap-3 w-full md:w-auto">
              <select
                value={campaignFilter}
                onChange={(e) => setCampaignFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All campaigns</option>
                {campaigns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All sources</option>
                {sources.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All services</option>
                {services.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full md:w-auto">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent w-full sm:w-72 md:w-80"
              />
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center text-gray-500">No submissions found</div>
          ) : (
            filteredSubmissions.map((s) => (
              <div key={s._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{new Date(s.submittedAt).toLocaleDateString()}</span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">{s.type}</span>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                  <p className="text-xs text-gray-600 truncate">{s.email}</p>
                  {s.city && <p className="text-xs text-gray-600 truncate">City: {s.city}</p>}
                  {s.service && <p className="text-xs text-gray-600 truncate">Service: {s.service}</p>}
                  {s.campaignName && <p className="text-xs text-gray-600 truncate">Campaign: {s.campaignName}</p>}
                  {s.campaignSource && <p className="text-xs text-gray-600 truncate">Source: {s.campaignSource}</p>}
                </div>
                {s.message && (
                  <p className="mt-2 text-sm text-gray-700 line-clamp-2">{s.message}</p>
                )}
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={s.status} />
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/submissions/${s._id}`}
                      className="text-gray-600 hover:text-gray-900"
                      title="View details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                    {s.status === 'new' && (
                      <button onClick={() => updateStatus(s._id, 'in-progress')} className="text-blue-600 hover:text-blue-800" title="Mark in progress">
                        <ClockIcon className="h-5 w-5" />
                      </button>
                    )}
                    {s.status !== 'completed' && (
                      <button onClick={() => updateStatus(s._id, 'completed')} className="text-green-600 hover:text-green-900" title="Mark completed">
                        <CheckCircleIcon className="h-5 w-5" />
                      </button>
                    )}
                    <button onClick={() => updateStatus(s._id, 'archived')} className="text-gray-600 hover:text-gray-900" title="Archive">
                      <XCircleIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Contact</th>
                  <th className="hidden lg:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Campaign</th>
                  <th className="hidden lg:table-cell px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Message</th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 md:px-6 py-8 md:py-12 text-center text-gray-500">No submissions found</td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <tr key={submission._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                        {new Date(submission.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">{submission.type}</span>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 max-w-sm">
                        <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{submission.name}</div>
                        <div className="text-xs md:text-sm text-gray-500 truncate">{submission.email}</div>
                        <div className="text-[11px] text-gray-500 truncate">{submission.city || '—'} • {submission.service || '—'}</div>
                      </td>
                      <td className="hidden lg:table-cell px-3 md:px-6 py-3 md:py-4 max-w-xs">
                        <div className="text-sm text-gray-900 truncate">{submission.campaignName || '—'}</div>
                        <div className="text-xs text-gray-500 truncate">Src: {submission.campaignSource || '—'} • Med: {submission.campaignMedium || '—'}</div>
                      </td>
                      <td className="hidden lg:table-cell px-3 md:px-6 py-3 md:py-4 max-w-xs">
                        <p className="text-sm text-gray-900 truncate">{submission.message}</p>
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <StatusBadge status={submission.status} />
                      </td>
                      <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/submissions/${submission._id}`}
                            className="text-gray-600 hover:text-gray-900"
                            title="View details"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
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
