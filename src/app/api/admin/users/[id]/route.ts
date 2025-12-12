import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { client, writeClient } from '@/sanity/client'
import { requireAdmin } from '@/lib/adminAuth'

const allowedRoles = new Set(['admin', 'teacher', 'student'])
const allowedStatuses = new Set(['active', 'suspended'])

function hashWithSalt(password: string, salt: string) {
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}

async function getUserIdFromPath(request: NextRequest): Promise<string | null> {
  const url = new URL(request.url)
  const match = url.pathname.match(/\/users\/([^/]+)/)
  return match ? match[1] : null
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin(request)
  if (!auth.ok) {
    return auth.response
  }

  const userId = await getUserIdFromPath(request)
  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'User id is required' },
      { status: 400 }
    )
  }

  try {
    const body = await request.json()
    const { role, status, name, email, password } = body as {
      role?: string
      status?: string
      name?: string
      email?: string
      password?: string
    }

    const existing = await client.fetch(
      '*[_type == "user" && _id == $id][0]{ _id }',
      { id: userId }
    )

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const updates: Record<string, unknown> = {}

    if (role) {
      if (!allowedRoles.has(role)) {
        return NextResponse.json(
          { success: false, message: 'Invalid role' },
          { status: 400 }
        )
      }
      updates.role = role
    }

    if (status) {
      if (!allowedStatuses.has(status)) {
        return NextResponse.json(
          { success: false, message: 'Invalid status' },
          { status: 400 }
        )
      }
      updates.status = status
    }

    if (name) {
      updates.name = name
    }

    if (email) {
      updates.email = email
    }

    if (password) {
      if (typeof password !== 'string' || password.length < 8) {
        return NextResponse.json(
          { success: false, message: 'Password must be at least 8 characters' },
          { status: 400 }
        )
      }
      const salt = crypto.randomBytes(16).toString('hex')
      updates.salt = salt
      updates.passwordHash = hashWithSalt(password, salt)
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No changes provided' },
        { status: 400 }
      )
    }

    await writeClient.patch(userId).set(updates).commit()

    const updatedUser = await client.fetch(
      '*[_type == "user" && _id == $id][0]{ _id, username, email, name, role, status, createdAt }',
      { id: userId }
    )

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    )
  }
}
