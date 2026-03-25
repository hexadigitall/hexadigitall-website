import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { client, writeClient } from '@/sanity/client'

async function getUserByUsernameOrEmail(username: string, email: string) {
  const query = `*[_type == "user" && (username == $username || email == $email)][0]{ _id, username, email }`
  return client.fetch(query, { username, email })
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex')
}

function hashWithSalt(password: string, salt: string): string {
  return crypto.createHash('sha256').update(password + salt).digest('hex')
}

export async function POST(request: NextRequest) {
  try {
    const { name, username, email, password, role } = await request.json()

    // Validate inputs
    if (!name || !username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      )
    }

    if (!['student', 'teacher'].includes(role)) {
      return NextResponse.json(
        { success: false, message: 'Invalid role.' },
        { status: 400 }
      )
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Password strength: minimum 8 characters
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters.' },
        { status: 400 }
      )
    }

    // Username: alphanumeric + underscores only
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      return NextResponse.json(
        { success: false, message: 'Username must be 3–30 characters and contain only letters, numbers, or underscores.' },
        { status: 400 }
      )
    }

    // Check for existing user
    const existing = await getUserByUsernameOrEmail(username, email)
    if (existing) {
      const conflict = existing.username === username ? 'username' : 'email address'
      return NextResponse.json(
        { success: false, message: `That ${conflict} is already registered.` },
        { status: 409 }
      )
    }

    // Hash password
    const salt = generateSalt()
    const passwordHash = hashWithSalt(password, salt)

    // Students are active immediately; teachers require admin approval
    const status = role === 'teacher' ? 'pending' : 'active'

    await writeClient.create({
      _type: 'user',
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      role,
      passwordHash,
      salt,
      status,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      status,
      message: role === 'teacher'
        ? 'Your teacher account has been submitted for approval. You will be notified once an administrator approves your account.'
        : 'Account created successfully. You can now sign in.',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
