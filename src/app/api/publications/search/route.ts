import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/client';

interface SearchPayloadNode {
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

interface ScoredSearchNode {
  node: SearchPayloadNode;
  calculatedMatchScore: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawQueryString = searchParams.get('q') || '';

    if (!rawQueryString.trim()) {
      return NextResponse.json({ success: true, results: [] });
    }

    const dataExtractQuery = `*[_type == "publication"] {
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

    const lookupDataset: SearchPayloadNode[] = await client.fetch(dataExtractQuery);
    const cleaningRegex = /[^\w\s]/g;
    const normalizationTokens = rawQueryString.toLowerCase().replace(cleaningRegex, '').split(/\s+/).filter(Boolean);

    const matchEvaluationEngine: ScoredSearchNode[] = lookupDataset.map((document) => {
      let documentAccumulatedScore = 0;
      const searchTargetString = [
        document.title,
        document.description || '',
        document.authorName,
        document.resources.map(r => `${r.matrixId} ${r.title}`).join(' ')
      ].join(' ').toLowerCase().replace(cleaningRegex, '');
      normalizationTokens.forEach((token) => {
        if (searchTargetString.includes(token)) {
          const boundaryScan = new RegExp(`\\b${token}\\b`, 'i');
          if (boundaryScan.test(searchTargetString)) {
            documentAccumulatedScore += 10;
          } else {
            documentAccumulatedScore += 3;
          }
        }
      });
      return { node: document, calculatedMatchScore: documentAccumulatedScore };
    });

    const filteredRankedResults = matchEvaluationEngine
      .filter(candidate => candidate.calculatedMatchScore > 0)
      .sort((alpha, beta) => beta.calculatedMatchScore - alpha.calculatedMatchScore)
      .map(entry => entry.node);

    return NextResponse.json({ success: true, results: filteredRankedResults });
  } catch (structuralSystemFault) {
    return NextResponse.json(
      { success: false, error: 'Internal Engine Compute Failure Exception' },
      { status: 500 }
    );
  }
}
