"use client"
import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

export default function StartupFunnelClient() {
  useEffect(() => {
    // Delegate clicks for elements with data-funnel attribute
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-funnel]') as HTMLElement | null
      if (!target) return
      const funnel = target.getAttribute('data-funnel') || 'unknown'
      const href = (target as HTMLAnchorElement).href || window.location.href
      trackEvent('funnel_click', { event_category: 'funnel', event_label: funnel, link: href })
    }

    const onArrival = () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const f = params.get('funnel')
        if (f) {
          trackEvent('funnel_arrival', { event_category: 'funnel', event_label: f, page: window.location.pathname })
          // Persist a short-lived marker so modals opened after navigation can show onboarding
          try {
            const payload = JSON.stringify({ funnel: f, ts: Date.now() })
            sessionStorage.setItem('funnel.arrival', payload)
          } catch {
            // ignore storage errors
          }
          // Dispatch a custom event so pages can react (open modals, etc.)
          window.dispatchEvent(new CustomEvent('funnel:arrive', { detail: { funnel: f } }))
        }
      } catch {
        // ignore
      }
    }

    document.addEventListener('click', onClick)
    // fire arrival event immediately
    onArrival()

    return () => {
      document.removeEventListener('click', onClick)
    }
  }, [])

  return null
}
