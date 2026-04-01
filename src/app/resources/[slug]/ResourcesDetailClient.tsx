'use client'

import { useMemo, useState } from 'react'
import type { ResourceItem } from '@/lib/book-queries'

const TYPE_ICONS: Record<string, string> = {
  code: '💻',
  file: '📄',
  dataset: '📊',
  slides: '📑',
  answer_student: '📝',
  answer_instructor: '🔐',
  video: '🎬',
  link: '🔗',
}

const TYPE_LABELS: Record<string, string> = {
  code: 'Code Repository',
  file: 'Download',
  dataset: 'Dataset',
  slides: 'Slide Deck',
  answer_student: 'Answer Key (Student)',
  answer_instructor: 'Answer Key (Instructor)',
  video: 'Video',
  link: 'External Link',
}

type TypeFilter = 'all' | 'code' | 'file' | 'dataset' | 'slides' | 'answer_student' | 'video' | 'link'

function normalize(value: string): string {
  return value.toLowerCase().trim()
}

function toSearchableText(resource: ResourceItem): string {
  return normalize([
    resource.title,
    resource.description,
    resource.type,
    resource.chapter,
  ].filter(Boolean).join(' '))
}

interface ResourcesDetailClientProps {
  resources: ResourceItem[]
}

export default function ResourcesDetailClient({ resources }: ResourcesDetailClientProps) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<TypeFilter>('all')
  const [chapter, setChapter] = useState<'all' | number>('all')

  const normalizedQuery = normalize(query)

  const chapterOptions = useMemo(() => {
    const values = Array.from(new Set(resources.map((resource) => resource.chapter).filter((value): value is number => Number.isInteger(value))))
    return values.sort((a, b) => a - b)
  }, [resources])

  const filteredResources = useMemo(() => {
    const byType = type === 'all' ? resources : resources.filter((resource) => resource.type === type)
    const byChapter = chapter === 'all' ? byType : byType.filter((resource) => resource.chapter === chapter)

    if (!normalizedQuery) return byChapter

    const terms = normalizedQuery.split(/\s+/).filter(Boolean)
    return byChapter.filter((resource) => {
      const searchable = toSearchableText(resource)
      return terms.every((term) => searchable.includes(term))
    })
  }, [resources, type, chapter, normalizedQuery])

  const grouped = useMemo(() => {
    return filteredResources.reduce((acc, resource) => {
      const key = resource.chapter ? `Chapter ${resource.chapter}` : 'General'
      if (!acc[key]) acc[key] = []
      acc[key].push(resource)
      return acc
    }, {} as Record<string, ResourceItem[]>)
  }, [filteredResources])

  const chapterKeys = useMemo(() => {
    return Object.keys(grouped).sort((a, b) => {
      if (a === 'General') return -1
      if (b === 'General') return 1
      return parseInt(a.replace('Chapter ', '')) - parseInt(b.replace('Chapter ', ''))
    })
  }, [grouped])

  return (
    <section className="mb-16">
      <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 mb-6">
        <label htmlFor="resources-search" className="block text-sm font-semibold text-darkText mb-2">
          Search resources
        </label>
        <input
          id="resources-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, description, type, or chapter"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setType('all')}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              type === 'all' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Types
          </button>
          {(['code', 'file', 'dataset', 'slides', 'answer_student', 'video', 'link'] as TypeFilter[]).map((resourceType) => (
            <button
              key={resourceType}
              type="button"
              onClick={() => setType(resourceType)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                type === resourceType ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {TYPE_LABELS[resourceType]}
            </button>
          ))}
        </div>

        {chapterOptions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setChapter('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                chapter === 'all' ? 'bg-secondary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Chapters
            </button>
            {chapterOptions.map((chapterNumber) => (
              <button
                key={chapterNumber}
                type="button"
                onClick={() => setChapter(chapterNumber)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  chapter === chapterNumber ? 'bg-secondary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Chapter {chapterNumber}
              </button>
            ))}
          </div>
        )}

        <p className="mt-2 text-xs text-gray-500">
          Showing {filteredResources.length} of {resources.length} resource{resources.length !== 1 ? 's' : ''}
        </p>
      </div>

      {filteredResources.length > 0 ? (
        <div className="space-y-10">
          {chapterKeys.map((chapterKey) => (
            <div key={chapterKey}>
              <h2 className="text-base font-bold text-darkText mb-4 border-b border-gray-100 pb-2">
                {chapterKey}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {grouped[chapterKey].map((resource) => {
                  const downloadUrl = resource.url ?? resource.file?.asset?.url
                  return (
                    <div key={resource._key} className="p-4 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{TYPE_ICONS[resource.type] ?? '📁'}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-darkText">{resource.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{TYPE_LABELS[resource.type] ?? resource.type}</p>
                          {resource.description && (
                            <p className="text-xs text-gray-500 mt-2 leading-relaxed">{resource.description}</p>
                          )}
                        </div>
                      </div>

                      {downloadUrl && (
                        <a
                          href={downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          {resource.type === 'code' ? '↗ Open Repository' : resource.type === 'video' ? '▶ Watch' : '↓ Download'}
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 border border-dashed border-gray-200 rounded-2xl bg-white">
          <p className="text-2xl mb-2">No matching resources</p>
          <p className="text-sm">Try changing chapter or resource type filters.</p>
        </div>
      )}
    </section>
  )
}
