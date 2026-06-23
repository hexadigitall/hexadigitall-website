'use client'

import { useState } from 'react'
import { PersonalHomepage } from './PersonalHomepage'

function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const session = localStorage.getItem('admin_session')
    if (!session) return false
    const data = JSON.parse(session)
    return ['admin', 'teacher', 'student'].includes(data.role)
  } catch {
    return false
  }
}

export function AuthDashboardGate({ children }: { children: React.ReactNode }) {
  const [authed] = useState(isAuthenticated)

  if (authed) {
    return <PersonalHomepage />
  }

  return <>{children}</>
}
