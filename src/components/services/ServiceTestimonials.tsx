"use client"

import React from 'react'
import Image from 'next/image'

type Testimonial = {
  _id?: string
  client?: string
  role?: string
  testimonial?: string
  company?: string
  image?: { asset?: { url?: string } }
}

export default function ServiceTestimonials({ testimonials }: { testimonials?: Testimonial[] }) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <div className="my-12">
      <h3 className="text-2xl font-bold mb-4">What our clients say</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t._id || t.client} className="bg-white border rounded-xl p-4 shadow-sm">
            {t.image?.asset?.url && (
              <div className="w-12 h-12 mb-3">
                <img src={t.image.asset.url} alt={t.client || 'Client'} className="w-12 h-12 rounded-full object-cover" />
              </div>
            )}
            <div className="text-sm text-gray-700 mb-2">{t.testimonial}</div>
            <div className="text-sm font-medium text-gray-900">{t.client}{t.role ? ` — ${t.role}` : ''}</div>
            {t.company && <div className="text-xs text-gray-500">{t.company}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
