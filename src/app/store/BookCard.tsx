'use client'
// src/app/store/BookCard.tsx

import React, { useState, useMemo, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { BookSummary } from '@/lib/book-queries'
import { BookOpenIcon, BookmarkIcon, ShoppingCartIcon, CheckCircleIcon, EyeIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'
import BookDetailsModal from '@/components/dashboard/BookDetailsModal'
import { useCurrency } from '@/contexts/CurrencyContext'
import { SUPPORTED_CURRENCIES } from '@/lib/currency'
import { resolveBookPrice } from '@/lib/mentorship-pricing'

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  coming_soon: 'bg-amber-100 text-amber-700',
  out_of_stock: 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-500',
  discontinued: 'bg-red-100 text-red-600',
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
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

interface BookCardProps {
  book: BookSummary
  highlightTerm?: string
  user?: { role: string; email?: string; username?: string }
  isDashboardContext?: boolean
}

export default function BookCard({ book, highlightTerm = '', user, isDashboardContext }: BookCardProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  
  const { currentCurrency, convertPrice, formatPrice } = useCurrency()
  
  const coverUrl = book.coverImage?.asset?.url
  const isTextbook = book._type === 'book'
  const displayAuthor = (['imprint', 'publication'].includes(book._type) ? book.author?.name : (book.authors && book.authors.length > 0 ? book.authors.join(', ') : 'Hexadigitall')) || 'Hexadigitall'

  // @ts-ignore - added in StoreCatalog expansion
  const variant = book._displayVariant as 'teacher' | 'student' | 'single' | undefined;
  const isTeacher = user?.role === 'teacher' || user?.role === 'instructor' || user?.role === 'admin'

  const resolvedPrice = useMemo(() => {
    return resolveBookPrice({
        slug: book.slug.current,
        _type: book._type,
        // Ensure variant is passed so teacher markup is applied in utility
        variant: variant || (isTeacher ? 'teacher' : 'student'),
        relatedCourse: book.relatedCourse as any,
        pricing: book.pricing
    });
  }, [book, isTeacher, variant]);

  const rawPrice = useMemo(() => {
    return convertPrice(resolvedPrice.usd);
  }, [resolvedPrice, convertPrice]);

  const formattedPrice = useMemo(() => {
    if (!isDashboardContext || variant === 'teacher') return undefined;
    
    return formatPrice(resolvedPrice.usd);
  }, [resolvedPrice, formatPrice, isDashboardContext, variant]);

  const handleSaveToDashboard = async () => {
    if (!user?.email) {
      toast.error('Please log in to save items.')
      return
    }
    
    setIsSaving(true)
    try {
      const res = await fetch('/api/student/library/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          bookId: book._id,
          audience: variant === 'single' ? 'student' : 'teacher' // Saving the appropriate version
        })
      })
      
      if (res.ok) {
        setIsSaved(true)
        toast.success('Saved to your dashboard library!')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Failed to save item.')
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }
  
  // Decide what buttons and title to show
  const renderActions = () => {
    if (isDashboardContext) {
      return (
        <button
          onClick={(e) => { e.stopPropagation(); setDetailsModalOpen(true); }}
          className="flex items-center justify-center gap-2 w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-800 dark:hover:bg-blue-700 transition-all shadow-xl active:scale-95"
        >
          <BookOpenIcon className="h-4 w-4" />
          View Details
        </button>
      )
    }

    // Standard Store View
    return (
      <button 
        onClick={() => setDetailsModalOpen(true)}
        className="flex items-center justify-center w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl active:scale-95"
      >
        View Details
      </button>
    )
  }

  const displayTitle = () => {
    const base = highlightText(book.title, highlightTerm);
    if (isDashboardContext && variant === 'teacher') {
      return <span>{base} <span className="text-amber-500 text-sm block mt-1">(Instructor Edition)</span></span>
    }
    if (isDashboardContext && variant === 'student' && isTeacher) {
      return <span>{base} <span className="text-blue-500 text-sm block mt-1">(Student Edition)</span></span>
    }
    return base;
  }

  return (
    <>
      <article 
        onClick={() => setDetailsModalOpen(true)}
        className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
      >
        <div className="block relative bg-slate-50 dark:bg-slate-950 overflow-hidden" style={{ aspectRatio: '3/4' }}>
          {coverUrl ? (
            <Image src={coverUrl} alt={book.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-6xl opacity-20">📘</div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
             <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-2xl">
                <EyeIcon className="h-6 w-6 text-slate-900" />
             </div>
          </div>
          
          {/* Floating Category Tag */}
          <div className="absolute top-4 right-4">
            <span className="text-[10px] font-black uppercase tracking-widest bg-black/80 text-white px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
              {variant === 'teacher' ? 'Instructor Edition' : (variant === 'student' ? 'Student Edition' : (isTextbook ? 'Textbook' : 'Digital Imprint'))}
            </span>
          </div>
        </div>

        <div className="p-8 flex flex-col flex-1">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
               <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-current ${STATUS_STYLES[book.status]}`}>
                {STATUS_LABELS[book.status]}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-3 min-h-[3.5rem]">
              {displayTitle()}
            </h3>
            <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest italic">by {displayAuthor}</p>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
            {renderActions()}
          </div>
        </div>
      </article>

      <BookDetailsModal 
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        book={book}
        user={user}
        variant={variant}
        onSave={handleSaveToDashboard}
        isSaving={isSaving}
        isSaved={isSaved}
      />
    </>
  )
}