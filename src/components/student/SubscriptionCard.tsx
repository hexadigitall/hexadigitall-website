'use client'

import { useEffect, useState } from 'react'
import { CreditCardIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface SubscriptionCardProps {
  expiryDate: string
  monthlyAmount: number
  paymentStatus: string
  courseTitle?: string
  courseSlug?: string
  enrollmentId: string
}

export default function SubscriptionCard({
  expiryDate,
  monthlyAmount,
  paymentStatus,
  courseTitle = 'Your Course',
  courseSlug,
  enrollmentId,
}: SubscriptionCardProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null)
  const [isExpiringSoon, setIsExpiringSoon] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [renewalLoading, setRenewalLoading] = useState(false)

  useEffect(() => {
    const calculateDaysRemaining = () => {
      const expiry = new Date(expiryDate).getTime()
      const now = new Date().getTime()
      const diffMs = expiry - now
      const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

      setDaysRemaining(days)
      setIsExpiringSoon(days <= 7 && days > 0)
      setIsExpired(days <= 0)
    }

    calculateDaysRemaining()
    const interval = setInterval(calculateDaysRemaining, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [expiryDate])

  const handleRenew = async () => {
    setRenewalLoading(true)
    try {
      // Call the renewal endpoint
      const response = await fetch('/api/student/renew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          monthlyAmount,
        }),
      })

      if (response.ok) {
        const { authorization_url } = await response.json()
        // Redirect to Paystack payment
        window.location.href = authorization_url
      } else {
        const error = await response.json()
        console.error('Renewal error:', error)
        alert('Failed to initiate renewal. Please try again.')
      }
    } catch (error) {
      console.error('Renewal error:', error)
      alert('An error occurred. Please try again.')
    } finally {
      setRenewalLoading(false)
    }
  }

  const formattedExpiry = new Date(expiryDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-semibold text-gray-900" id="subscription-status-heading" role="heading" aria-level={3}>
            Subscription Status
          </h3>
          {paymentStatus === 'active' && (
             <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full" aria-label="Subscription is active" role="status">
              Active
            </span>
          )}
          {isExpired && (
             <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full" aria-label="Subscription has expired" role="status">
              Expired
            </span>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-6">{courseTitle}</p>

        {/* Expiry Date */}
        <div className="flex items-start mb-4 pb-4 border-b border-gray-200">
           <CalendarIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Expiry Date
            </p>
            <p className="text-sm font-medium text-gray-900">
              {formattedExpiry}
            </p>
          </div>
        </div>

        {/* Days Remaining */}
        {daysRemaining !== null && !isExpired && (
          <div className="flex items-start mb-4 pb-4 border-b border-gray-200">
             <ClockIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Time Remaining
              </p>
              <p
                className={`text-sm font-medium ${
                  isExpiringSoon ? 'text-orange-600' : 'text-gray-900'
                }`}
              >
                {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
              </p>
              {isExpiringSoon && (
                 <p className="text-xs text-orange-600 mt-1" role="alert">
                  ⚠️ Your subscription is expiring soon
                </p>
              )}
            </div>
          </div>
        )}

        {/* Monthly Amount */}
        <div className="flex items-start mb-6 pb-4 border-b border-gray-200">
           <CreditCardIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Monthly Fee
            </p>
            <p className="text-sm font-medium text-gray-900">
              ₦{monthlyAmount.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {(isExpiringSoon || isExpired) && (
            <button
              onClick={handleRenew}
              disabled={renewalLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                         aria-label="Click to renew your subscription"
                         aria-busy={renewalLoading}
            >
              {renewalLoading ? 'Processing...' : 'Renew Subscription'}
            </button>
          )}

          {!isExpired && (
            <Link
              href={courseSlug ? `/courses/${courseSlug}` : '/courses'}
              className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-200"
                         aria-label={`Navigate to ${courseTitle} course details`}
            >
              View Course
            </Link>
          )}

          {isExpired && (
            <button
              onClick={handleRenew}
              disabled={renewalLoading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                         aria-label="Renew expired subscription"
                         aria-busy={renewalLoading}
            >
              {renewalLoading ? 'Processing...' : 'Renew Now'}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!isExpired && daysRemaining !== null && (
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Subscription Progress</span>
            <span className="text-xs text-gray-600">
              {Math.max(0, Math.round((daysRemaining / 30) * 100))}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isExpiringSoon ? 'bg-orange-500' : 'bg-green-500'
              }`}
              style={{
                width: `${Math.max(0, Math.round((daysRemaining / 30) * 100))}%`,
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}
