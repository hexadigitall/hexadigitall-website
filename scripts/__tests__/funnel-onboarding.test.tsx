import React from 'react'
import ReactDOM from 'react-dom/client'
import { act } from 'react-dom/test-utils'

import FunnelOnboarding from '@/components/marketing/FunnelOnboarding'

describe('FunnelOnboarding', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('renders onboarding content and dismisses when Got it is clicked', async () => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = ReactDOM.createRoot(container)

    await act(async () => {
      root.render(React.createElement(FunnelOnboarding, { onClose: undefined }))
      await new Promise((r) => setTimeout(r, 0))
    })

    // Expect heading text
    expect(container.textContent).toContain('Welcome — let’s make this simple')
    expect(container.textContent).toContain('Pick a package')

    // Click the Got it button to dismiss
    const button = container.querySelector('button') as HTMLButtonElement
    expect(button).not.toBeNull()

    await act(async () => {
      button.click()
      await new Promise((r) => setTimeout(r, 0))
    })

    // After dismiss, the container should be empty or not contain the heading
    expect(container.textContent).not.toContain('Welcome — let’s make this simple')

    root.unmount()
  })
})
