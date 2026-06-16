'use client';

import React, { useState, useMemo } from 'react';
import type { BookDetail } from '@/lib/book-queries';
import TwoStepCheckoutModal from '@/components/modals/TwoStepCheckoutModal';
import { ArrowTopRightOnSquareIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { useCurrency } from '@/contexts/CurrencyContext';
import { resolveBookPrice } from '@/lib/mentorship-pricing';

interface StoreBuySectionProps {
  book: BookDetail;
}

export default function StoreBuySection({ book }: StoreBuySectionProps) {
  const { data: session } = useSession();
  const { currentCurrency, convertPrice, formatPrice } = useCurrency();
  const [activeModal, setActiveModal] = useState(false);

  const user = session?.user as any;

  const isTextbook = book._type === 'book';

  const prices = useMemo(() => {
    const studentPrices = resolveBookPrice({
        slug: book.slug.current,
        _type: book._type,
        variant: 'student',
        relatedCourse: book.relatedCourse as any,
        pricing: book.pricing
    });

    const studentBase = convertPrice(studentPrices.usd, currentCurrency.code);

    return {
      student: studentBase,
      single: studentBase,
      rawStudentUSD: studentPrices.usd,
    };
  }, [book, currentCurrency.code, convertPrice]);

  const formattedPrice = useMemo(() => {
    return formatPrice(prices.rawStudentUSD);
  }, [prices, formatPrice]);

  const hasExternalLinks = !!book.storeLinks?.amazon || !!book.storeLinks?.selar || !!book.storeLinks?.gumroad;

  return (
    <div className="space-y-6">
      {/* Direct Download / Purchase */}
      {book.directDownloadEnabled && (
        <button
          onClick={() => setActiveModal(true)}
          className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:scale-[1.01] transition-all shadow-2xl active:scale-[0.98]"
        >
          <ShoppingBagIcon className="h-5 w-5" />
          <span>Buy Book</span>
          {isTextbook && <span className="ml-4 pl-4 border-l border-white/20 font-mono">{formattedPrice}</span>}
        </button>
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
          isOpen={activeModal}
          onClose={() => setActiveModal(false)}
          title={book.title}
          price={prices.single}
          currency={currentCurrency.code}
          itemId={book._id}
          itemType={['publication', 'imprint'].includes(book._type) ? 'publication' : 'book'}
          userContext={user}
          onSuccess={() => setActiveModal(false)}
        />
      )}
    </div>
  );
}