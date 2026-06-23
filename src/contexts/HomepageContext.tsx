'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { TEMPLATES, getDefaultWidgetsForTemplate } from '@/data/homepageTemplates'

const LS_CONFIG_KEY = 'hexadigitall_homepage_config'

let widgetCounter = 0
function generateWidgetId(): string {
  widgetCounter += 1
  return `widget-${Date.now()}-${widgetCounter}`
}

export interface WidgetItem {
  widgetId: string
  type: string
  title: string
  config: { items: string[] }
  visible: boolean
  position: { section: number; order: number }
}

export interface HomepageConfig {
  template: string | null
  version: number
  widgets: WidgetItem[]
}

export type UserRole = 'anonymous' | 'student' | 'teacher' | 'admin' | null

interface HomepageContextValue {
  config: HomepageConfig | null
  template: string | null
  widgets: WidgetItem[]
  isLoading: boolean
  isSaving: boolean
  isEditing: boolean
  userRole: UserRole
  showOnboarding: boolean
  isDeciding: boolean

  setTemplate: (templateId: string) => void
  setIsDeciding: (deciding: boolean) => void
  addWidget: (type: string) => void
  removeWidget: (widgetId: string) => void
  updateWidget: (widgetId: string, updates: Partial<WidgetItem>) => void
  moveWidget: (widgetId: string, direction: 'up' | 'down') => void
  setIsEditing: (editing: boolean) => void
  setShowOnboarding: (show: boolean) => void
  save: () => Promise<void>
  resetToTemplate: (templateId?: string) => void
  clearConfig: () => void
}

const HomepageContext = createContext<HomepageContextValue | null>(null)

function loadFromLocalStorage(): HomepageConfig | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(LS_CONFIG_KEY)
    if (!raw) return null
    return JSON.parse(raw) as HomepageConfig
  } catch {
    return null
  }
}

function saveToLocalStorage(config: HomepageConfig): void {
  try {
    localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(config))
  } catch {
    /* localStorage full or unavailable */
  }
}

function createWidgetsFromTemplate(templateId: string): WidgetItem[] {
  const types = getDefaultWidgetsForTemplate(templateId)
  return types.map((type, index) => ({
    widgetId: `${type}-${index}`,
    type,
    title: '',
    config: { items: [] },
    visible: true,
    position: { section: 0, order: index },
  }))
}

async function loadFromApi(token: string): Promise<HomepageConfig | null> {
  try {
    const res = await fetch('/api/user/homepage-config', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.config) return null
    return {
      template: data.config.template || null,
      version: data.config.version || 1,
      widgets: (data.config.widgets || []).map((w: any) => ({
        widgetId: w.widgetId,
        type: w.type,
        title: w.title || '',
        config: w.config || { items: [] },
        visible: w.visible !== false,
        position: w.position || { section: 0, order: 0 },
      })),
    }
  } catch {
    return null
  }
}

async function saveToApi(token: string, config: HomepageConfig): Promise<boolean> {
  try {
    const res = await fetch('/api/user/homepage-config', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        template: config.template,
        version: config.version,
        widgets: config.widgets,
      }),
    })
    return res.ok
  } catch {
    return false
  }
}

function detectUserRole(): UserRole {
  if (typeof window === 'undefined') return null
  try {
    const session = localStorage.getItem('admin_session')
    if (!session) return 'anonymous'
    const data = JSON.parse(session)
    if (data.role === 'admin') return 'admin'
    if (data.role === 'teacher') return 'teacher'
    if (data.role === 'student') return 'student'
    return 'anonymous'
  } catch {
    return 'anonymous'
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('admin_token')
}

export function HomepageProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<HomepageConfig | null>(() => {
    if (typeof window === 'undefined') return null
    return loadFromLocalStorage()
  })
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === 'undefined') return true
    return !!getToken()
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(() => {
    if (typeof window === 'undefined') return false
    const local = loadFromLocalStorage()
    const token = getToken()
    return !local && !token
  })
  const [userRole, setUserRole] = useState<UserRole>(() => detectUserRole())
  const [isDeciding, setIsDeciding] = useState(false)
  const initialized = useRef(false)

  const template = config?.template ?? null
  const widgets = config?.widgets ?? []

  const updateAndPersist = useCallback((updated: HomepageConfig) => {
    setConfig(updated)
    saveToLocalStorage(updated)

    const token = getToken()
    if (token) {
      saveToApi(token, updated)
    }
  }, [])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const token = getToken()
    const localConfig = loadFromLocalStorage()

    if (!token) return

    loadFromApi(token).then((apiConfig) => {
      if (apiConfig) {
        setConfig(apiConfig)
        saveToLocalStorage(apiConfig)
        setShowOnboarding(false)
      } else if (localConfig) {
        saveToApi(token, localConfig)
        setShowOnboarding(false)
      } else {
        setShowOnboarding(true)
      }
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key !== 'admin_token' && e.key !== 'admin_session') return
      setUserRole(detectUserRole())

      if (e.key === 'admin_token') {
        const token = getToken()
        if (token) {
          setIsLoading(true)
          loadFromApi(token).then((apiConfig) => {
            const local = loadFromLocalStorage()
            if (apiConfig) {
              setConfig(apiConfig)
              saveToLocalStorage(apiConfig)
              setShowOnboarding(false)
            } else if (local) {
              saveToApi(token, local)
            }
            setIsLoading(false)
          })
        } else {
          const local = loadFromLocalStorage()
          setConfig(local)
          setShowOnboarding(!local)
          setIsLoading(false)
        }
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const setTemplate = useCallback(
    (templateId: string) => {
      const updated: HomepageConfig = {
        template: templateId,
        version: 1,
        widgets: createWidgetsFromTemplate(templateId),
      }
      updateAndPersist(updated)
      setShowOnboarding(false)
      setIsDeciding(false)
    },
    [updateAndPersist]
  )

  const addWidget = useCallback(
    (type: string) => {
      if (!config) return
      const newWidget: WidgetItem = {
        widgetId: generateWidgetId(),
        type,
        title: '',
        config: { items: [] },
        visible: true,
        position: { section: 0, order: config.widgets.length },
      }
      const updated: HomepageConfig = {
        ...config,
        widgets: [...config.widgets, newWidget],
      }
      updateAndPersist(updated)
    },
    [config, updateAndPersist]
  )

  const removeWidget = useCallback(
    (widgetId: string) => {
      if (!config) return
      const updated: HomepageConfig = {
        ...config,
        widgets: config.widgets.filter((w) => w.widgetId !== widgetId),
      }
      updateAndPersist(updated)
    },
    [config, updateAndPersist]
  )

  const updateWidget = useCallback(
    (widgetId: string, updates: Partial<WidgetItem>) => {
      if (!config) return
      const updated: HomepageConfig = {
        ...config,
        widgets: config.widgets.map((w) =>
          w.widgetId === widgetId ? { ...w, ...updates } : w
        ),
      }
      updateAndPersist(updated)
    },
    [config, updateAndPersist]
  )

  const moveWidget = useCallback(
    (widgetId: string, direction: 'up' | 'down') => {
      if (!config) return
      const idx = config.widgets.findIndex((w) => w.widgetId === widgetId)
      if (idx === -1) return
      if (direction === 'up' && idx === 0) return
      if (direction === 'down' && idx === config.widgets.length - 1) return

      const swapped = [...config.widgets]
      const swapIdx = direction === 'up' ? idx - 1 : idx + 1
      ;[swapped[idx], swapped[swapIdx]] = [swapped[swapIdx], swapped[idx]]

      const reordered = swapped.map((w, i) => ({
        ...w,
        position: { ...w.position, order: i },
      }))

      const updated: HomepageConfig = { ...config, widgets: reordered }
      updateAndPersist(updated)
    },
    [config, updateAndPersist]
  )

  const save = useCallback(async () => {
    if (!config) return
    setIsSaving(true)
    saveToLocalStorage(config)
    const token = getToken()
    if (token) {
      await saveToApi(token, config)
    }
    setIsSaving(false)
  }, [config])

  const resetToTemplate = useCallback(
    (templateId?: string) => {
      const tid = templateId || config?.template || 'explorer'
      const updated: HomepageConfig = {
        template: tid,
        version: 1,
        widgets: createWidgetsFromTemplate(tid),
      }
      updateAndPersist(updated)
      setShowOnboarding(false)
    },
    [config, updateAndPersist]
  )

  const clearConfig = useCallback(async () => {
    setConfig(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LS_CONFIG_KEY)
    }
    setShowOnboarding(true)
    const token = getToken()
    if (token) {
      try {
        await fetch('/api/user/homepage-config', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {
        /* best-effort */
      }
    }
  }, [])

  return (
    <HomepageContext.Provider
      value={{
        config,
        template,
        widgets,
        isLoading,
        isSaving,
        isEditing,
        userRole,
        showOnboarding,
        isDeciding,
        setTemplate,
        setIsDeciding,
        addWidget,
        removeWidget,
        updateWidget,
        moveWidget,
        setIsEditing,
        setShowOnboarding,
        save,
        resetToTemplate,
        clearConfig,
      }}
    >
      {children}
    </HomepageContext.Provider>
  )
}

export function useHomepage(): HomepageContextValue {
  const ctx = useContext(HomepageContext)
  if (!ctx) throw new Error('useHomepage must be used within HomepageProvider')
  return ctx
}
