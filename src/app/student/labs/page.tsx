'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BeakerIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
import type { SimLabDefinition, SimInstance } from '@/types/simulation'

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

export default function StudentLabsPage() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [labs, setLabs] = useState<SimLabDefinition[]>([])
  const [instances, setInstances] = useState<SimInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('admin_token')
    const session = localStorage.getItem('admin_session')
    if (!t || !session) {
      router.push('/student/login')
      return
    }
    setToken(t)
    Promise.all([fetchLabs(t), fetchInstances(t, session)]).finally(() => setLoading(false))
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

  async function fetchInstances(t: string, session: string) {
    try {
      const { userId } = JSON.parse(session)
      const res = await fetch(`/api/sim/instances?ownerId=${userId}`, {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (res.ok) {
        const data = await res.json()
        setInstances(data.data || [])
      }
    } catch { /* silent */ }
  }

  async function handleStartLab(labDefId: string) {
    if (!token) return
    setStarting(labDefId)
    try {
      const res = await fetch('/api/sim/instances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ labDefinitionId: labDefId }),
      })
      if (res.ok) {
        const data = await res.json()
        const instance = data.data
        await fetch(`/api/sim/instances/${instance.id}/start`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
        setInstances(prev => [...prev, instance])
      }
    } catch { /* silent */ }
    setStarting(null)
  }

  function getActiveInstance(labDefId: string): SimInstance | undefined {
    return instances.find(
      i => i.labDefinitionId === labDefId && ['starting', 'running', 'paused'].includes(i.status)
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    )
  }

  const activeCount = instances.filter(i => ['starting', 'running', 'paused'].includes(i.status)).length

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Link
              href="/student/dashboard"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Simulation Labs</h1>
              <p className="text-sm text-purple-300 mt-0.5">
                {labs.length} lab{labs.length !== 1 ? 's' : ''} available · {activeCount} active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {labs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-purple-50 dark:bg-purple-950/20 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <BeakerIcon className="h-10 w-10 text-purple-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">No labs available</h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
              Simulation labs will appear here once your instructor publishes them for your courses.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {labs.map((lab) => {
              const active = getActiveInstance(lab._id)
              return (
                <div
                  key={lab._id}
                  className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100">{lab.title}</h3>
                      <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${DIFFICULTY_COLORS[lab.difficulty] || ''}`}>
                        {lab.difficulty}
                      </span>
                    </div>

                    {lab.description && (
                      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-3">
                        {lab.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500 mb-5 pb-4 border-b border-gray-100 dark:border-slate-700">
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {lab.durationMinutes} min
                      </span>
                      {lab.course && (
                        <span className="flex items-center gap-1">
                          <AcademicCapIcon className="h-3.5 w-3.5" />
                          {lab.course?.title || lab.course?._ref}
                        </span>
                      )}
                    </div>

                    {active ? (
                      <Link
                        href={`/student/labs/${active.id}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-sm font-semibold"
                      >
                        Continue Lab →
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleStartLab(lab._id)}
                        disabled={starting === lab._id}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-primary text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {starting === lab._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                            Starting...
                          </>
                        ) : (
                          'Start Lab'
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
