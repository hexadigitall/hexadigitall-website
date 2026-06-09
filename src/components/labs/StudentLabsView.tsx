'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BeakerIcon, ClockIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import type { SimLabDefinition, SimInstance } from '@/types/simulation'

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  intermediate: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  advanced: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
}

interface ActiveInstance extends SimInstance {
  labDefinition?: SimLabDefinition
}

export default function StudentLabsView() {
  const [token, setToken] = useState<string | null>(null)
  const [labs, setLabs] = useState<SimLabDefinition[]>([])
  const [instances, setInstances] = useState<ActiveInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState<string | null>(null)

  useEffect(() => {
    const t = localStorage.getItem('admin_token')
    setToken(t)
    if (t) {
      Promise.all([fetchLabs(t), fetchInstances(t)]).finally(() => setLoading(false))
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

  async function fetchInstances(t: string) {
    try {
      const session = localStorage.getItem('admin_session')
      if (!session) return
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
        // Start the engine
        await fetch(`/api/sim/instances/${instance.id}/start`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        })
        setInstances(prev => [...prev, { ...instance, status: 'running' }])
      }
    } catch { /* silent */ }
    setStarting(null)
  }

  function getActiveInstance(labDefId: string): ActiveInstance | undefined {
    return instances.find(
      i => i.labDefinitionId === labDefId && ['starting', 'running', 'paused'].includes(i.status)
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    )
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100">Simulation Labs</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">
            Hands-on infrastructure and security lab environments
          </p>
        </div>
        <Link
          href="/student/labs"
          className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 transition-colors"
        >
          View all labs →
        </Link>
      </div>

      {labs.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BeakerIcon className="h-8 w-8 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">No labs available</h3>
          <p className="text-gray-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
            Simulation labs will appear here once your instructor publishes them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {labs.slice(0, 6).map((lab) => {
            const active = getActiveInstance(lab._id)
            return (
              <div
                key={lab._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-base font-bold text-gray-900 dark:text-slate-100">
                      {lab.title}
                    </h3>
                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${DIFFICULTY_COLORS[lab.difficulty] || ''}`}>
                      {lab.difficulty}
                    </span>
                  </div>

                  {lab.description && (
                    <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 line-clamp-2">
                      {lab.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-slate-500 mb-4">
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
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors text-xs font-semibold"
                    >
                      Continue Lab →
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleStartLab(lab._id)}
                      disabled={starting === lab._id}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-primary text-white rounded-xl hover:bg-slate-800 dark:hover:bg-primary/90 transition-colors text-xs font-semibold disabled:opacity-50"
                    >
                      {starting === lab._id ? (
                        <>
                          <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white" />
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
    </section>
  )
}
