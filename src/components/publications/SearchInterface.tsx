'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

interface DynamicSearchResult {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  authorName: string;
  resources: Array<{
    matrixId: string;
    title: string;
    resourceType: string;
  }> | null;
}

export default function SearchInterface() {
  const [queryInputString, setQueryInputString] = useState('');
  const [extractedDataResults, setExtractedDataResults] = useState<DynamicSearchResult[]>([]);
  const [isPendingExecution, executeTransitionStream] = useTransition();

  useEffect(() => {
    if (queryInputString.trim().length === 0) {
      setExtractedDataResults([]);
      return;
    }

    const internalSystemThrottle = setTimeout(() => {
      executeTransitionStream(async () => {
        try {
          const networkRequestCall = await fetch(`/api/publications/search?q=${encodeURIComponent(queryInputString)}`);
          const formattingPayloadJson = await networkRequestCall.json();
          if (formattingPayloadJson.success) {
            setExtractedDataResults(formattingPayloadJson.results);
          }
        } catch (faultTrace) {
          console.error('Hydration synchronization search exception:', faultTrace);
        }
      });
    }, 250);

    return () => clearTimeout(internalSystemThrottle);
  }, [queryInputString]);

  return (
    <div className="w-full mx-auto max-w-4xl bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm">
      <div className="relative border-b-2 border-slate-950 pb-4">
        <MagnifyingGlassIcon className="absolute left-3 top-3.5 h-6 w-6 text-slate-400" />
        <input
          type="text"
          className="w-full pl-12 pr-4 py-2 font-mono text-xl text-slate-900 focus:outline-none placeholder:text-slate-200"
          placeholder="Lookup Matrix Code (e.g., FVMMD-LIN-M3)..."
          value={queryInputString}
          onChange={(e) => setQueryInputString(e.target.value)}
        />
      </div>

      {isPendingExecution && (
        <p className="mt-2 font-mono text-xs text-amber-600 animate-pulse tracking-tight">
          Synchronizing ecosystem alignment fields...
        </p>
      )}

      <div className="mt-6 space-y-4">
        {extractedDataResults.map((result) => (
          <div key={result._id} className="p-5 border border-slate-100 rounded-xl bg-slate-50/40 hover:border-slate-950 transition-all duration-200 group">
            <div className="flex justify-between items-start space-x-4">
              <div>
                <h3 className="text-xl font-bold font-serif text-slate-950 group-hover:text-blue-900 transition-colors">
                  {result.title}
                </h3>
                <p className="text-[10px] font-mono uppercase text-slate-400 tracking-widest mt-1">
                  Imprint Node: {result.authorName}
                </p>
              </div>
              <a 
                href={`/publications/${result.slug}`} 
                className="p-2 bg-white border border-slate-200/60 hover:border-slate-950 rounded-full transition-all shadow-sm flex-shrink-0"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 text-slate-900" />
              </a>
            </div>

            {result.description && (
              <p className="text-sm text-slate-600 font-serif mt-2 line-clamp-2 leading-relaxed">
                {result.description}
              </p>
            )}

            {result.resources && result.resources.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                  Section C Appendix Resource Indices Mapped:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {result.resources.map((resource, i) => (
                    <div key={i} className="flex items-center space-x-2 bg-white border border-slate-200/50 p-2.5 rounded-lg shadow-2xs">
                      <DocumentDuplicateIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                        {resource.matrixId}
                      </span>
                      <span className="font-serif text-xs text-slate-700 truncate">
                        {resource.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {!isPendingExecution && queryInputString.trim().length > 0 && extractedDataResults.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/20">
            <p className="font-mono text-sm text-slate-400">No active matrix keys verified matching parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
