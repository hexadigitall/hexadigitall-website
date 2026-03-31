import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { client, writeClient } from '@/sanity/client'

export async function POST() {
  const session = await auth()
  const email = session?.user?.email?.trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ success: false, message: 'No OAuth session found.' }, { status: 401 })
  }

  type DbUser = {
    _id: string
    username: string
    role: string
    status: string
    name?: string
    passwordHash?: string
    enrollmentCount?: number
  }

  const user = await client.fetch<DbUser | null>(
    `*[_type == "user" && email == $email][0]{
      _id, username, role, status, name, passwordHash,
      "enrollmentCount": count(*[_type == "enrollment" && references(^._id)])
    }`,
    { email }
  )

  if (!user) {
    return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 })
  }

  // Already a teacher — idempotent
  if (user.role === 'teacher') {
    return NextResponse.json({
      success: true,
      status: user.status,
      message: user.status === 'pending' ? 'Your application is already pending review.' : 'Account is already a teacher.',
    })
  }

  // Guard: don't convert students who have enrolled courses or a password set
  if (user.role === 'student') {
    if (user.enrollmentCount && user.enrollmentCount > 0) {
      return NextResponse.json(
        { success: false, message: 'This email already has a student account with active enrollments. Please use a different email to apply as a teacher.' },
        { status: 409 }
      )
    }
    if (user.passwordHash) {
      return NextResponse.json(
        { success: false, message: 'This email already has a student account with a password. Please use a different email to apply as a teacher.' },
        { status: 409 }
      )
    }
  }

  // Convert to teacher+pending
  await writeClient.patch(user._id).set({
    role: 'teacher',
    status: 'pending',
  }).commit()

  return NextResponse.json({ success: true, status: 'pending' })
}
