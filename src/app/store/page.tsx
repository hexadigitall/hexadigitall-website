// src/app/store/page.tsx
import type { Metadata } from 'next'
import { getAllBooks, getAllAuthors, type BookSummary, type AuthorSummary } from '@/lib/book-queries'
import StoreCatalog from '@/app/store/StoreCatalog'
import Banner from '@/components/common/Banner'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable cache for this page
const BASE_URL = 'https://hexadigitall.com'

export const metadata: Metadata = {
  title: 'Ecosystem Store | Hexadigitall',
  description: 'Access official course textbooks and digital imprints. Digital downloads, physical copies, and premium companion assets.',
  keywords: [
    'Hexadigitall store', 'tech books', 'digital imprints', 'FVMMD', 'companion assets',
  ],
  openGraph: {
    title: 'Hexadigitall Store & Resource Center',
    description: 'The central hub for all Hexadigitall physical and digital publishing resources.',
    url: `${BASE_URL}/store`,
    siteName: 'Hexadigitall',
    locale: 'en_NG',
    type: 'website',
    images: [{ url: `${BASE_URL}/og-images/store.jpg`, width: 1200, height: 630, alt: 'Hexadigitall Store' }],
  },
  alternates: { canonical: `${BASE_URL}/store` },
}

export default async function StorePage() {
  const [items, authors] = await Promise.all([
    getAllBooks(),
    getAllAuthors()
  ])

  return (
    <>
      <Banner
        title="Hexadigitall Store"
        description="Ecosystem resources, textbooks, and digital imprints for builders and thinkers."
        overlayClassName="bg-slate-950/80"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Breadcrumb */}
        <nav className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-12">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-white font-bold">Store</span>
        </nav>

        {/* Intro blurb */}
        <section className="mb-20 max-w-3xl">
          <h2 className="text-4xl font-bold font-serif text-slate-950 dark:text-white mb-6">Master Resource Catalog</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-serif italic">
            "Every asset is designed to bridge the gap between abstract concept and tactical execution."
          </p>
        </section>

        <StoreCatalog books={items} authors={authors} />

        {/* Empty state */}
        {items.length === 0 && authors.length === 0 && (
          <div className="text-center py-24 text-gray-500 dark:text-slate-500">
            <p className="text-3xl mb-4">📘</p>
            <p className="text-lg font-medium">Synchronizing ecosystem alignment...</p>
            <p className="mt-2 text-sm">Our primary publishing catalog is currently being indexed. Check back shortly.</p>
            <Link href="/courses" className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all">
              Browse Courses
            </Link>
          </div>
        )}
      </main>
    </>
  )
}