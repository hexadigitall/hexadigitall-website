export const dynamic = 'force-dynamic';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SchoolPageContent from './SchoolPageContent';


type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const query = groq`*[_type == "school" && slug.current == $slug][0]{ title, description, ogTitle, ogDescription, ogImage { asset-> { url } } }`;
  const school = await client.fetch(query, { slug });
  if (!school) return { title: 'School Not Found | Hexadigitall' };
  const title = school.ogTitle || `${school.title} | Hexadigitall School`;
  const description = school.ogDescription || school.description || `Learn at ${school.title}.`;
  let imageUrl = school.ogImage?.asset?.url || `https://hexadigitall.com/og-images/school-${slug}.jpg`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: `${school.title} School`, type: 'image/jpeg' }],
      type: 'website',
      siteName: 'Hexadigitall',
      url: `https://hexadigitall.com/school/${slug}`,
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
    alternates: { canonical: `https://hexadigitall.com/school/${slug}` }
  };
}

export default async function SchoolPage(props: Props) {
  const { slug } = await props.params;
  // Fetch school and its courses
  const query = groq`*[_type == "school" && slug.current == $slug][0]{
    _id,
    title,
    description,
    "courses": *[_type == "course" && references(^._id)] | order(order asc) {
      _id,
      title,
      slug,
      summary,
      description,
      "mainImage": mainImage.asset->url,
      duration,
      level,
      instructor,
      courseType,
      hourlyRateUSD,
      hourlyRateNGN,
      nairaPrice,
      dollarPrice,
      price,
      featured,
      durationWeeks,
      hoursPerWeek,
      modules,
      lessons,
      includes,
      certificate
    }
  }`;
  const school = await client.fetch(query, { slug });
  if (!school) notFound();
  return <SchoolPageContent school={school} />;
}
