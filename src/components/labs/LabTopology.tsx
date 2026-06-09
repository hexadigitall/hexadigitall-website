'use client'

import { ServerIcon, CircleStackIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import type { SimDeviceState, SimDevicePort } from '@/types/simulation'

interface LabTopologyProps {
  devices: SimDeviceState[]
  selectedDeviceId: string | null
  onSelectDevice: (deviceId: string | null) => void
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

const STATUS_COLORS: Record<string, string> = {
  on: 'bg-emerald-400',
  off: 'bg-gray-400',
  post: 'bg-amber-400',
  booting: 'bg-blue-400',
  failure: 'bg-red-400',
  error: 'bg-red-400',
  up: 'bg-emerald-400',
  down: 'bg-red-400',
}

export default function LabTopology({ devices, selectedDeviceId, onSelectDevice }: LabTopologyProps) {
  if (devices.length === 0) {
    return (
      <div className="space-y-2 p-3">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Topology</h3>
        <p className="text-xs text-slate-600">No devices in topology.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 p-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Topology</h3>
        <span className="text-xs text-slate-500">{devices.length} devices</span>
      </div>

      <div className="space-y-1.5">
        {devices.map((device) => {
          const Icon = DEVICE_ICONS[device.type] || ServerIcon
          const isSelected = selectedDeviceId === device.id

          return (
            <div key={device.id}>
              <button
                onClick={() => onSelectDevice(isSelected ? null : device.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors text-left ${
                  isSelected
                    ? 'bg-slate-700/60 border-cyan-500/50'
                    : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-700/40'
                }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${STATUS_COLORS[device.status] || 'bg-gray-400'}`} />
                <Icon className="h-4 w-4 text-slate-400 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{device.label}</p>
                  <p className="text-xs text-slate-500">{device.type}</p>
                </div>
                {device.cpuPct !== undefined && (
                  <span className="text-[10px] font-mono text-slate-500">{device.cpuPct}%</span>
                )}
              </button>

              {device.children && device.children.length > 0 && (
                <div className="ml-6 mt-1 space-y-0.5 border-l-2 border-slate-700/50 pl-3">
                  {device.children.map((child: SimDevicePort) => (
                    <div key={child.id} className="flex items-center gap-2 px-2 py-1 rounded bg-slate-800/20">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_COLORS[child.status] || 'bg-gray-400'}`} />
                      <ArrowPathIcon className="h-3 w-3 text-slate-500 shrink-0" />
                      <span className="text-xs text-slate-400 truncate">{child.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
