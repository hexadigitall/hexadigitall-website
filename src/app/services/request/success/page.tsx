"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface ServiceRequest {
  requestId?: string;
  selectedPackage?: { name?: string };
  totalAmount?: number;
  projectDetails?: { title?: string };
  clientInfo?: { firstName?: string; lastName?: string; email?: string };
}

export default function ServiceRequestSuccessPage() {
  const searchParams = useSearchParams()
  const [isConfirming, setIsConfirming] = useState(true)
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sessionId = searchParams.get('session_id')
  const requestId = searchParams.get('request_id')

  useEffect(() => {
    const confirmPayment = async () => {
      if (!sessionId || !requestId) {
        setError('Missing payment information')
        setIsConfirming(false)
        return
      }

      try {
        const response = await fetch('/api/service-request/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            requestId
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to confirm payment')
        }

        setServiceRequest(data.serviceRequest)
      } catch (err) {
        console.error('Payment confirmation error:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      } finally {
        setIsConfirming(false)
      }
    }

    confirmPayment()
  }, [sessionId, requestId])

  if (isConfirming) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Confirming Your Payment</h2>
          <p className="text-gray-600">Please wait while we process your service request...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Confirmation Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/contact"
            className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-600 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Service Request Confirmed!
            </h1>
            <p className="text-green-100 text-lg">
              Thank you for choosing Hexadigitall. Your project has been successfully initiated.
            </p>
          </div>

          {/* Request Details */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Request Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Request ID:</span>
                    <p className="text-gray-900 font-mono">{serviceRequest?.requestId}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Service:</span>
                    <p className="text-gray-900">{serviceRequest?.selectedPackage?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Payment Confirmed
                    </span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Total Paid:</span>
                    <p className="text-gray-900 font-semibold">${serviceRequest?.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Project Title:</span>
                    <p className="text-gray-900">{serviceRequest?.projectDetails?.title}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Client:</span>
                    <p className="text-gray-900">
                      {serviceRequest?.clientInfo?.firstName} {serviceRequest?.clientInfo?.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-gray-900">{serviceRequest?.clientInfo?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Initial Review</h3>
              <p className="text-gray-600">
                Our team will review your requirements and contact you within 24 hours to discuss details.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Project Kickoff</h3>
              <p className="text-gray-600">
                We'll schedule a kickoff meeting to align on goals, timeline, and deliverables.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Development Begins</h3>
              <p className="text-gray-600">
                Our experts will begin working on your project with regular updates on progress.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Need to Get in Touch?</h3>
              <p className="text-blue-800 mb-4">
                If you have any questions about your project or need to provide additional information, 
                don&apos;t hesitate to contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Contact Us
                </Link>
                <a
                  href={`mailto:hello@hexadigitall.com?subject=Service Request ${serviceRequest?.requestId}`}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Directly
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0v-6a1 1 0 011-1h2a1 1 0 011 1v6m3 0a1 1 0 001-1V10M9 21h6" />
            </svg>
            Back to Home
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  )
}
