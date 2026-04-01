// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { client } from '@/sanity/client';
import { groq } from 'next-sanity';

// Get dynamic content from Sanity
async function getDynamicRoutes() {
  try {
    // Fetch courses
    const courses = await client.fetch(
      groq`*[_type == "course" && defined(slug.current)]{
        "slug": slug.current,
        _updatedAt
      }`
    );

    // Fetch blog posts (if you have them)
    const posts = await client.fetch(
      groq`*[_type == "post" && defined(slug.current)]{
        "slug": slug.current,
        _updatedAt
      }`
    ).catch(() => []); // Graceful failure if no posts

    // Fetch books
    const books = await client.fetch(
      groq`*[_type == "book" && defined(slug.current)]{
        "slug": slug.current,
        _updatedAt
      }`
    ).catch(() => []);

    return { courses: courses || [], posts: posts || [], books: books || [] };
  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap:', error);
    return { courses: [], posts: [], books: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hexadigitall.com';
  const currentDate = new Date();
  
  // Get dynamic content
  const { courses, posts, books } = await getDynamicRoutes();
  
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services/business-plan-and-logo-design`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/web-and-mobile-software-development`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/social-media-advertising-and-marketing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/profile-and-portfolio-building`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/mentoring-and-consulting`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mentorships`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/mentorships/courses`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/store`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/errata`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ];

  // Add dynamic course pages
  const courseRoutes = courses.map((course: { slug: string; _updatedAt: string }) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: new Date(course._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const mentorshipRoutes = courses.map((course: { slug: string; _updatedAt: string }) => ({
    url: `${baseUrl}/mentorships/courses/${course.slug}`,
    lastModified: new Date(course._updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Add dynamic blog post pages
  const blogRoutes = posts.map((post: { slug: string; _updatedAt: string }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Add dynamic book-related pages
  const bookRoutes = books.flatMap((book: { slug: string; _updatedAt: string }) => [
    {
      url: `${baseUrl}/store/${book.slug}`,
      lastModified: new Date(book._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/errata/${book.slug}`,
      lastModified: new Date(book._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/resources/${book.slug}`,
      lastModified: new Date(book._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
  ]);

  // Combine all routes
  return [
    ...staticRoutes,
    ...courseRoutes,
    ...blogRoutes,
    ...mentorshipRoutes,
    ...bookRoutes,
  ];
}
