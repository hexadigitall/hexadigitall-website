'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { client } from '@/sanity/client'
import { useHomepage } from '@/contexts/HomepageContext'
import type { WidgetItem } from '@/contexts/HomepageContext'

interface Book {
  _id: string
  title: string
  slug: { current: string }
  authors?: string[]
  status?: string
}

export function TextbooksWidget({ widget }: { widget: WidgetItem }) {
  const { userRole } = useHomepage()
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = `*[_type == "book"]{_id, title, slug, authors, status} | order(_createdAt desc)[0...4]`
    client.fetch<Book[]>(q)
      .then(setBooks)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-5 space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  const available = books.filter((b) => b.status === 'available')
  const canReadOnline = userRole === 'teacher' || userRole === 'admin'

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
          {widget.title || 'Textbooks'}
        </h3>
        <Link href="/store" className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline">
          Visit store
        </Link>
      </div>
      {available.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-slate-500">No textbooks available.</p>
      ) : (
        <div className="space-y-2">
          {available.map((b) => (
            <Link
              key={b._id}
              href={`/store/${b.slug.current}`}
              className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors group"
            >
              <div className="w-8 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                {b.title.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors truncate">
                  {b.title}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">
                  {b.authors?.join(', ') || 'Hexadigitall'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      {userRole === 'student' && (
        <Link
          href="/student/dashboard"
          className="mt-3 block text-center text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
        >
          My Library →
        </Link>
      )}
    </div>
  )
}
