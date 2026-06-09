'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import LabTopology from '@/components/labs/LabTopology'
import DeviceInspector from '@/components/labs/DeviceInspector'
import type { SimDeviceState } from '@/types/simulation'

type PageProps = { params: Promise<{ labDefId: string }> }

const MOCK_DEVICES: SimDeviceState[] = [
  { id: 'd-001', label: 'edge-router-01', type: 'router', status: 'on', cpuPct: 32.5, memPct: 55.2, uptimeTicks: 142 },
  { id: 'd-002', label: 'leaf-01', type: 'switch', status: 'on', cpuPct: 12.1, memPct: 28.7, uptimeTicks: 142 },
  { id: 'd-003', label: 'fw-01', type: 'firewall', status: 'on', cpuPct: 45.0, memPct: 62.3, uptimeTicks: 142 },
  { id: 'w-001', label: 'dev-station-01', type: 'workstation', status: 'on', cpuPct: 78.3, memPct: 44.1, uptimeTicks: 142 },
]

export default function PreviewLabPage({ params }: PageProps) {
  const { labDefId } = use(params)
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null)
  const selectedDevice = MOCK_DEVICES.find(d => d.id === selectedDeviceId) || null

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-slate-950">
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 dark:from-slate-950 dark:via-teal-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Link href="/teacher/labs" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Lab Preview</h1>
              <p className="text-sm text-teal-300 mt-0.5">ID: {labDefId.slice(0, 12)}…</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <LabTopology
            devices={MOCK_DEVICES}
            selectedDeviceId={selectedDeviceId}
            onSelectDevice={setSelectedDeviceId}
          />
          <DeviceInspector
            device={selectedDevice}
            onClose={() => setSelectedDeviceId(null)}
          />
        </div>
        <div className="col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 shadow-sm">
            <p className="text-gray-500 dark:text-slate-400 text-center">
              Select a device in the topology to inspect its live state.
              Real-time streaming from the engine will be shown in the lab workspace.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
