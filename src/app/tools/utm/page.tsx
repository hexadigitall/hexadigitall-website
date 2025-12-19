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
  { url: 'https://hexadigitall.com/services/profile-and-portfolio-building', label: 'Portfolio Design' },
]

const CITIES = ['Lagos', 'Abuja', 'Calabar', 'Kano', 'Port Harcourt', 'Benin', 'Ibadan']

const SERVICES = [
  { key: 'web-dev', label: 'Web Development', url: 'https://hexadigitall.com/services/web-and-mobile-software-development' },
  { key: 'digital-marketing', label: 'Digital Marketing', url: 'https://hexadigitall.com/services/social-media-advertising-and-marketing' },
  { key: 'business-planning', label: 'Business Planning', url: 'https://hexadigitall.com/services/business-plan-and-logo-design' },
  { key: 'portfolio-design', label: 'Portfolio Design', url: 'https://hexadigitall.com/services/profile-and-portfolio-building' },
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

  const presetLinks = useMemo(() => {
    return SERVICES.flatMap(service =>
      CITIES.map(city => {
        const url = new URL(service.url)
        url.searchParams.set('utm_source', source)
        url.searchParams.set('utm_medium', medium)
        url.searchParams.set('utm_campaign', campaign)
        url.searchParams.set('utm_content', service.key)
        url.searchParams.set('utm_term', city.toLowerCase().replace(/\s+/g, '-'))
        return {
          city,
          service: service.label,
          url: url.toString(),
        }
      })
    )
  }, [campaign, medium, source])

  const presetText = useMemo(
    () => presetLinks.map(link => `${link.service} • ${link.city}: ${link.url}`).join('\n'),
    [presetLinks]
  )

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

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-3">Campaign presets (7 cities × 4 services)</h2>
        <p className="text-sm text-gray-600 mb-4">Links auto-use your current source/medium/campaign selections and set content=service, term=city.</p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3 max-h-80 overflow-y-auto border border-gray-200 rounded-md p-3 bg-gray-50">
            {presetLinks.map((link) => (
              <div key={`${link.city}-${link.service}`} className="text-sm">
                <div className="font-medium text-gray-900">{link.service} — {link.city}</div>
                <div className="text-gray-600 break-all text-xs">{link.url}</div>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Copy all presets</label>
            <textarea
              className="w-full border rounded p-2 h-72 text-xs"
              readOnly
              value={presetText}
            />
            <div className="mt-2 text-sm text-gray-500">Paste into SOCIAL_SHARE_GUIDE or send to the team.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
