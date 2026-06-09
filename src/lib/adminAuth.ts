import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/client'

export type AdminAuthSuccess = {
  ok: true
  user: {
    id?: string
    username: string
    role: string
  }
}

export type AdminAuthFailure = {
  ok: false
  response: NextResponse
}

type AuthResult = AdminAuthSuccess | AdminAuthFailure

type DecodedToken = {
  userId?: string
  username?: string
  role?: string
  timestamp?: number
}

function unauthorized(message = 'Unauthorized'): AdminAuthFailure {
  return {
    ok: false,
    response: NextResponse.json(
      { success: false, message },
      { status: 401 }
    ),
  }
}

function forbidden(message = 'Forbidden'): AdminAuthFailure {
  return {
    ok: false,
    response: NextResponse.json(
      { success: false, message },
      { status: 403 }
    ),
  }
}

export async function requireAdmin(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return unauthorized()
  }

  const token = authHeader.substring(7)
  let decoded: DecodedToken

  try {
    decoded = JSON.parse(Buffer.from(token, 'base64').toString())
  } catch {
    return unauthorized('Invalid token')
  }

  if (!decoded.timestamp) {
    return unauthorized('Invalid session')
  }

  const hoursSinceLogin = (Date.now() - decoded.timestamp) / (1000 * 60 * 60)
  if (hoursSinceLogin >= 24) {
    return unauthorized('Session expired')
  }

  if (decoded.userId) {
    const user = await client.fetch(
      '*[_type == "user" && _id == $id][0]{ _id, username, role, status }',
      { id: decoded.userId }
    )

    if (!user || user.status === 'suspended') {
      return unauthorized('User not found')
    }

    if (user.role !== 'admin') {
      return forbidden()
    }

    return {
      ok: true,
      user: {
        id: user._id as string,
        username: user.username as string,
        role: user.role as string,
      },
    }
  }

  if (decoded.role === 'admin') {
    return {
      ok: true,
      user: {
        username: decoded.username || 'admin',
        role: 'admin',
      },
    }
  }

  return forbidden()
}
