'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, ArrowDownTrayIcon, ArrowRightIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [accessData, setAccessData] = useState<any>(null);

  useEffect(() => {
    if (reference) {
      verifyPayment();
    } else {
      setStatus('error');
    }
  }, [reference]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/publications/verify-access?reference=${reference}`);
      const data = await response.json();
      if (data.success) {
        setAccessData(data.data);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-slate-500 font-mono text-sm animate-pulse">Verifying ecosystem transaction...</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <CheckCircleIcon className="h-10 w-10 rotate-45" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Verification Failed</h1>
        <p className="text-slate-600 mb-8">We couldn't verify your payment. If you've been charged, please contact support with your reference: <code className="bg-slate-100 px-2 py-1 rounded">{reference}</code></p>
        <Link href="/publications" className="text-blue-600 font-bold hover:underline flex items-center justify-center space-x-2">
          <ArrowRightIcon className="h-4 w-4 rotate-180" />
          <span>Return to Library</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-500/5 text-center">
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8">
          <CheckCircleIcon className="h-12 w-12" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold font-serif text-slate-950 mb-4">Thank you for your purchase!</h1>
        <p className="text-lg text-slate-600 mb-10">Your transaction has been verified. You now have full access to your digital assets.</p>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left mb-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-500/30">
              <BookOpenIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Acquired Publication</p>
              <h2 className="text-xl font-bold text-slate-900">{accessData.publication.title}</h2>
            </div>
          </div>

          <div className="space-y-3">
            {accessData.publication.files && accessData.publication.files.length > 0 && accessData.publication.files.map((file: any, idx: number) => (
              <a 
                key={idx}
                href={file.url} 
                target="_blank"
                className="w-full inline-flex items-center justify-center space-x-3 bg-slate-950 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                <span>Download {file.label || 'PDF'}</span>
              </a>
            ))}

            {accessData.publication.resources && accessData.publication.resources.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Companion Matrix Assets</p>
                <div className="grid gap-3">
                  {accessData.publication.resources.map((resource: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-500 transition-all group">
                      <div className="flex items-center space-x-3">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{resource.matrixId}</span>
                        <span className="font-serif text-sm font-bold text-slate-800">{resource.title}</span>
                      </div>
                      <a href={resource.secureAssetUrl} target="_blank" className="text-blue-600 hover:text-blue-700 transition-colors">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-400 font-serif italic mb-6">A copy of these download links has been sent to your email.</p>
          <Link href="/publications" className="inline-flex items-center space-x-2 text-slate-900 font-bold hover:text-blue-600 transition-colors">
            <span>Explore more in the Library</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PublicationSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50/50">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
