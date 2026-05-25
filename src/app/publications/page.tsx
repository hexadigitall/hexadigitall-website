import React from 'react';
import SearchInterface from '@/components/publications/SearchInterface';
import { BookOpenIcon } from '@heroicons/react/24/outline';

export const revalidate = 3600; // Cache layer revalidates static content hourly

export default function PublicationsLibraryCatalog() {
  return (
    <main className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-slate-950 text-white rounded-2xl shadow-sm mb-4">
          <BookOpenIcon className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold font-serif text-slate-950 tracking-tight sm:text-5xl">
          Hexadigitall Imprint Library
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-base text-slate-500 font-serif italic">
          Query secure interactive operational matrix configurations, clean execution sheets, and structural volume roadmaps authored across FVMMD identity workspaces.
        </p>
      </div>

      <SearchInterface />
    </main>
  );
}
