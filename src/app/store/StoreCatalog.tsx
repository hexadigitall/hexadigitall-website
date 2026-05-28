'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { BookSummary } from '@/lib/book-queries'
import BookCard from '@/app/store/BookCard'

interface StoreCatalogProps {
  books: BookSummary[]
}

type StatusFilter = 'all' | 'available' | 'coming_soon'
type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'all_levels'
type TypeFilter = 'all' | 'book' | 'imprint'

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
  const authorName = book.author?.name ?? ''
  const description = book.description ?? ''
  const subtitle = book.subtitle ?? ''
  const edition = book.edition ?? ''
  const slug = book.slug?.current ?? ''
  return normalize(`${book.title} ${subtitle} ${authors} ${authorName} ${description} ${edition} ${slug}`)
}

export default function StoreCatalog({ books }: StoreCatalogProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [status, setStatus] = useState<StatusFilter>((searchParams.get('status') as StatusFilter) || 'all')
  const [level, setLevel] = useState<LevelFilter>((searchParams.get('level') as LevelFilter) || 'all')
  const [type, setType] = useState<TypeFilter>((searchParams.get('type') as TypeFilter) || 'all')

  useEffect(() => {
    const nextQ = searchParams.get('q') ?? ''
    const nextStatus = (searchParams.get('status') as StatusFilter) || 'all'
    const nextLevel = (searchParams.get('level') as LevelFilter) || 'all'
    const nextType = (searchParams.get('type') as TypeFilter) || 'all'
    setQuery(nextQ)
    setStatus(nextStatus)
    setLevel(nextLevel)
    setType(nextType)
  }, [searchParams])

  useEffect(() => {
    const params = new URLSearchParams()

    if (query.trim()) {
      params.set('q', query.trim())
    }

    if (status !== 'all') {
      params.set('status', status)
    }

    if (level !== 'all') {
      params.set('level', level)
    }

    if (type !== 'all') {
      params.set('type', type)
    }

    const next = params.toString()
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }, [query, status, level, type, pathname, router])

  const normalizedQuery = normalize(query)

  const typeFilteredBooks = useMemo(() => {
    if (type === 'all') return books
    return books.filter((book) => book._type === type)
  }, [books, type])

  const statusFilteredBooks = useMemo(() => {
    if (status === 'all') return typeFilteredBooks
    return typeFilteredBooks.filter((book) => book.status === status)
  }, [typeFilteredBooks, status])

  const levelFilteredBooks = useMemo(() => {
    if (level === 'all') return statusFilteredBooks
    if (level === 'all_levels') return statusFilteredBooks.filter((book) => book.level === 'all')
    return statusFilteredBooks.filter((book) => book.level === level)
  }, [statusFilteredBooks, level])

  const filteredBooks = useMemo(() => {
    if (!normalizedQuery) return levelFilteredBooks

    const terms = normalizedQuery.split(/\s+/).filter(Boolean)
    return levelFilteredBooks.filter((book) => {
      const searchable = toSearchableText(book)
      return terms.every((term) => fuzzyMatch(searchable, term))
    })
  }, [levelFilteredBooks, normalizedQuery])

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
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        {/* Filters Sidebar */}
        <aside className="space-y-10">
          <div>
            <label htmlFor="store-search" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4">
              Filter Ecosystem
            </label>
            <div className="relative">
              <input
                ref={searchInputRef}
                id="store-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-slate-900 dark:text-white transition-all"
                aria-label="Search resources"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Resource Type</p>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'Everything' },
                  { id: 'book', label: 'Course Textbooks' },
                  { id: 'imprint', label: 'Digital Imprints' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setType(f.id as TypeFilter)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      type === f.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Availability</p>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'All Status' },
                  { id: 'available', label: 'Available Now' },
                  { id: 'coming_soon', label: 'Coming Soon' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatus(f.id as StatusFilter)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      status === f.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Difficulty</p>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'all', label: 'All Levels' },
                  { id: 'beginner', label: 'Beginner' },
                  { id: 'intermediate', label: 'Intermediate' },
                  { id: 'advanced', label: 'Advanced' }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setLevel(f.id as LevelFilter)}
                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      level === f.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
              Displaying {filteredBooks.length} items from master list.
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-1">
              Press "/" to quick-search.
            </p>
          </div>
        </aside>

        {/* Results Area */}
        <div className="flex-1">
          {available.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
              {available.map((book) => (
                <BookCard key={book._id} book={book} highlightTerm={query} />
              ))}
            </div>
          )}

          {upcoming.length > 0 && (
            <div className="space-y-10">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4">
                Pipeline / Coming Soon
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {upcoming.map((book) => (
                  <BookCard key={book._id} book={book} highlightTerm={query} />
                ))}
              </div>
            </div>
          )}

          {books.length > 0 && filteredBooks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
              <p className="text-slate-900 dark:text-white font-bold text-xl mb-2">No matching resources</p>
              <p className="text-slate-500 text-sm">Adjust filters or try a broader search term.</p>
              <button onClick={() => { setQuery(''); setType('all'); setStatus('all'); setLevel('all'); }} className="mt-6 text-blue-600 font-bold hover:underline">Reset all filters</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}