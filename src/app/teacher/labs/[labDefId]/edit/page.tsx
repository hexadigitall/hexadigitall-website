'use client'

import { use } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon, PencilIcon } from '@heroicons/react/24/outline'

type PageProps = { params: Promise<{ labDefId: string }> }

export default function EditLabPage({ params }: PageProps) {
  const { labDefId } = use(params)

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-slate-950">
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 dark:from-slate-950 dark:via-teal-950 dark:to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Link href="/teacher/labs" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit Lab</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-20 h-20 bg-teal-50 dark:bg-teal-950/20 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <PencilIcon className="h-10 w-10 text-teal-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">Edit mode coming in Phase 4</h2>
        <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          The lab editor will load the existing definition and allow you to modify
          topology, scenarios, instructions, and grading hints.
        </p>
        <p className="text-xs text-gray-400 dark:text-slate-500 font-mono">
          Lab ID: {labDefId}
        </p>
      </div>
    </div>
  )
}
