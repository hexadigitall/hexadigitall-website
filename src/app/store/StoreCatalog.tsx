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

function fuzzyMatch(text: string, query: string): boolean {
  if (!query) return true
  const q = normalize(query)
  return normalize(text).includes(q)
}

function toSearchableText(book: BookSummary): string {
  const authors = (book.authors ?? []).join(' ')
  const authorName = book.author?.name ?? ''
  const description = book.description ?? ''
  const subtitle = book.subtitle ?? ''
  return `${book.title} ${subtitle} ${authors} ${authorName} ${description}`
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

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [status, setStatus] = useState<StatusFilter>((searchParams.get('status') as StatusFilter) || 'all')
  const [level, setLevel] = useState<LevelFilter>((searchParams.get('level') as LevelFilter) || 'all')
  const [type, setType] = useState<TypeFilter>((searchParams.get('type') as TypeFilter) || 'all')

  // Filter books (Exclude imprints from 'all' and 'book' views as requested)
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // If we are in 'all' or 'book' mode, ONLY show books (textbooks)
      if (type === 'all' || type === 'book') {
        if (book._type !== 'book') return false;
      }
      
      // If specifically looking at 'publication', the author cards will handle it
      if (type === 'publication') return false;

      if (status !== 'all' && book.status !== status) return false;
      if (level !== 'all') {
        if (level === 'all_levels' && book.level !== 'all') return false;
        if (level !== 'all_levels' && book.level !== level) return false;
      }
      if (query.trim()) {
        const searchable = toSearchableText(book);
        if (!fuzzyMatch(searchable, query)) return false;
      }
      return true;
    });
  }, [books, type, status, level, query]);

  // Filter authors (Only for 'publication' view)
  const filteredAuthors = useMemo(() => {
    if (type !== 'publication' && type !== 'all') return [];
    
    // In 'publication' view, we show ALL authors who have imprints
    if (type === 'publication') {
       if (!query.trim()) return authors;
       return authors.filter(a => fuzzyMatch(a.name, query));
    }

    return [];
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
          <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Search Catalog</label>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search resources..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Resource Type</p>
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
                  {[{ id: 'all', label: 'All Status' }, { id: 'available', label: 'Available Now' }, { id: 'coming_soon', label: 'Pipeline' }].map((f) => (
                    <button key={f.id} onClick={() => setStatus(f.id as StatusFilter)} className={`text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${status === f.id ? 'bg-blue-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
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
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-4">Upcoming Curriculum</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {upcoming.map(book => <BookCard key={book._id} book={book} highlightTerm={query} />)}
                </div>
              </div>
            )}
          </>
        )}

        {(type === 'publication' ? filteredAuthors.length === 0 : filteredBooks.length === 0) && (
          <div className="py-24 text-center">
            <p className="text-slate-400">No matching catalog items found.</p>
          </div>
        )}
      </div>
    </div>
  )
}
