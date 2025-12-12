import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// In production, store these in environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || hashPassword('admin123') // Change this!

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + (process.env.AUTH_SALT || 'hexadigitall')).digest('hex')
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate credentials
    if (username === ADMIN_USERNAME && hashPassword(password) === ADMIN_PASSWORD_HASH) {
      const token = generateToken()
      
      // In production, store token in Redis or database with expiration
      // For now, we'll use a simple token that encodes timestamp
      const sessionToken = Buffer.from(JSON.stringify({
        token,
        username,
        timestamp: Date.now(),
      })).toString('base64')

      return NextResponse.json({
        success: true,
        token: sessionToken,
        username,
      })
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
        return NextResponse.json({ authenticated: true, username: decoded.username })
      }
    } catch {
      // Invalid token format
    }

    return NextResponse.json({ authenticated: false }, { status: 401 })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
