'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BeakerIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import type { SimLabDefinition } from '@/types/simulation'

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

export default function TeacherLabsView() {
  const [token, setToken] = useState<string | null>(null)
  const [labs, setLabs] = useState<SimLabDefinition[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('admin_token')
    setToken(t)
    if (t) {
      fetchLabs(t).finally(() => setLoading(false))
    }
  }, [])

  async function fetchLabs(t: string) {
    try {
      const res = await fetch('/api/sim/labs', { headers: { Authorization: `Bearer ${t}` } })
      if (res.ok) {
        const data = await res.json()
        setLabs(data.data || [])
      }
    } catch { /* silent */ }
  }

  async function togglePublish(labId: string, current: boolean) {
    if (!token) return
    try {
      // Publish toggle would go through a PATCH endpoint
      // For now, optimistically update local state
      setLabs(prev => prev.map(l => l._id === labId ? { ...l, published: !current } : l))
    } catch { /* silent */ }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Simulation Labs</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Create and manage hands-on lab environments for your courses
          </p>
        </div>
        <Link
          href="/teacher/labs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-semibold"
        >
          <BeakerIcon className="h-4 w-4" />
          Manage Labs
        </Link>
      </div>

      {labs.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BeakerIcon className="h-8 w-8 text-teal-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">No labs created yet</h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm mb-6">
            Create your first simulation lab for students to use.
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
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                      {lab.course?.title || lab.course?._ref || '—'}
                    </td>
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
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                          Preview
                        </Link>
                        <Link
                          href={`/teacher/labs/${lab._id}/edit`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-xs font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800"
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

      {labs.length > 0 && (
        <div className="mt-6 flex justify-center">
          <Link
            href="/teacher/labs/create"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-semibold"
          >
            <PlusIcon className="h-4 w-4" />
            Create New Lab
          </Link>
        </div>
      )}
    </section>
  )
}
