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
  mainImage: string | null;
  description: string;
  duration: string;
  level: string;
  instructor: string;
  courseType?: 'live' | 'self-paced';
  // PPP Pricing (for live courses)
  hourlyRateUSD?: number;
  hourlyRateNGN?: number;
  // Legacy pricing (for self-paced courses)
  nairaPrice?: number;
  dollarPrice?: number;
  price?: number;
  featured: boolean;
  durationWeeks?: number;
  hoursPerWeek?: number;
  modules?: number;
  lessons?: number;
  includes?: string[];
  certificate?: boolean;
}


interface School {
  _id: string;
  title: string;
  description: string;
  courses: Course[];
}

const schoolsQuery = groq`*[_type == "school"] | order(title asc) {
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

export async function getCoursesData(): Promise<School[]> {
  try {
    console.log('🔍 [SERVER] Fetching course categories from Sanity...');
    
    const schools = await client.fetch(schoolsQuery, {}, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    }) as unknown as School[];
    
    console.log('✅ [SERVER] Schools fetched:', schools?.length || 0);
    
    if (!schools || schools.length === 0) {
      console.warn('⚠️ [SERVER] No schools found, using fallback data');
      return fallbackCourses;
    }
    
    return schools;
  } catch (error) {
    console.error('❌ [SERVER] Error fetching courses:', error);
    console.log('🔄 [SERVER] Using fallback data due to error');
    return fallbackCourses;
  }
}

export default async function ServerCoursesPage() {
  const schools = await getCoursesData();
  // 👇 FIXED: Changed initialData to initialSchools
  return (<CoursesPageContent initialSchools={schools} />);
}