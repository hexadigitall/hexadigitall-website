// src/app/services/custom-build/page.tsx
import CustomBuildWizard from '../../../components/services/CustomBuildWizard'

export const dynamic = 'force-static'

export default function CustomBuildPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50/30 to-slate-50">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Software Configurator
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
            🧭 Custom Build Wizard
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Configure your platform, features, and services with live pricing. Perfect for unique software needs.
          </p>
        </div>
        <CustomBuildWizard />
      </section>
    </main>
  )
}

