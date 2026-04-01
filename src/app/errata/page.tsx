// src/app/errata/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Banner from '@/components/common/Banner'
import { getAllBooks } from '@/lib/book-queries'
import ErrataCatalog from '@/app/errata/ErrataCatalog'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://hexadigitall.com'

export const metadata: Metadata = {
  title: 'Book Errata | Corrections & Updates | Hexadigitall',
  description: 'Official corrections for all Hexadigitall textbooks. Find errata by book edition and report errors you have found.',
  openGraph: {
    title: 'Hexadigitall Textbook Errata',
    description: 'Official corrections and updates for Hexadigitall textbooks.',
    url: `${BASE_URL}/errata`,
    siteName: 'Hexadigitall',
    locale: 'en_NG',
    type: 'website',
  },
  alternates: { canonical: `${BASE_URL}/errata` },
}

export default async function ErrataIndexPage() {
  const books = await getAllBooks()
  const booksWithErrata = books.filter((b) => b.status !== 'discontinued')

  return (
    <>
      <Banner
        title="Book Errata"
        description="Official corrections for all Hexadigitall textbooks. Accuracy matters to us."
        overlayClassName="bg-primary/80"
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">Errata</span>
        </nav>

        {/* Intro */}
        <section className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-bold text-primary mb-3">Why we publish errata</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            No printed book is perfect. When errors are found — whether by our team or eagle-eyed readers —
            we log them here with the exact correction. This page is updated with every reported error.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Select a book below to see corrections for that edition, or to report an error you have found.
          </p>
        </section>

        {/* Book list */}
        {booksWithErrata.length > 0 ? (
          <ErrataCatalog books={booksWithErrata} />
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-3xl mb-4">📚</p>
            <p className="text-lg font-medium">No books published yet.</p>
            <Link href="/store" className="mt-4 inline-block text-sm text-primary underline">Visit the store</Link>
          </div>
        )}
      </main>
    </>
  )
}
