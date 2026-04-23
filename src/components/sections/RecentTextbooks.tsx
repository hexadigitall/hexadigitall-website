import Image from 'next/image'
import Link from 'next/link'
import { getAllBooks } from '@/lib/book-queries'

export default async function RecentTextbooks() {
  const books = await getAllBooks()
  const recentBooks = books
    .filter((book) => book.status !== 'discontinued')
    .slice(0, 4)

  if (recentBooks.length === 0) return null

  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-sky-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 border-y border-sky-100/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-secondary dark:text-cyan-300 uppercase">Textbook Store</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-bold text-darkText dark:text-slate-100">Recently Added Textbooks</h2>
          </div>
          <Link href="/store" className="text-sm font-semibold text-primary dark:text-cyan-300 hover:underline">
            Browse all textbooks →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentBooks.map((book) => {
            const coverUrl = book.coverImage?.asset?.url
            return (
              <article key={book._id} className="rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <Link href={`/store/${book.slug.current}`} className="block">
                  <div className="relative bg-gray-50" style={{ aspectRatio: '3/4' }}>
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={book.coverImage?.alt ?? `${book.title} cover`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 text-5xl">
                        📘
                      </div>
                    )}
                    <span className="absolute left-3 top-3 text-[11px] font-semibold px-2 py-1 rounded-full bg-white/90 text-gray-700 border border-white/70">
                      {book.status === 'available' ? 'Available' : 'Coming Soon'}
                    </span>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/store/${book.slug.current}`} className="font-semibold text-sm text-darkText hover:text-primary transition-colors line-clamp-2">
                    {book.title}
                  </Link>
                  {book.edition && (
                    <p className="mt-1 text-xs text-gray-500">{book.edition}</p>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
