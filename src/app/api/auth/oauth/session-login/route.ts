import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { auth } from '@/auth'
import { client } from '@/sanity/client'

type DbUser = {
  _id: string
  username: string
  role: 'student' | 'teacher' | 'admin'
  status?: 'active' | 'pending' | 'suspended'
  name?: string
  email?: string
  emailVerified?: boolean
  profilePhotoUrl?: string
}

export async function POST() {
  const session = await auth()
  const email = session?.user?.email?.trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ success: false, message: 'No OAuth session found.' }, { status: 401 })
  }

  const user = await client.fetch<DbUser | null>(
    `*[_type == "user" && email == $email][0]{ _id, username, role, status, name, email, emailVerified, profilePhotoUrl }`,
    { email }
  )

  if (!user) {
    return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 })
  }

  if (user.status === 'suspended') {
    return NextResponse.json({ success: false, message: 'Your account has been suspended.' }, { status: 403 })
  }

  if (user.role === 'teacher') {
    return NextResponse.json({ success: false, message: 'Teacher accounts cannot sign in through student OAuth.' }, { status: 403 })
  }

  if (user.emailVerified === false) {
    return NextResponse.json({ success: false, message: 'Please verify your email before signing in.' }, { status: 403 })
  }

  const sessionToken = Buffer.from(JSON.stringify({
    token: crypto.randomBytes(32).toString('hex'),
    userId: user._id,
    username: user.username,
    role: user.role,
    timestamp: Date.now(),
  })).toString('base64')

  const response = NextResponse.json({
    success: true,
    token: sessionToken,
    userId: user._id,
    username: user.username,
    role: user.role,
    name: user.name,
    email: user.email,    profilePhotoUrl: user.profilePhotoUrl,  })

  response.cookies.set('admin_token', sessionToken, {
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
  })

  return response
}
