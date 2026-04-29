// src/app/resources/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getBookBySlug, getAllBookSlugs, type ResourceItem } from '@/lib/book-queries'
import ResourcesDetailClient from '@/app/resources/[slug]/ResourcesDetailClient'

export const dynamic = 'force-dynamic'

const BASE_URL = 'https://hexadigitall.com'

type Props = { params: Promise<{ slug: string }> }

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) return { title: 'Resources Not Found | Hexadigitall' }

  return {
    title: `Resources: ${book.title} | Hexadigitall`,
    description: `Free companion resources for "${book.title}" — code files, datasets, slides, and more.`,
    alternates: { canonical: `${BASE_URL}/resources/${slug}` },
    openGraph: {
      title: `Resources: ${book.title}`,
      description: `Companion downloads for the Hexadigitall textbook "${book.title}"`,
      url: `${BASE_URL}/resources/${slug}`,
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

const TYPE_ICONS: Record<string, string> = {
  code: '💻',
  file: '📄',
  dataset: '📊',
  slides: '📑',
  answer_student: '📝',
  answer_instructor: '🔐',
  video: '🎬',
  link: '🔗',
}

const TYPE_LABELS: Record<string, string> = {
  code: 'Code Repository',
  file: 'Download',
  dataset: 'Dataset',
  slides: 'Slide Deck',
  answer_student: 'Answer Key (Student)',
  answer_instructor: 'Answer Key (Instructor)',
  video: 'Video',
  link: 'External Link',
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ResourcesPage({ params }: Props) {
  const { slug } = await params
  const book = await getBookBySlug(slug)
  if (!book) notFound()

  const resources: ResourceItem[] = book.resources ?? []
  const publicResources = resources.filter((r) => !r.gated)
  const instructorResources = resources.filter((r) => r.gated)
  const coverUrl = book.coverImage?.asset?.url

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-900 dark:text-slate-100 dark:text-slate-100">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 dark:text-slate-500 dark:text-slate-400 mb-8">
        <Link href="/" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/resources" className="hover:text-primary dark:hover:text-cyan-300 transition-colors">Resources</Link>
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
          <h1 className="text-2xl md:text-3xl font-bold text-primary dark:text-cyan-300 leading-tight">
            Companion Resources
          </h1>
          <p className="text-gray-600 dark:text-slate-400 dark:text-slate-400 mt-1">
            for <strong>{book.title}</strong>
            {book.edition && <span className="text-gray-400 dark:text-slate-500 dark:text-slate-500"> · {book.edition}</span>}
          </p>
          <div className="flex gap-3 mt-3">
            <Link href={`/store/${slug}`} className="text-xs text-secondary hover:underline">← Back to book</Link>
            {(book.errata?.length ?? 0) > 0 && (
              <Link href={`/errata/${slug}`} className="text-xs text-secondary hover:underline">🔍 Errata</Link>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {resources.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-10 text-sm">
          <span className="text-gray-600 dark:text-slate-400 dark:text-slate-400">{publicResources.length} student resource{publicResources.length !== 1 ? 's' : ''}</span>
          {instructorResources.length > 0 && (
            <span className="text-gray-600 dark:text-slate-400 dark:text-slate-400">{instructorResources.length} instructor resource{instructorResources.length !== 1 ? 's' : ''}</span>
          )}
        </div>
      )}

      {/* Public resources by chapter */}
      {publicResources.length > 0 ? (
        <ResourcesDetailClient resources={publicResources} />
      ) : (
        <section className="mb-16 text-center py-16 text-gray-500 dark:text-slate-500 dark:text-slate-400">
          <p className="text-4xl mb-3">📁</p>
          <p className="text-lg font-medium text-gray-700 dark:text-slate-300 dark:text-slate-300">Resources for this book are coming soon.</p>
          <p className="text-sm mt-2">Check back after purchase — files are added as the book is used in courses.</p>
        </section>
      )}

      {/* Instructor resources */}
      {instructorResources.length > 0 && (
        <section id="instructor" className="mb-16 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-amber-800 dark:text-amber-300 mb-2">🔐 Instructor Resources</h2>
          <p className="text-sm text-amber-700 dark:text-amber-300 mb-5 max-w-xl">
            The following resources are available to verified lecturers and instructors only.
            Complete the short form below to request access. We typically respond within 1–2 business days.
          </p>

          {/* List of gated items (names only — no links) */}
          <ul className="mb-6 space-y-2">
            {instructorResources.map((r) => (
              <li key={r._key} className="flex items-center gap-2 text-sm text-amber-800 dark:text-amber-200">
                <span>{TYPE_ICONS[r.type] ?? '📁'}</span>
                <span>{r.title}</span>
                <span className="text-xs text-amber-500 dark:text-amber-400">({TYPE_LABELS[r.type] ?? r.type})</span>
              </li>
            ))}
          </ul>

          {/* Instructor verification form */}
          <form
            action="https://formspree.io/f/instructorAccess"
            method="POST"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <input type="hidden" name="book" value={`${book.title} (${book.edition ?? ''})`} />
            <input type="hidden" name="bookSlug" value={slug} />

            <div>
              <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                placeholder="Dr. Ngozi Ibrahim"
                className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">Institutional Email</label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@university.edu.ng"
                className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">Institution / University</label>
              <input
                type="text"
                name="institution"
                required
                placeholder="University of Calabar"
                className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">Role / Department</label>
              <input
                type="text"
                name="role"
                required
                placeholder="Lecturer, Computer Science Dept."
                className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">How will you use this textbook?</label>
              <textarea
                name="usage"
                required
                rows={3}
                placeholder="e.g. Prescribed text for CSC302, approx. 45 students per session"
                className="w-full rounded-lg border border-amber-200 px-3 py-2 text-sm bg-white dark:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="bg-amber-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-amber-700 transition-colors"
              >
                Request Instructor Access
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Upsell to course */}
      {book.relatedCourse && (
        <section className="bg-primary/5 border border-primary/10 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎓</span>
            <div>
              <h3 className="font-bold text-primary dark:text-cyan-300 mb-1">Want guided instruction?</h3>
              <p className="text-sm text-gray-600 dark:text-slate-400 dark:text-slate-400 mb-3">
                This book accompanies the <strong>{book.relatedCourse.title}</strong> course on Hexadigitall — 
                with live mentoring, Q&amp;A, and structured pacing.
              </p>
              <Link
                href={`/courses/${book.relatedCourse.slug.current}`}
                className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                View Course →
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
