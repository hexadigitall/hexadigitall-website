'use client';

import React, { useState } from 'react';
import { ShieldCheckIcon, ArrowRightIcon, BookmarkSquareIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import TwoStepCheckoutModal from '@/components/modals/TwoStepCheckoutModal';
import RegisterCopyModal from '@/components/modals/RegisterCopyModal';

interface PublicationActionsProps {
  publicationId: string;
  title: string;
  price: number;
  slug: string;
  allowRegistration: boolean;
  resources: any[];
}

export default function PublicationActions({
  publicationId,
  title,
  price,
  slug,
  allowRegistration,
  resources
}: PublicationActionsProps) {
  const [showCheckout, setShowCheckout] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activeResourceCheckout, setActiveResourceCheckout] = useState<any>(null);

  return (
    <div className="space-y-12">
      {/* Primary Actions */}
      <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block mb-1">Fulfillment Clearance Target</span>
          <span className="text-3xl font-black font-mono text-slate-950 dark:text-white">
            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(price)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {allowRegistration && (
            <button 
              onClick={() => setShowRegister(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-xs font-bold border-2 border-slate-950 dark:border-slate-700 px-5 py-3.5 rounded-xl transition-all hover:bg-slate-50"
            >
              <BookmarkSquareIcon className="h-4 w-4" />
              <span>Register My Copy</span>
            </button>
          )}
          
          <button 
            onClick={() => setShowCheckout(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-2 bg-slate-950 dark:bg-blue-600 text-white font-mono text-xs font-bold px-6 py-4 rounded-xl transition-all hover:scale-[1.02] shadow-xl shadow-blue-500/10"
          >
            <span>Buy Digital System</span>
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Companion Assets Section */}
      {resources && resources.length > 0 && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
            <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-slate-400 text-center px-4">
              Companion Matrix Assemblies
            </h2>
            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((resource, i) => (
              <div key={i} className="group p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold bg-slate-950 text-white px-2 py-0.5 rounded uppercase">{resource.matrixId}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{resource.resourceType}</span>
                  </div>
                  {(resource.priceNGN > 0) && (
                    <span className="font-mono text-sm font-bold text-blue-600">₦{resource.priceNGN.toLocaleString()}</span>
                  )}
                </div>
                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">{resource.title}</h3>
                <p className="text-xs text-slate-500 font-serif italic mb-6">Optimized strategic configuration matrix authored for FVMMD alignment.</p>
                
                <button 
                  onClick={() => {
                    if (resource.priceNGN > 0) {
                      setActiveResourceCheckout(resource);
                    } else {
                      window.location.href = `/publications/${slug}/resource-vault`;
                    }
                  }}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                >
                  {resource.priceNGN > 0 ? (
                    <>
                      <ShoppingBagIcon className="h-4 w-4" />
                      <span>Acquire Asset</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheckIcon className="h-4 w-4" />
                      <span>Access Vault</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Modals */}
      <TwoStepCheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        title={title}
        price={price}
        currency="NGN"
        itemId={publicationId}
        itemType="publication"
        onSuccess={() => setShowCheckout(false)}
      />

      <RegisterCopyModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        publicationTitle={title}
        publicationId={publicationId}
      />

      {activeResourceCheckout && (
        <TwoStepCheckoutModal
          isOpen={!!activeResourceCheckout}
          onClose={() => setActiveResourceCheckout(null)}
          title={activeResourceCheckout.title}
          price={activeResourceCheckout.priceNGN}
          currency="NGN"
          itemId={activeResourceCheckout._id}
          itemType="publication" // Resource matrices also record access
          onSuccess={() => setActiveResourceCheckout(null)}
        />
      )}
    </div>
  );
}
