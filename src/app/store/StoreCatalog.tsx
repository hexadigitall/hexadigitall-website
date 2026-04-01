'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { BookSummary } from '@/lib/book-queries'
import BookCard from '@/app/store/BookCard'

interface StoreCatalogProps {
  books: BookSummary[]
}

type StatusFilter = 'all' | 'available' | 'coming_soon'

function normalize(value: string): string {
  return value.toLowerCase().trim()
}

function looseSubsequenceMatch(text: string, query: string): boolean {
  let textIndex = 0
  let queryIndex = 0

  while (textIndex < text.length && queryIndex < query.length) {
    if (text[textIndex] === query[queryIndex]) {
      queryIndex += 1
    }
    textIndex += 1
  }

  return queryIndex === query.length
}

function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true
  if (text.includes(query)) return true
  return looseSubsequenceMatch(text, query)
}

function toSearchableText(book: BookSummary): string {
  const authors = (book.authors ?? []).join(' ')
  const description = book.description ?? ''
  const subtitle = book.subtitle ?? ''
  const edition = book.edition ?? ''
  const slug = book.slug?.current ?? ''
  return normalize(`${book.title} ${subtitle} ${authors} ${description} ${edition} ${slug}`)
}

export default function StoreCatalog({ books }: StoreCatalogProps) {
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

    if (query.trim()) {
      params.set('q', query.trim())
    } else {
      params.delete('q')
    }

    if (status !== 'all') {
      params.set('status', status)
    } else {
      params.delete('status')
    }

    const next = params.toString()
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }, [query, status, pathname, router])

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

  const available = filteredBooks.filter((b) => b.status === 'available')
  const upcoming = filteredBooks.filter((b) => b.status === 'coming_soon')

  return (
    <>
      <section className="mb-10">
        <label htmlFor="store-search" className="block text-sm font-semibold text-darkText mb-2">
          Search textbooks
        </label>
        <div className="relative">
          <input
            ref={searchInputRef}
            id="store-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, topic, or keyword"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-28 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
            aria-label="Search books"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatus('all')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              status === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setStatus('available')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              status === 'available'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Available
          </button>
          <button
            type="button"
            onClick={() => setStatus('coming_soon')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              status === 'coming_soon'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Coming Soon
          </button>
        </div>

        <p className="mt-2 text-xs text-gray-500">
          Showing {filteredBooks.length} of {books.length} textbook{books.length !== 1 ? 's' : ''}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          Tip: Press / anywhere on this page to jump to search.
        </p>
      </section>

      {available.length > 0 && (
        <section className="mb-16">
          <h3 className="text-xl font-semibold text-darkText mb-6 border-b border-gray-200 pb-2">
            Available Now
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {available.map((book) => (
              <BookCard key={book._id} book={book} highlightTerm={query} />
            ))}
          </div>
        </section>
      )}

      {upcoming.length > 0 && (
        <section className="mb-16">
          <h3 className="text-xl font-semibold text-darkText mb-6 border-b border-gray-200 pb-2">
            Coming Soon
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {upcoming.map((book) => (
              <BookCard key={book._id} book={book} highlightTerm={query} />
            ))}
          </div>
        </section>
      )}

      {books.length > 0 && filteredBooks.length === 0 && (
        <section className="text-center py-16 text-gray-500 border border-dashed border-gray-200 rounded-2xl">
          <p className="text-2xl mb-2">No books found</p>
          <p className="text-sm">Try a different keyword like DevOps, JavaScript, AWS, or Design.</p>
        </section>
      )}
    </>
  )
}
