import { NextRequest, NextResponse } from 'next/server'

/**
 * WebSocket tunnel metadata endpoint.
 *
 * WebSocket connections are handled by the standalone WS proxy
 * (ws-proxy/server.js) which runs alongside the Next.js server.
 *
 * Browser → ws://localhost:3001/ws/instance/<id>?token=<auth>
 *         → ws-proxy → Python engine ws://localhost:9000/ws/instance/<id>
 *
 * This endpoint returns the WS proxy URL so clients can connect.
 */

const WS_PROXY_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'

export async function GET(request: NextRequest) {
  const { pathname } = request.nextUrl
  const instanceId = pathname.match(/\/api\/sim\/instances\/([^/]+)\/ws/)?.[1]

  return NextResponse.json({
    status: 'available',
    proxyUrl: `${WS_PROXY_URL}/ws/instance/${instanceId}`,
    proxyVersion: '0.1.0',
    docs: 'Connect via WebSocket with ?token=<base64-auth> query param',
  })
}
