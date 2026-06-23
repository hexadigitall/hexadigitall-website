'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { WidgetItem } from '@/contexts/HomepageContext'

const ACTIVITY_KEY = 'hexadigitall_recent_activity'
const MAX_ITEMS = 5

interface ActivityEntry {
  path: string
  label: string
  action: string
  timestamp: number
  cta?: string
}

function readActivity(): ActivityEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY)
    if (!raw) return []
    const items = JSON.parse(raw) as ActivityEntry[]
    const now = Date.now()
    const sevenDays = 7 * 24 * 60 * 60 * 1000
    return items.filter((i) => now - i.timestamp < sevenDays).slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

function timeAgo(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const ACTION_LABELS: Record<string, string> = {
  viewed: 'Viewed',
  enrollment_started: 'Started enrollment',
  payment_initiated: 'Payment',
  build_started: 'Build in progress',
  contacted: 'Contacted us',
}

export function RecentActivityWidget({ widget }: { widget: WidgetItem }) {
  const [items, setItems] = useState<ActivityEntry[]>(() => readActivity())

  useEffect(() => {
    const interval = setInterval(() => setItems(readActivity()), 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="p-5">
      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3">
        {widget.title || 'Recent Activity'}
      </h3>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-slate-500">
          No recent activity. Pages you visit will appear here.
        </p>
      ) : (
        <div className="space-y-1">
          {items.map((item, i) => (
            <Link
              key={`${item.path}-${i}`}
              href={item.path}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
            >
              <div className="w-2 h-2 rounded-full bg-purple-400 dark:bg-purple-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-700 dark:text-slate-300 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors truncate">
                  {item.label}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500">
                  {ACTION_LABELS[item.action] || item.action} · {timeAgo(item.timestamp)}
                </p>
              </div>
              {item.cta && (
                <span className="text-[10px] font-medium text-purple-600 dark:text-purple-400 shrink-0">
                  {item.cta}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
