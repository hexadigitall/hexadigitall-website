'use client'

import { useState, useCallback } from 'react'

const CONSENT_KEY = 'hexadigitall_consent'

export interface ConsentState {
  essential: true
  analytics: boolean
  personalization: boolean
  version: number
  updatedAt: string
}

const CURRENT_VERSION = 1

function defaultConsent(): ConsentState {
  return {
    essential: true,
    analytics: false,
    personalization: false,
    version: CURRENT_VERSION,
    updatedAt: new Date().toISOString(),
  }
}

function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as ConsentState
  } catch {
    return null
  }
}

function writeConsent(state: ConsentState): void {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
}

export function getConsent(): ConsentState | null {
  return readConsent()
}

export function setConsent(partial: Partial<ConsentState>): ConsentState {
  const current = readConsent() ?? defaultConsent()
  const updated: ConsentState = {
    ...current,
    ...partial,
    essential: true,
    version: CURRENT_VERSION,
    updatedAt: new Date().toISOString(),
  }
  writeConsent(updated)
  return updated
}

export function hasConsent(type: 'analytics' | 'personalization'): boolean {
  const consent = readConsent()
  if (!consent) return false
  return consent[type] === true
}

export function resetConsent(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CONSENT_KEY)
}

export function useConsent() {
  const [consent, setConsentState] = useState<ConsentState | null>(() => readConsent())

  const acceptAll = useCallback(() => {
    const updated = setConsent({ analytics: true, personalization: true })
    setConsentState(updated)
  }, [])

  const acceptEssential = useCallback(() => {
    const updated = setConsent({ analytics: false, personalization: false })
    setConsentState(updated)
  }, [])

  const acceptCustom = useCallback(
    (analytics: boolean, personalization: boolean) => {
      const updated = setConsent({ analytics, personalization })
      setConsentState(updated)
    },
    []
  )

  const revoke = useCallback(() => {
    resetConsent()
    setConsentState(null)
  }, [])

  const checkConsent = useCallback((type: 'analytics' | 'personalization'): boolean => {
    const c = readConsent()
    if (!c) return false
    return c[type] === true
  }, [])

  return {
    consent,
    acceptAll,
    acceptEssential,
    acceptCustom,
    revoke,
    hasConsent: checkConsent,
  }
}
