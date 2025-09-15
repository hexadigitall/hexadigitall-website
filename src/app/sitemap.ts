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

    return { courses: courses || [], posts: posts || [] };
  } catch (error) {
    console.error('Error fetching dynamic routes for sitemap:', error);
    return { courses: [], posts: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hexadigitall.com';
  const currentDate = new Date();
  
  // Get dynamic content
  const { courses, posts } = await getDynamicRoutes();
  
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

  // Add dynamic blog post pages
  const blogRoutes = posts.map((post: { slug: string; _updatedAt: string }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Combine all routes
  return [
    ...staticRoutes,
    ...courseRoutes,
    ...blogRoutes,
  ];
}
