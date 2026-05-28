import React from 'react';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/client';
import { ShieldCheckIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import PublicationActions from '@/components/publications/PublicationActions';

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
  allowCopyRegistration: boolean;
  resources: any[] | null;
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
    allowCopyRegistration,
    "authorName": author->name,
    "resources": embeddedResources[]-> {
      _id,
      title,
      matrixId,
      resourceType,
      priceNGN,
      priceUSD
    }
  }`;

  const document: PublicationDocumentPayload | null = await client.fetch(secureQueryFetch, { slug: currentSlugToken });

  if (!document) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50/30 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8 font-serif text-slate-950">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-xs">
        <div className="border-b border-slate-900 dark:border-slate-700 pb-10">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-blue-600 font-black block mb-3">
            Manuscript Registry Element
          </span>
          <h1 className="text-4xl font-bold font-serif tracking-tight sm:text-5xl text-slate-950 dark:text-white leading-tight">
            {document.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 mt-6 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
            <span>Author Workspace: <strong className="text-slate-700 dark:text-slate-200">{document.authorName}</strong></span>
            {document.isbn && <span>| ISBN Node: <strong className="text-slate-700 dark:text-slate-200">{document.isbn}</strong></span>}
          </div>
        </div>

        {document.description && (
          <div className="py-10 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-4 font-bold">Index Summary Abstract</h2>
            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-justify whitespace-pre-line font-serif italic">
              "{document.description}"
            </p>
          </div>
        )}

        <PublicationActions 
          publicationId={document._id}
          title={document.title}
          price={document.price}
          slug={currentSlugToken}
          allowRegistration={document.allowCopyRegistration}
          resources={document.resources || []}
        />
        
        <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 text-center">
          <a 
            href={`/publications/${currentSlugToken}/resource-vault`}
            className="inline-flex items-center space-x-2 text-slate-400 hover:text-blue-600 transition-all font-mono text-[10px] uppercase tracking-widest"
          >
            <ShieldCheckIcon className="h-4 w-4" />
            <span>Direct Access Endpoint (Verify Authorization)</span>
          </a>
        </div>
      </div>
    </main>
  );
}
