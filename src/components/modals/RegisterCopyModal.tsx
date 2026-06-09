'use client';

import React, { useState } from 'react';
import { Dialog, DialogBackdrop, DialogTitle } from '@headlessui/react';
import { XMarkIcon, BookmarkSquareIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

interface RegisterCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  publicationTitle: string;
  publicationId: string;
}

export default function RegisterCopyModal({
  isOpen,
  onClose,
  publicationTitle,
  publicationId
}: RegisterCopyModalProps) {
  const [formData, setFormData] = useState({ fullName: '', email: '', code: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      // In a real app, you'd send this to Sanity
      // We'll simulate a successful registration for now
      // but in the actual implementation we would use a Sanity mutation API
      
      const response = await fetch('/api/admin/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'publication_registration',
          status: 'new',
          priority: 'medium',
          contactInfo: {
            name: formData.fullName,
            email: formData.email,
          },
          message: `Book Registration for: ${publicationTitle}`,
          formData: {
            publicationId,
            registrationCode: formData.code
          }
        })
      });

      if (response.ok) {
        setStatus('success');
      } else {
        throw new Error('Failed to submit registration.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      setStatus('error');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[100]">
      <DialogBackdrop className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-200 dark:border-slate-800">
            
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Register Your Copy
              </DialogTitle>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="px-6 py-8">
              {status === 'success' ? (
                <div className="text-center py-4">
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <CheckBadgeIcon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Registration Received!</h3>
                  <p className="text-sm text-slate-500 mb-6">Our team will verify your proof of purchase and email you your digital asset access within 24 hours.</p>
                  <button onClick={onClose} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">Close</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                    Have a physical copy or purchased from another store? Register it here to unlock your companion digital assets.
                  </p>

                  <div className="space-y-3">
                    <input
                      required
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                    <input
                      required
                      type="email"
                      placeholder="Email address"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      required
                      type="text"
                      placeholder="Receipt code"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-mono"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                  </div>

                  {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

                  <button
                    disabled={status === 'submitting'}
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 mt-6 flex items-center justify-center space-x-2"
                  >
                    {status === 'submitting' ? 'Submitting...' : 'Register'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
