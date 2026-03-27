import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { client, writeClient } from '@/sanity/client'
import { emailService } from '@/lib/email'

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

function createVerificationToken() {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  return { rawToken, tokenHash, expiresAt }
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
    const { rawToken, tokenHash, expiresAt } = createVerificationToken()

    await writeClient.create({
      _type: 'user',
      name: name.trim(),
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      role,
      passwordHash,
      salt,
      status,
      emailVerified: false,
      emailVerificationTokenHash: tokenHash,
      emailVerificationExpiresAt: expiresAt,
      createdAt: new Date().toISOString(),
    })

    const origin = new URL(request.url).origin
    const verificationUrl = `${origin}/api/auth/verify-email?token=${rawToken}`

    const emailResult = await emailService.sendEmail({
      to: email.trim().toLowerCase(),
      from: process.env.FROM_EMAIL || 'info@hexadigitall.com',
      replyTo: process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'info@hexadigitall.com',
      subject: 'Verify your email address - Hexadigitall',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto;">
          <h2 style="color: #0A4D68; margin-bottom: 8px;">Verify your email address</h2>
          <p style="color: #1f2937; font-size: 15px; line-height: 1.6;">
            Hello ${name.trim()}, please verify your email to activate sign in for your Hexadigitall account.
          </p>
          <p style="margin: 24px 0;">
            <a href="${verificationUrl}" style="background: #0A4D68; color: #ffffff; text-decoration: none; padding: 12px 18px; border-radius: 8px; display: inline-block; font-weight: 600;">
              Verify Email
            </a>
          </p>
          <p style="color: #6b7280; font-size: 13px; line-height: 1.5;">
            This link expires in 24 hours. If you did not create this account, you can safely ignore this message.
          </p>
        </div>
      `,
    })

    if (!emailResult.success) {
      console.error('Verification email send failed:', emailResult.error)
    }

    return NextResponse.json({
      success: true,
      requiresEmailVerification: true,
      status,
      message: role === 'teacher'
        ? 'Your teacher account was created. Verify your email first, then wait for administrator approval.'
        : 'Account created. Check your email and verify before signing in.',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
