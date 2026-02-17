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
  formData?: {
    raw?: string
    fields?: Array<{ key?: string; value?: string }>
  }
  attachments?: Array<{ name?: string; url?: string; type?: string; size?: number }>
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

  const buildExportRows = (data: FormSubmission) => {
    const rows: Array<[string, string]> = [
      ['Submission ID', data._id],
      ['Submitted At', new Date(data.submittedAt).toLocaleString()],
      ['Status', data.status],
      ['Type', data.type],
      ['Service', data.subject || '—'],
      ['Name', data.name || '—'],
      ['Email', data.email || '—'],
      ['Phone', data.phone || '—'],
      ['Company', data.company || '—'],
      ['Message', data.message || '—'],
      ['IP Address', data.ipAddress || '—'],
      ['User Agent', data.userAgent || '—'],
      ['Referrer', data.referrer || '—'],
    ]

    if (data.formData?.fields?.length) {
      data.formData.fields.forEach((field) => {
        rows.push([field.key || 'Field', field.value || '—'])
      })
    } else if (data.formData?.raw) {
      rows.push(['Form Data (raw)', data.formData.raw])
    }

    if (data.attachments?.length) {
      data.attachments.forEach((attachment, index) => {
        const label = `Attachment ${index + 1}`
        const value = `${attachment.name || 'Attachment'} - ${attachment.url || '—'}`
        rows.push([label, value])
      })
    }

    return rows
  }

  const downloadBlob = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const exportSubmission = (format: 'csv' | 'json' | 'xls' | 'doc' | 'pdf') => {
    if (!submission) return
    const rows = buildExportRows(submission)
    const baseFileName = `submission-${submission._id}`

    const escapeCsv = (value: string) => `"${value.replace(/"/g, '""')}"`
    const escapeXml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
    const escapeRtf = (value: string) =>
      value.replace(/[\\{}]/g, '\\$&').replace(/\r?\n/g, '\\line ')

    if (format === 'json') {
      const payload = {
        id: submission._id,
        submittedAt: submission.submittedAt,
        status: submission.status,
        type: submission.type,
        subject: submission.subject,
        contact: {
          name: submission.name,
          email: submission.email,
          phone: submission.phone,
          company: submission.company,
        },
        message: submission.message,
        formData: submission.formData,
        attachments: submission.attachments,
        metadata: {
          ipAddress: submission.ipAddress,
          userAgent: submission.userAgent,
          referrer: submission.referrer,
        },
      }
      downloadBlob(JSON.stringify(payload, null, 2), `${baseFileName}.json`, 'application/json')
      return
    }

    if (format === 'csv') {
      const csv = rows.map(([key, value]) => `${escapeCsv(key)},${escapeCsv(value || '')}`).join('\n')
      const csvWithBom = `\uFEFF${csv}`
      downloadBlob(csvWithBom, `${baseFileName}.csv`, 'text/csv')
      return
    }

    if (format === 'xls') {
      const tableRows = rows
        .map(
          ([key, value]) =>
            `<Row><Cell><Data ss:Type="String">${escapeXml(key)}</Data></Cell><Cell><Data ss:Type="String">${escapeXml(
              value || ''
            )}</Data></Cell></Row>`
        )
        .join('')
      const xls = `<?xml version="1.0"?>\n<?mso-application progid="Excel.Sheet"?>\n<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Submission"><Table>${tableRows}</Table></Worksheet></Workbook>`
      downloadBlob(`\uFEFF${xls}`, `${baseFileName}.xls`, 'application/vnd.ms-excel')
      return
    }

    if (format === 'doc') {
      const rtfBody = rows
        .map(
          ([key, value]) =>
            `\\b ${escapeRtf(key)}\\b0\\line ${escapeRtf(value || '—')}\\line\\line`
        )
        .join('')
      const rtf = `{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Calibri;}}\\fs22 ${rtfBody}}`
      downloadBlob(rtf, `${baseFileName}.doc`, 'application/rtf')
      return
    }

    const tableRows = rows
      .map(
        ([key, value]) =>
          `<tr><td style="border:1px solid #ddd;padding:8px;"><strong>${key}</strong></td><td style="border:1px solid #ddd;padding:8px;">${value}</td></tr>`
      )
      .join('')
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Submission ${submission._id}</title>
        </head>
        <body>
          <h2>Submission Details</h2>
          <table style="border-collapse:collapse;width:100%;">${tableRows}</table>
        </body>
      </html>
    `

    if (format === 'pdf') {
      const printWindow = window.open('', '_blank')
      if (!printWindow) return
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.focus()
      printWindow.print()
    }
  }

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

        {/* Export Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Export</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => exportSubmission('csv')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Download CSV
            </button>
            <button
              onClick={() => exportSubmission('xls')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Download XLS
            </button>
            <button
              onClick={() => exportSubmission('doc')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Download DOC
            </button>
            <button
              onClick={() => exportSubmission('json')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Download JSON
            </button>
            <button
              onClick={() => exportSubmission('pdf')}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Print / Save PDF
            </button>
          </div>
        </div>

        {/* Attachments */}
        {submission.attachments && submission.attachments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h2>
            <div className="space-y-3">
              {submission.attachments.map((attachment, index) => (
                <div key={`${attachment.url}-${index}`}>
                  <a
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    {attachment.name || 'Attachment'}
                  </a>
                  <div className="text-xs text-gray-500">
                    {attachment.type || 'file'}
                    {attachment.size ? ` • ${Math.round(attachment.size / 1024)} KB` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Form Data */}
        {submission.formData && (submission.formData.fields || submission.formData.raw) && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
            <div className="space-y-4">
              {submission.formData.fields && submission.formData.fields.length > 0 ? (
                submission.formData.fields.map((field, index) => (
                  <div key={`${field.key}-${index}`}>
                    <label className="block text-xs font-medium text-gray-600 uppercase">
                      {field.key || 'Field'}
                    </label>
                    <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">
                      {field.value || '—'}
                    </p>
                  </div>
                ))
              ) : (
                <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                  {submission.formData.raw || '—'}
                </pre>
              )}
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
