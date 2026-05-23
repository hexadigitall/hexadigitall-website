import { notFound } from 'next/navigation';
import { client } from '@/sanity/client';
import { ArrowDownTrayIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

interface CompletePageProps {
  params: Promise<{ slug: string }>;
}

interface ExtractionNodePayload {
  _id: string;
  title: string;
  resources: Array<{
    _id: string;
    title: string;
    matrixId: string;
    resourceType: string;
    secureAssetUrl: string;
    requiresVerification: boolean;
  }>;
}

export default async function ResourceVaultPage({ params }: CompletePageProps) {
  const resolvesRouteParameters = await params;
  const targetSlugToken = resolvesRouteParameters.slug;

  const extractionQuery = `*[_type == "publication" && slug.current == $slug][0] {
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

  const documentPayload: ExtractionNodePayload | null = await client.fetch(extractionQuery, { slug: targetSlugToken });

  if (!documentPayload) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-serif text-slate-900">
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 p-8 rounded-xl shadow-sm">
        <div className="border-b border-slate-900 pb-6 mb-8">
          <div className="flex items-center space-x-3 text-emerald-700 font-mono text-sm uppercase tracking-wider mb-2">
            <ShieldCheckIcon className="h-5 w-5" />
            <span>Academy Verification Command Matrix Active</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-950 font-sans tracking-tight">
            {documentPayload.title} — Protected Resource Vault
          </h1>
          <p className="text-slate-600 mt-2 text-sm italic">
            Access secure clean tracking templates, diagnostic cohort matrices, and educational roadmaps explicitly distributed under the imprint documentation.
          </p>
        </div>

        <div className="space-y-4">
          {documentPayload.resources && documentPayload.resources.length > 0 ? (
            documentPayload.resources.map((matrixItem) => (
              <div 
                key={matrixItem._id} 
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 border border-slate-100 bg-slate-50/50 hover:bg-slate-50 rounded-lg transition-all"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wide bg-slate-900 text-white px-2 py-0.5 rounded">
                      {matrixItem.matrixId}
                    </span>
                    <span className="font-mono text-xs capitalize text-slate-500">
                      {matrixItem.resourceType} Node Type
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 mt-1 font-sans">{matrixItem.title}</h3>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">System Verification Required System Gate</p>
                </div>

                <a
                  href={matrixItem.secureAssetUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-mono text-xs rounded transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Retrieve Matrix Link</span>
                </a>
              </div>
            ))
          ) : (
            <div className="text-center py-12 border border-dashed border-slate-200 rounded-lg">
              <p className="font-mono text-sm text-slate-400">No external Section C system manifests configured inside this blueprint registry node.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
