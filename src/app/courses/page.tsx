// src/app/courses/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/sanity/imageUrlBuilder';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

export const metadata: Metadata = {
  title: 'Our Courses | Hexadigitall',
  description: 'Browse our range of professional, tech, and certification courses designed for career growth.',
};

// Define types for our data
interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  mainImage: SanityImageSource;
}

interface Category {
  _id: string;
  title: string;
  description: string;
  courses: Course[];
}

// A GROQ query to fetch categories and their associated courses
const categoriesWithCoursesQuery = groq`
  *[_type == "courseCategory"] | order(title asc) {
    _id,
    title,
    description,
    "courses": *[_type == "course" && references(^._id)] | order(title asc) {
      _id,
      title,
      slug,
      summary,
      mainImage
    }
  }
`;

export default async function CoursesPage() {
  try {
    const categories: Category[] = await client.fetch(categoriesWithCoursesQuery);

    return (
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Courses</h1>
            <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
              Invest in your future with our expert-led courses designed for career growth.
            </p>
          </div>
          
          {!categories || categories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-darkText mb-4">No courses are currently available.</p>
              <p className="text-sm text-gray-500">Please check back later or contact us for more information.</p>
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map((category) => (
                <div key={category._id}>
                  <h2 className="text-3xl font-bold font-heading border-b-2 border-primary pb-2 mb-8">{category.title}</h2>
                  {!category.courses || category.courses.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No courses available in this category.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {category.courses.map((course) => (
                        <Link key={course._id} href={`/courses/${course.slug.current}`} className="group block bg-lightGray rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                          <div className="relative h-48 w-full">
                            {course.mainImage ? (
                              <Image 
                                src={urlFor(course.mainImage).width(400).height(192).url()} 
                                alt={`Cover for ${course.title}`} 
                                fill 
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                placeholder="blur"
                                blurDataURL={urlFor(course.mainImage).width(20).blur(50).url()}
                              />
                            ) : (
                              <div className="w-full h-full bg-lightGray flex items-center justify-center">
                                <span className="text-gray-400">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold font-heading mb-2">{course.title}</h3>
                            <p className="text-sm text-darkText">{course.summary || 'No description available'}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error fetching courses:', error);
    return (
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold font-heading">Our Courses</h1>
            <p className="mt-4 text-lg text-darkText max-w-2xl mx-auto">
              Invest in your future with our expert-led courses designed for career growth.
            </p>
          </div>
          
          <div className="text-center py-16">
            <p className="text-xl text-red-600 mb-4">Sorry, we&apos;re having trouble loading courses right now.</p>
            <p className="text-sm text-gray-500">Please try again later or contact us for assistance.</p>
          </div>
        </div>
      </section>
    );
  }
}
