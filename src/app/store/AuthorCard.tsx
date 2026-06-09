'use client'
// src/app/store/AuthorCard.tsx

import Image from 'next/image'
import Link from 'next/link'
import type { AuthorSummary } from '@/lib/book-queries'

export default function AuthorCard({ author }: { author: AuthorSummary }) {
  // Use specific local asset for FVMMD, fallback to Sanity image
  const isFVMMD = author.slug.current === 'fvmmd'
  const coverUrl = isFVMMD 
    ? '/digital-publishing/FVMMD/completed/author-fvmmd-cover.png' 
    : author.image?.asset?.url

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-all duration-500">
      <Link href={`/store/author/${author.slug.current}`} className="block relative bg-slate-50 dark:bg-slate-950 overflow-hidden" style={{ aspectRatio: '3/4' }}>
        {coverUrl ? (
          <Image 
            src={coverUrl} 
            alt={author.name} 
            fill 
            sizes="(max-width: 768px) 100vw, 400px" 
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-6xl opacity-20">👤</div>
        )}
        
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-black uppercase tracking-widest bg-black/80 text-white px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
            Author / Creator
          </span>
        </div>
      </Link>

      <div className="p-8 flex flex-col flex-1">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight min-h-[3rem]">
            {author.name}
          </h3>
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-widest italic line-clamp-2">
            {author.biography || `${author.workCount} Published Works`}
          </p>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800">
          <Link 
            href={`/store/author/${author.slug.current}`} 
            className="flex items-center justify-center w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all shadow-xl active:scale-95"
          >
            View Imprints
          </Link>
        </div>
      </div>
    </article>
  )
}
