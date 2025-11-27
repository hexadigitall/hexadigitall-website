"use client"

import React from 'react'
import Link from 'next/link'

type CaseStudy = {
  _id?: string
  title?: string
  client?: { name?: string; industry?: string }
  challenge?: string
  slug?: { current?: string }
  featured?: boolean
}

export default function ServiceCaseStudies({ caseStudies }: { caseStudies?: CaseStudy[] }) {
  if (!caseStudies || caseStudies.length === 0) return null

  return (
    <div className="my-12">
      <h3 className="text-2xl font-bold mb-4">Case Studies</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseStudies.map((c) => (
          <div key={c._id || c.title} className="bg-white border rounded-xl p-4 shadow-sm">
            <h4 className="font-semibold text-lg mb-1">{c.title}</h4>
            {c.client?.name && <div className="text-sm text-gray-600 mb-2">{c.client.name} — {c.client.industry}</div>}
            <p className="text-sm text-gray-700 mb-3">{(c.challenge || '').slice(0, 180)}{(c.challenge || '').length > 180 ? '...' : ''}</p>
            <div className="flex items-center justify-between">
              <Link href={c.slug?.current ? `/case-studies/${c.slug.current}` : '#'} className="text-primary font-medium">Read case study</Link>
              {c.featured && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
