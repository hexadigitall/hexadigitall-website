import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { client, writeClient } from '@/sanity/client'

// In production, store these in environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || hashPassword('admin123') // Change this!

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + (process.env.AUTH_SALT || 'hexadigitall')).digest('hex')
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

async function getUserByUsername(username: string) {
  const query = `*[_type == "user" && username == $username][0]{
    _id,
    username,
    name,
    role,
    passwordHash,
    salt,
    status
  }`
  return client.fetch(query, { username })
}

function hashWithSalt(password: string, salt: string) {
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // 1) Try Sanity users first
    const dbUser = await getUserByUsername(username)
    if (dbUser && dbUser.status !== 'suspended' && dbUser.passwordHash && dbUser.salt) {
      const hashed = hashWithSalt(password, dbUser.salt)
      if (hashed === dbUser.passwordHash) {
        const token = generateToken()
        const sessionToken = Buffer.from(JSON.stringify({
          token,
          userId: dbUser._id,
          username: dbUser.username,
          role: dbUser.role,
          timestamp: Date.now(),
        })).toString('base64')

        return NextResponse.json({ success: true, token: sessionToken, username: dbUser.username, role: dbUser.role })
      }
    }

    // 2) Fallback to env admin (legacy)
    if (username === ADMIN_USERNAME && hashPassword(password) === ADMIN_PASSWORD_HASH) {
      // Ensure this admin has a Sanity user document so that userId-based
      // token resolution works everywhere (assessments, dashboards, etc.)
      let sanityUserId: string | null = null
      try {
        const existing = await client.fetch<{ _id: string } | null>(
          `*[_type == "user" && username == $username][0]{ _id }`,
          { username },
        )
        if (existing) {
          sanityUserId = existing._id
        } else {
          // First login via env credentials — create the Sanity document
          const created = await writeClient.create({
            _type: 'user',
            username,
            name: 'Administrator',
            role: 'admin',
            status: 'active',
            createdAt: new Date().toISOString(),
          })
          sanityUserId = created._id
        }
      } catch {
        // Non-fatal — fall through with null userId (legacy behaviour)
      }

      const token = generateToken()
      const sessionPayload: Record<string, unknown> = {
        token,
        username,
        role: 'admin',
        timestamp: Date.now(),
      }
      if (sanityUserId) sessionPayload.userId = sanityUserId

      const sessionToken = Buffer.from(JSON.stringify(sessionPayload)).toString('base64')
      return NextResponse.json({ success: true, token: sessionToken, username, role: 'admin' })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())

      // Check if token is less than 24 hours old
      const hoursSinceLogin = (Date.now() - decoded.timestamp) / (1000 * 60 * 60)
      if (hoursSinceLogin < 24) {
        // If token contains userId, verify user still exists and not suspended
        if (decoded.userId) {
          const user = await client.fetch(`*[_type == "user" && _id == $id][0]{_id, username, name, profilePhotoUrl, role, status}`, { id: decoded.userId })
          if (!user || user.status === 'suspended') {
            return NextResponse.json({ authenticated: false }, { status: 401 })
          }
          return NextResponse.json({ authenticated: true, username: user.username, name: user.name, profilePhotoUrl: user.profilePhotoUrl, role: user.role })
        }
        // Legacy env token
        return NextResponse.json({ authenticated: true, username: decoded.username, name: decoded.name, role: decoded.role || 'admin' })
      }
    } catch {
      // Invalid token format
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
