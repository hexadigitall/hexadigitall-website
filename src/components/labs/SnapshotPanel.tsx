'use client'

import { useEffect, useState } from 'react'
import { TrashIcon, PlusIcon } from '@heroicons/react/24/outline'
import type { SimSnapshot } from '@/types/simulation'

interface SnapshotPanelProps {
  instanceId: string
  token: string
}

export default function SnapshotPanel({ instanceId, token }: SnapshotPanelProps) {
  const [snapshots, setSnapshots] = useState<SimSnapshot[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  async function loadSnapshots() {
    try {
      const res = await fetch(`/api/sim/instances/${instanceId}/snapshots`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setSnapshots(data.data || [])
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (expanded) loadSnapshots()
  }, [instanceId, token, expanded])

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/sim/instances/${instanceId}/snapshots`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label: `Snapshot ${snapshots.length + 1}` }),
      })
      if (res.ok) {
        await loadSnapshots()
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(snapshotId: string) {
    try {
      await fetch(`/api/sim/instances/${instanceId}/snapshots/${snapshotId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      setSnapshots(prev => prev.filter(s => s.id !== snapshotId))
    } catch {
      /* silent */
    }
  }

  return (
    <div className="border-t border-slate-800">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <span>Snapshots</span>
        <span className="text-slate-600">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors disabled:opacity-50 mb-2"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            {saving ? 'Saving...' : 'Save Snapshot'}
          </button>

          {loading ? (
            <div className="text-xs text-slate-500 text-center py-2">Loading...</div>
          ) : snapshots.length === 0 ? (
            <div className="text-xs text-slate-600 text-center py-2">No snapshots yet</div>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {snapshots.map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/50"
                >
                  <div className="text-xs">
                    <span className="text-slate-300">{s.label || `Tick ${s.tick}`}</span>
                    <span className="text-slate-600 ml-2">T{s.tick}</span>
                  </div>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-0.5 rounded text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
