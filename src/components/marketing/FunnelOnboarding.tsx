"use client"
import React, { useState } from 'react'

export default function FunnelOnboarding({ onClose }: { onClose?: () => void }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="mb-4 p-4 rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-100">
      <div className="flex items-start justify-between">
        <div className="mr-4">
          <h4 className="text-sm font-semibold text-gray-900">Welcome — let’s make this simple</h4>
          <p className="text-xs text-gray-600 mt-1">We’ll guide you through 3 quick steps to get a tailored quote. You can skip anytime.</p>

          <ol className="mt-3 text-xs text-gray-700 space-y-1 list-decimal list-inside">
            <li><strong>Pick a package</strong> — choose the scope that fits your needs.</li>
            <li><strong>Tell us about your project</strong> — 2–3 short details are enough.</li>
            <li><strong>Confirm</strong> — complete the request and we’ll take it from there.</li>
          </ol>
        </div>

        <div className="flex-shrink-0 ml-4">
          <button
            onClick={() => {
              setDismissed(true)
              if (onClose) onClose()
            }}
            className="text-sm text-primary hover:underline"
            aria-label="Dismiss onboarding"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
