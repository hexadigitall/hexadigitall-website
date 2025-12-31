// Force dynamic rendering to handle search params and dynamic content
export const dynamic = "force-dynamic";

import { client } from '@/sanity/client'
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PortableText } from '@portabletext/react';
import type { PortableTextBlock } from 'sanity';
import CourseEnrollment, { type CourseEnrollmentData } from '@/components/CourseEnrollment';
import { cookies } from 'next/headers'
import Banner from '@/components/common/Banner';
import Breadcrumb from '@/components/ui/Breadcrumb';

// --- Interfaces ---

// Full Course Interface matching Sanity Schema
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
    contentPdf?: { asset?: { _ref?: string; url?: string } };
    roadmapPdf?: { asset?: { _ref?: string; url?: string } };
    curriculum?: {
        modules: number;
        lessons: number;
        duration: string;
    };
    bannerBackgroundImage?: { asset?: { url?: string } };
    includes?: string[];
    certificate?: boolean;
    durationWeeks?: number;
    hoursPerWeek?: number;
    modules?: number;
    lessons?: number;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: { asset?: { url?: string } };
}

// Props Type for Next.js 15+ (Params is a Promise)
type Props = {
  params: Promise<{ slug: string }>;
}

// --- Helpers ---

function getCourseOgImage(slug: string): string {
  // Use environment variable or default to production URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hexadigitall.com';
  return `${baseUrl}/og-images/course-${slug}.jpg`;
}

function getCoursePricing(course: { courseType?: string; hourlyRateNGN?: number; nairaPrice?: number }): string {
  if (course.courseType === 'live' && course.hourlyRateNGN) {
    return `From ₦${course.hourlyRateNGN.toLocaleString()}/hour`
  }
  if (course.nairaPrice) {
    return `₦${course.nairaPrice.toLocaleString()}`
  }
  return 'Flexible pricing available'
}

// --- Metadata Generation ---

export async function generateMetadata(props: Props): Promise<Metadata> {
  // 1. Await params (Critical for Next.js 15)
  const params = await props.params;
  const slug = params.slug;
  
  let course = null;

  try {
    // 2. Fetch specific fields needed for SEO (Expand Assets!)
    const query = groq`*[_type == "course" && slug.current == $slug][0]{ 
      title, 
      description, 
      summary, 
      level, 
      courseType, 
      hourlyRateNGN, 
      nairaPrice,
      ogTitle, 
      ogDescription, 
      ogImage {
        asset-> {
          url
        }
      },
      mainImage {
        asset-> {
          url
        }
      }
    }`;
    course = await client.fetch(query, { slug });
  } catch (error) {
    console.warn(`Sanity metadata fetch failed for: ${slug}`, error);
  }

  if (!course) return { title: 'Course Not Found | Hexadigitall' };

  // 3. Resolve Metadata Values
  const title = course.ogTitle || `${course.title} | Hexadigitall Courses`;
  
  const baseDescription = course.ogDescription || course.description || course.summary || `Master ${course.title} with expert mentoring.`;
  const pricing = getCoursePricing(course);
  
  const socialDescription = baseDescription.length > 130
    ? `${baseDescription.slice(0, 130)}... ${pricing}`
    : `${baseDescription} ${pricing}`;

  // Image Priority: Sanity OG -> Sanity Main -> Generated Fallback
  let imageUrl = getCourseOgImage(slug);
  if (course.ogImage?.asset?.url) {
    imageUrl = course.ogImage.asset.url;
  } else if (course.mainImage?.asset?.url) {
    imageUrl = course.mainImage.asset.url;
  }

  return {
    title,
    description: `${baseDescription} ${pricing}. Live mentoring & certification available.`,
    keywords: `${course.title}, ${course.level} course, online learning, tech education, Hexadigitall`,
    openGraph: {
      title,
      description: socialDescription,
      images: [{ 
        url: imageUrl, 
        width: 1200, 
        height: 630, 
        alt: `${course.title} Course`,
        type: 'image/jpeg'
      }],
      type: 'website',
      siteName: 'Hexadigitall',
      url: `https://hexadigitall.com/courses/${slug}`,
      locale: 'en_NG'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: socialDescription,
      images: [imageUrl],
      creator: '@hexadigitall',
      site: '@hexadigitall'
    },
    alternates: {
      canonical: `https://hexadigitall.com/courses/${slug}`
    }
  };
}

// --- Main Page Component ---

export default async function CoursePage(props: Props) {
    // 1. Await params
    const params = await props.params;
    const slug = params.slug;

    if (!slug) notFound();

    // 2. Fetch Complete Course Data
    // We use a robust query to get everything needed for the UI
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
        bannerBackgroundImage{asset->{url}},
        ogImage{asset->{url}},
        ogTitle,
        ogDescription,
        contentPdf{asset->{_ref,url}},
        roadmapPdf{asset->{_ref,url}},
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

    let course: Course | null = null;
    try {
        course = await client.fetch(courseQuery, { slug });
    } catch (error) {
        console.error(`Failed to fetch course data for ${slug}:`, error);
    }

    if (!course) notFound();

    // 3. Check Access Permissions (Cookies)
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;
    let hasAccess = false;

    if (token) {
        try {
            const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8')) as {
                role?: string;
                userId?: string;
                timestamp?: number;
            };
            
            // Check token validity (24h)
            if (decoded?.timestamp && (Date.now() - decoded.timestamp) < 24 * 60 * 60 * 1000) {
                const role = decoded.role;
                const userId = decoded.userId;

                if (role === 'admin') {
                    hasAccess = true;
                } else if (role === 'teacher' && userId) {
                    const assigned = await client.fetch(
                        groq`count(*[_type == "course" && _id == $courseId && references($teacherId)]) > 0`,
                        { courseId: course._id, teacherId: userId }
                    );
                    hasAccess = Boolean(assigned);
                } else if (role === 'student' && userId) {
                    const enrolled = await client.fetch(
                        groq`count(*[_type == "enrollment" && courseId._ref == $courseId && studentId._ref == $studentId]) > 0`,
                        { courseId: course._id, studentId: userId }
                    );
                    hasAccess = Boolean(enrolled);
                }
            }
        } catch {
            // Token invalid, access remains false
        }
    }

    // 4. Map Data for Enrollment Component
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
    
    // 5. SEO Data (JSON-LD)
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
    };

    const courseJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.description || course.summary,
        provider: {
            '@type': 'Organization',
            name: 'Hexadigitall',
            url: 'https://hexadigitall.com',
            logo: 'https://hexadigitall.com/hexadigitall-logo.svg'
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
            url: `https://hexadigitall.com/courses/${course.slug.current}`
        },
        educationalLevel: course.level,
        timeRequired: course.duration,
        numberOfLessons: course.lessons || course.curriculum?.lessons
    };
    
    return (
        <article className="bg-white">
            {/* Inject JSON-LD */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

            {/* Breadcrumb Navigation */}
            <div className="container mx-auto px-6 pt-8">
                <Breadcrumb 
                    items={[
                        { label: 'Courses', href: '/courses' },
                        { label: course.title }
                    ]}
                    className="mb-2 text-gray-700 [&_a]:text-primary [&_svg]:text-primary/70"
                />
            </div>

            {/* Hero Banner */}
            <Banner
                image={course.bannerBackgroundImage?.asset?.url}
                title={course.title}
                description={course.summary || course.description}
            />

            {/* Main Content Area */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Left Column: Course Body/Description */}
                    <div className="lg:col-span-2 prose lg:prose-xl max-w-none">
                        {course.body ? (
                            // Type-cast body to avoid TS errors with PortableText
                            <PortableText value={course.body as Record<string, unknown>[]} />
                        ) : (
                            <p className="text-gray-600 italic">No detailed description available.</p>
                        )}
                    </div>

                    {/* Right Column: Enrollment & Materials */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28">
                            <CourseEnrollment course={courseEnrollmentData} />
                            
                            {/* Materials Section (Protected) */}
                            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                <h3 className="text-base font-semibold text-gray-900 mb-3">Course Materials</h3>
                                {hasAccess ? (
                                    <div className="space-y-2">
                                        {course.contentPdf?.asset?._ref && (
                                            <a
                                                href={`https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${course.contentPdf.asset._ref.replace('file-', '').replace('-pdf', '.pdf')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                                                download
                                            >
                                                Download Course Content (PDF)
                                            </a>
                                        )}
                                        {course.roadmapPdf?.asset?._ref && (
                                            <a
                                                href={`https://cdn.sanity.io/files/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${course.roadmapPdf.asset._ref.replace('file-', '').replace('-pdf', '.pdf')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-full items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                download
                                            >
                                                Download Roadmap (PDF)
                                            </a>
                                        )}
                                        {!course.contentPdf?.asset?._ref && !course.roadmapPdf?.asset?._ref && (
                                            <p className="text-sm text-gray-600">No materials available yet.</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600">Login and enroll (or be assigned) to access downloadable materials.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}

// --- Static Params Generation ---

export async function generateStaticParams() {
    try {
        const slugs: { slug: { current: string } }[] = await client.fetch(groq`*[_type == "course"]{ slug }`);
        return slugs.map(({ slug }) => ({ slug: slug.current }));
    } catch (error) {
        console.warn('Failed to fetch course slugs during build:', error);
        return [];
    }
}