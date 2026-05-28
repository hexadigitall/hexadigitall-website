'use client';

import React, { useState } from 'react';
import type { BookSummary } from '@/lib/book-queries';
import TwoStepCheckoutModal from '@/components/modals/TwoStepCheckoutModal';
import { ChevronDownIcon, ShoppingCartIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface StoreBuySectionProps {
  book: BookSummary;
}

export default function StoreBuySection({ book }: StoreBuySectionProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeModal, setActiveModal] = useState<{ audience: 'student' | 'teacher' | 'both' } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Derive roles
  const user = session?.user as any;
  const isInternalStudent = user?.role === 'student';
  const isInternalTeacher = user?.role === 'instructor' || user?.role === 'admin' || user?.role === 'teacher';

  // Base pricing
  const defaultNgnPrice = book.pricing?.ngn || 30000;
  
  // Calculate specific package prices (Example logic: both = 1.5x)
  const prices = {
    student: defaultNgnPrice,
    teacher: defaultNgnPrice,
    both: defaultNgnPrice * 1.5
  };

  const hasExternalLinks = !!book.storeLinks?.amazon || !!book.storeLinks?.selar || !!book.storeLinks?.gumroad;

  return (
    <div className="space-y-6">
      {/* 1. Direct Download Dropdown */}
      {book.directDownloadEnabled && (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-center space-x-3 bg-blue-600 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span>Direct Download</span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              
              {/* Internal Hexadigitall User Group */}
              <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Hexadigitall Users</span>
              </div>
              
              {!session ? (
                 <button
                  onClick={() => signIn()}
                  className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center group"
                 >
                   <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600">Sign In to Download</p>
                 </button>
              ) : (
                <>
                  {isInternalStudent && book.hasStudentVersion && (
                    <button
                      onClick={() => {
                        setActiveModal({ audience: 'student' });
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center group"
                    >
                      <div>
                        <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Download (Student)</p>
                      </div>
                      <span className="font-mono text-sm font-black text-slate-900 dark:text-white">₦{prices.student.toLocaleString()}</span>
                    </button>
                  )}
                  {isInternalTeacher && book.hasTeacherVersion && (
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        router.push(`/store/${book.slug.current}/reader`);
                      }}
                      className="w-full text-left px-6 py-4 hover:bg-amber-50 dark:hover:bg-amber-900/20 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center group"
                    >
                      <div>
                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400">View (Instructor webcopy)</p>
                      </div>
                      <span className="text-[10px] uppercase font-black text-amber-600 bg-amber-100 dark:bg-amber-900/40 px-2 py-1 rounded">Complimentary</span>
                    </button>
                  )}
                </>
              )}

              {/* External / Guest Group */}
              <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-y border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Direct Access (Guest)</span>
              </div>

              {book.hasStudentVersion && (
                <button
                  onClick={() => {
                    setActiveModal({ audience: 'student' });
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center group"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600">Student Version</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">For independent learners</p>
                  </div>
                  <span className="font-mono text-sm font-black text-slate-900 dark:text-white">₦{prices.student.toLocaleString()}</span>
                </button>
              )}

              {book.hasTeacherVersion && (
                <button
                  onClick={() => {
                    setActiveModal({ audience: 'teacher' });
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center group"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600">Teacher / Coach Version</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Includes teaching aids</p>
                  </div>
                  <span className="font-mono text-sm font-black text-slate-900 dark:text-white">₦{prices.teacher.toLocaleString()}</span>
                </button>
              )}

              {book.hasStudentVersion && book.hasTeacherVersion && (
                <button
                  onClick={() => {
                    setActiveModal({ audience: 'both' });
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 flex justify-between items-center group bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600">Download Both Versions</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Complete bundle</p>
                  </div>
                  <span className="font-mono text-sm font-black text-slate-900 dark:text-white">₦{prices.both.toLocaleString()}</span>
                </button>
              )}

            </div>
          )}
        </div>
      )}

      {/* 2. External Stores */}
      {hasExternalLinks && (
        <div className="flex flex-wrap gap-2">
          {/* Amazon */}
          <button
            onClick={() => book.storeLinks?.amazon ? window.open(book.storeLinks.amazon, '_blank') : null}
            disabled={!book.storeLinks?.amazon}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 border font-bold text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl transition-all ${
              book.storeLinks?.amazon 
                ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Amazon</span>
            {book.storeLinks?.amazon && <ArrowTopRightOnSquareIcon className="h-3 w-3" />}
          </button>

          {/* Selar */}
          <button
            onClick={() => book.storeLinks?.selar ? window.open(book.storeLinks.selar, '_blank') : null}
            disabled={!book.storeLinks?.selar}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 border font-bold text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl transition-all ${
              book.storeLinks?.selar 
                ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Selar</span>
            {book.storeLinks?.selar && <ArrowTopRightOnSquareIcon className="h-3 w-3" />}
          </button>

          {/* Gumroad */}
          <button
            onClick={() => book.storeLinks?.gumroad ? window.open(book.storeLinks.gumroad, '_blank') : null}
            disabled={!book.storeLinks?.gumroad}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 border font-bold text-[10px] uppercase tracking-widest px-6 py-4 rounded-2xl transition-all ${
              book.storeLinks?.gumroad 
                ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-950 hover:text-white dark:hover:bg-white dark:hover:text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
            }`}
          >
            <span>Gumroad</span>
            {book.storeLinks?.gumroad && <ArrowTopRightOnSquareIcon className="h-3 w-3" />}
          </button>
        </div>
      )}

      {/* Checkout Modal wrapper */}
      {activeModal && (
        <TwoStepCheckoutModal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={`${book.title} (${
            activeModal.audience === 'teacher' ? 'Instructor Edition' : 
            activeModal.audience === 'both' ? 'Complete Bundle' : 'Student Edition'
          })`}
          price={prices[activeModal.audience]}
          currency="NGN"
          itemId={book._id}
          itemType="book"
          onSuccess={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}