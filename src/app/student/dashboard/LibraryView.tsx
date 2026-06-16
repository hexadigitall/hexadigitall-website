'use client'

import React, { useEffect, useState } from 'react';
import { BookmarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function LibraryView({ userEmail }: { userEmail: string }) {
  const [libraryItems, setLibraryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userEmail) return;

    const fetchLibrary = async () => {
      try {
        const res = await fetch(`/api/student/library?email=${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          setLibraryItems(data.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch library:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLibrary();
  }, [userEmail]);

  if (loading) {
    return <div className="flex justify-center p-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">My Digital Library</h2>
          <p className="text-sm text-slate-500">All your purchased textbooks, imprints, and companion assets.</p>
        </div>
      </div>

      {libraryItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookmarkIcon className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Your library is empty</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            You haven't acquired any digital imprints, textbooks, or companion assets yet.
          </p>
          <Link href="/store?context=dashboard" className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
            Browse Library
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {libraryItems.map((item, index) => (
            <div key={index} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                  {item.type}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(item.acquiredAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight mb-2 flex-grow">
                {item.title}
              </h3>
              
              <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 space-y-3">
                {item.files?.map((file: any, i: number) => (
                  <a 
                    key={i}
                    href={file.url}
                    target="_blank"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate pr-4">{file.label || 'Download File'}</span>
                    <ArrowDownTrayIcon className="h-4 w-4 text-slate-400 shrink-0" />
                  </a>
                ))}

                {item.audience === 'teacher' && (
                  <Link 
                    href={`/reader/${item.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-500 hover:bg-amber-100 transition-colors border border-amber-200/50"
                  >
                    <span className="text-sm font-bold">Open Webcopy Reader</span>
                    <ArrowDownTrayIcon className="h-4 w-4 shrink-0" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
