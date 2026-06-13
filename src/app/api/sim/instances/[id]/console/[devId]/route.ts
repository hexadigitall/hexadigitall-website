import { NextRequest, NextResponse } from 'next/server'

/**
 * Console WebSocket tunnel metadata endpoint.
 *
 * Browser → ws://localhost:3001/ws/instance/<id>/console/<devId>?token=<auth>
 *         → ws-proxy → Python engine
 *
 * Returns the WS proxy URL for device console connections.
 */

const WS_PROXY_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl
  const match = pathname.match(/\/api\/sim\/instances\/([^/]+)\/console\/([^/]+)/)

  if (!match) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const [, instanceId, deviceId] = match

  return NextResponse.json({
    status: 'available',
    proxyUrl: `${WS_PROXY_URL}/ws/instance/${instanceId}/console/${deviceId}`,
    proxyVersion: '0.1.0',
    docs: 'Connect via WebSocket with ?token=<base64-auth> query param',
  })
}
