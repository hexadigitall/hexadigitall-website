'use client';

import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogTitle } from '@headlessui/react';
import { XMarkIcon, UserIcon, EnvelopeIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface TwoStepCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  price: number;
  currency: string;
  itemId: string;
  itemType: 'book' | 'publication' | 'course';
  onSuccess: (checkoutUrl: string) => void;
}

export default function TwoStepCheckoutModal({
  isOpen,
  onClose,
  title,
  price,
  currency,
  itemId,
  itemType,
  onSuccess
}: TwoStepCheckoutModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [isSubmitting, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      setError('Please fill out all fields.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleInitializePayment = async () => {
    setIsPending(true);
    setError(null);

    try {
      // Use the generic enrollment endpoint for books too, or create a specific one
      const response = await fetch('/api/course-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: itemId, // Mapping to courseId for now as the API expects it
          amount: price,
          currency: currency,
          studentDetails: {
            fullName: formData.fullName,
            email: formData.email
          },
          metadata: {
            itemType,
            itemId,
            itemTitle: title
          }
        }),
      });

      const data = await response.json();

      if (data.success && data.checkoutUrl) {
        onSuccess(data.checkoutUrl);
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error(data.error || 'Failed to initialize payment gateway.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[100]">
      <DialogBackdrop className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-200 dark:border-slate-800">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                {step === 1 ? 'Step 1: Contact Info' : 'Step 2: Confirmation'}
              </DialogTitle>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500 transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-8">
              {step === 1 ? (
                <form onSubmit={handleNext} className="space-y-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                    Enter your details to receive the download link for <strong className="text-slate-900 dark:text-white">{title}</strong>.
                  </p>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Full Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">Email Address</label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-500 mt-2 ml-1">{error}</p>}

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 mt-6 flex items-center justify-center space-x-2"
                  >
                    <span>Continue to Payment</span>
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Total to Pay</p>
                    <p className="text-4xl font-black text-slate-900 dark:text-white">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(price)}
                    </p>
                    <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                      <p>Checkout as: <strong>{formData.fullName}</strong></p>
                      <p className="text-xs">({formData.email})</p>
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-500">{error}</p>}

                  <div className="space-y-3">
                    <button
                      disabled={isSubmitting}
                      onClick={handleInitializePayment}
                      className="w-full bg-slate-950 dark:bg-white dark:text-slate-950 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 border-2 border-white dark:border-slate-950 border-t-transparent animate-spin rounded-full" />
                      ) : (
                        <>
                          <CreditCardIcon className="h-5 w-5" />
                          <span>Pay with Paystack</span>
                        </>
                      )}
                    </button>
                    
                    <button
                      disabled={isSubmitting}
                      onClick={() => setStep(1)}
                      className="w-full text-slate-500 hover:text-slate-700 text-sm font-medium py-2 transition-colors"
                    >
                      Edit details
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    By proceeding, you agree to our Terms of Service. A download link will be sent to your email immediately after successful payment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
