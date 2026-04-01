// src/app/resources/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Banner from '@/components/common/Banner'
import { getAllBooks } from '@/lib/book-queries'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://hexadigitall.com'

export const metadata: Metadata = {
  title: 'Textbook Resources | Downloads & Companion Files | Hexadigitall',
  description: 'Free companion resources for all Hexadigitall textbooks — code files, datasets, slide decks, exercise answers, and video supplements.',
  openGraph: {
    title: 'Hexadigitall Textbook Resources',
    description: 'Free downloads, code repos, datasets, and video supplements for Hexadigitall textbooks.',
    url: `${BASE_URL}/resources`,
    siteName: 'Hexadigitall',
    locale: 'en_NG',
    type: 'website',
  },
  alternates: { canonical: `${BASE_URL}/resources` },
}

export default async function ResourcesIndexPage() {
  const books = await getAllBooks()
  const booksInPrint = books.filter((b) => b.status !== 'discontinued')

  return (
    <>
      <Banner
        title="Textbook Resources"
        description="Code files, datasets, slide decks, answer keys, and video supplements for every Hexadigitall book."
        overlayClassName="bg-primary/80"
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-primary font-medium">Resources</span>
        </nav>

        {/* Intro */}
        <section className="mb-12 max-w-2xl">
          <h2 className="text-2xl font-bold text-primary mb-3">Companion files for your textbook</h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            Every Hexadigitall textbook comes with free online resources — code repositories, 
            practice datasets, exercise files, and more. Select your book below to access its resources.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Some resources (such as instructor answer keys) are gated and require a brief verification.
            Student resources are always free and instant.
          </p>
        </section>

        {/* Resource type legend */}
        <div className="flex flex-wrap gap-2 mb-10">
          {[
            { icon: '💻', label: 'Code Repo' },
            { icon: '📊', label: 'Dataset' },
            { icon: '📑', label: 'Slides' },
            { icon: '📄', label: 'File Download' },
            { icon: '🎬', label: 'Video' },
            { icon: '🔐', label: 'Instructor Only' },
          ].map(({ icon, label }) => (
            <span key={label} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
              {icon} {label}
            </span>
          ))}
        </div>

        {/* Book list */}
        {booksInPrint.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {booksInPrint.map((book) => {
              const coverUrl = book.coverImage?.asset?.url
              return (
                <Link
                  key={book._id}
                  href={`/resources/${book.slug.current}`}
                  className="group flex gap-4 p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
                >
                  <div className="relative w-14 flex-shrink-0 rounded-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    {coverUrl ? (
                      <Image src={coverUrl} alt={book.title} fill sizes="56px" className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-xl">📘</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-darkText group-hover:text-primary transition-colors line-clamp-2">
                      {book.title}
                    </p>
                    {book.edition && <p className="text-xs text-gray-400 mt-0.5">{book.edition}</p>}
                    <p className="text-xs text-secondary mt-2 font-medium">View resources →</p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-3xl mb-4">📁</p>
            <p className="text-lg font-medium">Resources will be published alongside our first textbooks.</p>
            <Link href="/store" className="mt-4 inline-block text-sm text-primary underline">Visit the store</Link>
          </div>
        )}
      </main>
    </>
  )
}
