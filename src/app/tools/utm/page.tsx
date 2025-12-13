"use client"
import React, { useMemo, useState } from 'react'

const PLATFORMS = [
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'email', label: 'Email' },
]

const PAGES = [
  { url: 'https://hexadigitall.com', label: 'Homepage' },
  { url: 'https://hexadigitall.com/services', label: 'Services hub' },
  { url: 'https://hexadigitall.com/courses', label: 'Courses hub' },
  { url: 'https://hexadigitall.com/services/web-and-mobile-software-development', label: 'Web Development' },
  { url: 'https://hexadigitall.com/services/social-media-advertising-and-marketing', label: 'Digital Marketing' },
  { url: 'https://hexadigitall.com/services/business-plan-and-logo-design', label: 'Business Planning' },
]

export default function UTMBuilderPage() {
  const [baseUrl, setBaseUrl] = useState(PAGES[1].url)
  const [source, setSource] = useState('whatsapp')
  const [medium, setMedium] = useState('social')
  const [campaign, setCampaign] = useState('dec_jan_2025')
  const [content, setContent] = useState('')
  const [term, setTerm] = useState('')

  const trackedUrl = useMemo(() => {
    const url = new URL(baseUrl)
    url.searchParams.set('utm_source', source)
    url.searchParams.set('utm_medium', medium)
    url.searchParams.set('utm_campaign', campaign)
    if (content) url.searchParams.set('utm_content', content)
    if (term) url.searchParams.set('utm_term', term)
    return url.toString()
  }, [baseUrl, source, medium, campaign, content, term])

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">UTM Link Builder</h1>
      <p className="text-gray-600 mb-8">Compose tracked links for campaigns with consistent parameters.</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium mb-2">Base URL</label>
          <select className="w-full border rounded p-2" value={baseUrl} onChange={e => setBaseUrl(e.target.value)}>
            {PAGES.map(p => <option key={p.url} value={p.url}>{p.label} ({p.url})</option>)}
          </select>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Source</label>
              <select className="w-full border rounded p-2" value={source} onChange={e => setSource(e.target.value)}>
                {PLATFORMS.map(p => <option key={p.key} value={p.key}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Medium</label>
              <input className="w-full border rounded p-2" value={medium} onChange={e => setMedium(e.target.value)} />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign</label>
              <input className="w-full border rounded p-2" value={campaign} onChange={e => setCampaign(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content (optional)</label>
              <input className="w-full border rounded p-2" value={content} onChange={e => setContent(e.target.value)} />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Term (optional)</label>
            <input className="w-full border rounded p-2" value={term} onChange={e => setTerm(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tracked URL</label>
          <textarea className="w-full border rounded p-2 h-40" readOnly value={trackedUrl} />
          <div className="mt-2 text-sm text-gray-500">Copy this and paste into your posts.</div>
        </div>
      </div>
    </div>
  )
}
