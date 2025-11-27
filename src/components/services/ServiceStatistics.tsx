"use client"

import React from 'react'
import { ServiceStats } from '../../types/service'
import normalizeStatistics from '@/lib/normalizeStatistics'

type Metrics = {
  projectsCompleted?: number
  clientSatisfaction?: number
  averageDeliveryTime?: string
  teamSize?: number
}

type StatsProp = {
  metrics?: Metrics
}

export default function ServiceStatistics({ statistics }: { statistics?: ServiceStats | StatsProp }) {
  if (!statistics) return null

  // Normalize incoming `statistics` into a canonical `{ metrics }` shape.
  const normalized = normalizeStatistics(statistics)
  const metrics: Metrics = normalized.metrics || {}

  return (
    <div className="my-12 bg-white border rounded-xl p-6 shadow-sm">
      <h3 className="text-2xl font-bold mb-4">Service Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{metrics.projectsCompleted ?? '—'}</div>
          <div className="text-sm text-gray-500">Projects Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{metrics.clientSatisfaction ?? '—'}%</div>
          <div className="text-sm text-gray-500">Client Satisfaction</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{metrics.averageDeliveryTime ?? '—'}</div>
          <div className="text-sm text-gray-500">Avg Delivery</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{metrics.teamSize ?? '—'}</div>
          <div className="text-sm text-gray-500">Team Size</div>
        </div>
      </div>
    </div>
  )
}
