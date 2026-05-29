'use client'
// src/app/store/BookCard.tsx

import Image from 'next/image'
import Link from 'next/link'
import type { BookSummary } from '@/lib/book-queries'
import type { ReactNode } from 'react'

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  coming_soon: 'bg-amber-100 text-amber-700',
  out_of_stock: 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-500',
  discontinued: 'bg-red-100 text-red-600',
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available Now',
  coming_soon: 'Pipeline',
  out_of_stock: 'Sold Out',
  discontinued: 'Legacy',
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\\]]/g, '\\$&')
}

function highlightText(text: string, query: string): ReactNode {
  if (!query.trim()) return text
  const safeQuery = escapeRegExp(query.trim())
  const regex = new RegExp(`(${safeQuery})`, 'ig')
  const parts = text.split(regex)
  return parts.map((part, index) => {
    if (part.toLowerCase() === query.trim().toLowerCase()) {
      return <mark key={index} className="bg-yellow-100 text-inherit px-0.5 rounded">{part}</mark>
    }
    return <span key={index}>{part}</span>
  })
}

export default function BookCard({ book, highlightTerm = '' }: { book: BookSummary; highlightTerm?: string }) {
  const coverUrl = book.coverImage?.asset?.url
  const isTextbook = book._type === 'book'
  const displayAuthor = (['imprint', 'publication'].includes(book._type) ? book.author?.name : (book.authors && book.authors.length > 0 ? book.authors.join(', ') : 'Hexadigitall')) || 'Hexadigitall'

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
      <Link href={`/store/${book.slug.current}`} className="block relative bg-slate-50 dark:bg-slate-950 overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {coverUrl ? (
          <Image src={coverUrl} alt={book.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-6xl opacity-20">📘</div>
        )}
        
        {/* Floating Category Tag */}
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-black uppercase tracking-widest bg-black/80 text-white px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
            {isTextbook ? 'Textbook' : 'Digital Imprint'}
          </span>
        </div>
      </Link>

      <div className="p-8 flex flex-col flex-1">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
             <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-current ${STATUS_STYLES[book.status]}`}>
              {STATUS_LABELS[book.status]}
            </span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 min-h-[3.5rem]">
            {highlightText(book.title, highlightTerm)}
          </h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest italic">by {displayAuthor}</p>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
          <Link 
            href={`/store/${book.slug.current}`} 
            className="flex items-center justify-center w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl active:scale-95"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  )
}