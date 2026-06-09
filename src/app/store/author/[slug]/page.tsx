// src/app/store/author/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getAuthorBySlug, getBooksByAuthor } from '@/lib/book-queries'
import BookCard from '@/app/store/BookCard'
import Banner from '@/components/common/Banner'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) return { title: 'Author Not Found | Hexadigitall' }
  return {
    title: `${author.name} | Author Profile | Hexadigitall`,
    description: author.biography || `Discover digital imprints and publications by ${author.name}.`,
  }
}

export default async function AuthorProfilePage({ params }: Props) {
  const { slug } = await params
  const author = await getAuthorBySlug(slug)
  if (!author) notFound()

  const books = await getBooksByAuthor(author._id)

  const isFVMMD = author.slug.current === 'fvmmd'
  const coverUrl = isFVMMD 
    ? '/digital-publishing/FVMMD/completed/author-fvmmd-cover.png' 
    : author.image?.asset?.url

  return (
    <>
      <Banner
        title={author.name}
        description={author.biography || "Featured Creator"}
        overlayClassName="bg-slate-950/80"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumb */}
        <nav className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-12">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/store" className="hover:text-blue-600 transition-colors">Library</Link>
          <span className="mx-2">/</span>
          <span className="text-slate-900 dark:text-white font-bold">Author: {author.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-16">
          {/* Author Sidebar */}
          <aside>
             <div className="sticky top-28 space-y-8">
               <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800" style={{ aspectRatio: '1/1' }}>
                 {coverUrl ? (
                   <Image src={coverUrl} alt={author.name} fill className="object-cover" />
                 ) : (
                   <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-8xl">👤</div>
                 )}
               </div>
               
               <div>
                 <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-600 mb-4">Profile Abstract</h2>
                 <p className="text-slate-600 dark:text-slate-400 font-serif leading-relaxed italic">
                   {author.biography || "Strategic architect contributing to the Hexadigitall ecosystem matrix."}
                 </p>
               </div>
             </div>
          </aside>

          {/* Author's Works */}
          <div>
            <h2 className="text-3xl font-bold font-serif text-slate-950 dark:text-white mb-10 flex items-center gap-4">
              Published Imprints
              <span className="h-px flex-1 bg-slate-100 dark:bg-slate-800"></span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {books.map(book => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            {books.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                <p className="text-slate-500 italic">No imprints indexed for this author node yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
