// src/lib/book-queries.ts
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SalesLink {
  _key: string
  platform: string
  audience?: 'student' | 'teacher'
  url: string
  file?: { asset?: { url?: string } }
  priceNGN?: number
  priceUSD?: number
  label?: string
  affiliateTag?: string
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

export interface BookSummary {
  _id: string
  _type: 'book' | 'imprint'
  title: string
  subtitle?: string
  slug: { current: string }
  edition?: string
  authors?: string[]
  author?: { name: string }
  description?: string
  coverImage?: { asset?: { url?: string }; alt?: string }
  status: 'coming_soon' | 'available' | 'out_of_stock' | 'discontinued'
  level?: string
  pageCount?: number
  publishedAt?: string
  salesLinks?: SalesLink[]
}

export interface BookDetail extends BookSummary {
  longDescription?: object[]
  isbn?: string
  tableOfContents?: TocEntry[]
  errata?: ErrataItem[]
  resources?: ResourceItem[]
  assets?: ResourceItem[]
  allowCopyRegistration?: boolean
  relatedCourse?: { _id: string; title: string; slug: { current: string } }
  ogTitle?: string
  ogDescription?: string
  ogImage?: { asset?: { url?: string } }
}

// ── Image projection reused in both queries ───────────────────────────────────

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

const ALL_STORE_ITEMS_QUERY = groq`
  *[_type in ["book", "imprint"]] | order(publishedAt desc) {
    _id,
    _type,
    title,
    subtitle,
    slug,
    edition,
    authors,
    "author": author->{ name },
    description,
    ${COVER_PROJECTION},
    status,
    level,
    pageCount,
    publishedAt,
    salesLinks[] {
      _key,
      platform,
      audience,
      url,
      file { asset->{ url } },
      priceNGN,
      priceUSD,
      label,
      affiliateTag
    }
  }
`

const BOOK_BY_SLUG_QUERY = groq`
  *[_type in ["book", "imprint"] && slug.current == $slug][0] {
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
    salesLinks[] {
      _key,
      platform,
      audience,
      url,
      file { asset->{ url } },
      priceNGN,
      priceUSD,
      label,
      affiliateTag
    },
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
  *[_type in ["book", "imprint"] && defined(slug.current)] {
    "slug": slug.current,
    _updatedAt
  }
`

// ── Fetchers ──────────────────────────────────────────────────────────────────

export async function getAllBooks(): Promise<BookSummary[]> {
  try {
    return await client.fetch(ALL_STORE_ITEMS_QUERY)
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
