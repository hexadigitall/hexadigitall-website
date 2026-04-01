// src/app/store/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getBookBySlug, getAllBookSlugs, type BookDetail, type SalesLink } from '@/lib/book-queries'
import ReleaseNotifyForm from '@/app/store/[slug]/ReleaseNotifyForm'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://hexadigitall.com'

type Props = { params: Promise<{ slug: string }> }

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) return { title: 'Book Not Found | Hexadigitall' }

  const ogImage = book.ogImage?.asset?.url ?? book.coverImage?.asset?.url ?? `${BASE_URL}/og-images/store.jpg`

  return {
    title: `${book.ogTitle ?? book.title} | Hexadigitall Store`,
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

// ── Static params ─────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const slugs = await getAllBookSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}

// ── Helpers ───────────────────────────────────────────────────────────────────

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

const PLATFORM_ICONS: Record<string, string> = {
  amazon_paperback: '📦',
  amazon_hardcover: '📚',
  amazon_kindle: '📱',
  selar: '🛒',
  paystack: '💳',
  pdf: '📄',
  other: '🔗',
}

const PLATFORM_LABELS: Record<string, string> = {
  amazon_paperback: 'Amazon Paperback',
  amazon_hardcover: 'Amazon Hardcover',
  amazon_kindle: 'Amazon Kindle',
  selar: 'Selar',
  paystack: 'Paystack',
  pdf: 'Direct PDF Download',
  other: 'Buy',
}

const SEVERITY_COLORS: Record<string, string> = {
  minor: 'bg-gray-100 text-gray-600',
  content: 'bg-amber-100 text-amber-700',
  code: 'bg-blue-100 text-blue-700',
  critical: 'bg-red-100 text-red-700',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function BookPage({ params }: Props) {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) notFound()

  const coverUrl = book.coverImage?.asset?.url
  const hasErrata = (book.errata?.length ?? 0) > 0
  const hasResources = (book.resources?.length ?? 0) > 0
  const publicResources = book.resources?.filter((r) => !r.gated) ?? []

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    description: book.description,
    author: book.authors?.map((a: string) => ({ '@type': 'Person', name: a })) ?? [],
    publisher: { '@type': 'Organization', name: 'Hexadigitall' },
    datePublished: book.publishedAt,
    isbn: book.isbn,
    numberOfPages: book.pageCount,
    inLanguage: 'en',
    url: `${BASE_URL}/store/${slug}`,
    image: coverUrl,
    offers: book.salesLinks?.map((l: SalesLink) => ({
      '@type': 'Offer',
      url: l.url,
      priceCurrency: l.priceNGN ? 'NGN' : 'USD',
      price: l.priceNGN ?? l.priceUSD ?? 0,
      availability: book.status === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
    })) ?? [],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/store" className="hover:text-primary transition-colors">Store</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium line-clamp-1">{book.title}</span>
        </nav>

        {/* Hero row */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-10 mb-16">

          {/* Cover */}
          <div className="flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: '3/4' }}>
              {coverUrl ? (
                <Image
                  src={coverUrl}
                  alt={book.coverImage?.alt ?? `${book.title} cover`}
                  fill
                  sizes="(max-width: 768px) 80vw, 320px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  <span className="text-7xl">📘</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div>
              <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3 ${STATUS_STYLES[book.status]}`}>
                {STATUS_LABELS[book.status]}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-primary leading-tight">{book.title}</h1>
              {book.subtitle && <p className="text-lg text-gray-500 mt-1">{book.subtitle}</p>}
              {book.authors && (
                <p className="text-sm text-gray-600 mt-2">by {book.authors.join(', ')}</p>
              )}
            </div>

            {/* Meta grid */}
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm">
              {book.edition && (
                <>
                  <dt className="text-gray-400">Edition</dt>
                  <dd className="col-span-1 font-medium text-darkText">{book.edition}</dd>
                </>
              )}
              {book.level && (
                <>
                  <dt className="text-gray-400">Level</dt>
                  <dd className="font-medium text-darkText capitalize">{book.level.replace('_', ' ')}</dd>
                </>
              )}
              {book.pageCount && (
                <>
                  <dt className="text-gray-400">Pages</dt>
                  <dd className="font-medium text-darkText">{book.pageCount}</dd>
                </>
              )}
              {book.isbn && (
                <>
                  <dt className="text-gray-400">ISBN</dt>
                  <dd className="font-mono text-xs text-darkText">{book.isbn}</dd>
                </>
              )}
              {book.publishedAt && (
                <>
                  <dt className="text-gray-400">Published</dt>
                  <dd className="font-medium text-darkText">
                    {new Date(book.publishedAt).toLocaleDateString('en-NG', { year: 'numeric', month: 'long' })}
                  </dd>
                </>
              )}
            </dl>

            <p className="text-gray-600 leading-relaxed">{book.description}</p>

            {/* Related course */}
            {book.relatedCourse && (
              <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                <span className="text-2xl">🎓</span>
                <div>
                  <p className="text-xs text-gray-500">Companion course</p>
                  <Link href={`/courses/${book.relatedCourse.slug.current}`} className="text-sm font-semibold text-primary hover:underline">
                    {book.relatedCourse.title}
                  </Link>
                </div>
              </div>
            )}

            {/* Quick-link pills to sub-pages */}
            <div className="flex flex-wrap gap-2 text-sm">
              {hasResources && (
                <Link href={`/resources/${slug}`} className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full font-medium hover:bg-secondary/20 transition-colors">
                  📁 Free Resources
                </Link>
              )}
              {hasErrata && (
                <Link href={`/errata/${slug}`} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium hover:bg-gray-200 transition-colors">
                  🔍 Corrections (Errata)
                </Link>
              )}
            </div>

            {/* Buy buttons */}
            {book.status === 'available' && book.salesLinks && book.salesLinks.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold mb-2 tracking-wider">Where to Buy</p>
                <div className="flex flex-wrap gap-3">
                  {book.salesLinks.map((link: SalesLink) => (
                    <a
                      key={link._key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <span>{PLATFORM_ICONS[link.platform] ?? '🛒'}</span>
                      <span>{link.label ?? PLATFORM_LABELS[link.platform] ?? 'Buy'}</span>
                      {link.priceNGN && <span className="text-white/80 text-xs">₦{link.priceNGN.toLocaleString()}</span>}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Notify form anchor for coming soon */}
            {book.status === 'coming_soon' && (
              <ReleaseNotifyForm slug={slug} title={book.title} />
            )}
          </div>
        </div>

        {/* Long description */}
        {book.longDescription && (
          <section className="mb-16 max-w-3xl">
            <h2 className="text-2xl font-bold text-primary mb-5">About This Book</h2>
            <div className="prose prose-gray max-w-none">
              <PortableText value={book.longDescription as Record<string, unknown>[]} />
            </div>
          </section>
        )}

        {/* Table of contents */}
        {book.tableOfContents && book.tableOfContents.length > 0 && (
          <section className="mb-16 max-w-2xl">
            <h2 className="text-2xl font-bold text-primary mb-5">Table of Contents</h2>
            <ol className="space-y-2">
              {book.tableOfContents.map((entry) => (
                <li key={entry._key} className="flex items-baseline gap-3 py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-400 w-6 text-right flex-shrink-0">{entry.chapter}.</span>
                  <span className="text-gray-700 flex-1">{entry.title}</span>
                  {entry.pages && <span className="text-xs text-gray-400 flex-shrink-0">p. {entry.pages}</span>}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Preview resources (public only) */}
        {publicResources.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-primary">Free Companion Resources</h2>
              <Link href={`/resources/${slug}`} className="text-sm text-secondary hover:underline font-medium">
                View all resources →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {publicResources.slice(0, 3).map((r) => (
                <div key={r._key} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                  <p className="font-semibold text-sm text-darkText">{r.title}</p>
                  {r.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Errata teaser */}
        {hasErrata && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-primary">Corrections (Errata)</h2>
              <Link href={`/errata/${slug}`} className="text-sm text-secondary hover:underline font-medium">
                View all corrections →
              </Link>
            </div>
            <p className="text-sm text-gray-600 max-w-xl">
              We maintain a full list of corrections for this book. Found an error? Visit the errata page to report it.
            </p>
            <div className="mt-3">
              <Link href={`/errata/${slug}`} className="inline-flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors">
                🔍 View {book.errata?.length} correction{book.errata!.length !== 1 ? 's' : ''}
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  )
}
