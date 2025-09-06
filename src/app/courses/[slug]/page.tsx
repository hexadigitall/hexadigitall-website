// src/app/courses/[slug]/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/imageUrlBuilder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

interface Course {
  title: string;
  slug: { current: string };
  price: number;
  body: PortableTextBlock[];
  mainImage: SanityImageSource;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const course: { title: string } = await client.fetch(groq`*[_type == "course" && slug.current == $slug][0]{ title }`, { slug: params.slug });
  return { title: `${course?.title || 'Course'} | Hexadigitall` };
}

const courseQuery = groq`*[_type == "course" && slug.current == $slug][0]`;

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course: Course = await client.fetch(courseQuery, { slug: params.slug });

  if (!course) notFound();

  return (
    <article className="bg-white">
      {/* Course Hero */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold font-heading !text-white">{course.title}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Column: Course Details */}
          <div className="lg:col-span-2 prose lg:prose-xl max-w-none">
            <PortableText value={course.body} />
          </div>

          {/* Right Column: Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-lightGray p-8 rounded-lg shadow-md">
              <div className="relative h-48 w-full mb-4 rounded-md overflow-hidden">
                <Image src={urlFor(course.mainImage).url()} alt={`Image for ${course.title}`} fill className="object-cover" />
              </div>
              <p className="text-3xl font-bold font-heading mb-4">
                ₦{course.price.toLocaleString()}
              </p>
              <Link href="/contact" className="btn-primary w-full text-center block">
                Enroll Now
              </Link>
              <p className="text-xs text-center mt-2 text-gray-600">You will be directed to our contact page to finalize enrollment.</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(groq`*[_type == "course"]{ slug }`);
  return slugs.map(({ slug }) => ({ slug: slug.current }));
}