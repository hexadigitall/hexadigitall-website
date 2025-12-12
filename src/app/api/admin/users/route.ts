import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { client, writeClient } from '@/sanity/client'
import { requireAdmin } from '@/lib/adminAuth'

const allowedRoles = new Set(['admin', 'teacher', 'student'])

function hashWithSalt(password: string, salt: string) {
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  try {
    const users = await client.fetch(
      '*[_type == "user"] | order(createdAt desc) { _id, username, email, name, role, status, createdAt }'
    )

    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  try {
    const { username, email, name, role, password, status } = await request.json()

    if (!username || !email || !role || !password) {
      return NextResponse.json(
        { success: false, message: 'Username, email, role and password are required' },
        { status: 400 }
      )
    }

    if (!allowedRoles.has(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role' },
        { status: 400 }
      )
    }

    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const existing = await client.fetch(
      '*[_type == "user" && (username == $username || email == $email)][0]{ _id }',
      { username, email }
    )

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      )
    }

    const salt = crypto.randomBytes(16).toString('hex')
    const passwordHash = hashWithSalt(password, salt)
    const now = new Date().toISOString()

    const created = await writeClient.create({
      _type: 'user',
      username,
      email,
      name: name || username,
      role,
      status: status === 'suspended' ? 'suspended' : 'active',
      salt,
      passwordHash,
      createdAt: now,
    })

    return NextResponse.json(
      {
        success: true,
        user: {
          _id: created._id,
          username,
          email,
          name: name || username,
          role,
          status: status === 'suspended' ? 'suspended' : 'active',
          createdAt: now,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to create user' },
      { status: 500 }
    )
  }
}
