// src/app/store/page.tsx
import type { Metadata } from 'next'
import { getAllBooks, getAllAuthors, type BookSummary, type AuthorSummary } from '@/lib/book-queries'
import StoreCatalog from '@/app/store/StoreCatalog'
import Banner from '@/components/common/Banner'
import Link from 'next/link'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0 // Disable cache for this page
const BASE_URL = 'https://hexadigitall.com'

type StorePageProps = {
  searchParams: Promise<{ context?: string }>
}

export const metadata: Metadata = {
  title: 'Ecosystem Library | Hexadigitall',
  description: 'Access official course textbooks and digital imprints. Digital downloads, physical copies, and premium companion assets.',
  keywords: [
    'Hexadigitall library', 'tech books', 'digital imprints', 'FVMMD', 'companion assets',
  ],
  openGraph: {
    title: 'Hexadigitall Library & Resource Center',
    description: 'The central hub for all Hexadigitall physical and digital publishing resources.',
    url: `${BASE_URL}/store`,
    siteName: 'Hexadigitall',
    locale: 'en_NG',
    type: 'website',
    images: [{ url: `${BASE_URL}/og-images/store.jpg`, width: 1200, height: 630, alt: 'Hexadigitall Library' }],
  },
  alternates: { canonical: `${BASE_URL}/store` },
}

export default async function StorePage({ searchParams }: StorePageProps) {
  const { context } = await searchParams
  const isDashboard = context === 'dashboard'
  
  const session = await auth()
  const user = session?.user as any
  const dashboardLink = ['teacher', 'instructor', 'admin'].includes(user?.role) 
    ? '/teacher/dashboard' 
    : '/student/dashboard'

  const [items, authors] = await Promise.all([
    getAllBooks(),
    getAllAuthors()
  ])

  return (
    <>
      {!isDashboard ? (
        <Banner
          title="Hexadigitall Library"
          description="Equip yourself with the foundational texts, architectural blueprints, and digital imprints powering the next generation of builders and thinkers."
          overlayClassName="bg-slate-950/80"
        />
      ) : (
        <div className="bg-slate-950 border-b border-white/10 pt-12 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <Link href={dashboardLink} className="inline-flex items-center text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors mb-6">
                <span className="mr-2">←</span> Back to Dashboard
             </Link>
             <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Dashboard Library</h1>
             <p className="text-slate-400 mt-2 text-sm max-w-2xl">Access official course textbooks and technical blueprints directly from your account.</p>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Breadcrumb */}
        {!isDashboard && (
          <nav className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-12">
            <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900 dark:text-white font-bold">Library</span>
          </nav>
        )}

        {/* Intro blurb */}
        {!isDashboard && (
          <section className="mb-20 max-w-4xl">
            <h2 className="text-4xl md:text-5xl font-bold font-serif text-slate-950 dark:text-white mb-6 tracking-tight">Master Resource Catalog</h2>
            
            <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-serif">
              <p>
                Welcome to the central repository for Hexadigitall publishing. This catalog is meticulously curated to provide engineers, designers, and strategic thinkers with high-signal, low-noise resources required to harden their infrastructure and elevate their technical discipline.
              </p>
              <p>
                Explore our official <strong className="text-slate-900 dark:text-slate-200">Course Textbooks</strong>—rigorous, standard-setting manuals designed to accompany our core curriculums—or delve into <strong className="text-slate-900 dark:text-slate-200">Digital Imprints</strong> authored by our partner ecosystem nodes, offering specialized frameworks for personal clarity, tactical execution, and self-governance.
              </p>
              <p className="italic border-l-4 border-blue-600 pl-6 py-2 mt-8 text-xl text-slate-800 dark:text-slate-300">
                "Every asset is engineered to bridge the gap between abstract concept and tactical execution."
              </p>
            </div>
          </section>
        )}

        <StoreCatalog books={items} authors={authors} user={user ? { role: user.role, email: user.email, username: user.username } : undefined} />

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