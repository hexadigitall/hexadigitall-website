import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
// Removed unused 'Link' import
import { PortableText } from '@portabletext/react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { urlFor } from '@/sanity/imageUrlBuilder'

// Force dynamic to support new deployments
export const dynamic = "force-dynamic"

type Props = {
  params: Promise<{ slug: string }>
}

// Helper for generating local OG image path
function getProjectOgImage(slug: string): string {
  return `https://hexadigitall.com/og-images/project-${slug}.jpg`
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { slug } = params

  const query = groq`*[_type == "project" && slug.current == $slug][0]{
    title,
    description,
    // Expand OG Image
    ogImage { asset->{url} },
    // Fallback Main Image
    mainImage { asset->{url} }
  }`

  const project = await client.fetch(query, { slug })

  if (!project) return { title: 'Project Not Found' }

  // Priority: Sanity OG -> Sanity Main -> Local Fallback
  let imageUrl = getProjectOgImage(slug)
  if (project.ogImage?.asset?.url) {
    imageUrl = project.ogImage.asset.url
  } else if (project.mainImage?.asset?.url) {
    imageUrl = project.mainImage.asset.url
  }

  return {
    title: project.title,
    description: project.description || `Case study: ${project.title}`,
    openGraph: {
      title: project.title,
      description: project.description || `Case study: ${project.title}`,
      url: `https://hexadigitall.com/portfolio/${slug}`,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description,
      images: [imageUrl],
    }
  }
}

export default async function ProjectPage(props: Props) {
  const params = await props.params
  const { slug } = params

  const query = groq`*[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    description,
    mainImage,
    industry,
    challenge,
    solution,
    results,
    body,
    technologies,
    liveUrl,
    githubUrl
  }`

  const project = await client.fetch(query, { slug })

  if (!project) notFound()

  return (
    <article className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-12 md:py-20">
        <Breadcrumb items={[{ label: 'Portfolio', href: '/portfolio' }, { label: project.title }]} />
        
        {/* Header */}
        <header className="mb-12 mt-8 text-center max-w-4xl mx-auto">
          {project.industry && (
            <span className="inline-block py-1 px-3 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-wider mb-4">
              {project.industry}
            </span>
          )}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">{project.title}</h1>
          <p className="text-xl text-gray-600 leading-relaxed">{project.description}</p>
          
          <div className="flex justify-center gap-4 mt-8">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                View Live Site
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                View Code
              </a>
            )}
          </div>
        </header>

        {/* Main Image */}
        {project.mainImage && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-16 bg-gray-100">
            <Image
              src={urlFor(project.mainImage).url()}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Sidebar / Metadata */}
          <div className="md:col-span-1 space-y-8">
            {project.technologies && (
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string) => (
                    <span key={tech} className="px-3 py-1 bg-white border border-gray-200 rounded-md text-sm text-gray-600">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Body */}
          <div className="md:col-span-2 prose prose-lg prose-blue max-w-none">
             {project.body ? (
                <PortableText value={project.body} />
             ) : (
               <div className="space-y-8">
                 {project.challenge && (
                   <section>
                     <h3>The Challenge</h3>
                     <p>{project.challenge}</p>
                   </section>
                 )}
                 {project.solution && (
                   <section>
                     <h3>The Solution</h3>
                     <p>{project.solution}</p>
                   </section>
                 )}
                 {project.results && (
                   <section>
                     <h3>The Results</h3>
                     <p>{project.results}</p>
                   </section>
                 )}
               </div>
             )}
          </div>
        </div>
      </div>
    </article>
  )
}