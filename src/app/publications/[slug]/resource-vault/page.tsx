import React from 'react';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/client';
import { ArrowDownTrayIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface VaultRoutingProps {
  params: Promise<{ slug: string }>;
}

interface AppendixResourceNode {
  _id: string;
  title: string;
  matrixId: string;
  resourceType: string;
  secureAssetUrl: string;
  requiresVerification: boolean;
}

interface ComprehensiveVaultPayload {
  _id: string;
  title: string;
  resources: AppendixResourceNode[] | null;
}

export default async function ProtectedResourceVaultPage({ params }: VaultRoutingProps) {
  const parsedSlugParams = await params;
  const identifierSlugToken = parsedSlugParams.slug;

  const dataExtractionGROQ = `*[_type == "publication" && slug.current == $slug][0] {
    _id,
    title,
    "resources": embeddedResources[]-> {
      _id,
      title,
      matrixId,
      resourceType,
      secureAssetUrl,
      requiresVerification
    }
  }`;

  const payload: ComprehensiveVaultPayload | null = await client.fetch(dataExtractionGROQ, { slug: identifierSlugToken });

  if (!payload) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 text-slate-950">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
        <div className="border-b border-slate-950 pb-6 mb-8">
          <div className="inline-flex items-center space-x-2 text-emerald-800 font-mono text-xs uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full mb-3">
            <ShieldCheckIcon className="h-4 w-4 text-emerald-600" />
            <span className="font-bold">Ecosystem Authorization Gate Active</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-slate-950 tracking-tight sm:text-4xl">
            {payload.title}
          </h1>
          <p className="text-sm text-slate-500 font-serif italic mt-2">
            Section C Infrastructure Vault: Download validated workbook models, asset tracking dashboards, and strategic reference charts.
          </p>
        </div>

        <div className="space-y-4">
          {payload.resources && payload.resources.length > 0 ? (
            payload.resources.map((matrix) => (
              <div key={matrix._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-slate-100 bg-slate-50/40 rounded-xl hover:bg-slate-50 transition-all group">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-950 text-white px-2 py-0.5 rounded shadow-sm">
                      {matrix.matrixId}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider capitalize">
                      {matrix.resourceType.replace('-', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-slate-950 group-hover:text-blue-900 transition-colors">
                    {matrix.title}
                  </h3>
                </div>

                <a
                  href={matrix.secureAssetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-slate-950 hover:bg-slate-800 text-white font-mono text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Download Matrix</span>
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/20">
              <p className="font-mono text-sm text-slate-400">No external data matrix sheets mapped to this blueprint.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}