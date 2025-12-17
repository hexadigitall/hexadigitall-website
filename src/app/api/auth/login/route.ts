import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { client } from '@/sanity/client'

async function getUserByUsername(username: string) {
  const query = `*[_type == "user" && username == $username][0]{
    _id,
    username,
    email,
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

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, requiredRole } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Fetch user from Sanity
    const user = await getUserByUsername(username)

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check if suspended
    if (user.status === 'suspended') {
      return NextResponse.json(
        { success: false, message: 'Your account has been suspended. Please contact support.' },
        { status: 403 }
      )
    }

    // Verify password
    if (!user.passwordHash || !user.salt) {
      return NextResponse.json(
        { success: false, message: 'Account not properly configured. Please contact admin.' },
        { status: 500 }
      )
    }

    const hashed = hashWithSalt(password, user.salt)
    if (hashed !== user.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Check role if specified
    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: `This login is for ${requiredRole}s only. Please use the correct login page.` },
        { status: 403 }
      )
    }

    // Generate session token
    const token = generateToken()
    const sessionToken = Buffer.from(JSON.stringify({
      token,
      userId: user._id,
      username: user.username,
      role: user.role,
      timestamp: Date.now(),
    })).toString('base64')

    return NextResponse.json({
      success: true,
      token: sessionToken,
      userId: user._id,
      username: user.username,
      role: user.role,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Login failed' },
      { status: 500 }
    )
  }
}
