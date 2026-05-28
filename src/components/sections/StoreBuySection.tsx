'use client';

import React, { useState } from 'react';
import type { SalesLink } from '@/lib/book-queries';
import TwoStepCheckoutModal from '@/components/modals/TwoStepCheckoutModal';
import { ChevronDownIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

interface StoreBuySectionProps {
  salesLinks: SalesLink[];
  bookTitle: string;
  bookId: string;
}

const PLATFORM_LABELS: Record<string, string> = {
  amazon_paperback: 'Amazon (Paperback)',
  amazon_hardcover: 'Amazon (Hardcover)',
  amazon_kindle: 'Amazon (Kindle)',
  selar: 'Selar Store',
  paystack: 'Paystack Checkout',
  pdf: 'Direct Digital Download',
  other: 'External Store',
};

export default function StoreBuySection({ salesLinks, bookTitle, bookId }: StoreBuySectionProps) {
  const [activeModal, setActiveModal] = useState<{ link: SalesLink } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Group links by platform type to detect if we have multiples
  const directLinks = salesLinks.filter(l => l.platform === 'pdf');
  const externalLinks = salesLinks.filter(l => l.platform !== 'pdf');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Primary Action: Direct Download (if available) */}
        {directLinks.length > 0 && (
          <div className="relative flex-1">
            <button
              onClick={() => {
                if (directLinks.length === 1) {
                  setActiveModal({ link: directLinks[0] });
                } else {
                  setIsDropdownOpen(!isDropdownOpen);
                }
              }}
              className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span>{directLinks.length > 1 ? 'Select Edition & Buy' : 'Buy Digital Edition'}</span>
              {directLinks.length > 1 && <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />}
            </button>

            {isDropdownOpen && directLinks.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {directLinks.map((link) => (
                  <button
                    key={link._key}
                    onClick={() => {
                      setActiveModal({ link });
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800 last:border-0 flex justify-between items-center group"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {link.audience === 'teacher' ? 'Instructor Edition' : 'Student Edition'}
                      </p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest">Digital PDF / Web-Book</p>
                    </div>
                    {link.priceNGN && <span className="font-mono text-sm font-black text-slate-900 dark:text-white">₦{link.priceNGN.toLocaleString()}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Secondary: Amazon / Selar */}
        {externalLinks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {externalLinks.map((link) => (
              <button
                key={link._key}
                onClick={() => window.open(link.url || '#', '_blank')}
                className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all"
              >
                <span>{PLATFORM_LABELS[link.platform] || 'External Store'}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeModal && (
        <TwoStepCheckoutModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={`${bookTitle} (${activeModal.link.audience === 'teacher' ? 'Instructor' : 'Student'} Edition)`}
          price={activeModal.link.priceNGN || 15000}
          currency="NGN"
          itemId={bookId}
          itemType="book"
          onSuccess={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
