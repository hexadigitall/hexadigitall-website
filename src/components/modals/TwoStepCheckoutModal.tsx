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

const ROLES = [
  { id: 'student', label: 'Student (Self-study)' },
  { id: 'parent', label: 'Parent (Buying for a student)' },
  { id: 'teacher', label: 'Teacher / Instructor' },
  { id: 'mentor', label: 'Mentor / Coach' },
];

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
  const [formData, setFormData] = useState({ fullName: '', email: '', role: 'student' });
  const [isSubmitting, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || (itemType === 'book' && !formData.role)) {
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
      const response = await fetch('/api/course-enrollment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: itemId, 
          amount: price,
          currency: currency,
          redirectUrl: `${window.location.origin}/store/success`,
          studentDetails: {
            fullName: formData.fullName,
            email: formData.email
          },
          metadata: {
            itemType,
            publicationId: itemId,
            itemTitle: title,
            userRole: formData.role
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
      <DialogBackdrop className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto font-serif">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-100 dark:border-slate-800">
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
              <DialogTitle className="text-xl font-bold text-slate-950 dark:text-white">
                {step === 1 ? 'Checkout' : 'Payment'}
              </DialogTitle>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-10">
              {step === 1 ? (
                <form onSubmit={handleNext} className="space-y-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed italic">
                    Providing access to: <strong className="text-slate-900 dark:text-slate-200 not-italic">{title}</strong>.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
                      <input
                        required
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white font-sans"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Email address</label>
                      <input
                        required
                        type="email"
                        placeholder="Email address"
                        className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white font-sans"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>

                    {itemType === 'book' && (
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Role</label>
                        <select
                          required
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white font-sans"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                          {ROLES.map(r => (
                            <option key={r.id} value={r.id}>{r.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {error && <p className="text-xs text-red-500 mt-4 ml-1">{error}</p>}

                  <button
                    type="submit"
                    className="w-full bg-slate-950 dark:bg-blue-600 hover:scale-[1.02] text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/10 mt-8"
                  >
                    Continue to Payment
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
                  <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] font-black font-mono text-slate-400 uppercase tracking-widest mb-2">Amount</p>
                    <p className="text-4xl font-black text-slate-950 dark:text-white font-mono">
                      {new Intl.NumberFormat('en-NG', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(price)}
                    </p>
                    <div className="mt-6 text-sm text-slate-500 dark:text-slate-400 font-serif italic">
                      <p>Name: <span className="text-slate-900 dark:text-slate-200 not-italic font-bold">{formData.fullName}</span></p>
                      <p className="text-xs mt-1">({formData.email})</p>
                    </div>
                  </div>

                  {error && <p className="text-xs text-red-500">{error}</p>}

                  <div className="space-y-4">
                    <button
                      disabled={isSubmitting}
                      onClick={handleInitializePayment}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
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
                      className="w-full text-slate-400 hover:text-slate-900 dark:hover:text-white text-[10px] font-black uppercase tracking-widest py-2 transition-colors"
                    >
                      Back
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed font-serif italic">
                    Your digital assets will be emailed to you immediately after payment.
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
