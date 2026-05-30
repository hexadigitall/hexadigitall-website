// src/app/store/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getBookBySlug, getAllBookSlugs, type BookDetail } from '@/lib/book-queries'
import ReleaseNotifyForm from '@/app/store/[slug]/ReleaseNotifyForm'
import StoreBuySection from '@/components/sections/StoreBuySection'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'
export const dynamicParams = true 
const BASE_URL = 'https://hexadigitall.com'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) return { title: 'Book Not Found | Hexadigitall' }

  const ogImage = book.ogImage?.asset?.url ?? book.coverImage?.asset?.url ?? `${BASE_URL}/og-images/store.jpg`

  return {
    title: `${book.ogTitle ?? book.title} | Hexadigitall Library`,
    description: book.ogDescription ?? book.description ?? `${book.title} — Hexadigitall textbook.`,
    openGraph: {
      title: book.ogTitle ?? book.title,
      description: book.ogDescription ?? book.description ?? '',
      url: `${BASE_URL}/store/${slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: book.title }],
      type: 'website',
      siteName: 'Hexadigitall',
    },
    alternates: { canonical: `${BASE_URL}/store/${slug}` },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllBookSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

const STATUS_STYLES: Record<string, string> = {
  available: 'bg-green-100 text-green-700',
  coming_soon: 'bg-amber-100 text-amber-700',
  out_of_stock: 'bg-gray-100 text-gray-500',
  discontinued: 'bg-red-100 text-red-600',
}

const STATUS_LABELS: Record<string, string> = {
  available: 'Available Now',
  coming_soon: 'Coming Soon',
  out_of_stock: 'Out of Stock',
  discontinued: 'Discontinued',
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) notFound()

  const coverUrl = book.coverImage?.asset?.url
  const hasErrata = Array.isArray(book.errata) && book.errata.length > 0
  const hasResources = (Array.isArray(book.resources) && book.resources.length > 0) || (Array.isArray(book.assets) && book.assets.length > 0)
  
  const displayAuthor = (['imprint', 'publication'].includes(book._type) ? book.author?.name : (Array.isArray(book.authors) && book.authors.length > 0 ? book.authors.join(', ') : 'Hexadigitall')) || 'Hexadigitall'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    description: book.description,
    author: ['imprint', 'publication'].includes(book._type) ? { '@type': 'Person', name: book.author?.name || 'Hexadigitall' } : (Array.isArray(book.authors) ? book.authors.map((a: string) => ({ '@type': 'Person', name: a })) : []),
    publisher: { '@type': 'Organization', name: 'Hexadigitall' },
    datePublished: book.publishedAt,
    isbn: book.isbn,
    numberOfPages: book.pageCount,
    inLanguage: 'en',
    url: `${BASE_URL}/store/${slug}`,
    image: coverUrl,
    offers: [
      {
        '@type': 'Offer',
        priceCurrency: 'NGN',
        price: book.pricing?.ngn || 0,
        availability: book.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      }
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-slate-950">

        <nav className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-12">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/store" className="hover:text-blue-600 transition-colors">Library</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-white font-bold line-clamp-1">{book.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] lg:grid-cols-[380px_1fr] gap-12 lg:gap-20 mb-24">
          <div className="flex flex-col gap-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800" style={{ aspectRatio: '3/4' }}>
              {coverUrl ? (
                <Image src={coverUrl} alt={book.title} fill sizes="(max-width: 768px) 80vw, 380px" className="object-cover" priority />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500/5 to-purple-500/5"><span className="text-8xl">📘</span></div>
              )}
            </div>
            {book.isbn && (
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">International Registry</p>
                <p className="font-mono text-xs text-slate-900 dark:text-slate-300 font-bold">{book.isbn}</p>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${STATUS_STYLES[book.status] || 'bg-gray-100'}`}>
                  {STATUS_LABELS[book.status] || 'Active'}
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950 text-white px-3 py-1.5 rounded-full border border-white/10">
                  {book._type === 'book' ? 'Course Textbook' : 'Digital Imprint'}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-slate-950 dark:text-white leading-tight mb-4 tracking-tight">{book.title}</h1>
              {book.subtitle && <p className="text-xl text-slate-500 dark:text-slate-400 font-serif italic mb-6">{book.subtitle}</p>}
              <div className="flex items-center gap-4 py-4 border-y border-slate-100 dark:border-slate-800 mb-8">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20">{displayAuthor.charAt(0).toUpperCase()}</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authored By</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{displayAuthor}</p>
                </div>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none mb-12">
              <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 font-serif whitespace-pre-line">{book.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-12">
              {book.edition && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Edition</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{book.edition}</p>
                </div>
              )}
              {book.level && typeof book.level === 'string' && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Level</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200 capitalize">{book.level.replace('_', ' ')}</p>
                </div>
              )}
              {book.pageCount && (
                <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Extent</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{book.pageCount} Pages</p>
                </div>
              )}
            </div>

            {book.status === 'available' && <StoreBuySection book={book} />}
            {book.status === 'coming_soon' && (
              <div className="bg-slate-950 rounded-3xl p-8 border border-white/10 shadow-2xl">
                <p className="text-white font-bold mb-4">Be the first to know when it drops.</p>
                <ReleaseNotifyForm slug={slug} title={book.title} />
              </div>
            )}
          </div>
        </div>

        {book.relatedCourse?.slug?.current && (
          <section className="mb-24">
            <Link href={`/courses/${book.relatedCourse.slug.current}`} className="group block bg-blue-600 rounded-3xl p-1 shadow-xl shadow-blue-500/20">
              <div className="bg-white dark:bg-slate-950 rounded-[22px] p-8 flex flex-col md:flex-row items-center justify-between gap-8 group-hover:bg-transparent transition-all duration-500">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-white/20 transition-colors">🎓</div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:text-white mb-1 transition-colors">Companion Course</p>
                    <h2 className="text-2xl font-bold text-slate-950 dark:text-white group-hover:text-white transition-colors">{book.relatedCourse.title}</h2>
                  </div>
                </div>
                <div className="text-blue-600 group-hover:text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-colors">Explore Curriculum <ArrowRightIcon className="h-4 w-4" /></div>
              </div>
            </Link>
          </section>
        )}

        {Array.isArray(book.assets) && book.assets.length > 0 && (
          <section className="mb-24">
             <h2 className="text-3xl font-bold font-serif text-slate-950 dark:text-white mb-10 flex items-center gap-4">Companion Digital Assets<span className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></span></h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {book.assets.map((asset: any) => (
                  <div key={asset._id} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-mono text-[10px] font-black bg-slate-950 text-white px-2 py-1 rounded">{asset.matrixId}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{asset.resourceType}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 group-hover:text-blue-600 transition-colors">{asset.title}</h3>
                    <button className="w-full py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-950 hover:text-white transition-all">Acquire Asset</button>
                  </div>
                ))}
             </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {Array.isArray(book.longDescription) && book.longDescription.length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">Manuscript Overview</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none font-serif leading-relaxed text-slate-700 dark:text-slate-400 italic">
                  <PortableText value={book.longDescription as Record<string, unknown>[]} />
                </div>
              </section>
            )}
            {Array.isArray(book.tableOfContents) && book.tableOfContents.length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">Index Structure</h2>
                <ol className="space-y-4">
                  {book.tableOfContents.map((entry) => (
                    <li key={entry._key} className="flex items-center gap-6 group">
                      <span className="font-mono text-xs font-black text-slate-300 dark:text-slate-700 group-hover:text-blue-600 transition-colors">{entry.chapter.toString().padStart(2, '0')}</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-400 group-hover:text-slate-950 dark:group-hover:text-white transition-colors">{entry.title}</span>
                      <div className="h-px flex-1 bg-slate-50 dark:bg-slate-900 border-b border-dotted border-slate-200 dark:border-slate-800"></div>
                      {entry.pages && <span className="font-mono text-[10px] text-slate-400">{entry.pages}</span>}
                    </li>
                  ))}
                </ol>
              </section>
            )}
        </div>

        <section className="mt-32 pt-12 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {hasErrata && (
              <Link href={`/errata/${slug}`} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🔍</span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Maintenance</p>
                    <p className="font-bold text-slate-900 dark:text-slate-200">View Errata & Corrections</p>
                  </div>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-slate-300 group-hover:text-red-500 transition-colors" />
              </Link>
            )}
            {book.allowCopyRegistration && (
              <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group cursor-pointer">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Ownership</p>
                    <p className="font-bold text-slate-900 dark:text-slate-200">Register Proof of Purchase</p>
                  </div>
                </div>
                <ArrowRightIcon className="h-5 w-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            )}
        </section>
      </main>
    </>
  )
}