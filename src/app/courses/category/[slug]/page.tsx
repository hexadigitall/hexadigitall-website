export const dynamic = 'force-dynamic';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';


type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const query = groq`*[_type == "courseCategory" && slug.current == $slug][0]{ title, description, ogTitle, ogDescription, ogImage { asset-> { url } } }`;
  const category = await client.fetch(query, { slug });
  if (!category) return { title: 'Course Category Not Found | Hexadigitall' };
  const title = category.ogTitle || `${category.title} | Hexadigitall Courses`;
  const description = category.ogDescription || category.description || `Explore ${category.title} courses.`;
  let imageUrl = category.ogImage?.asset?.url || `https://hexadigitall.com/og-images/category-${slug}.jpg`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${category.title} Category`, type: 'image/jpeg' }],
      type: 'website',
      siteName: 'Hexadigitall',
      url: `https://hexadigitall.com/courses/category/${slug}`,
      locale: 'en_NG',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
      creator: '@hexadigitall',
      site: '@hexadigitall'
    },
    alternates: { canonical: `https://hexadigitall.com/courses/category/${slug}` }
  };
}

export default async function CourseCategoryPage(props: Props) {
  const { slug } = await props.params;
  const query = groq`*[_type == "courseCategory" && slug.current == $slug][0]{ title, description }`;
  const category = await client.fetch(query, { slug });
  if (!category) notFound();
  return <main className="container mx-auto py-20"><h1 className="text-4xl font-bold mb-4">{category.title}</h1><p>{category.description}</p></main>;
}
