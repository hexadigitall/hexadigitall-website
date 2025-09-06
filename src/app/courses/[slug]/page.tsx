// src/app/courses/[slug]/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import Image from 'next/image';
import { urlFor } from '@/sanity/imageUrlBuilder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
// 👇 1. Import the new AddToCartButton and its type
import AddToCartButton, { type CourseCartItem } from '@/components/AddToCartButton';

// Interface for the full course data fetched from Sanity
interface Course {
    _id: string;
    title: string;
    price: number;
    body: PortableTextBlock[];
    mainImage: SanityImageSource;
}

// Metadata function remains the same
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const course: { title: string } = await client.fetch(
        groq`*[_type == "course" && slug.current == $slug][0]{ title }`,
        { slug }
    );
    return { title: `${course?.title || 'Course'} | Hexadigitall` };
}

// 👇 2. Make the query more specific to ensure all fields are fetched
const courseQuery = groq`*[_type == "course" && slug.current == $slug][0]{
    _id,
    title,
    price,
    body,
    mainImage
}`;

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course: Course = await client.fetch(courseQuery, { slug });

    if (!course) notFound();

    // 👇 3. Prepare the data in the exact format the AddToCartButton needs
    const courseCartItem: CourseCartItem = {
        name: course.title,
        id: course._id,
        price: course.price * 100, // Convert to kobo for use-shopping-cart
        currency: 'NGN',
        image: urlFor(course.mainImage).width(200).height(200).url(),
    };

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
                            
                            {/* 👇 4. Replace the old Link with the new AddToCartButton component */}
                            <AddToCartButton course={courseCartItem} />

                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

// generateStaticParams function remains the same
export async function generateStaticParams() {
    const slugs: { slug: { current: string } }[] = await client.fetch(groq`*[_type == "course"]{ slug }`);
    return slugs.map(({ slug }) => ({ slug: slug.current }));
}