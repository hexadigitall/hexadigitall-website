// src/app/store/page.tsx
import type { Metadata } from 'next'
import { getAllBooks, type BookSummary } from '@/lib/book-queries'
import BookCard from '@/app/store/BookCard'
import Banner from '@/components/common/Banner'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://hexadigitall.com'

export const metadata: Metadata = {
  title: 'Textbook Store | Hexadigitall',
  description: 'Browse Hexadigitall textbooks for professional tech and business training. Buy on Amazon, Selar, or download direct.',
  keywords: [
    'Hexadigitall textbooks', 'tech books Nigeria', 'programming books', 'business books Nigeria',
    'buy textbooks online Nigeria', 'coding books', 'Hexadigitall store',
  ],
  openGraph: {
    title: 'Hexadigitall Textbook Store',
    description: 'Official textbooks for Hexadigitall courses. Available on Amazon and other platforms.',
    url: `${BASE_URL}/store`,
    siteName: 'Hexadigitall',
    locale: 'en_NG',
    type: 'website',
    images: [{ url: `${BASE_URL}/og-images/store.jpg`, width: 1200, height: 630, alt: 'Hexadigitall Store' }],
  },
  alternates: { canonical: `${BASE_URL}/store` },
}

// ── Status badge helpers ──────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  available: 'Available Now',
  coming_soon: 'Coming Soon',
  out_of_stock: 'Out of Stock',
  discontinued: 'Discontinued',
}

export default async function StorePage() {
  const books = await getAllBooks()

  const available = books.filter((b) => b.status === 'available')
  const upcoming = books.filter((b) => b.status === 'coming_soon')

  return (
    <>
      <Banner
        title="Hexadigitall Textbook Store"
        description="Official course textbooks — written by our instructors, built for Nigerian learners."
        overlayClassName="bg-primary/80"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">Store</span>
        </nav>

        {/* Intro blurb */}
        <section className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-bold text-primary mb-3">Our Textbooks</h2>
          <p className="text-gray-600 leading-relaxed">
            Every book is written to accompany a Hexadigitall course. Purchase from Amazon or other platforms and
            return here for free companion resources, exercise files, and corrections.
          </p>
        </section>

        {/* Available books */}
        {available.length > 0 && (
          <section className="mb-16">
            <h3 className="text-xl font-semibold text-darkText mb-6 border-b border-gray-200 pb-2">
              Available Now
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {available.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* Coming soon books */}
        {upcoming.length > 0 && (
          <section className="mb-16">
            <h3 className="text-xl font-semibold text-darkText mb-6 border-b border-gray-200 pb-2">
              Coming Soon
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {upcoming.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {books.length === 0 && (
          <div className="text-center py-24 text-gray-500">
            <p className="text-3xl mb-4">📚</p>
            <p className="text-lg font-medium">Our first textbooks are on their way.</p>
            <p className="mt-2 text-sm">Check back soon or explore our courses while you wait.</p>
            <Link href="/courses" className="mt-6 inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
              Browse Courses
            </Link>
          </div>
        )}

        {/* Schema.org ItemList */}
        {books.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Hexadigitall Textbooks',
                url: `${BASE_URL}/store`,
                numberOfItems: books.length,
                itemListElement: books.map((b: BookSummary, i: number) => ({
                  '@type': 'ListItem',
                  position: i + 1,
                  url: `${BASE_URL}/store/${b.slug.current}`,
                  name: b.title,
                })),
              }),
            }}
          />
        )}
      </main>
    </>
  )
}
