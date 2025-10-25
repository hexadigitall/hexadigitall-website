import { NextResponse } from 'next/server'
import { SERVICE_PRICING } from '@/lib/currency'

export async function GET() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || 'unknown'
  const serviceSnapshot = {
    'web-development': (SERVICE_PRICING['web-development'] || []).map(t => ({ id: t.id, basePrice: t.basePrice }))
  }

  return NextResponse.json({
    ok: true,
    sha,
    time: new Date().toISOString(),
    pricing: serviceSnapshot,
    env: {
      node: process.version,
      vercel: !!process.env.VERCEL
    }
  })
}
