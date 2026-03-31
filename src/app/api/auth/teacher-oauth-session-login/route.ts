import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { auth } from '@/auth'
import { client } from '@/sanity/client'

type DbTeacher = {
  _id: string
  username: string
  role: string
  status: string
  name?: string
  email?: string
  profilePhotoUrl?: string
}

export async function POST() {
  const session = await auth()
  const email = session?.user?.email?.trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ success: false, message: 'No OAuth session found.' }, { status: 401 })
  }

  const user = await client.fetch<DbTeacher | null>(
    `*[_type == "user" && email == $email][0]{ _id, username, role, status, name, email, profilePhotoUrl }`,
    { email }
  )

  if (!user) {
    return NextResponse.json({ success: false, message: 'No teacher account found for this email. Please apply first.', notFound: true }, { status: 404 })
  }

  if (user.role !== 'teacher') {
    return NextResponse.json({ success: false, message: 'This email is registered as a student, not a teacher.' }, { status: 403 })
  }

  if (user.status === 'suspended') {
    return NextResponse.json({ success: false, message: 'Your account has been suspended. Please contact support.' }, { status: 403 })
  }

  if (user.status === 'pending') {
    return NextResponse.json({ success: false, pending: true, message: 'Your account is still pending administrator approval.' }, { status: 403 })
  }

  if (user.status !== 'active') {
    return NextResponse.json({ success: false, pending: true, message: 'Your account is not yet active.' }, { status: 403 })
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
    name: user.name,
    role: user.role,
    profilePhotoUrl: user.profilePhotoUrl,
  })

  response.cookies.set('admin_token', sessionToken, {
    path: '/',
    maxAge: 60 * 60 * 24,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: false,
  })

  return response
}
