'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BeakerIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import type { SimLabDefinition } from '@/types/simulation'

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

export default function TeacherLabsPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [labs, setLabs] = useState<SimLabDefinition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('admin_token')
    if (!t) { router.push('/teacher/login'); return }
    setToken(t)
    fetchLabs(t).finally(() => setLoading(false))
  }, [router])

  async function fetchLabs(t: string) {
    try {
      const res = await fetch('/api/sim/labs', { headers: { Authorization: `Bearer ${t}` } })
      if (res.ok) {
        const data = await res.json()
        setLabs(data.data || [])
      }
    } catch { /* silent */ }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    )
  }

  const draftCount = labs.filter(l => !l.published).length
  const publishedCount = labs.filter(l => l.published).length

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 dark:from-slate-950 dark:via-teal-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/teacher/dashboard"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Simulation Labs</h1>
                <p className="text-sm text-teal-300 mt-0.5">
                  {publishedCount} published · {draftCount} drafts · {labs.length} total
                </p>
              </div>
            </div>
            <Link
              href="/teacher/labs/create"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-teal-800 rounded-xl hover:bg-teal-50 transition-colors text-sm font-semibold"
            >
              <PlusIcon className="h-4 w-4" />
              Create Lab
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {labs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-teal-50 dark:bg-teal-950/20 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <BeakerIcon className="h-10 w-10 text-teal-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">No labs yet</h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-6">
              Create your first simulation lab to get started. Labs appear to students once published.
            </p>
            <Link
              href="/teacher/labs/create"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all font-medium text-sm shadow-sm"
            >
              <PlusIcon className="h-4 w-4" />
              Create Lab
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Lab</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Course</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Difficulty</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 dark:text-slate-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-800">
                  {labs.map((lab) => (
                    <tr key={lab._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{lab.title}</p>
                        {lab.description && (
                          <p className="text-xs text-gray-400 dark:text-slate-400 mt-0.5 line-clamp-1">{lab.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{lab.course?.title || lab.course?._ref || '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${DIFFICULTY_COLORS[lab.difficulty] || ''}`}>
                          {lab.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">{lab.durationMinutes}m</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${
                          lab.published
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400'
                        }`}>
                          {lab.published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/teacher/labs/${lab._id}/preview`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <EyeIcon className="h-3.5 w-3.5" />
                            Preview
                          </Link>
                          <Link
                            href={`/teacher/labs/${lab._id}/edit`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <PencilIcon className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Student progress link */}
        {labs.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Link
              href="/teacher/labs/students"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors text-sm font-semibold"
            >
              View Student Progress
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
