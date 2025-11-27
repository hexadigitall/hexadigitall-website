import React from 'react'
import ReactDOM from 'react-dom/client'
import { act } from 'react-dom/test-utils'

// The component under test (client-only)
import StartupFunnelClient from '@/components/marketing/StartupFunnelClient'

describe('StartupFunnelClient', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
    // Clear storage
    sessionStorage.clear()
    // Reset location
    // @ts-ignore
    delete window.location
    // @ts-ignore
    window.location = new URL('http://localhost/')
  })

  it('stores funnel arrival in sessionStorage and dispatches event when funnel query param present', async () => {
    // Set a funnel query param
    // @ts-ignore
    window.location = new URL('http://localhost/?funnel=have-an-idea')

    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = ReactDOM.createRoot(container)

    let received: any = null
    const handler = (e: CustomEvent) => { received = e.detail }
    window.addEventListener('funnel:arrive', handler as EventListener)

    await act(async () => {
      root.render(React.createElement(StartupFunnelClient))
      // Allow effects to run
      await new Promise((r) => setTimeout(r, 0))
    })

    const raw = sessionStorage.getItem('funnel.arrival')
    expect(raw).not.toBeNull()
    const parsed = JSON.parse(raw as string)
    expect(parsed.funnel).toBe('have-an-idea')
    expect(received).not.toBeNull()
    expect(received.funnel).toBe('have-an-idea')

    // cleanup
    window.removeEventListener('funnel:arrive', handler as EventListener)
    root.unmount()
  })
})
