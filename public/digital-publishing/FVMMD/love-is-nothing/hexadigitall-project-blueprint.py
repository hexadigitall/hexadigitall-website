import os
from weasyprint import HTML

# Create the HTML structure for a beautiful, highly detailed, professional engineering blueprint PDF document.
# Using a clean white and slate blue palette matching Hexadigitall tech aesthetics, with crisp font sizing and zero flex/grid body layouts.

html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Hexadigitall Architectural Engineering Blueprint</title>
    <style>
        *, *::before, *::after {
            box-sizing: border-box;
        }
        @page {
            size: A4;
            margin: 20mm 15mm;
            background-color: #ffffff;
            @bottom-right {
                content: counter(page);
                font-family: 'Courier New', Courier, monospace;
                font-size: 8pt;
                color: #64748b;
            }
            @bottom-left {
                content: "Hexadigitall Blueprint v1.0.0 // Author: FVMMD";
                font-family: 'Courier New', Courier, monospace;
                font-size: 8pt;
                color: #64748b;
            }
        }
        body {
            margin: 0;
            padding: 0;
            font-family: 'Georgia', serif;
            font-size: 10pt;
            line-height: 1.6;
            color: #0f172a;
        }
        h1, h2, h3, h4 {
            font-family: 'Arial', sans-serif;
            color: #0f172a;
            margin-top: 0;
        }
        h1 {
            font-size: 24pt;
            letter-spacing: -0.5px;
            font-weight: 900;
            margin-bottom: 5px;
            text-transform: uppercase;
        }
        h2 {
            font-size: 14pt;
            font-weight: 700;
            border-left: 4px solid #0f172a;
            padding-left: 8px;
            margin-top: 25px;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            page-break-after: avoid;
        }
        h3 {
            font-size: 11pt;
            font-weight: 700;
            margin-top: 15px;
            margin-bottom: 6px;
            color: #1e3a8a;
            page-break-after: avoid;
        }
        p {
            margin: 0 0 10px 0;
            text-align: justify;
        }
        .code-block {
            font-family: 'Courier New', Courier, monospace;
            font-size: 8.5pt;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 10px;
            margin: 10px 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #0f172a;
        }
        .header-banner {
            margin: -20mm -15mm 25px -15mm;
            padding: 30px 15mm;
            background-color: #0f172a;
            color: #ffffff;
        }
        .header-banner h1 {
            color: #ffffff;
            margin: 0;
        }
        .header-banner .subtitle {
            font-family: 'Courier New', Courier, monospace;
            font-size: 9.5pt;
            color: #38bdf8;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .meta-table {
            display: table;
            width: 100%;
            margin-bottom: 25px;
            border-bottom: 2px solid #0f172a;
            padding-bottom: 15px;
        }
        .meta-row {
            display: table-row;
        }
        .meta-cell {
            display: table-cell;
            padding: 4px 0;
            font-size: 9pt;
        }
        .meta-label {
            font-family: 'Courier New', Courier, monospace;
            font-weight: bold;
            color: #475569;
            width: 18%;
        }
        .meta-value {
            font-family: 'Arial', sans-serif;
            color: #0f172a;
        }
        .info-box {
            background-color: #f0f9ff;
            border-left: 4px solid #0284c7;
            padding: 12px;
            margin: 15px 0;
            font-size: 9.5pt;
            page-break-inside: avoid;
        }
        .info-box-title {
            font-family: 'Arial', sans-serif;
            font-weight: bold;
            color: #0369a1;
            margin-bottom: 4px;
            text-transform: uppercase;
            font-size: 8.5pt;
            letter-spacing: 0.5px;
        }
        table.data-matrix {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            page-break-inside: avoid;
        }
        table.data-matrix th {
            font-family: 'Arial', sans-serif;
            font-size: 8.5pt;
            font-weight: bold;
            background-color: #0f172a;
            color: #ffffff;
            text-align: left;
            padding: 8px 10px;
            border: 1px solid #0f172a;
            text-transform: uppercase;
        }
        table.data-matrix td {
            font-family: 'Arial', sans-serif;
            font-size: 9pt;
            padding: 8px 10px;
            border: 1px solid #e2e8f0;
        }
        table.data-matrix tr:nth-child(even) td {
            background-color: #f8fafc;
        }
        .accent-text {
            font-family: 'Courier New', Courier, monospace;
            font-weight: bold;
            color: #0f172a;
            background-color: #f1f5f9;
            padding: 1px 4px;
            border-radius: 3px;
            font-size: 9pt;
        }
    </style>
</head>
<body>

    <div class="header-banner">
        <h1>Hexadigitall Blueprint</h1>
        <div class="subtitle">Ecosystem Architecture & Publication Integration Specification</div>
    </div>

    <div class="meta-table">
        <div class="meta-row">
            <div class="meta-cell meta-label">PROJECT NAME:</div>
            <div class="meta-cell meta-value">Hexadigitall Project Engine (hexadigitall.com)</div>
            <div class="meta-cell meta-label">DOCUMENT REF:</div>
            <div class="meta-cell meta-value">HEXA-BLU-2026-V1</div>
        </div>
        <div class="meta-row">
            <div class="meta-cell meta-label">AUTHOR IMPRINT:</div>
            <div class="meta-cell meta-value">FVMMD (Penname Workspace)</div>
            <div class="meta-cell meta-label">COMPILED DATE:</div>
            <div class="meta-cell meta-value">May 22, 2026</div>
        </div>
        <div class="meta-row">
            <div class="meta-cell meta-label">CORE TECH:</div>
            <div class="meta-cell meta-value">Next.js 15 (App Router), React 19, Sanity CMS, Paystack API</div>
            <div class="meta-cell meta-label">TARGET DEPLOY:</div>
            <div class="meta-cell meta-value">Vercel Edge Network</div>
        </div>
    </div>

    <h2>1. Executive Architectural Strategy</h2>
    <p>
        The Hexadigitall ecosystem is designed as a unified, high-performance publishing engine optimized for literary, research, and interactive manual distribution. This blueprint maps the structural translation of physical raw content into digital architectures. 
    </p>
    <p>
        The platform manages digital content distribution with an infrastructure optimized for speed, programmatic access controls, and transparent checkout fulfillment paths. By separating high-scale dynamic components from server-side static generation, the engine ensures millisecond lookup responses even under intense concurrency spikes on the <span class="accent-text">hexadigitall.com</span> domain.
    </p>

    <div class="info-box">
        <div class="info-box-title">Target Objective: Section C Appendix Matrix</div>
        This model focuses on launching the initial literary work <strong>"Love is Nothing. Love Comes From Everything Long Lasting"</strong>, standardizing how end-matter resource elements (tracking sheets, diagnostic tools, and roadmap sheets) are stored, processed, searched, and securely served to verified book owners.
    </div>

    <h2>2. Complete Technical Stack Array</h2>
    <p>
        To preserve extreme visual fidelity and execution speeds, the architecture enforces a modern stack boundary with clear component responsibilities:
    </p>
    <table class="data-matrix">
        <thead>
            <tr>
                <th style="width: 25%;">Technology Tier</th>
                <th style="width: 35%;">Engine Subsystem Component</th>
                <th style="width: 40%;">Architectural Operational Purpose</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Next.js 15</strong></td>
                <td>App Router Engine (`/app`)</td>
                <td>Provides high-performance, edge-rendered Server Components for immediate client painting.</td>
            </tr>
            <tr>
                <td><strong>React 19</strong></td>
                <td>Concurrent Mode Boundaries</td>
                <td>Enables asynchronous hydration and lightweight state streams for interface search fields.</td>
            </tr>
            <tr>
                <td><strong>Sanity CMS</strong></td>
                <td>GROQ Database Engine</td>
                <td>Acts as an immutable data ledger containing content definitions, file matrices, and author profiles.</td>
            </tr>
            <tr>
                <td><strong>Paystack API</strong></td>
                <td>Webhook Execution Node</td>
                <td>Processes high-volume financial checks and securely updates the asset authorization list.</td>
            </tr>
            <tr>
                <td><strong>Tailwind CSS</strong></td>
                <td>Utility Design Compiler</td>
                <td>Ensures clean UI generation without shipping unnecessary CSS bundles to mobile users.</td>
            </tr>
            <tr>
                <td><strong>TypeScript</strong></td>
                <td>Strict Type Inference</td>
                <td>Enforces compile-time type boundaries across all database payloads and client forms.</td>
            </tr>
        </tbody>
    </table>

    <h2>3. Production Directory Mapping</h2>
    <p>
        All modular content expansions and assets must strictly align to the following standardized file layout structures within the repository:
    </p>
    <div class="code-block">hexadigitall-project/
├── .build-scripts/
│   └── migrate-services.js        # Data seeding & migration execution script
├── app/
│   ├── api/
│   │   ├── publications/
│   │   │   └── search/
│   │   │       └── route.ts       # Performance edge search algorithm route
│   │   └── webhooks/
│   │       └── paystack/
│   │           └── route.ts       # Secure clearing automation endpoint
│   └── publications/
│       ├── page.tsx               # Base library and digital catalog entry point
│       └── [slug]/
│           ├── page.tsx           # Dynamic digital manuscript hub view
│           └── resource-vault/
│               └── page.tsx       # Section C gated asset download delivery vault
├── components/
│   └── publications/
│       ├── SearchInterface.tsx    # Responsive React 19 inline client component
│       └── ResourceCard.tsx       # Reusable element layout configuration
└── sanity/
    ├── schema.ts                  # Unified CMS compiler mapping connection file
    └── schemas/
        ├── author.ts              # Author metadata profile schema
        ├── publication.ts         # Digital literary item manifest schema
        └── resourceMatrix.ts      # Section C appendix tool reference schema</div>

    <h2>4. Database Engine Definitions (Sanity Schemas)</h2>
    <p>
        The content layout relies on a normalized graph structure. To connect Section C elements to manuscripts, the database architecture declares three distinct document schemas:
    </p>

    <h3>4.1. The Resource Matrix Schema</h3>
    <p>
        Tracks explicit tool definitions, diagnostic charts, and workbooks found inside the appendix sections of books.
    </p>
    <div class="code-block">// Location: sanity/schemas/resourceMatrix.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'resourceMatrix',
  title: 'Section C Resource Tracker Matrix',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Resource/Matrix Identifier Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'matrixId',
      title: 'Unique Section Reference Code',
      type: 'string',
      description: 'e.g., FVMMD-LIN-M3',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resourceType',
      title: 'Medium Classification',
      type: 'string',
      options: {
        list: [
          { title: 'Clean Tracking Template (Interactive)', value: 'template' },
          { title: 'Educational Roadmap Manual (PDF)', value: 'roadmap' },
          { title: 'Architecture Roundtable Workshop Entry', value: 'workshop' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secureAssetUrl',
      title: 'Protected Distribution File Link',
      type: 'url',
    }),
    defineField({
      name: 'requiresVerification',
      title: 'Enforce Book Proof of Purchase Entry Gate',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});</div>

    <h3>4.2. The Publication Registry Schema</h3>
    <p>
        Manages high-level book details, indexing structural relationships, pricing boundaries, and its associated resource maps.
    </p>
    <div class="code-block">// Location: sanity/schemas/publication.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'publication',
  title: 'Publication Knowledge Graph Registry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Complete Literary Work Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Route Slug Token',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author Profile Node',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isbn',
      title: 'International Standard Book Number',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Manuscript Abstract / Index Overview',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Base Cleardown Price (NGN/USD Equivalent)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'embeddedResources',
      title: 'Section C Appendix Matrix List Links',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'resourceMatrix' }] }],
    }),
  ],
});</div>

    <h2>5. Dynamic Searching Algorithm Architecture</h2>
    <p>
        To bypass heavy infrastructure search engines, a customized dynamic algorithmic route is built using Next.js Edge capabilities. The routine fetches a localized high-density GROQ map and measures term weights on clean string arrays using strict boundary regex matches.
    </p>
    <div class="code-block">// Location: app/api/publications/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
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
      "resources": embeddedResources[]-> { matrixId, title, resourceType }
    }`;

    const lookupDataset = await client.fetch(dataExtractQuery);
    const cleaningRegex = /[^\w\s]/g;
    const normalizationTokens = rawQueryString.toLowerCase().replace(cleaningRegex, '').split(/\s+/).filter(Boolean);

    const matchEvaluationEngine = lookupDataset.map((document: any) => {
      let documentAccumulatedScore = 0;
      const searchTargetString = [
        document.title,
        document.description || '',
        document.authorName,
        document.resources?.map((r: any) => `${r.matrixId} ${r.title}`).join(' ') || ''
      ].join(' ').toLowerCase().replace(cleaningRegex, '');

      normalizationTokens.forEach((token) => {
        if (searchTargetString.includes(token)) {
          const boundaryScan = new RegExp(`\\\\b${token}\\\\b`, 'i');
          documentAccumulatedScore += boundaryScan.test(searchTargetString) ? 10 : 3;
        }
      });

      return { node: document, calculatedMatchScore: documentAccumulatedScore };
    });

    const filteredRankedResults = matchEvaluationEngine
      .filter((candidate: any) => candidate.calculatedMatchScore > 0)
      .sort((alpha: any, beta: any) => beta.calculatedMatchScore - alpha.calculatedMatchScore)
      .map((entry: any) => entry.node);

    return NextResponse.json({ success: true, results: filteredRankedResults });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Internal Engine Compute Failure' }, { status: 500 });
  }
}</div>

    <h2>6. Paystack Financial Fulfillment Pipeline</h2>
    <p>
        When an analytical book sale executes successfully on the front end, Paystack dispatches a secure cryptographic payload. The application parses the hash signature against local server secrets to instantly instantiate user authorization logs inside Sanity.
    </p>
    <div class="code-block">// Location: app/api/webhooks/paystack/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { client } from '@/sanity/lib/client';

export async function POST(request: NextRequest) {
  try {
    const requestRawPayload = await request.text();
    const payloadHashSignature = request.headers.get('x-paystack-signature');
    const locallyCalculatedHash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!)
      .update(requestRawPayload)
      .digest('hex');

    if (payloadHashSignature !== locallyCalculatedHash) {
      return NextResponse.json({ error: 'Signature Verification Failure Exception' }, { status: 401 });
    }

    const payloadEventData = JSON.parse(requestRawPayload);

    if (payloadEventData.event === 'charge.success') {
      const { metadata } = payloadEventData.data;
      const customerEmail = payloadEventData.data.customer.email;
      const targetedPublicationId = metadata.publicationId;

      await client.create({
        _type: 'accessGrantLedger',
        customerIdentityToken: customerEmail,
        purchasedPublicationNode: { _type: 'reference', _ref: targetedPublicationId },
        grantedSystemTimestamp: new Date().toISOString(),
        operationalLedgerState: 'active',
      });
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (fault) {
    return NextResponse.json({ error: 'Fulfillment Error Lifecycle Catch' }, { status: 500 });
  }
}</div>

    <h2>7. Protected Resource Vault (Next.js Server Page)</h2>
    <p>
        The runtime interface utilizes Next.js Server Components to pull structured information, mapping safe access pathways without exposing secure layout definitions on the browser tier.
    </p>
    <div class="code-block">// Location: app/publications/[slug]/resource-vault/page.tsx
import { notFound } from 'next/navigation';
import { client } from '@/sanity/lib/client';

export default async function ResourceVaultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const extractionQuery = `*[_type == "publication" && slug.current == $slug][0] {
    _id,
    title,
    "resources": embeddedResources[]-> { _id, title, matrixId, resourceType, secureAssetUrl }
  }`;

  const documentPayload = await client.fetch(extractionQuery, { slug });
  if (!documentPayload) notFound();

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ borderBottom: '2px solid #000', paddingBottom: '10px' }}>{documentPayload.title} — Resource Vault</h1>
      <div style={{ marginTop: '20px' }}>
        {documentPayload.resources?.map((res: any) => (
          <div key={res._id} style={{ padding: '15px', border: '1px solid #ccc', marginBottom: '10px', background: '#f9f9f9' }}>
            <span style={{ background: '#000', color: '#fff', padding: '2px 6px', fontSize: '12px', fontFamily: 'monospace' }}>{res.matrixId}</span>
            <h3 style={{ margin: '5px 0' }}>{res.title}</h3>
            <a href={res.secureAssetUrl} style={{ color: '#0066cc', textDecoration: 'none', fontSize: '14px' }}>Download Asset Matrix →</a>
          </div>
        ))}
      </div>
    </div>
  );
}</div>

</body>
</html>
"""

# Output file path
output_pdf_path = "hexadigitall-project-blueprint.pdf"

# Generate the PDF document using WeasyPrint
HTML(string=html_content).write_pdf(output_pdf_path)
print(f"Blueprint PDF generated successfully: {output_pdf_path}")