'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { client } from '@/sanity/client'
import type { WidgetItem } from '@/contexts/HomepageContext'

interface Project {
  _id: string
  title: string
  slug: { current: string }
  description?: string
}

export function PortfolioWidget({ widget }: { widget: WidgetItem }) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = `*[_type == "project"]{_id, title, slug, description} | order(_createdAt desc)[0...3]`
    client.fetch<Project[]>(q)
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-5 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
          {widget.title || 'Portfolio'}
        </h3>
        <Link href="/portfolio" className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline">
          View all
        </Link>
      </div>
      {projects.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-slate-500">No projects yet.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <Link
              key={p._id}
              href={`/portfolio/${p.slug.current}`}
              className="block p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors group"
            >
              <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors">
                {p.title}
              </p>
              {p.description && (
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-1">{p.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
