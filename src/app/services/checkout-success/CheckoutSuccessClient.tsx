"use client"

import React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function CheckoutSuccessClient() {
  const params = useSearchParams()
  const sessionId = params.get('session_id') || ''

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Successful</h1>
      <p className="text-gray-700 mb-4">Thank you! Your payment was processed successfully.</p>
      {sessionId && (
        <p className="text-sm text-gray-600">Stripe Session: {sessionId}</p>
      )}
         <Link href="/services" className="inline-block mt-6 px-4 py-2 bg-primary text-white rounded-lg">Return to Services</Link>
    </div>
  )
}
