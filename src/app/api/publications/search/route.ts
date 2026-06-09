import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/client';

interface SanityPublicationDataStream {
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const rawInputQuery = searchParams.get('q') || '';

    if (!rawInputQuery.trim()) {
      return NextResponse.json({ success: true, results: [] });
    }

    const compiledDataFetchQuery = `*[_type == "publication"] {
      _id,
      title,
      "slug": slug.current,
      description,
      "authorName": author->name,
      "resources": embeddedResources[]-> {
        matrixId,
        title,
        resourceType
      }
    }`;

    const lookupDataset: SanityPublicationDataStream[] = await client.fetch(compiledDataFetchQuery);
    const cleansingRegExp = /[^\w\s]/g;
    const trackingTokens = rawInputQuery.toLowerCase().replace(cleansingRegExp, '').split(/\s+/).filter(Boolean);

    const scoringCompilationEngine = lookupDataset.map((document) => {
      let documentCalculatedScore = 0;
      
      const aggregationTargetText = [
        document.title,
        document.description || '',
        document.authorName,
        document.resources?.map(resource => `${resource.matrixId} ${resource.title}`).join(' ') || ''
      ].join(' ').toLowerCase().replace(cleansingRegExp, '');

      trackingTokens.forEach((token) => {
        if (aggregationTargetText.includes(token)) {
          const absoluteWordBoundaryScan = new RegExp(`\\b${token}\\b`, 'i');
          if (absoluteWordBoundaryScan.test(aggregationTargetText)) {
            documentCalculatedScore += 10;
          } else {
            documentCalculatedScore += 3;
          }
        }
      });

      return { node: document, operationalScore: documentCalculatedScore };
    });

    const finalizedRankedTransforms = scoringCompilationEngine
      .filter((candidate) => candidate.operationalScore > 0)
      .sort((a, b) => b.operationalScore - a.operationalScore)
      .map((entry) => entry.node);

    return NextResponse.json({ success: true, results: finalizedRankedTransforms });
  } catch (exceptionSystemFault) {
    console.error('Core algorithmic fault trace:', exceptionSystemFault);
    return NextResponse.json({ success: false, error: 'Internal Analytical Processing Fault' }, { status: 500 });
  }
}