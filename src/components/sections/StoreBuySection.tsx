'use client';

import React, { useState, useMemo } from 'react';
import type { BookDetail } from '@/lib/book-queries';
import TwoStepCheckoutModal from '@/components/modals/TwoStepCheckoutModal';
import { ChevronDownIcon, ShoppingCartIcon, ArrowTopRightOnSquareIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext';
import { resolveMentorshipRates, resolveBookPrice } from '@/lib/mentorship-pricing';
import { SUPPORTED_CURRENCIES } from '@/lib/currency';

interface StoreBuySectionProps {
  book: BookDetail;
}

export default function StoreBuySection({ book }: StoreBuySectionProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { currentCurrency, convertPrice, formatPrice } = useCurrency();
  const [activeModal, setActiveModal] = useState<{ audience: 'student' | 'teacher' | 'both' | 'single' } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Derive roles
  const user = session?.user as any;
  const isInternalTeacher = user?.role === 'instructor' || user?.role === 'admin' || user?.role === 'teacher';

  const isTextbook = book._type === 'book';

  const prices = useMemo(() => {
    const studentPrices = resolveBookPrice({
        slug: book.slug.current,
        _type: book._type,
        variant: 'student',
        relatedCourse: book.relatedCourse as any,
        pricing: book.pricing
    });

    const teacherPrices = resolveBookPrice({
        slug: book.slug.current,
        _type: book._type,
        variant: 'teacher',
        relatedCourse: book.relatedCourse as any,
        pricing: book.pricing
    });

    const isNGN = currentCurrency.code === 'NGN';
    const studentBase = isNGN ? studentPrices.ngn : convertPrice(studentPrices.usd, currentCurrency.code);
    const teacherBase = isNGN ? teacherPrices.ngn : convertPrice(teacherPrices.usd, currentCurrency.code);

    return {
      student: studentBase,
      teacher: teacherBase,
      single: studentBase,
      rawStudentUSD: studentPrices.usd,
      rawTeacherUSD: teacherPrices.usd,
      rawStudentNGN: studentPrices.ngn,
      rawTeacherNGN: teacherPrices.ngn
    };
  }, [book, currentCurrency.code, convertPrice]);

  const formattedPrices = useMemo(() => {
    const isNGN = currentCurrency.code === 'NGN';
    
    if (isNGN) {
      return {
        student: `₦${prices.rawStudentNGN.toLocaleString()}`,
        teacher: `₦${prices.rawTeacherNGN.toLocaleString()}`,
        single: `₦${prices.rawStudentNGN.toLocaleString()}`
      };
    }

    return {
      student: formatPrice(prices.rawStudentUSD),
      teacher: formatPrice(prices.rawTeacherUSD),
      single: formatPrice(prices.rawStudentUSD)
    };
  }, [prices, currentCurrency.code, formatPrice]);

  const hasExternalLinks = !!book.storeLinks?.amazon || !!book.storeLinks?.selar || !!book.storeLinks?.gumroad;

  return (
    <div className="space-y-6">
      {/* 1. Direct Download Logic */}
      {book.directDownloadEnabled && (
        <div className="relative">
          {isTextbook ? (
            /* TEXTBOOK DROPDOWN */
            <>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] px-8 py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center space-x-3">
                  <ShoppingCartIcon className="h-5 w-5" />
                  <span>Buy Book</span>
                </div>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  {/* Internal Path */}
                  {isInternalTeacher && book.hasTeacherVersion && (
                    <button
                      onClick={() => { setIsDropdownOpen(false); router.push(`/store/${book.slug.current}/reader`); }}
                      className="w-full text-left px-6 py-4 hover:bg-amber-50 dark:hover:bg-amber-900/20 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center group"
                    >
                      <p className="text-sm font-bold text-amber-600">Access Instructor Webcopy</p>
                      <span className="text-[9px] font-black bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded">Complimentary</span>
                    </button>
                  )}

                  {/* Student Path */}
                  <button
                    onClick={() => { setActiveModal({ audience: 'student' }); setIsDropdownOpen(false); }}
                    className="w-full text-left px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center group"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Student Edition</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">For individual learners</p>
                    </div>
                    <span className="font-mono text-sm font-black">{formattedPrices.student}</span>
                  </button>

                  {/* Instructor Path */}
                  <button
                    onClick={() => { setActiveModal({ audience: 'teacher' }); setIsDropdownOpen(false); }}
                    className="w-full text-left px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800 flex justify-between items-center group"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">Instructor Edition</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Includes teaching resources</p>
                    </div>
                    <span className="font-mono text-sm font-black">{formattedPrices.teacher}</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* DIGITAL IMPRINT / PUBLICATION: SINGLE BUTTON */
            <button
              onClick={() => setActiveModal({ audience: 'single' })}
              className="w-full flex items-center justify-center space-x-3 bg-slate-950 dark:bg-blue-600 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:scale-[1.01] transition-all shadow-2xl active:scale-[0.98]"
            >
              <ShoppingBagIcon className="h-5 w-5" />
              <span>Buy Book</span>
              <span className="ml-4 pl-4 border-l border-white/20 font-mono">{formattedPrices.single}</span>
            </button>
          )}
        </div>
      )}

      {/* 2. External Stores */}
      {hasExternalLinks && (
        <div className="flex flex-wrap gap-3">
          {book.storeLinks?.amazon && (
            <button
              onClick={() => window.open(book.storeLinks!.amazon, '_blank')}
              className="flex-1 inline-flex items-center justify-center space-x-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-slate-950 hover:text-white transition-all"
            >
              <span>Amazon</span>
              <ArrowTopRightOnSquareIcon className="h-3 w-3" />
            </button>
          )}
          {book.storeLinks?.selar && (
            <button
              onClick={() => window.open(book.storeLinks!.selar, '_blank')}
              className="flex-1 inline-flex items-center justify-center space-x-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-slate-950 hover:text-white transition-all"
            >
              <span>Selar Store</span>
              <ArrowTopRightOnSquareIcon className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {activeModal && (
        <TwoStepCheckoutModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={isTextbook ? `${book.title} (${activeModal.audience === 'teacher' ? 'Instructor' : 'Student'} Edition)` : book.title}
          price={prices[activeModal.audience as keyof typeof prices]}
          currency={currentCurrency.code}
          itemId={book._id}
          itemType={['publication', 'imprint'].includes(book._type) ? 'publication' : 'book'}
          userContext={user}
          onSuccess={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}