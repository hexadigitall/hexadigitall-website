'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowLeftIcon,
  StopIcon,
  PlusIcon,
  XMarkIcon,
  PauseIcon,
  PlayIcon,
  AcademicCapIcon,
} from '@heroicons/react/24/outline'
import LabTopology from './LabTopology'
import DeviceInspector from './DeviceInspector'
import LabTerminal from './LabTerminal'
import LabInstructions from './LabInstructions'
import SnapshotPanel from './SnapshotPanel'
import ApiKeyPanel from './ApiKeyPanel'
import ConnectionInfoPanel from './ConnectionInfoPanel'
import GradeResult from './GradeResult'
import type { SimInstance, SimLabDefinition, SimWSMessage, SimDeviceState, GradingResult } from '@/types/simulation'

type TabId = 'terminals' | 'instructions' | 'events'

interface LabWorkspaceProps {
  instanceId: string
}

export default function LabWorkspace({ instanceId }: LabWorkspaceProps) {
  const [token, setToken] = useState<string | null>(null)
  const [instance, setInstance] = useState<SimInstance | null>(null)
  const [labDef, setLabDef] = useState<SimLabDefinition | null>(null)
  const [events, setEvents] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Live state
  const [devices, setDevices] = useState<SimDeviceState[]>([])
  const [currentTick, setCurrentTick] = useState(0)
  const [wsConnected, setWsConnected] = useState(false)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)

  // Pause/resume
  const [paused, setPaused] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  // Grading
  const [submittingGrade, setSubmittingGrade] = useState(false)
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null)
  const [showGrading, setShowGrading] = useState(false)

  // Tabs and terminals
  const [activeTab, setActiveTab] = useState<TabId>('terminals')
  const [openTerminals, setOpenTerminals] = useState<string[]>([])

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || null

  useEffect(() => {
    const t = localStorage.getItem('admin_token')
    setToken(t)
    if (t) {
      loadInstance(t)
    }
  }, [instanceId])

  async function loadInstance(t: string) {
    try {
      const res = await fetch(`/api/sim/instances/${instanceId}`, {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (!res.ok) return
      const data = await res.json()
      setInstance(data.data)
      setCurrentTick(data.data.tick || 0)

      const labRes = await fetch('/api/sim/labs', {
        headers: { Authorization: `Bearer ${t}` },
      })
      if (labRes.ok) {
        const labData = await labRes.json()
        const def = (labData.data || []).find(
          (l: SimLabDefinition) => l._id === data.data.labDefinitionId
        )
        setLabDef(def)
      }
    } catch (err) {
      console.error('Failed to load instance:', err)
    } finally {
      setLoading(false)
    }
  }

  // WebSocket connection for state stream
  useEffect(() => {
    if (!token || !instance) return

    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'}/ws/instance/${instanceId}?token=${encodeURIComponent(token)}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => setWsConnected(true)

    ws.onmessage = (event) => {
      try {
        const msg: SimWSMessage = JSON.parse(event.data)

        if (msg.type === 'error') {
          console.error('WS error:', msg.detail)
          return
        }

        setDevices(msg.devices || [])
        setCurrentTick(msg.tick)

        if (msg.type === 'tick_update') {
          setInstance(prev => prev ? { ...prev, tick: msg.tick, status: msg.status as SimInstance['status'] } : null)
        }
      } catch { /* binary data or parse error */ }
    }

    ws.onclose = () => setWsConnected(false)

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [instanceId, token, instance?.status])

  function handlePauseResume() {
    if (!wsRef.current) return
    const action = paused ? 'resume' : 'pause'
    wsRef.current.send(JSON.stringify({ action }))
    setPaused(!paused)
  }

  async function handleStop() {
    if (!token || !instance) return
    try {
      await fetch(`/api/sim/instances/${instanceId}/stop`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      setInstance(prev => prev ? { ...prev, status: 'stopped' } : null)
      wsRef.current?.close()
      wsRef.current = null
    } catch { /* silent */ }
  }

  async function handleSubmitGrade() {
    if (!token || !instance) return
    setSubmittingGrade(true)
    try {
      const res = await fetch(`/api/sim/instances/${instanceId}/grade`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data) {
          setGradingResult(data.data)
          setShowGrading(true)
        }
      }
    } catch {
      /* silent */
    } finally {
      setSubmittingGrade(false)
    }
  }

  const handleSelectDevice = useCallback((deviceId: string | null) => {
    setSelectedDeviceId(deviceId)
  }, [])

  const handleOpenTerminal = useCallback((deviceId: string) => {
    setOpenTerminals(prev => prev.includes(deviceId) ? prev : [...prev, deviceId])
  }, [])

  const handleCloseTerminal = useCallback((deviceId: string) => {
    setOpenTerminals(prev => prev.filter(id => id !== deviceId))
  }, [])

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400" />
      </div>
    )
  }

  if (!instance) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Instance not found</p>
          <Link href="/student/dashboard" className="text-cyan-400 hover:text-cyan-300">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-slate-950 text-slate-200">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/student/dashboard"
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-sm font-semibold text-slate-100">
              {labDef?.title || 'Simulation Lab'}
            </h1>
            <p className="text-xs text-slate-500">
              Instance {instance.id.slice(0, 8)} · Tick {currentTick}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* WS status */}
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
            wsConnected ? 'bg-emerald-900/50 text-emerald-300' : 'bg-red-900/50 text-red-300'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${wsConnected ? 'bg-emerald-400' : 'bg-red-400'}`} />
            {wsConnected ? 'live' : 'offline'}
          </span>

          {/* Instance status */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
            instance.status === 'running' ? 'bg-emerald-900/50 text-emerald-300' :
            instance.status === 'starting' ? 'bg-blue-900/50 text-blue-300' :
            'bg-slate-800 text-slate-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              instance.status === 'running' ? 'bg-emerald-400' :
              instance.status === 'starting' ? 'bg-blue-400' :
              'bg-slate-500'
            }`} />
            {instance.status}
          </span>

          {instance.status === 'running' && (
            <>
              <button
                onClick={handlePauseResume}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium ${
                  paused
                    ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                    : 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30'
                }`}
              >
                {paused ? (
                  <PlayIcon className="h-3.5 w-3.5" />
                ) : (
                  <PauseIcon className="h-3.5 w-3.5" />
                )}
                {paused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={handleSubmitGrade}
                disabled={submittingGrade}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-colors text-xs font-medium disabled:opacity-50"
              >
                <AcademicCapIcon className="h-3.5 w-3.5" />
                {submittingGrade ? 'Grading...' : 'Grade'}
              </button>
              <button
                onClick={handleStop}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors text-xs font-medium"
              >
                <StopIcon className="h-3.5 w-3.5" />
                Stop
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main workspace grid */}
      <div className="flex-1 grid grid-cols-4 gap-0 overflow-hidden">
        {/* Sidebar — topology + inspector */}
        <aside className="col-span-1 bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden">
          {/* Topology */}
          <div className="overflow-y-auto border-b border-slate-800">
            <LabTopology
              devices={devices}
              selectedDeviceId={selectedDeviceId}
              onSelectDevice={handleSelectDevice}
            />
          </div>

          {/* Inspector */}
          <div className="overflow-y-auto flex-1 min-h-0">
            <DeviceInspector
              device={selectedDevice}
              onClose={() => setSelectedDeviceId(null)}
            />
          </div>

          {/* Bottom panels — snapshots, keys, connection info */}
          <div className="shrink-0 border-t border-slate-800">
            <SnapshotPanel instanceId={instanceId} token={token || ''} />
            <ApiKeyPanel instanceId={instanceId} token={token || ''} />
            <ConnectionInfoPanel instanceId={instanceId} enginePort={instance?.enginePort} />
          </div>
        </aside>

        {/* Main area — terminals, instructions, events */}
        <main className="col-span-3 flex flex-col overflow-hidden">
          {/* Workspace tabs */}
          <div className="flex items-center justify-between px-3 pt-2 bg-slate-900 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-1">
              {(['terminals', 'instructions', 'events'] as TabId[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs font-medium border-b-2 transition-colors capitalize ${
                    activeTab === tab
                      ? 'text-cyan-400 border-cyan-400'
                      : 'text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Open terminal buttons for devices */}
            {activeTab === 'terminals' && devices.length > 0 && (
              <div className="flex items-center gap-1">
                {devices.slice(0, 6).map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleOpenTerminal(d.id)}
                    className={`px-2 py-1 rounded text-[10px] font-medium border transition-colors ${
                      openTerminals.includes(d.id)
                        ? 'bg-cyan-900/30 border-cyan-700/50 text-cyan-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <PlusIcon className="h-3 w-3 inline mr-0.5" />
                    {d.label.split('-')[0]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'terminals' && (
              <div className="h-full flex flex-col">
                {openTerminals.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <p className="text-sm text-slate-500">
                      Select a device in the topology and click its name button above to open a terminal.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 grid gap-0" style={{
                    gridTemplateColumns: `repeat(${Math.min(openTerminals.length, 2)}, 1fr)`,
                    gridTemplateRows: `repeat(${Math.ceil(openTerminals.length / 2)}, 1fr)`,
                  }}>
                    {openTerminals.map(devId => (
                      <div key={devId} className="relative border border-slate-800 overflow-hidden">
                        <button
                          onClick={() => handleCloseTerminal(devId)}
                          className="absolute top-1 right-1 z-10 p-0.5 rounded bg-slate-800/80 hover:bg-red-600/50 text-slate-400 hover:text-red-300 transition-colors"
                        >
                          <XMarkIcon className="h-3 w-3" />
                        </button>
                        <LabTerminal
                          instanceId={instanceId}
                          deviceId={devId}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="h-full overflow-y-auto p-6">
                {labDef?.instructions ? (
                  <LabInstructions markdown={labDef.instructions} />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-slate-500">
                      No instructions provided for this lab. Check the lab definition in the admin panel.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'events' && (
              <div className="h-full overflow-y-auto p-6">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Event Log</h3>
                {events.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No events yet. Events will appear here as the simulation runs.
                  </p>
                ) : (
                  <div className="space-y-1 font-mono text-xs">
                    {events.map((evt, i) => (
                      <div key={i} className="text-slate-400">{evt}</div>
                    ))}
                  </div>
                )}
                <div className="mt-6 text-xs text-slate-500">
                  Event streaming from the simulation engine — shows configuration changes, security events, and state transitions.
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Grading results overlay */}
      {showGrading && gradingResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80" onClick={() => setShowGrading(false)}>
          <div
            className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4"
            onClick={e => e.stopPropagation()}
          >
            <GradeResult
              result={gradingResult}
              onClose={() => setShowGrading(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
