// src/app/courses/ServerCoursesPage.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';
import CoursesPageContent from './CoursesPageContent';
import { fallbackCourses } from '@/lib/fallback-data';

interface Course {
  _id: string;
  title: string;
  slug: { current: string };
  summary: string;
  mainImage: string;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  nairaPrice?: number;
  dollarPrice?: number;
  price?: number;
  featured: boolean;
}

interface Category {
  _id: string;
  title: string;
  description: string;
  courses: Course[];
}

const courseCategoriesQuery = groq`*[_type == "courseCategory"] | order(title asc) {
  _id,
  title,
  description[0...200],
  "courses": *[_type == "course" && references(^._id)] | order(title asc) {
    _id,
    title,
    slug,
    summary[0...200],
    "mainImage": mainImage.asset->url,
    description[0...300],
    duration,
    level,
    instructor,
    nairaPrice,
    dollarPrice,
    price,
    featured
  }
}`;

export async function getCoursesData(): Promise<Category[]> {
  try {
    console.log('🔍 [SERVER] Fetching course categories from Sanity...');
    
    const categories = await client.fetch<Category[]>(courseCategoriesQuery, {}, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    });
    
    console.log('✅ [SERVER] Course categories fetched:', categories?.length || 0);
    
    if (!categories || categories.length === 0) {
      console.warn('⚠️ [SERVER] No categories found, using fallback data');
      return fallbackCourses as Category[];
    }
    
    return categories;
  } catch (error) {
    console.error('❌ [SERVER] Error fetching courses:', error);
    console.log('🔄 [SERVER] Using fallback data due to error');
    return fallbackCourses as Category[];
  }
}

export default async function ServerCoursesPage() {
  const categories = await getCoursesData();
  
  return <CoursesPageContent initialData={categories} />;
}