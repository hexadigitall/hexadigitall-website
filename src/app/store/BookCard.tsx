'use client'
// src/app/store/BookCard.tsx

import Image from 'next/image'
import Link from 'next/link'
import type { BookSummary } from '@/lib/book-queries'
import type { ReactNode } from 'react'
import { useState } from 'react'
import TwoStepCheckoutModal from '@/components/modals/TwoStepCheckoutModal'
import { ChevronDownIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

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
  return value.replace(/[.*+?^${}()|[\]]/g, '\\$&')
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
  const [showCheckout, setShowCheckout] = useState(false)
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false)
  const [selectedAudience, setSelectedAudience] = useState<'student' | 'teacher' | 'single'>('student')
  
  const coverUrl = book.coverImage?.asset?.url
  const defaultPrice = book.pricing?.ngn || 30000
  const isTextbook = book._type === 'book'
  const isImprint = book._type === 'imprint' || book._type === 'publication'

  const displayAuthor = (book._type === 'imprint' || book._type === 'publication' ? book.author?.name : (book.authors && book.authors.length > 0 ? book.authors.join(', ') : 'Hexadigitall')) || 'Hexadigitall'

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
      <TwoStepCheckoutModal 
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title={isTextbook ? `${book.title} (${selectedAudience === 'student' ? 'Student' : 'Instructor'} Edition)` : book.title}
        price={defaultPrice}
        currency="NGN"
        itemId={book._id}
        itemType={book._type === 'publication' ? 'publication' : 'book'}
        onSuccess={() => setShowCheckout(false)}
      />

      <Link href={`/store/${book.slug.current}`} className="block relative bg-slate-50 dark:bg-slate-950 overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {coverUrl ? (
          <Image src={coverUrl} alt={book.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-6xl opacity-20">📘</div>
        )}
        
        {/* Floating Labels */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
          <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950/90 text-white px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
            {isTextbook ? 'Textbook' : 'Digital Imprint'}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg ${STATUS_STYLES[book.status]}`}>
            {STATUS_LABELS[book.status]}
          </span>
        </div>
      </Link>

      <div className="p-8 flex flex-col flex-1">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-2 min-h-[3.5rem]">
            {highlightText(book.title, highlightTerm)}
          </h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest italic">by {displayAuthor}</p>
        </div>

        {/* ROLE SELECTION: ONLY FOR TEXTBOOKS */}
        {isTextbook && book.status === 'available' && book.directDownloadEnabled && (
          <div className="relative mb-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">Delivery Context</p>
            <button 
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <span>{selectedAudience === 'student' ? 'Student Edition' : 'Instructor Edition'}</span>
              <ChevronDownIcon className={`h-4 w-4 text-blue-600 transition-transform ${isRoleMenuOpen ? 'rotate-180' : ''}`} />
            </button>
            {isRoleMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <button onClick={() => { setSelectedAudience('student'); setIsRoleMenuOpen(false); }} className="w-full text-left px-5 py-4 text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800">Student Version</button>
                <button onClick={() => { setSelectedAudience('teacher'); setIsRoleMenuOpen(false); }} className="w-full text-left px-5 py-4 text-xs font-bold hover:bg-blue-50 dark:hover:bg-slate-800">Instructor Version</button>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Master Clearing</span>
            <span className="text-xl font-black text-slate-950 dark:text-white font-mono">₦{defaultPrice.toLocaleString()}</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/store/${book.slug.current}`} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 transition-all" title="Full Manuscript Details">
              <ChevronDownIcon className="h-6 w-6 -rotate-90" />
            </Link>
            {book.status === 'available' && (
              <button 
                onClick={() => {
                  if (book.directDownloadEnabled) setShowCheckout(true)
                  else if (book.storeLinks?.amazon) window.open(book.storeLinks.amazon, '_blank')
                }}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                <ShoppingBagIcon className="h-4 w-4" />
                <span>{book.directDownloadEnabled ? 'Get System' : 'Amazon'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}