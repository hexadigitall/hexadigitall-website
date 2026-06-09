// src/app/errata/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getBookBySlug, getAllBookSlugs, type ErrataItem } from '@/lib/book-queries'
import ErrataDetailClient from '@/app/errata/[slug]/ErrataDetailClient'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://hexadigitall.com'

type Props = { params: Promise<{ slug: string }> }

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) return { title: 'Errata Not Found | Hexadigitall' }

  return {
    title: `Errata: ${book.title} | Hexadigitall`,
    description: `Official corrections and errata for "${book.title}" by Hexadigitall. ${book.errata?.length ?? 0} correction(s) logged.`,
    alternates: { canonical: `${BASE_URL}/errata/${slug}` },
    openGraph: {
      title: `Errata: ${book.title}`,
      description: `Corrections for the Hexadigitall textbook "${book.title}"`,
      url: `${BASE_URL}/errata/${slug}`,
      siteName: 'Hexadigitall',
      locale: 'en_NG',
      type: 'website',
    },
  }
}

export async function generateStaticParams() {
  const slugs = await getAllBookSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const SEVERITY_STYLES: Record<string, { badge: string; label: string }> = {
  minor: { badge: 'bg-gray-100 dark:bg-slate-800 dark:bg-slate-700 text-gray-600 dark:text-slate-400 dark:text-slate-300', label: 'Typo / Minor' },
  content: { badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300', label: 'Content Error' },
  code: { badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300', label: 'Code Error' },
  critical: { badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300', label: 'Critical' },
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ErrataPage({ params }: Props) {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) notFound()

  const errata: ErrataItem[] = book.errata ?? []
  const coverUrl = book.coverImage?.asset?.url

  // Group by severity for summary counts
  const counts = errata.reduce((acc, e) => {
    acc[e.severity] = (acc[e.severity] ?? 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-900 dark:text-slate-100 dark:text-slate-100">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-slate-500 dark:text-slate-400 mb-8">
        <Link href="/" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/errata" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Errata</Link>
        <span className="mx-2">/</span>
        <span className="text-primary dark:text-cyan-300 font-medium line-clamp-1">{book.title}</span>
      </nav>

      {/* Book header */}
      <div className="flex items-start gap-5 mb-10">
        {coverUrl && (
          <div className="relative w-16 flex-shrink-0 rounded-lg overflow-hidden shadow" style={{ aspectRatio: '3/4' }}>
            <Image src={coverUrl} alt={book.title} fill sizes="64px" className="object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-cyan-300 leading-tight">{book.title}</h1>
          {book.edition && <p className="text-sm text-gray-500 dark:text-slate-500 dark:text-slate-400 mt-1">{book.edition}</p>}
          <div className="flex gap-3 mt-3">
            <Link href={`/store/${slug}`} className="text-xs text-secondary hover:underline">← Back to book</Link>
            {(book.resources?.length ?? 0) > 0 && (
              <Link href={`/resources/${slug}`} className="text-xs text-secondary hover:underline">📁 Resources</Link>
            )}
          </div>
        </div>
      </div>

      {/* Summary stats */}
      {errata.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="text-sm font-semibold text-gray-700 dark:text-slate-300 dark:text-slate-300">{errata.length} correction{errata.length !== 1 ? 's' : ''} logged</span>
          {Object.entries(counts).map(([sev, count]) => (
            <span key={sev} className={`text-xs px-2 py-1 rounded-full font-medium ${SEVERITY_STYLES[sev]?.badge ?? 'bg-gray-100 dark:bg-slate-800 dark:bg-slate-700 text-gray-600 dark:text-slate-400 dark:text-slate-300'}`}>
              {count} {SEVERITY_STYLES[sev]?.label ?? sev}
            </span>
          ))}
        </div>
      )}

      {/* Errata list */}
      {errata.length > 0 ? (
        <ErrataDetailClient errata={errata} />
      ) : (
        <section className="mb-16 text-center py-16 text-gray-500 dark:text-slate-500 dark:text-slate-400">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-lg font-medium text-gray-700 dark:text-slate-300 dark:text-slate-400">No corrections logged yet for this edition.</p>
          <p className="text-sm mt-2">Found an error? Let us know using the form below.</p>
        </section>
      )}

      {/* Report form */}
        <section id="report" className="bg-gray-50 dark:bg-slate-800/50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700">
        <h2 className="text-xl font-bold text-primary dark:text-cyan-300 mb-2">Report an Error</h2>
        <p className="text-sm text-gray-600 dark:text-slate-400 dark:text-slate-400 mb-5">
          Found something wrong in <strong>{book.title}</strong>? Fill in the details below and we&apos;ll investigate and log it here.
        </p>
        <form
          action="https://formspree.io/f/errataReport"
          method="POST"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input type="hidden" name="book" value={`${book.title} (${book.edition ?? 'unknown edition'})`} />
          <input type="hidden" name="bookSlug" value={slug} />

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">Your Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Amara Okonkwo"
              className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">Your Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">Page Number</label>
            <input
              type="number"
              name="page"
              placeholder="e.g. 42"
              className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">Location / Chapter</label>
            <input
              type="text"
              name="location"
              placeholder='e.g. "Chapter 3, Exercise 2"'
              className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">What it says (incorrect text)</label>
            <textarea
              name="original"
              required
              rows={3}
              placeholder="Copy the incorrect text here..."
              className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 dark:text-slate-300 dark:text-slate-300 mb-1">What it should say</label>
            <textarea
              name="correction"
              required
              rows={3}
              placeholder="What do you think the correct version should be?"
              className="w-full rounded-lg border border-gray-200 dark:border-slate-700 px-3 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Submit Report
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}
