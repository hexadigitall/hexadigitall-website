// src/app/debug-courses/page.tsx
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';

export default async function DebugCoursesPage() {
  try {
    // Test basic connectivity
    const testQuery = groq`count(*[_type == "course"])`;
    const courseCount = await client.fetch(testQuery);
    
    // Fetch all courses
    const coursesQuery = groq`*[_type == "course"] | order(title asc) {
      _id,
      title,
      slug,
      price,
      summary,
      mainImage
    }`;
    const courses = await client.fetch(coursesQuery);
    
    // Fetch all course categories
    const categoriesQuery = groq`*[_type == "courseCategory"] | order(title asc) {
      _id,
      title,
      description
    }`;
    const categories = await client.fetch(categoriesQuery);
    
    // Fetch categories with courses (the main query from the courses page)
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
    const categoriesWithCourses = await client.fetch(categoriesWithCoursesQuery);

    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Debug Courses Data</h1>
        
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Connection Test</h2>
            <p>Total courses in database: {courseCount}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">All Courses ({courses.length})</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(courses, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">All Categories ({categories.length})</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(categories, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Categories with Courses (Main Query)</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(categoriesWithCourses, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-8 text-red-600">Error Fetching Data</h1>
        <pre className="bg-red-100 p-4 rounded text-sm">
          {error instanceof Error ? error.message : 'Unknown error occurred'}
        </pre>
      </div>
    );
  }
}
