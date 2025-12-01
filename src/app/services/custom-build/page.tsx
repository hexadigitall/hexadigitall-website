// src/app/services/custom-build/page.tsx
import CustomBuildWizard from '../../../components/services/CustomBuildWizard'

export const dynamic = 'force-static'

export default function CustomBuildPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Build Your Custom Solution
          </h1>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Answer a few quick questions to get a tailored build plan and instant estimate.
          </p>
        </div>
        <CustomBuildWizard />
      </section>
    </main>
  )
}

