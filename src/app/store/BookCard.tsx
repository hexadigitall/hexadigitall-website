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
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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
  const coverUrl = book.coverImage?.asset?.url
  const primaryLink = book.salesLinks?.find((l) => l.platform.startsWith('amazon')) ?? book.salesLinks?.[0]
  const lowestNGN = book.salesLinks?.map((l) => l.priceNGN).filter(Boolean).sort((a, b) => a! - b!)[0]

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">

      {/* Cover */}
      <Link href={`/store/${book.slug.current}`} className="block relative bg-gray-50 dark:bg-slate-800/50" style={{ aspectRatio: '3/4' }}>
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={book.coverImage?.alt ?? `${book.title} cover`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
            <span className="text-5xl">📘</span>
          </div>
        )}

        {/* Status badge */}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[book.status]}`}>
          {STATUS_LABELS[book.status]}
        </span>
      </Link>

      {/* Details */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <Link href={`/store/${book.slug.current}`} className="hover:text-primary transition-colors">
            <h3 className="font-bold text-darkText text-sm leading-snug line-clamp-2">{highlightText(book.title, highlightTerm)}</h3>
          </Link>
          {book.subtitle && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 line-clamp-1">{highlightText(book.subtitle, highlightTerm)}</p>}
          {book.authors && book.authors.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-slate-500 mt-1">{highlightText(book.authors.join(', '), highlightTerm)}</p>
          )}
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1">
          {book.level && (
            <span className="text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full">
              {LEVEL_LABELS[book.level] ?? book.level}
            </span>
          )}
          {book.edition && (
            <span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-500 px-2 py-0.5 rounded-full">
              {book.edition}
            </span>
          )}
        </div>

        {/* Price */}
        {lowestNGN && (
          <p className="text-sm font-bold text-primary">
            From ₦{lowestNGN.toLocaleString()}
          </p>
        )}

        {/* CTA */}
        <div className="mt-auto pt-2 flex gap-2">
          <Link
            href={`/store/${book.slug.current}`}
            className="flex-1 text-center text-xs font-semibold border border-primary text-primary rounded-lg py-2 hover:bg-primary hover:text-white transition-colors"
          >
            View Details
          </Link>
          {book.status === 'available' && primaryLink && (
            <a
              href={primaryLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs font-semibold bg-primary text-white rounded-lg py-2 hover:bg-primary/90 transition-colors"
            >
              {primaryLink.label ?? `Buy on ${PLATFORM_LABELS[primaryLink.platform] ?? 'Store'}`}
            </a>
          )}
          {book.status === 'coming_soon' && (
            <Link
              href={`/store/${book.slug.current}#notify`}
              className="flex-1 text-center text-xs font-semibold bg-amber-500 text-white rounded-lg py-2 hover:bg-amber-600 transition-colors"
            >
              Notify Me
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
