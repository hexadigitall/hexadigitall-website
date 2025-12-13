// src/app/courses/[slug]/page.tsx
import { client } from '@/sanity/client'
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import CourseEnrollment, { type CourseEnrollmentData } from '@/components/CourseEnrollment';
import Breadcrumb from '@/components/ui/Breadcrumb';

// Interface for the full course data fetched from Sanity
interface Course {
    _id: string;
    title: string;
    slug: { current: string };
    summary?: string;
    description?: string;
    price?: number;
    nairaPrice?: number;
    dollarPrice?: number;
    courseType?: 'live' | 'self-paced';
    hourlyRateUSD?: number;
    hourlyRateNGN?: number;
    duration: string;
    level: string;
    instructor: string;
    prerequisites?: string[];
    maxStudents?: number;
    currentEnrollments?: number;
    body: PortableTextBlock[];
    mainImage: string;
    curriculum?: {
        modules: number;
        lessons: number;
        duration: string;
    };
    includes?: string[];
    certificate?: boolean;
    durationWeeks?: number;
    hoursPerWeek?: number;
    modules?: number;
    lessons?: number;
}

/**
 * Get course-specific OG image - uses generated images from scripts/generate-og-course-images.mjs
 */
function getCourseOgImage(slug: string): string {
  // Check if generated course OG image exists
  const generatedImage = `/og-images/course-${slug}.jpg`
  // Note: In production, verify file exists. Using optimistic approach for now.
  return generatedImage
}

/**
 * Extract pricing info from course for metadata
 */
function getCoursePricing(course: { courseType?: string; hourlyRateNGN?: number; nairaPrice?: number }): string {
  if (course.courseType === 'live' && course.hourlyRateNGN) {
    return `From ₦${course.hourlyRateNGN.toLocaleString()}/hour`
  }
  if (course.nairaPrice) {
    return `₦${course.nairaPrice.toLocaleString()}`
  }
  return 'Flexible pricing available'
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const course = await client.fetch(
        groq`*[_type == "course" && slug.current == $slug][0]{ 
            title, description, summary, level, courseType, 
            hourlyRateNGN, nairaPrice,
            "imageUrl": mainImage.asset->url 
        }`,
        { slug }
    );

    if (!course) return { title: 'Course | Hexadigitall' };

    const title = `${course.title} | Hexadigitall Courses`;
    const baseDescription = course.description || course.summary || `Master ${course.title} with expert mentoring.`;
    const pricing = getCoursePricing(course)
    const description = `${baseDescription} ${pricing}. Live mentoring & certification available.`
    
    // Use generated OG image, fallback to Sanity image, then hub image
    const ogImage = getCourseOgImage(slug) || course.imageUrl || '/og-images/courses-hub.jpg';
    
    // Optimize for social media (truncate if too long)
    const socialDescription = baseDescription.length > 130
      ? `${baseDescription.slice(0, 130)}... ${pricing}`
      : `${baseDescription} ${pricing}`

    return {
        title,
        description,
        keywords: `${course.title}, ${course.level} course, online learning, tech education, Hexadigitall`,
        openGraph: {
            title: `${course.title} - ${course.level || 'Professional'} Course`,
            description: socialDescription,
            images: [{ 
              url: ogImage, 
              width: 1200, 
              height: 630, 
              alt: `${course.title} Course - Hexadigitall`,
              type: 'image/jpeg'
            }],
            type: 'website',
            siteName: 'Hexadigitall',
            url: `https://hexadigitall.com/courses/${slug}`,
            locale: 'en_NG'
        },
        twitter: {
            card: 'summary_large_image',
            title: `${course.title} - ${course.level || 'Professional'} Course`,
            description: socialDescription,
            images: [ogImage],
            creator: '@hexadigitall',
            site: '@hexadigitall'
        },
        alternates: {
          canonical: `https://hexadigitall.com/courses/${slug}`
        }
    };
}

// Enhanced query to fetch all enrollment data including PPP pricing
const courseQuery = groq`*[_type == "course" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    summary,
    description,
    price,
    nairaPrice,
    dollarPrice,
    courseType,
    hourlyRateUSD,
    hourlyRateNGN,
    duration,
    level,
    instructor,
    prerequisites,
    maxStudents,
    "currentEnrollments": count(*[_type == "enrollment" && courseId._ref == ^._id]),
    body,
    "mainImage": mainImage.asset->url,
    curriculum {
        modules,
        lessons,
        duration
    },
    includes,
    certificate,
    durationWeeks,
    hoursPerWeek,
    modules,
    lessons
}`;

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const course: Course = await client.fetch(courseQuery, { slug });

    if (!course) notFound();

    // Prepare course data for enrollment component with fallbacks
    const courseEnrollmentData: CourseEnrollmentData = {
        _id: course._id,
        title: course.title,
        slug: course.slug,
        price: course.price || course.nairaPrice || 0,
        nairaPrice: course.nairaPrice,
        dollarPrice: course.dollarPrice,
        courseType: course.courseType,
        hourlyRateUSD: course.hourlyRateUSD,
        hourlyRateNGN: course.hourlyRateNGN,
        duration: course.duration || '8 weeks',
        level: course.level || 'Intermediate',
        prerequisites: course.prerequisites,
        maxStudents: course.maxStudents,
        currentEnrollments: course.currentEnrollments || 0,
        instructor: course.instructor || 'Expert Instructor',
        description: course.description || 'Transform your skills with this comprehensive course.',
        mainImage: course.mainImage || '/digitall_partner.png',
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
    // Breadcrumb structured data for courses
    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://hexadigitall.com'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Courses',
                item: 'https://hexadigitall.com/courses'
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: course.title,
                item: `https://hexadigitall.com/courses/${course.slug.current}`
            }
        ]
    }
        return (
                <article className="bg-white">
                        {/* JSON-LD: Enhanced Course structured data */}
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Course',
                            name: course.title,
                            description: course.description || course.summary,
                            provider: {
                                '@type': 'Organization',
                                name: 'Hexadigitall',
                                url: 'https://hexadigitall.com',
                                logo: 'https://hexadigitall.com/hexadigitall-logo.svg',
                                sameAs: [
                                  'https://twitter.com/hexadigitall',
                                  'https://linkedin.com/company/hexadigitall'
                                ]
                            },
                            instructor: {
                                '@type': 'Person',
                                name: course.instructor || 'Expert Instructor'
                            },
                            offers: {
                                '@type': 'Offer',
                                priceCurrency: 'NGN',
                                price: course.nairaPrice || course.price,
                                availability: 'https://schema.org/InStock',
                                url: `https://hexadigitall.com/courses/${course.slug.current}`,
                                validFrom: new Date().toISOString()
                            },
                            educationalLevel: course.level,
                            coursePrerequisites: course.prerequisites,
                            timeRequired: course.duration,
                            numberOfLessons: course.lessons || course.curriculum?.lessons,
                            hasCourseInstance: {
                                '@type': 'CourseInstance',
                                courseMode: course.courseType === 'live' ? 'online' : 'online',
                                courseWorkload: `PT${course.hoursPerWeek || 5}H`
                            }
                        }) }} />
                        
                        {/* Breadcrumb structured data */}
                        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
            
            {/* Course Hero */}
            <div className="bg-primary text-white py-16">
                <div className="container mx-auto px-6">
                    <div className="mb-4">
                        <Breadcrumb 
                            items={[
                                { label: 'Courses', href: '/courses' },
                                { label: course.title }
                            ]}
                            className="text-white [&_a]:text-white [&_svg]:text-white/70"
                        />
                    </div>
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

// generateStaticParams function with error handling for build
export async function generateStaticParams() {
    try {
        const slugs: { slug: { current: string } }[] = await client.fetch(groq`*[_type == "course"]{ slug }`);
        return slugs.map(({ slug }) => ({ slug: slug.current }));
    } catch (error) {
        console.warn('Failed to fetch course slugs during build:', error);
        // Return empty array to allow build to succeed
        return [];
    }
}