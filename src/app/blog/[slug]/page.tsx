import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { urlFor } from '@/sanity/imageUrlBuilder'

export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
}

// Helper for generating local OG image path
function getPostOgImage(slug: string): string {
  return `https://hexadigitall.com/og-images/post-${slug}.jpg`
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { slug } = params

  const query = groq`*[_type == "post" && slug.current == $slug][0]{
    title,
    excerpt,
    // Expand OG Image
    ogImage { asset->{url} },
    // Fallback Main Image
    mainImage { asset->{url} }
  }`

  const post = await client.fetch(query, { slug })

  if (!post) return { title: 'Post Not Found' }

  // Priority: Sanity OG -> Sanity Main -> Local Fallback
  let imageUrl = getPostOgImage(slug)
  if (post.ogImage?.asset?.url) {
    imageUrl = post.ogImage.asset.url
  } else if (post.mainImage?.asset?.url) {
    imageUrl = post.mainImage.asset.url
  }

  return {
    title: post.title,
    description: post.excerpt || `Read more about ${post.title}`,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://hexadigitall.com/blog/${slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: 'article',
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    }
  }
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params
  const { slug } = params

  const query = groq`*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    publishedAt,
    categories,
    mainImage,
    body,
    author->{name, image}
  }`

  const post = await client.fetch(query, { slug })

  if (!post) notFound()

  return (
    <article className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-12 md:py-20 max-w-4xl">
        <Breadcrumb items={[{ label: 'Blog', href: '/blog' }, { label: post.title }]} />
        
        {/* Header */}
        <header className="mb-10 mt-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories?.map((category: string) => (
              <span key={category} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold uppercase tracking-wide">
                {category}
              </span>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
          
          <div className="flex items-center justify-between border-t border-b border-gray-100 py-4">
            <div className="flex items-center gap-3">
              {post.author?.image && (
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src={urlFor(post.author.image).url()} alt={post.author.name} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-gray-900">{post.author?.name || 'Hexadigitall Team'}</p>
                <p className="text-xs text-gray-500">
                  {new Date(post.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </p>
              </div>
            </div>
            {/* Share buttons could go here */}
          </div>
        </header>

        {/* Featured Image */}
        {post.mainImage && (
          <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-lg mb-12 bg-gray-100">
            <Image
              src={urlFor(post.mainImage).url()}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-blue max-w-none text-gray-700">
          <PortableText value={post.body} />
        </div>
        
        <div className="mt-16 pt-8 border-t border-gray-200">
          <Link href="/blog" className="text-primary font-semibold hover:underline">
            ← Back to All Posts
          </Link>
        </div>
      </div>
    </article>
  )
}