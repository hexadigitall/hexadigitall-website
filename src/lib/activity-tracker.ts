'use client'

const ACTIVITY_KEY = 'hexadigitall_recent_activity'
const MAX_ITEMS = 50

export interface ActivityEntry {
  path: string
  label: string
  action: string
  timestamp: number
  cta?: string
}

function readAll(): ActivityEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(items: ActivityEntry[]): void {
  try {
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(items))
  } catch {
    /* localStorage full or unavailable */
  }
}

export function trackPageView(path: string, label: string): void {
  const entry: ActivityEntry = { path, label, action: 'viewed', timestamp: Date.now() }
  appendActivity(entry)
}

export function trackAction(path: string, label: string, action: string, cta?: string): void {
  const entry: ActivityEntry = { path, label, action, timestamp: Date.now(), cta }
  appendActivity(entry)
}

function appendActivity(entry: ActivityEntry): void {
  const items = readAll()
  items.unshift(entry)
  if (items.length > MAX_ITEMS) items.length = MAX_ITEMS
  writeAll(items)
}

export function clearActivity(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ACTIVITY_KEY)
}
