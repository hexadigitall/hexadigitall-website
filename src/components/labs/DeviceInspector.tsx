'use client'

import { XMarkIcon, ServerIcon, CircleStackIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import type { SimDeviceState, SimDevicePort } from '@/types/simulation'

interface DeviceInspectorProps {
  device: SimDeviceState | null
  onClose: () => void
}

const DEVICE_ICONS: Record<string, typeof ServerIcon> = {
  router: ServerIcon,
  switch: ServerIcon,
  firewall: ServerIcon,
  gnb: CircleStackIcon,
  'cellular-modem': CircleStackIcon,
  workstation: ServerIcon,
  'iot-sensor': CircleStackIcon,
  'edge-gateway': CircleStackIcon,
}

const STATUS_BADGE: Record<string, string> = {
  on: 'bg-emerald-900/50 text-emerald-300',
  off: 'bg-gray-700 text-gray-400',
  booting: 'bg-blue-900/50 text-blue-300',
  post: 'bg-amber-900/50 text-amber-300',
  failure: 'bg-red-900/50 text-red-300',
  error: 'bg-red-900/50 text-red-300',
}

function GaugeBar({ label, value, unit, color }: { label: string; value?: number; unit: string; color: string }) {
  if (value === undefined || value === null) return null
  const pct = Math.min(value, 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="text-slate-300 font-mono">{value}{unit}</span>
      </div>
      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export default function DeviceInspector({ device, onClose }: DeviceInspectorProps) {
  if (!device) {
    return (
      <div className="space-y-2 p-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inspector</h3>
        <p className="text-xs text-slate-600">Select a device to inspect its registers and state.</p>
      </div>
    )
  }

  const Icon = DEVICE_ICONS[device.type] || ServerIcon

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inspector</h3>
        <button onClick={onClose} className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors">
          <XMarkIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Device identity */}
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
        <Icon className="h-5 w-5 text-slate-300" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-100 truncate">{device.label}</p>
          <p className="text-xs text-slate-500">{device.type}</p>
        </div>
        <span className={`ml-auto inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[device.status] || 'bg-gray-700 text-gray-400'}`}>
          {device.status}
        </span>
      </div>

      {/* Resource gauges */}
      <div className="space-y-2 px-1">
        <GaugeBar label="CPU" value={device.cpuPct} unit="%" color="bg-cyan-400" />
        <GaugeBar label="Memory" value={device.memPct} unit="%" color="bg-purple-400" />
        {device.uptimeTicks !== undefined && (
          <div className="flex justify-between text-xs">
            <span className="text-slate-400">Uptime</span>
            <span className="text-slate-300 font-mono">{device.uptimeTicks} ticks</span>
          </div>
        )}
      </div>

      {/* Ports */}
      {device.children && device.children.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">Interfaces</h4>
          {device.children.map((port: SimDevicePort) => (
            <div key={port.id} className="flex items-center gap-2 px-2 py-1.5 rounded bg-slate-800/30 border border-slate-700/30">
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${port.status === 'up' ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <ArrowPathIcon className="h-3 w-3 text-slate-500 shrink-0" />
              <span className="text-xs text-slate-300 truncate flex-1">{port.label}</span>
              <span className="text-[10px] text-slate-500 font-mono">
                {port.status}
              </span>
              {(port.rxBytes !== undefined || port.txBytes !== undefined) && (
                <span className="text-[10px] text-slate-500 font-mono">
                  {port.rxBytes !== undefined ? `${(port.rxBytes / 1e6).toFixed(0)}M` : ''}/
                  {port.txBytes !== undefined ? `${(port.txBytes / 1e6).toFixed(0)}M` : ''}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
