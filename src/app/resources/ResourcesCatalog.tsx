'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { BookSummary } from '@/lib/book-queries'

type StatusFilter = 'all' | 'available' | 'coming_soon' | 'out_of_stock'

function normalize(value: string): string {
  return value.toLowerCase().trim()
}

function toSearchableText(book: BookSummary): string {
  const authors = (book.authors ?? []).join(' ')
  const description = book.description ?? ''
  const subtitle = book.subtitle ?? ''
  const edition = book.edition ?? ''
  const slug = book.slug?.current ?? ''
  return normalize(`${book.title} ${subtitle} ${authors} ${description} ${edition} ${slug}`)
}

function tokenize(value: string): string[] {
  return value.split(/[^a-z0-9+#.\-]+/i).filter(Boolean)
}

function looseSubsequenceMatch(text: string, query: string): boolean {
  let textIndex = 0
  let queryIndex = 0

  while (textIndex < text.length && queryIndex < query.length) {
    if (text[textIndex] === query[queryIndex]) queryIndex += 1
    textIndex += 1
  }

  return queryIndex === query.length
}

function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true

  const tokens = tokenize(text)
  if (tokens.some((token) => token.includes(query))) return true

  // Keep typo tolerance, but only for meaningful queries and per-token matching.
  if (query.length < 3) return false
  return tokens.some((token) => looseSubsequenceMatch(token, query))
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightText(text: string, query: string) {
  if (!query.trim()) return text

  const terms = query
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((term) => escapeRegExp(term))
    .sort((a, b) => b.length - a.length)

  if (terms.length === 0) return text

  const regex = new RegExp(`(${terms.join('|')})`, 'ig')
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (terms.some((term) => part.toLowerCase() === term.toLowerCase())) {
      return (
        <mark key={`${part}-${index}`} className="bg-yellow-100 text-inherit px-0.5 rounded">
          {part}
        </mark>
      )
    }
    return <span key={`${part}-${index}`}>{part}</span>
  })
}

export default function ResourcesCatalog({ books }: { books: BookSummary[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [status, setStatus] = useState<StatusFilter>((searchParams.get('status') as StatusFilter) || 'all')

  useEffect(() => {
    const nextQ = searchParams.get('q') ?? ''
    const nextStatus = (searchParams.get('status') as StatusFilter) || 'all'
    setQuery(nextQ)
    setStatus(nextStatus)
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams()

    if (query.trim()) params.set('q', query.trim())
    if (status !== 'all') params.set('status', status)

    const next = params.toString()
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }, [query, status, pathname, router])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/') return
      const target = event.target as HTMLElement | null
      if (target) {
        const tag = target.tagName
        const isEditable =
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          tag === 'SELECT' ||
          target.isContentEditable
        if (isEditable) return
      }
      event.preventDefault()
      searchInputRef.current?.focus()
      searchInputRef.current?.select()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const normalizedQuery = normalize(query)

  const statusFilteredBooks = useMemo(() => {
    if (status === 'all') return books
    return books.filter((book) => book.status === status)
  }, [books, status])

  const filteredBooks = useMemo(() => {
    if (!normalizedQuery) return statusFilteredBooks
    const terms = normalizedQuery.split(/\s+/).filter(Boolean)
    return statusFilteredBooks.filter((book) => {
      const searchable = toSearchableText(book)
      return terms.every((term) => fuzzyMatch(searchable, term))
    })
  }, [statusFilteredBooks, normalizedQuery])

  return (
    <>
      <section className="mb-10">
        <label htmlFor="resources-search" className="block text-sm font-semibold text-darkText dark:text-slate-300 mb-2">
          Search textbooks for resources
        </label>
        <div className="relative">
          <input
            ref={searchInputRef}
            id="resources-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, topic, or keyword"
            className="w-full rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 dark:text-slate-200 px-4 py-3 pr-28 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Search books for resources"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-gray-100 dark:bg-slate-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'available', label: 'Available' },
            { id: 'coming_soon', label: 'Coming Soon' },
            { id: 'out_of_stock', label: 'Out of Stock' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setStatus(item.id as StatusFilter)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                status === item.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p className="mt-2 text-xs text-gray-500 dark:text-slate-400">
          Showing {filteredBooks.length} of {books.length} textbook{books.length !== 1 ? 's' : ''}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
          Tip: Press / anywhere on this page to jump to search.
        </p>
      </section>

      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const coverUrl = book.coverImage?.asset?.url
            return (
              <Link
                key={book._id}
                href={`/resources/${book.slug.current}`}
                className="group flex gap-4 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
              >
                <div className="relative w-14 flex-shrink-0 rounded-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
                  {coverUrl ? (
                    <Image src={coverUrl} alt={book.title} fill sizes="56px" className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-xl">📘</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-darkText dark:text-slate-200 group-hover:text-primary transition-colors line-clamp-2">
                    {highlightText(book.title, query)}
                  </p>
                  {book.edition && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{highlightText(book.edition, query)}</p>}
                  <p className="text-xs text-secondary mt-2 font-medium">View resources →</p>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <section className="text-center py-16 text-gray-500 dark:text-slate-400 border border-dashed border-gray-200 dark:border-slate-600 rounded-2xl">
          <p className="text-2xl mb-2">No books found</p>
          <p className="text-sm">Try a different keyword like DevOps, JavaScript, AWS, or Design.</p>
        </section>
      )}
    </>
  )
}
