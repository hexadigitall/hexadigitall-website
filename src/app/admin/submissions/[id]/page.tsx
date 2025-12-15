'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline'
import AdminNavbar from '@/components/admin/AdminNavbar'

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
  referrer?: string
}

export default function SubmissionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [submission, setSubmission] = useState<FormSubmission | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

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

        if (!response.ok) {
          router.push('/admin/login')
          return
        }

        fetchSubmission(token)
      } catch {
        router.push('/admin/login')
      }
    }

    checkAuth()
  }, [router, id])

  const fetchSubmission = async (token: string) => {
    try {
      const response = await fetch(`/api/admin/submissions?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()
      if (data.success && data.submissions.length > 0) {
        setSubmission(data.submissions[0])
      }
    } catch (error) {
      console.error('Failed to fetch submission:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!submission) return

    setUpdating(true)
    const token = localStorage.getItem('admin_token')

    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({ id: submission._id, status: newStatus }),
      })

      if (response.ok) {
        setFeedback({ type: 'success', message: 'Status updated successfully' })
        setSubmission({ ...submission, status: newStatus })
        setTimeout(() => setFeedback(null), 3000)
      } else {
        setFeedback({ type: 'error', message: 'Failed to update status' })
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      setFeedback({ type: 'error', message: 'Failed to update status' })
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link
              href="/admin/submissions"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 inline-block"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
          </div>
        </header>
        <AdminNavbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-gray-500">Submission not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/submissions"
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Submission Details</h1>
            <div className="w-10"></div>
          </div>
        </div>
      </header>

      <AdminNavbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {feedback && (
          <div
            className={`px-4 py-3 rounded-lg border ${
              feedback.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Contact Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Name</label>
              <p className="text-sm text-gray-900 mt-1">{submission.name || '—'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Email</label>
              <p className="text-sm text-gray-900 mt-1">
                <a href={`mailto:${submission.email}`} className="text-primary hover:underline">
                  {submission.email || '—'}
                </a>
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Phone</label>
              <p className="text-sm text-gray-900 mt-1">
                {submission.phone ? (
                  <a href={`tel:${submission.phone}`} className="text-primary hover:underline">
                    {submission.phone}
                  </a>
                ) : (
                  '—'
                )}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Company</label>
              <p className="text-sm text-gray-900 mt-1">{submission.company || '—'}</p>
            </div>
          </div>
        </div>

        {/* Submission Details Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Submission Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Type</label>
              <p className="text-sm text-gray-900 mt-1 capitalize">{submission.type}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Subject</label>
              <p className="text-sm text-gray-900 mt-1">{submission.subject || '—'}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Message</label>
              <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{submission.message || '—'}</p>
            </div>
          </div>
        </div>

        {/* Additional Form Data */}
        {submission.formData && Object.keys(submission.formData).length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-4">
              {Object.entries(submission.formData).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 uppercase">{key}</label>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                    {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Technical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">Submitted At</label>
              <p className="text-gray-900 mt-1">
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 uppercase">IP Address</label>
              <p className="text-gray-900 mt-1 font-mono text-xs">{submission.ipAddress || '—'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase">User Agent</label>
              <p className="text-gray-900 mt-1 font-mono text-xs break-all">{submission.userAgent || '—'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 uppercase">Referrer</label>
              <p className="text-gray-900 mt-1 font-mono text-xs break-all">{submission.referrer || '—'}</p>
            </div>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => updateStatus('new')}
              disabled={updating || submission.status === 'new'}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ClockIcon className="h-5 w-5" />
              <span>Mark New</span>
            </button>
            <button
              onClick={() => updateStatus('in-progress')}
              disabled={updating || submission.status === 'in-progress'}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ClockIcon className="h-5 w-5" />
              <span>In Progress</span>
            </button>
            <button
              onClick={() => updateStatus('completed')}
              disabled={updating || submission.status === 'completed'}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCircleIcon className="h-5 w-5" />
              <span>Completed</span>
            </button>
            <button
              onClick={() => updateStatus('archived')}
              disabled={updating || submission.status === 'archived'}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <XCircleIcon className="h-5 w-5" />
              <span>Archive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
