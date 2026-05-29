// src/lib/book-queries.ts
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StoreLinks {
  amazon?: string
  selar?: string
  gumroad?: string
}

export interface Pricing {
  usd?: number
  ngn?: number
}

export interface ErrataItem {
  _key: string
  reportedAt?: string
  page?: number
  location?: string
  original?: string
  correction: string
  fixedInEdition?: string
  severity: 'minor' | 'content' | 'code' | 'critical'
}

export interface ResourceItem {
  _key: string
  title: string
  description?: string
  type: string
  url?: string
  file?: { asset?: { url?: string } }
  gated?: boolean
  chapter?: number
}

export interface TocEntry {
  _key: string
  chapter: number
  title: string
  pages?: string
}

export interface AuthorSummary {
  _id: string
  name: string
  slug: { current: string }
  biography?: string
  image?: { asset?: { url?: string } }
  workCount: number
}

// ── Image projection reused in both queries ───────────────────────────────────

const AUTHOR_PROJECTION = `
  _id,
  name,
  slug,
  biography,
  image { asset->{ url } },
  "workCount": count(*[_type == "publication" && references(^._id)])
`

const COVER_PROJECTION = `
  coverImage {
    asset->{ url },
    alt
  }
`

const OG_PROJECTION = `
  ogTitle,
  ogDescription,
  ogImage { asset->{ url } }
`

// ── Queries ───────────────────────────────────────────────────────────────────

const ALL_STORE_AUTHORS_QUERY = groq`
  *[_type == "author" && count(*[_type == "publication" && references(^._id)]) > 0] {
    ${AUTHOR_PROJECTION}
  }
`

const ALL_STORE_ITEMS_QUERY = groq`
  *[_type in ["book", "publication"] && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    _type,
    title,
    subtitle,
    slug,
    edition,
    authors,
    "author": author->{ name, slug },
    description,
    ${COVER_PROJECTION},
    status,
    level,
    pageCount,
    publishedAt,
    storeLinks,
    directDownloadEnabled,
    hasStudentVersion,
    studentFile { asset->{ url } },
    hasTeacherVersion,
    teacherFile { asset->{ url } },
    pricing
  }
`

const BOOKS_BY_AUTHOR_QUERY = groq`
  *[_type == "publication" && references($authorId) && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    _type,
    title,
    subtitle,
    slug,
    ${COVER_PROJECTION},
    status,
    "author": author->{ name, slug },
    pricing
  }
`

const AUTHOR_BY_SLUG_QUERY = groq`
  *[_type == "author" && slug.current == $slug][0] {
    ${AUTHOR_PROJECTION}
  }
`

const BOOK_BY_SLUG_QUERY = groq`
  *[_type in ["book", "imprint", "publication"] && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    _type,
    title,
    subtitle,
    slug,
    edition,
    isbn,
    authors,
    "author": author->{ name },
    description,
    longDescription,
    ${COVER_PROJECTION},
    status,
    level,
    pageCount,
    publishedAt,
    tableOfContents[] { _key, chapter, title, pages },
    storeLinks,
    directDownloadEnabled,
    hasStudentVersion,
    studentFile { asset->{ url } },
    hasTeacherVersion,
    teacherFile { asset->{ url } },
    pricing,
    errata[] | order(page asc) {
      _key,
      reportedAt,
      page,
      location,
      original,
      correction,
      fixedInEdition,
      severity
    },
    resources[] {
      _key,
      title,
      description,
      type,
      url,
      file { asset->{ url } },
      gated,
      chapter
    },
    "assets": assets[]-> {
      _id,
      _type,
      title,
      slug,
      priceNGN,
      priceUSD,
      matrixId,
      resourceType,
      "secureAssetUrl": file.asset->url
    },
    relatedCourse->{ _id, title, slug },
    ${OG_PROJECTION}
  }
`

const ALL_BOOK_SLUGS_QUERY = groq`
  *[_type in ["book", "imprint", "publication"] && defined(slug.current) && !(_id in path("drafts.**"))] {
    "slug": slug.current,
    _updatedAt
  }
`

// ── Fetchers ──────────────────────────────────────────────────────────────────

export async function getAllAuthors(): Promise<AuthorSummary[]> {
  try {
    return await client.fetch(ALL_STORE_AUTHORS_QUERY)
  } catch {
    return []
  }
}

export async function getAuthorBySlug(slug: string): Promise<AuthorSummary | null> {
  try {
    return await client.fetch(AUTHOR_BY_SLUG_QUERY, { slug })
  } catch {
    return null
  }
}

export async function getBooksByAuthor(authorId: string): Promise<BookSummary[]> {
  try {
    return await client.fetch(BOOKS_BY_AUTHOR_QUERY, { authorId })
  } catch {
    return []
  }
}

export async function getAllBooks(): Promise<BookSummary[]> {
  try {
    return await client.fetch(ALL_STORE_ITEMS_QUERY, {}, { next: { revalidate: 0 } })
  } catch {
    return []
  }
}

export async function getBookBySlug(slug: string): Promise<BookDetail | null> {
  try {
    return await client.fetch(BOOK_BY_SLUG_QUERY, { slug })
  } catch {
    return null
  }
}

export async function getAllBookSlugs(): Promise<{ slug: string; _updatedAt: string }[]> {
  try {
    return await client.fetch(ALL_BOOK_SLUGS_QUERY)
  } catch {
    return []
  }
}
