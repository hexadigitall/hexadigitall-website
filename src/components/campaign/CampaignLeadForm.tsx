"use client"
import { FormEvent, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface CampaignLeadFormProps {
  campaignName: string
  defaultService: string
  heading?: string
}

const CITIES = ['Lagos', 'Abuja', 'Calabar', 'Kano', 'Port Harcourt', 'Benin', 'Ibadan']

export function CampaignLeadForm({ campaignName, defaultService, heading = 'Book a consultation in 24 hours' }: CampaignLeadFormProps) {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    service: defaultService,
    message: '',
  })

  const utm = useMemo(() => {
    return {
      campaignName: searchParams.get('utm_campaign') || campaignName,
      campaignSource: searchParams.get('utm_source') || undefined,
      campaignMedium: searchParams.get('utm_medium') || undefined,
      campaignContent: searchParams.get('utm_content') || undefined,
      campaignTerm: searchParams.get('utm_term') || undefined,
    }
  }, [campaignName, searchParams])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/campaign/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, ...utm }),
      })

      const data = await response.json()
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to submit. Please try again.')
      }

      setStatus('success')
      setMessage('We got it! Expect a reply within 24 hours.')
      setFormData({ name: '', email: '', phone: '', city: '', service: defaultService, message: '' })
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again later.')
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-primary mb-2">{heading}</h2>
      <p className="text-sm text-gray-600 mb-6">Fill this form and we will schedule your consultation in the next business day.</p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={onChange}
              required
              disabled={status === 'loading'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-secondary disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={onChange}
              required
              disabled={status === 'loading'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-secondary disabled:bg-gray-50"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={onChange}
              disabled={status === 'loading'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-secondary disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <select
              name="city"
              value={formData.city}
              onChange={onChange}
              required
              disabled={status === 'loading'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-secondary disabled:bg-gray-50"
            >
              <option value="">Select a city</option>
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service *</label>
            <select
              name="service"
              value={formData.service}
              onChange={onChange}
              required
              disabled={status === 'loading'}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-secondary disabled:bg-gray-50"
            >
              <option value="">Select a service</option>
              <option value="Web Development">Web Development</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="Business Planning">Business Planning</option>
              <option value="E-Commerce Solutions">E-Commerce Solutions</option>
              <option value="Portfolio Design">Portfolio Design</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Campaign *</label>
            <input
              name="campaignName"
              value={utm.campaignName}
              readOnly
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-gray-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">What do you need? (optional)</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={onChange}
            rows={3}
            disabled={status === 'loading'}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-secondary focus:border-secondary disabled:bg-gray-50"
            placeholder="Tell us about your project or goals..."
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading' || !formData.name || !formData.email || !formData.city || !formData.service}
          className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-secondary text-white font-semibold rounded-md shadow hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? 'Submitting...' : 'Get My Plan'}
        </button>

        {message && (
          <div className={`p-3 rounded-md text-sm ${status === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
