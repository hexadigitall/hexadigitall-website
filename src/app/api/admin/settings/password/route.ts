import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { client } from '@/sanity/client'

function hashWithSalt(password: string, salt: string) {
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}

async function getUserByUsername(username: string) {
  return client.fetch(`*[_type == "user" && username == $username][0]{ _id, username, role, status }`, { username })
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    let decoded: { userId?: string; username?: string; role?: string; timestamp?: number }
    try {
      decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, message: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Determine user to update
    const userId = decoded.userId as string | undefined
    const username = decoded.username as string | undefined

    // If token has userId, verify identity and role
    if (userId) {
      const user = await client.fetch(`*[_type == "user" && _id == $id][0]{ _id, username, role, status, salt, passwordHash }`, { id: userId })
      if (!user || user.status === 'suspended') {
        return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
      }
      if (user.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
      }
      // Verify current password if provided
      if (user.passwordHash && user.salt && currentPassword) {
        const ok = hashWithSalt(currentPassword, user.salt) === user.passwordHash
        if (!ok) {
          return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 })
        }
      }

      const newSalt = crypto.randomBytes(16).toString('hex')
      const newHash = hashWithSalt(newPassword, newSalt)

      await client.patch(userId).set({ salt: newSalt, passwordHash: newHash }).commit()
      return NextResponse.json({ success: true })
    }

    // Legacy env-admin token path: bootstrap admin user
    if (username && (decoded.role === 'admin' || username === (process.env.ADMIN_USERNAME || 'admin'))) {
      // Upsert user by username
      const existing = await getUserByUsername(username)
      const newSalt = crypto.randomBytes(16).toString('hex')
      const newHash = hashWithSalt(newPassword, newSalt)

      if (existing?._id) {
        await client.patch(existing._id).set({ role: 'admin', status: 'active', salt: newSalt, passwordHash: newHash }).commit()
        return NextResponse.json({ success: true })
      } else {
        await client.create({
          _type: 'user',
          username,
          email: `${username}@example.com`,
          name: 'Administrator',
          role: 'admin',
          status: 'active',
          salt: newSalt,
          passwordHash: newHash,
          createdAt: new Date().toISOString(),
        })
        return NextResponse.json({ success: true, bootstrapped: true })
      }
    }

    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json({ success: false, message: 'Failed to change password' }, { status: 500 })
  }
}
