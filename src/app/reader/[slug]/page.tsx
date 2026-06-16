'use client';

import { useEffect, useState } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type AuthState = 'loading' | 'authorized' | 'unauthorized' | 'unavailable';

function getAdminTokenClaim(): { role?: string } | null {
  try {
    const m = document.cookie.match(/(?:^|;\s*)admin_token=([^;]*)/);
    if (!m) return null;
    const decoded = JSON.parse(atob(decodeURIComponent(m[1]))) as {
      role?: string; timestamp?: number;
    };
    if (decoded?.timestamp && Date.now() - decoded.timestamp < 24 * 60 * 60 * 1000) {
      return decoded;
    }
  } catch { /* ignore */ }
  return null;
}

export default function SecureWebReaderPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [state, setState] = useState<AuthState>('loading');
  const [title, setTitle] = useState(slug || '');

  useEffect(() => {
    if (!slug) return;

    (async () => {
      const claim = getAdminTokenClaim();
      const isTeacher = claim && (claim.role === 'teacher' || claim.role === 'instructor' || claim.role === 'admin');

      if (!isTeacher) {
        setState('unauthorized');
        return;
      }

      try {
        const res = await fetch(`/api/reader/${slug}?check=1`);
        if (!res.ok) {
          setState('unavailable');
          return;
        }
      } catch {
        setState('unavailable');
        return;
      }

      setState('authorized');
    })();
  }, [slug]);

  if (state === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (state === 'unauthorized') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white px-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8">
            <ArrowLeftIcon className="h-10 w-10 text-slate-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-slate-400 mb-10 text-lg">
            You must be signed in as an instructor to access the web reader.
          </p>
          <Link href="/teacher/dashboard" className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  if (state === 'unavailable') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white px-6">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-3xl">📖</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Reader Not Available</h1>
          <p className="text-slate-400 mb-10 text-lg">The web reader has not been published for this book yet.</p>
          <Link href="/teacher/dashboard" className="inline-flex items-center justify-center bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white font-sans">
      <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <Link href="/teacher/dashboard" className="p-2 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full transition-colors">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-bold text-lg text-slate-100">{title || slug}</h1>
            <p className="text-[10px] text-blue-400 font-mono tracking-widest uppercase mt-0.5">Instructor Secure Webcopy</p>
          </div>
        </div>
        <div className="text-[10px] font-black tracking-widest px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg border border-amber-500/20">COMPLIMENTARY ACCESS</div>
      </div>
      <div className="flex-1 w-full bg-slate-950 overflow-hidden relative">
        <iframe 
          src={`/api/reader/${slug}`}
          className="absolute inset-0 w-full h-full border-none"
          title={`${title || slug} Webcopy`}
        />
      </div>
    </div>
  );
}
