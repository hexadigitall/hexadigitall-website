'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { hasConsent } from '@/lib/consent'
import { trackPageView } from '@/lib/activity-tracker'

const BLOCKED_PREFIXES = [
  '/admin',
  '/api',
  '/studio',
  '/student/login',
  '/teacher/login',
  '/student/signup',
  '/teacher/signup',
]

function shouldTrack(path: string): boolean {
  return !BLOCKED_PREFIXES.some((prefix) => path.startsWith(prefix))
}

function pageLabel(path: string): string {
  if (path === '/' || path === '') return 'Homepage'
  const segments = path.split('/').filter(Boolean)
  if (segments.length === 0) return 'Homepage'
  if (segments.length === 1) {
    return segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
  }
  return segments
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' · ')
}

export function ActivityTracker(): null {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (!hasConsent('personalization')) return
    if (!shouldTrack(pathname)) return
    if (pathname === lastPath.current) return
    lastPath.current = pathname
    trackPageView(pathname, pageLabel(pathname))
  }, [pathname])

  return null
}
