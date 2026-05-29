'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { BookSummary, AuthorSummary } from '@/lib/book-queries'
import BookCard from '@/app/store/BookCard'
import AuthorCard from '@/app/store/AuthorCard'

interface StoreCatalogProps {
  books: BookSummary[]
  authors: AuthorSummary[]
}

type StatusFilter = 'all' | 'available' | 'coming_soon'
type LevelFilter = 'all' | 'beginner' | 'intermediate' | 'advanced' | 'all_levels'
type TypeFilter = 'all' | 'book' | 'publication'

function normalize(value: string): string {
  return value.toLowerCase().trim()
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
  if (text.includes(query)) return true
  return looseSubsequenceMatch(text, query)
}

function toSearchableText(book: BookSummary): string {
  const authors = (book.authors ?? []).join(' ')
  const authorName = book.author?.name ?? ''
  const description = book.description ?? ''
  const subtitle = book.subtitle ?? ''
  const slug = book.slug?.current ?? ''
  return normalize(`${book.title} ${subtitle} ${authors} ${authorName} ${description} ${slug}`)
}

export default function StoreCatalog({ books: initialBooks, authors }: StoreCatalogProps) {
  const books = useMemo(() => {
    const seen = new Set();
    return initialBooks.filter(b => {
      if (seen.has(b._id)) return false;
      seen.add(b._id);
      return true;
    });
  }, [initialBooks]);

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [status, setStatus] = useState<StatusFilter>((searchParams.get('status') as StatusFilter) || 'all')
  const [level, setLevel] = useState<LevelFilter>((searchParams.get('level') as LevelFilter) || 'all')
  const [type, setType] = useState<TypeFilter>((searchParams.get('type') as TypeFilter) || 'all')

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      if (type !== 'all' && book._type !== type) return false;
      if (status !== 'all' && book.status !== status) return false;
      if (level !== 'all') {
        if (level === 'all_levels' && book.level !== 'all') return false;
        if (level !== 'all_levels' && book.level !== level) return false;
      }
      if (query.trim()) {
        const searchable = toSearchableText(book);
        const terms = normalize(query).split(/\s+/).filter(Boolean);
        if (!terms.every(term => fuzzyMatch(searchable, term))) return false;
      }
      return true;
    });
  }, [books, type, status, level, query]);

  const filteredAuthors = useMemo(() => {
    if (type !== 'publication' && type !== 'all') return [];
    if (!query.trim()) return authors;
    return authors.filter(a => fuzzyMatch(normalize(a.name), normalize(query)));
  }, [authors, type, query]);

  const available = useMemo(() => filteredBooks.filter(b => b.status === 'available'), [filteredBooks]);
  const upcoming = useMemo(() => filteredBooks.filter(b => b.status === 'coming_soon'), [filteredBooks]);

  useEffect(() => {
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (status !== 'all') params.set('status', status)
    if (level !== 'all') params.set('level', level)
    if (type !== 'all') params.set('type', type)
    router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname, { scroll: false })
  }, [query, status, level, type, pathname, router])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
      <aside className="space-y-10">
        <div>
          <label htmlFor="store-search" className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Search Resources</label>
          <input
            ref={searchInputRef}
            id="store-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Resource Category</p>
            <div className="flex flex-col gap-2">
              {[
                { id: 'all', label: 'Everything' }, 
                { id: 'book', label: 'Course Textbooks' }, 
                { id: 'publication', label: 'Digital Imprints' }
              ].map((f) => (
                <button key={f.id} onClick={() => setType(f.id as TypeFilter)} className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${type === f.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {type !== 'publication' && (
            <>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Availability</p>
                <div className="flex flex-col gap-2">
                  {[{ id: 'all', label: 'All Status' }, { id: 'available', label: 'Available Now' }, { id: 'coming_soon', label: 'Coming Soon' }].map((f) => (
                    <button key={f.id} onClick={() => setStatus(f.id as StatusFilter)} className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${status === f.id ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Difficulty</p>
                <div className="flex flex-col gap-2">
                  {[{ id: 'all', label: 'All Levels' }, { id: 'beginner', label: 'Beginner' }, { id: 'intermediate', label: 'Intermediate' }, { id: 'advanced', label: 'Advanced' }].map((f) => (
                    <button key={f.id} onClick={() => setLevel(f.id as LevelFilter)} className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${level === f.id ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </aside>

      <div className="flex-1">
        {/* If Digital Imprints is selected, show Authors */}
        {type === 'publication' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAuthors.map(author => (
              <AuthorCard key={author._id} author={author} />
            ))}
          </div>
        ) : (
          <>
            {available.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-20">
                {available.map(book => <BookCard key={book._id} book={book} highlightTerm={query} />)}
              </div>
            )}

            {upcoming.length > 0 && (
              <div className="space-y-10">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4">Pipeline</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {upcoming.map(book => <BookCard key={book._id} book={book} highlightTerm={query} />)}
                </div>
              </div>
            )}
          </>
        )}

        {(type === 'publication' ? filteredAuthors.length === 0 : filteredBooks.length === 0) && (
          <div className="py-24 text-center">
            <p className="text-slate-400">No matching results found.</p>
          </div>
        )}
      </div>
    </div>
  )
}