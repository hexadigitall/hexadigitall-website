'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { client } from '@/sanity/client'
import { useHomepage } from '@/contexts/HomepageContext'
import type { WidgetItem } from '@/contexts/HomepageContext'

interface Lab {
  _id: string
  title: string
  slug: { current: string }
  difficulty?: string
}

export function LabsWidget({ widget }: { widget: WidgetItem }) {
  const { userRole } = useHomepage()
  const [labs, setLabs] = useState<Lab[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = `*[_type == "simLabDefinition" && published == true]{_id, title, slug, difficulty} | order(_createdAt desc)[0...4]`
    client.fetch<Lab[]>(q)
      .then(setLabs)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const linkTo = userRole === 'teacher' ? '/teacher/labs'
    : userRole === 'student' ? '/student/labs'
    : '/courses'

  if (loading) {
    return (
      <div className="p-5 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  const difficultyColor = (d?: string) => {
    if (d === 'Beginner') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
    if (d === 'Intermediate') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
    if (d === 'Advanced') return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
    return 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400'
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
          {widget.title || 'Simulation Labs'}
        </h3>
        <Link href={linkTo} className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline">
          View all
        </Link>
      </div>
      {labs.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-slate-500">No labs available.</p>
      ) : (
        <div className="space-y-2">
          {labs.map((lab) => (
            <div
              key={lab._id}
              className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate flex-1">
                  {lab.title}
                </p>
                {lab.difficulty && (
                  <span className={`ml-2 inline-flex px-1.5 py-0.5 text-[10px] font-medium rounded-md shrink-0 ${difficultyColor(lab.difficulty)}`}>
                    {lab.difficulty}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
