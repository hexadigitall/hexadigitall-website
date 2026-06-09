'use client'

import { useEffect, useState } from 'react'
import { KeyIcon, PlusIcon, TrashIcon, ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import type { SimApiKey } from '@/types/simulation'

interface ApiKeyPanelProps {
  instanceId: string
  token: string
}

export default function ApiKeyPanel({ instanceId, token }: ApiKeyPanelProps) {
  const [keys, setKeys] = useState<SimApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newKey, setNewKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  async function loadKeys() {
    try {
      const res = await fetch(`/api/sim/keys?instanceId=${instanceId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setKeys(data.data || [])
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (expanded) loadKeys()
  }, [instanceId, token, expanded])

  async function handleCreate() {
    setCreating(true)
    setNewKey(null)
    try {
      const res = await fetch('/api/sim/keys', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instanceId, label: 'default' }),
      })
      if (res.ok) {
        const data = await res.json()
        setNewKey(data.data.key)
        await loadKeys()
      }
    } finally {
      setCreating(false)
    }
  }

  async function handleRevoke(keyId: string) {
    try {
      await fetch('/api/sim/keys', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instanceId, keyId }),
      })
      setKeys(prev => prev.filter(k => k.id !== keyId))
    } catch {
      /* silent */
    }
  }

  function handleCopy() {
    if (newKey) {
      navigator.clipboard.writeText(newKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="border-t border-slate-800">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
      >
        <div className="flex items-center gap-1.5">
          <KeyIcon className="h-3.5 w-3.5" />
          <span>API Keys</span>
        </div>
        <span className="text-slate-600">{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && (
        <div className="px-4 pb-3">
          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors disabled:opacity-50 mb-2"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            {creating ? 'Creating...' : 'Generate Key'}
          </button>

          {newKey && (
            <div className="mb-3 p-2 rounded bg-cyan-900/30 border border-cyan-700/50">
              <p className="text-[10px] text-cyan-400 font-medium mb-1">New API Key (copy now — won&apos;t be shown again)</p>
              <div className="flex items-center gap-1">
                <code className="flex-1 text-xs text-cyan-200 font-mono truncate bg-slate-900 px-2 py-1 rounded">
                  {newKey}
                </code>
                <button
                  onClick={handleCopy}
                  className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <ClipboardDocumentIcon className="h-3.5 w-3.5" />
                </button>
              </div>
              {copied && <span className="text-[10px] text-cyan-400 mt-1 block">Copied!</span>}
            </div>
          )}

          {loading ? (
            <div className="text-xs text-slate-500 text-center py-2">Loading...</div>
          ) : keys.length === 0 ? (
            <div className="text-xs text-slate-600 text-center py-2">No API keys yet</div>
          ) : (
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {keys.map(k => (
                <div
                  key={k.id}
                  className="flex items-center justify-between px-2 py-1 rounded bg-slate-800/50"
                >
                  <div className="text-xs">
                    <span className="text-slate-300 font-mono text-[10px]">{k.keyPrefix}...</span>
                    <span className="text-slate-600 ml-2">{k.label}</span>
                  </div>
                  <button
                    onClick={() => handleRevoke(k.id)}
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
