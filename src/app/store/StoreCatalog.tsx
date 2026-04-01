'use client'

import { useMemo, useState } from 'react'
import type { BookSummary } from '@/lib/book-queries'
import BookCard from '@/app/store/BookCard'

interface StoreCatalogProps {
  books: BookSummary[]
}

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

export default function StoreCatalog({ books }: StoreCatalogProps) {
  const [query, setQuery] = useState('')

  const normalizedQuery = normalize(query)

  const filteredBooks = useMemo(() => {
    if (!normalizedQuery) return books
    return books.filter((book) => toSearchableText(book).includes(normalizedQuery))
  }, [books, normalizedQuery])

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
        <p className="mt-2 text-xs text-gray-500">
          Showing {filteredBooks.length} of {books.length} textbook{books.length !== 1 ? 's' : ''}
        </p>
      </section>

      {available.length > 0 && (
        <section className="mb-16">
          <h3 className="text-xl font-semibold text-darkText mb-6 border-b border-gray-200 pb-2">
            Available Now
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {available.map((book) => (
              <BookCard key={book._id} book={book} />
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
              <BookCard key={book._id} book={book} />
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
