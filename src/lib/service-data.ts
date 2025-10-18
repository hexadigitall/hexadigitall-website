// src/lib/service-data.ts
import { client } from '@/sanity/client'
import { ServiceCategory } from '@/types/service'

/**
 * Fetch a specific service by slug with all related data
 */
export async function getServiceBySlug(slug: string): Promise<ServiceCategory | null> {
  try {
    const service = await client.fetch<ServiceCategory | null>(
      `*[_type == "service" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        shortDescription,
        longDescription,
        packages[] {
          _key,
          _type,
          name,
          description,
          price,
          currency,
          popular,
          features,
          deliveryTime
        },
        individualServices[] {
          _key,
          _type,
          name,
          description,
          price,
          currency,
          deliveryTime,
          features
        },
        "category": category-> {
          _id,
          title,
          slug,
          description
        }
      }`,
      { slug },
      {
        // Enable ISR - revalidate every 60 seconds
        next: { revalidate: 60 }
      }
    )

    return service
  } catch (error) {
    console.error(`Failed to fetch service by slug: ${slug}`, error)
    return null
  }
}

/**
 * Get all service categories with their linked services
 */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  try {
    const categories = await client.fetch<ServiceCategory[]>(
      `*[_type == "serviceCategory"] | order(title asc) {
        _id,
        title,
        slug,
        description,
        "services": services[]-> {
          _id,
          title,
          slug,
          description,
          shortDescription
        }
      }`,
      {},
      {
        next: { revalidate: 300 } // 5 minutes cache
      }
    )

    return categories || []
  } catch (error) {
    console.error('Failed to fetch service categories', error)
    return []
  }
}

/**
 * Get all services for a specific category
 */
export async function getServicesByCategory(categorySlug: string): Promise<ServiceCategory[]> {
  try {
    const services = await client.fetch<ServiceCategory[]>(
      `*[_type == "service" && category->slug.current == $categorySlug] | order(title asc) {
        _id,
        title,
        slug,
        description,
        shortDescription,
        longDescription,
        packages[] {
          _key,
          _type,
          name,
          description,
          price,
          currency,
          popular,
          features,
          deliveryTime
        },
        individualServices[] {
          _key,
          _type,
          name,
          description,
          price,
          currency,
          deliveryTime,
          features
        },
        "category": category-> {
          _id,
          title,
          slug,
          description
        }
      }`,
      { categorySlug },
      {
        next: { revalidate: 60 }
      }
    )

    return services || []
  } catch (error) {
    console.error(`Failed to fetch services for category: ${categorySlug}`, error)
    return []
  }
}

/**
 * Generate static params for all service pages (for static generation)
 */
export async function getAllServiceSlugs(): Promise<{ slug: string }[]> {
  try {
    const slugs = await client.fetch<{ slug: string }[]>(
      `*[_type == "service" && defined(slug.current)] {
        "slug": slug.current
      }`
    )

    return slugs || []
  } catch (error) {
    console.error('Failed to fetch service slugs', error)
    return []
  }
}