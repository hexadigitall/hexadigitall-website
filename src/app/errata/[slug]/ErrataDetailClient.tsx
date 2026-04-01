'use client'

import { useMemo, useState } from 'react'
import type { ErrataItem } from '@/lib/book-queries'

const SEVERITY_STYLES: Record<string, { badge: string; label: string }> = {
  minor: { badge: 'bg-gray-100 text-gray-600', label: 'Typo / Minor' },
  content: { badge: 'bg-amber-100 text-amber-700', label: 'Content Error' },
  code: { badge: 'bg-blue-100 text-blue-700', label: 'Code Error' },
  critical: { badge: 'bg-red-100 text-red-700', label: 'Critical' },
}

type SeverityFilter = 'all' | 'minor' | 'content' | 'code' | 'critical'

function normalize(value: string): string {
  return value.toLowerCase().trim()
}

function toSearchableText(item: ErrataItem): string {
  return normalize([
    item.page,
    item.location,
    item.original,
    item.correction,
    item.fixedInEdition,
    item.severity,
  ].filter(Boolean).join(' '))
}

interface ErrataDetailClientProps {
  errata: ErrataItem[]
}

export default function ErrataDetailClient({ errata }: ErrataDetailClientProps) {
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState<SeverityFilter>('all')

  const normalizedQuery = normalize(query)

  const filteredErrata = useMemo(() => {
    const bySeverity = severity === 'all' ? errata : errata.filter((item) => item.severity === severity)
    if (!normalizedQuery) return bySeverity

    const terms = normalizedQuery.split(/\s+/).filter(Boolean)
    return bySeverity.filter((item) => {
      const searchable = toSearchableText(item)
      return terms.every((term) => searchable.includes(term))
    })
  }, [errata, normalizedQuery, severity])

  return (
    <section className="mb-16">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 mb-6">
        <label htmlFor="errata-search" className="block text-sm font-semibold text-darkText mb-2">
          Search corrections
        </label>
        <input
          id="errata-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by page, chapter, incorrect text, or correction"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSeverity('all')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              severity === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setSeverity('minor')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              severity === 'minor' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Minor
          </button>
          <button
            type="button"
            onClick={() => setSeverity('content')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              severity === 'content' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Content
          </button>
          <button
            type="button"
            onClick={() => setSeverity('code')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              severity === 'code' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Code
          </button>
          <button
            type="button"
            onClick={() => setSeverity('critical')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              severity === 'critical' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Critical
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Showing {filteredErrata.length} of {errata.length} correction{errata.length !== 1 ? 's' : ''}
        </p>
      </div>

      {filteredErrata.length > 0 ? (
        <div className="space-y-4">
          {filteredErrata.map((item) => (
            <article key={item._key} className="p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {item.page && (
                  <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    p.{item.page}
                  </span>
                )}
                {item.location && (
                  <span className="text-sm text-gray-500">{item.location}</span>
                )}
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${SEVERITY_STYLES[item.severity]?.badge ?? 'bg-gray-100 text-gray-600'}`}>
                  {SEVERITY_STYLES[item.severity]?.label ?? item.severity}
                </span>
                {item.fixedInEdition && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Fixed in {item.fixedInEdition}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">Incorrect</p>
                  <p className="text-gray-700 bg-red-50 rounded-lg p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">{item.original}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-green-500 uppercase tracking-wider mb-1">Correction</p>
                  <p className="text-gray-700 bg-green-50 rounded-lg p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap">{item.correction}</p>
                </div>
              </div>

              {item.reportedAt && (
                <p className="text-xs text-gray-400 mt-3">
                  Reported {new Date(item.reportedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl bg-white">
          <p className="text-2xl mb-2">No matching corrections</p>
          <p className="text-sm">Try changing the search term or severity filter.</p>
        </div>
      )}
    </section>
  )
}
