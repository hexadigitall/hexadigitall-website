'use client';

import React, { useState } from 'react';
import type { SalesLink } from '@/lib/book-queries';
import TwoStepCheckoutModal from '@/components/modals/TwoStepCheckoutModal';

interface StoreBuySectionProps {
  salesLinks: SalesLink[];
  bookTitle: string;
  bookId: string;
}

const PLATFORM_ICONS: Record<string, string> = {
  amazon_paperback: '📦',
  amazon_hardcover: '📚',
  amazon_kindle: '📱',
  selar: '🛒',
  paystack: '💳',
  pdf: '📄',
  other: '🔗',
};

const PLATFORM_LABELS: Record<string, string> = {
  amazon_paperback: 'Amazon Paperback',
  amazon_hardcover: 'Amazon Hardcover',
  amazon_kindle: 'Amazon Kindle',
  selar: 'Selar',
  paystack: 'Paystack',
  pdf: 'Direct PDF Download',
  other: 'Buy',
};

export default function StoreBuySection({ salesLinks, bookTitle, bookId }: StoreBuySectionProps) {
  const [activeModal, setActiveModal] = useState<{ link: SalesLink } | null>(null);

  return (
    <div>
      <p className="text-xs text-gray-400 uppercase font-semibold mb-2 tracking-wider">Where to Buy</p>
      <div className="flex flex-wrap gap-3">
        {salesLinks.map((link) => (
          <button
            key={link._key}
            onClick={() => {
              if (link.platform === 'pdf') {
                setActiveModal({ link });
              } else {
                window.open(link.url || '#', '_blank');
              }
            }}
            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all active:scale-95 shadow-sm"
          >
            <span>{PLATFORM_ICONS[link.platform] ?? '🛒'}</span>
            <span>
              {link.label || (
                link.platform === 'pdf' 
                ? `${link.audience === 'teacher' ? 'Instructor' : 'Student'} Edition`
                : PLATFORM_LABELS[link.platform] || 'Buy'
              )}
            </span>
            {link.priceNGN && <span className="text-white/80 text-xs ml-1">₦{link.priceNGN.toLocaleString()}</span>}
          </button>
        ))}
      </div>

      {activeModal && (
        <TwoStepCheckoutModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={bookTitle}
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
