import React from 'react';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/client';
import { ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface DynamicRoutingContainerProps {
  params: Promise<{ slug: string }>;
}

interface PublicationDocumentPayload {
  _id: string;
  title: string;
  isbn?: string;
  description?: string;
  price: number;
  authorName: string;
}

export default async function PublicationDetailView({ params }: DynamicRoutingContainerProps) {
  const unpackedRouteParameters = await params;
  const currentSlugToken = unpackedRouteParameters.slug;

  const secureQueryFetch = `*[_type == "publication" && slug.current == $slug][0] {
    _id,
    title,
    isbn,
    description,
    price,
    "authorName": author->name
  }`;

  const document: PublicationDocumentPayload | null = await client.fetch(secureQueryFetch, { slug: currentSlugToken });

  if (!document) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50/30 py-16 px-4 sm:px-6 lg:px-8 font-serif text-slate-950">
      <div className="max-w-3xl mx-auto bg-white border border-slate-200/70 rounded-2xl p-8 shadow-xs">
        <div className="border-b border-slate-900 pb-6">
          <span className="font-mono text-xs uppercase tracking-widest text-blue-900 font-bold block mb-1">
            Manuscript Registry Element
          </span>
          <h1 className="text-3xl font-bold font-serif tracking-tight sm:text-4xl text-slate-950 leading-tight">
            {document.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-3 font-mono text-xs text-slate-400">
            <span>Author Workspace: <strong className="text-slate-700">{document.authorName}</strong></span>
            {document.isbn && <span>| ISBN Node: <strong className="text-slate-700">{document.isbn}</strong></span>}
          </div>
        </div>

        {document.description && (
          <div className="py-6 border-b border-slate-100">
            <h2 className="font-mono text-xs uppercase tracking-wider text-slate-400 mb-2">Index Summary Abstract</h2>
            <p className="text-base text-slate-700 leading-relaxed text-justify whitespace-pre-line">
              {document.description}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 block">Fulfillment Clearance Target</span>
            <span className="text-2xl font-bold font-mono text-slate-950">
              {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(document.price)}
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <a 
              href={`/publications/${currentSlugToken}/resource-vault`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 text-slate-950 font-mono text-xs font-bold border-2 border-slate-950 px-5 py-3 rounded-xl transition-all shadow-2xs"
            >
              <ShieldCheckIcon className="h-4 w-4" />
              <span>Access Section C Vault</span>
            </a>
            
            <button className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-800 text-white font-mono text-xs font-bold px-5 py-3.5 rounded-xl transition-all shadow-xs">
              <span>Acquire System</span>
              <ArrowRightIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
