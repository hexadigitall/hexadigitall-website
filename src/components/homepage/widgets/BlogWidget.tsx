'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { WidgetItem } from '@/contexts/HomepageContext'

interface Post {
  _id: string
  title: string
  slug: { current: string }
  publishedAt?: string
  excerpt?: string
}

export function BlogWidget({ widget }: { widget: WidgetItem }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/blog-posts?limit=3')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setPosts(d.posts || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-5 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100">
          {widget.title || 'Latest Articles'}
        </h3>
        <Link href="/blog" className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline">
          View all
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-slate-500">No articles yet.</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="block p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors group"
            >
              <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors truncate">
                {post.title}
              </p>
              {post.excerpt && (
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-1">{post.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
