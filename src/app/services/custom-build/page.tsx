"use client"

import Link from 'next/link'

export default function CustomBuildPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-green-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-6 py-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-gray-900 mb-4">
              Build a Custom Solution
            </h1>
            <p className="text-lg text-gray-600">
              Combine website and mobile app options, add or remove features, and tailor everything to your exact needs.
              This flexible builder is in progress—tell us your requirements and we’ll craft a transparent quote.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="card-enhanced rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What would you like to build?</h2>
          <p className="text-gray-600 mb-6">
            We’re rolling out an interactive builder soon. For now, click below to start a custom request.
          </p>

          <Link
            href="/services"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-colors"
          >
            Browse Services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
