// src/app/courses/[slug]/page.tsx
import { client } from '@/sanity/client'
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import { urlFor } from '@/sanity/imageUrlBuilder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';
import CourseEnrollment, { type CourseEnrollmentData } from '@/components/CourseEnrollment';

// Interface for the full course data fetched from Sanity
interface Course {
    _id: string;
    title: string;
    slug: { current: string };
    price: number;
    duration: string;
    level: string;
    instructor: string;
    description: string;
    prerequisites?: string[];
    maxStudents?: number;
    currentEnrollments?: number;
    body: PortableTextBlock[];
    mainImage: SanityImageSource;
    curriculum: {
        modules: number;
        lessons: number;
        duration: string;
    };
    includes: string[];
    certificate: boolean;
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

// Enhanced query to fetch all enrollment data
const courseQuery = groq`*[_type == "course" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    price,
    duration,
    level,
    instructor,
    description,
    prerequisites,
    maxStudents,
    "currentEnrollments": count(*[_type == "enrollment" && courseId._ref == ^._id]),
    body,
    mainImage{
      asset->
    },
    curriculum {
        modules,
        lessons,
        duration
    },
    includes,
    certificate
}`;

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course: Course = await client.fetch(courseQuery, { slug });

    if (!course) notFound();

    // Prepare course data for enrollment component with fallbacks
    const courseEnrollmentData: CourseEnrollmentData = {
        _id: course._id,
        title: course.title,
        price: course.price,
        duration: course.duration || '8 weeks',
        level: course.level || 'Intermediate',
        prerequisites: course.prerequisites,
        maxStudents: course.maxStudents,
        currentEnrollments: course.currentEnrollments || 0,
        instructor: course.instructor || 'Expert Instructor',
        description: course.description || 'Transform your skills with this comprehensive course.',
        mainImage: course.mainImage ? urlFor(course.mainImage).width(400).height(300).url() : '/digitall_partner.png',
        curriculum: course.curriculum || {
            modules: 8,
            lessons: 24,
            duration: '8 weeks'
        },
        includes: course.includes || [
            'Lifetime access to course materials',
            'Certificate of completion',
            'Direct access to instructor',
            'Downloadable resources',
            'Mobile and desktop access'
        ],
        certificate: course.certificate !== false // Default to true
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
                        <PortableText value={course.body as Record<string, unknown>[]} />
                    </div>

                    {/* Right Column: Enrollment Card */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28">
                            <CourseEnrollment course={courseEnrollmentData} />
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