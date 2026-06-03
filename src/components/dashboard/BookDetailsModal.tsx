'use client';

import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogTitle } from '@headlessui/react';
import { XMarkIcon, BookOpenIcon, BookmarkIcon, ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { type BookSummary } from '@/lib/book-queries';
import Link from 'next/link';
import TwoStepCheckoutModal from '@/components/modals/TwoStepCheckoutModal';
import { useCurrency } from '@/contexts/CurrencyContext';

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: any; 
  user?: { role: string; email?: string; username?: string };
  variant?: 'teacher' | 'student' | 'single';
  onSave: () => Promise<void>;
  isSaving: boolean;
  isSaved: boolean;
  formattedPrice?: string;
  price?: number;
}

export default function BookDetailsModal({
  isOpen,
  onClose,
  book,
  user,
  variant,
  onSave,
  isSaving,
  isSaved,
  formattedPrice,
  price
}: BookDetailsModalProps) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { currentCurrency } = useCurrency();

  if (!book) return null;

  const isTeacher = user?.role === 'teacher' || user?.role === 'instructor' || user?.role === 'admin';
  const coverUrl = book.coverImage?.asset?.url;

  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setCheckoutOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-[100]">
        <DialogBackdrop className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl transition-opacity" />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-4xl border border-slate-100 dark:border-slate-800">
              
              {/* Close Button */}
              <button 
                onClick={onClose} 
                className="absolute top-6 right-8 z-20 p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-full transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] h-full max-h-[90vh] overflow-y-auto">
                
                {/* Left Column: Visuals & Primary Action */}
                <div className="bg-slate-50 dark:bg-slate-950/50 p-8 border-r border-slate-100 dark:border-slate-800 flex flex-col">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-8 aspect-[3/4]">
                    {coverUrl ? (
                      <Image src={coverUrl} alt={book.title} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-6xl">📘</div>
                    )}
                  </div>

                  <div className="space-y-4 mt-auto">
                    {variant === 'teacher' || (isTeacher && variant === 'single') ? (
                      <>
                          <button
                            onClick={onSave}
                            disabled={isSaving || isSaved}
                            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50 shadow-sm"
                          >
                            {isSaved ? <CheckCircleIcon className="h-5 w-5 text-green-500" /> : <BookmarkIcon className="h-5 w-5" />}
                            {isSaved ? 'Saved to Account' : 'Save to Account'}
                          </button>
                          <Link
                            href={`/store/${book.slug.current}/reader`}
                            className="w-full flex items-center justify-center gap-3 bg-slate-950 dark:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl"
                          >
                            <BookOpenIcon className="h-5 w-5" />
                            Open Web Reader
                          </Link>
                      </>
                    ) : (
                      <button
                          onClick={handleBuyClick}
                          className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                        >
                          <ShoppingCartIcon className="h-5 w-5" />
                          {book.relatedCourse ? 'Buy Course Textbook' : 'Buy Textbook'}
                        </button>
                    )}
                    {formattedPrice && (
                      <p className="text-center text-sm font-mono font-black text-slate-400 dark:text-slate-500">{formattedPrice}</p>
                    )}
                  </div>
                </div>

                {/* Right Column: Content */}
                <div className="p-10 md:p-12 overflow-y-auto">
                  <div className="mb-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-blue-600 text-white rounded-full">
                        {variant === 'teacher' ? 'Instructor Edition' : 'Student Edition'}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full">
                        {book.level || 'All Levels'}
                      </span>
                    </div>
                    <DialogTitle className="text-3xl md:text-4xl font-bold text-slate-950 dark:text-white leading-tight font-serif mb-4">{book.title}</DialogTitle>
                    {book.subtitle && <p className="text-lg text-slate-500 dark:text-slate-400 italic font-serif mb-6">{book.subtitle}</p>}
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">by {Array.isArray(book.authors) ? book.authors.join(', ') : 'Hexadigitall'}</p>
                  </div>

                  <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg whitespace-pre-line font-serif">{book.description}</p>
                  </div>

                  {book.tableOfContents && book.tableOfContents.length > 0 && (
                    <section>
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
                        <BookOpenIcon className="h-4 w-4" />
                        Manuscript Index
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {book.tableOfContents.map((chapter: any, idx: number) => (
                          <div key={chapter._key || idx} className="flex items-center justify-between py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50">
                            <div className="flex items-center gap-4">
                              <span className="font-mono text-xs font-black text-blue-600/50">{(chapter.chapter || idx + 1).toString().padStart(2, '0')}</span>
                              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{chapter.title}</span>
                            </div>
                            {chapter.pages && <span className="text-[10px] font-mono text-slate-400 uppercase">pp. {chapter.pages}</span>}
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <div className="mt-12 grid grid-cols-2 gap-6 py-6 border-t border-slate-100 dark:border-slate-800">
                    {book.pageCount && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Extent</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{book.pageCount} Pages</p>
                      </div>
                    )}
                    {book.edition && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Edition</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{book.edition}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog>

      <TwoStepCheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        title={`${book.title} (Student Edition)`}
        price={price || 0}
        currency={currentCurrency.code}
        itemId={book._id}
        itemType="book"
        onSuccess={() => setCheckoutOpen(false)}
      />
    </>
  );
}
