import React from 'react';
import { notFound } from 'next/navigation';
import { client } from '@/sanity/client';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ViewProps {
  params: Promise<{ slug: string }>;
}

export default async function WebBookViewer({ params }: ViewProps) {
  const { slug } = await params;

  // Fetch the asset and its parent publication/book info
  const query = `*[_type == "asset" && slug.current == $slug][0] {
    title,
    resourceType,
    "fileUrl": file.asset->url
  }`;
  
  const asset = await client.fetch(query, { slug });

  if (!asset || !asset.fileUrl || asset.resourceType !== 'tool') {
    // If not a tool (HTML), we don't use this viewer
    notFound();
  }

  // Fetch the HTML content
  const response = await fetch(asset.fileUrl);
  let htmlContent = await response.text();

  // Inject Hexadigitall Branding Styles to ensure it looks good even if original CSS is missing
  const styledHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          :root {
            --hex-blue: #0066FF;
            --hex-gold: #FFD700;
          }
          body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            max-width: 900px; 
            margin: 0 auto; 
            padding: 40px 20px;
            background: #fff;
          }
          @media (prefers-color-scheme: dark) {
            body { background: #0f172a; color: #f1f5f9; }
          }
          .hex-header {
            border-bottom: 2px solid var(--hex-blue);
            margin-bottom: 40px;
            padding-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="hex-header">
           <h1 style="margin:0; font-size: 24px;">${asset.title}</h1>
           <p style="margin:5px 0 0; color: #64748b; font-size: 14px; font-style: italic;">Hexadigitall Ecosystem Asset</p>
        </div>
        ${htmlContent}
      </body>
    </html>
  `;

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Viewer Header */}
      <header className="bg-slate-950 border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/store" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="h-6 w-px bg-white/10"></div>
          <div>
            <h1 className="text-white font-bold text-sm leading-tight">{asset.title}</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Interactive Web-Book Edition</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-1 rounded">SECURE VIEW</span>
        </div>
      </header>

      {/* Content Frame */}
      <div className="flex-1 w-full max-w-5xl mx-auto bg-white overflow-hidden shadow-2xl my-8 rounded-2xl">
         <iframe 
           srcDoc={styledHtml}
           className="w-full h-full border-0"
           title={asset.title}
           sandbox="allow-scripts"
         />
      </div>
      
      <footer className="bg-slate-950 py-4 px-6 text-center">
         <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">© 2026 Hexadigitall Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
