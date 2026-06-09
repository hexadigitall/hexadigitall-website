import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'

export const runtime = 'nodejs'

type AssetDoc = {
  url?: string
  mimeType?: string
  size?: number
  originalFilename?: string
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assetId } = await context.params
    if (!assetId) {
      return NextResponse.json({ success: false, error: 'Missing asset id' }, { status: 400 })
    }

    const asset = await client.fetch<AssetDoc>(
      `*[_id == $id][0]{url, mimeType, size, originalFilename}`,
      { id: assetId }
    )

    if (!asset?.url) {
      return NextResponse.json({ success: false, error: 'Asset not found' }, { status: 404 })
    }

    const response = await fetch(asset.url)
    if (!response.ok || !response.body) {
      return NextResponse.json({ success: false, error: 'Failed to fetch asset' }, { status: 502 })
    }

    const headers = new Headers()
    headers.set('Content-Type', asset.mimeType || response.headers.get('content-type') || 'application/octet-stream')
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')

    if (asset.originalFilename) {
      headers.set('Content-Disposition', `inline; filename="${asset.originalFilename}"`)
    }

    return new NextResponse(response.body, { status: 200, headers })
  } catch (error) {
    console.error('File proxy error:', error)
    return NextResponse.json({ success: false, error: 'Failed to load file' }, { status: 500 })
  }
}