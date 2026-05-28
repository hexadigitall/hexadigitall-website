'use client'
// src/app/store/BookCard.tsx

import Image from 'next/image'
import Link from 'next/link'
import type { BookSummary } from '@/lib/book-queries'
import type { ReactNode } from 'react'
import { useState } from 'react'
import TwoStepCheckoutModal from '@/components/modals/TwoStepCheckoutModal'

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  coming_soon: 'bg-amber-100 text-amber-700',
  out_of_stock: 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-500',
  discontinued: 'bg-red-100 text-red-600',
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  coming_soon: 'Coming Soon',
  out_of_stock: 'Out of Stock',
  discontinued: 'Discontinued',
}

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all: 'All Levels',
}

const PLATFORM_LABELS: Record<string, string> = {
  amazon_paperback: 'Amazon',
  amazon_hardcover: 'Amazon',
  amazon_kindle: 'Kindle',
  selar: 'Selar',
  paystack: 'Paystack',
  pdf: 'PDF',
  other: 'Buy',
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\\]/g, '\\$&')
}

function highlightText(text: string, query: string): ReactNode {
  if (!query.trim()) return text

  const safeQuery = escapeRegExp(query.trim())
  const regex = new RegExp(`(${safeQuery})`, 'ig')
  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (part.toLowerCase() === query.trim().toLowerCase()) {
      return (
        <mark key={`${part}-${index}`} className="bg-yellow-100 text-inherit px-0.5 rounded">
          {part}
        </mark>
      )
    }
    return <span key={`${part}-${index}`}>{part}</span>
  })
}

export default function BookCard({ book, highlightTerm = '' }: { book: BookSummary; highlightTerm?: string }) {
  const [showCheckout, setShowCheckout] = useState(false)
  const coverUrl = book.coverImage?.asset?.url
  const primaryLink = book.salesLinks?.find((l) => l.platform.startsWith('amazon')) ?? book.salesLinks?.[0]
  const lowestNGN = book.salesLinks?.map((l) => l.priceNGN).filter(Boolean).sort((a, b) => a! - b!)[0]
  
  const displayAuthor = (book._type === 'imprint' ? book.author?.name : (book.authors && book.authors.length > 0 ? book.authors.join(', ') : 'Hexadigitall')) || 'Hexadigitall'

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300">
      <TwoStepCheckoutModal 
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title={book.title}
        price={lowestNGN || 15000}
        currency="NGN"
        itemId={book._id}
        itemType={book._type === 'imprint' ? 'publication' : 'book'}
        onSuccess={() => setShowCheckout(false)}
      />

      {/* Cover Container */}
      <Link href={`/store/${book.slug.current}`} className="block relative bg-slate-50 dark:bg-slate-950 overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={book.coverImage?.alt ?? `${book.title} cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-2 group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <span className="text-5xl">📘</span>
          </div>
        )}

        {/* Category Label */}
        <div className="absolute top-3 right-3 z-10">
          <span className={`text-[10px] uppercase tracking-widest font-black px-2 py-1 rounded bg-black/80 text-white backdrop-blur-sm border border-white/10`}>
            {book._type === 'imprint' ? 'Imprint' : 'Textbook'}
          </span>
        </div>

        {/* Status badge */}
        <span className={`absolute top-3 left-3 text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-full ${STATUS_STYLES[book.status]}`}>
          {STATUS_LABELS[book.status]}
        </span>
      </Link>

      {/* Details */}
      <div className="flex flex-col flex-1 p-5 gap-4">
        <div>
          <Link href={`/store/${book.slug.current}`} className="hover:text-primary dark:hover:text-cyan-400 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white text-base leading-tight line-clamp-2 mb-1">{highlightText(book.title, highlightTerm)}</h3>
          </Link>
          {book.subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">{highlightText(book.subtitle, highlightTerm)}</p>}
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">by {highlightText(displayAuthor, highlightTerm)}</p>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2">
          {book.level && (
            <span className="text-[10px] uppercase font-bold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">
              {LEVEL_LABELS[book.level] ?? book.level}
            </span>
          )}
          {book.edition && (
            <span className="text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded">
              {book.edition}
            </span>
          )}
        </div>

        {/* Price */}
        {lowestNGN && (
          <p className="text-lg font-black text-slate-900 dark:text-white font-mono">
            ₦{lowestNGN.toLocaleString()}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-4 flex gap-2">
          <Link
            href={`/store/${book.slug.current}`}
            className="flex-1 text-center text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Details
          </Link>
          {book.status === 'available' && primaryLink && (
            <button
              onClick={() => {
                if (primaryLink.platform === 'pdf') {
                  setShowCheckout(true)
                } else {
                  window.open(primaryLink.url || '#', '_blank')
                }
              }}
              className="flex-1 text-center text-xs font-bold bg-blue-600 text-white rounded-xl py-3 hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              {primaryLink.label || (primaryLink.platform === 'pdf' ? 'Buy Now' : `Amazon`)}
            </button>
          )}
          {book.status === 'coming_soon' && (
            <Link
              href={`/store/${book.slug.current}#notify`}
              className="flex-1 text-center text-xs font-black uppercase tracking-widest bg-amber-500 text-white rounded-xl py-3 hover:bg-amber-600 transition-all active:scale-95"
            >
              Notify
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}