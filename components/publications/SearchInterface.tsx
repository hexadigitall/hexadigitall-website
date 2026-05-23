'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface SearchResultPayload {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  authorName: string;
  resources: Array<{
    matrixId: string;
    title: string;
    resourceType: string;
  }>;
}

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResultPayload[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const networkTimeoutThrottle = setTimeout(() => {
      startTransition(async () => {
        try {
          const apiFetchCall = await fetch(`/app/api/publications/search?q=${encodeURIComponent(searchQuery)}`);
          const jsonPayloadData = await apiFetchCall.json();
          if (jsonPayloadData.success) {
            setSearchResults(jsonPayloadData.results);
          }
        } catch (faultError) {
          console.error('Network retrieval exception: ', faultError);
        }
      });
    }, 250);

    return () => clearTimeout(networkTimeoutThrottle);
  }, [searchQuery]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="relative border-b-2 border-slate-900 pb-3">
        <MagnifyingGlassIcon className="absolute left-3 top-3 h-6 w-6 text-slate-400" />
        <input
          type="text"
          className="w-full pl-12 pr-4 py-2 text-xl font-mono focus:outline-none text-slate-900"
          placeholder="Query matrix identity code (e.g., LIN, FVMMD, Matrix)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isPending && <p className="text-sm font-mono mt-2 text-amber-600 animate-pulse">Running system alignment processing...</p>}

      <div className="mt-6 space-y-6">
        {searchResults.map((result) => (
          <div key={result._id} className="p-5 border border-slate-200 rounded-lg hover:border-slate-900 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-950">{result.title}</h3>
                <p className="text-xs font-mono uppercase tracking-widest text-slate-500 mt-1">Author Record Node: {result.authorName}</p>
              </div>
              <a href={`/publications/${result.slug}`} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowTopRightOnSquareIcon className="h-5 w-5 text-slate-900" />
              </a>
            </div>

            {result.description && <p className="text-sm text-slate-600 mt-2 font-serif line-clamp-2">{result.description}</p>}

            {result.resources && result.resources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider mb-2">Section C Manual Indexes Identified:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {result.resources.map((res, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-slate-50 p-2 rounded border border-slate-100">
                      <DocumentDuplicateIcon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="text-xs font-mono font-bold text-slate-800">[{res.matrixId}]</span>
                      <span className="text-xs font-serif text-slate-700 truncate">{res.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {!isPending && searchQuery.trim().length > 0 && searchResults.length === 0 && (
          <p className="text-center font-mono text-sm text-slate-400 py-6">No systems verified matching queries parameters.</p>
        )}
      </div>
    </div>
  );
}
