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
      if (user.status === 'pending') {
        return NextResponse.json({
          success: true,
          status: 'pending',
          message: 'Your application has already been submitted and is pending administrator approval. You will receive an email when your account is approved.',
        })
      }

      if (user.status === 'active') {
        return NextResponse.json({
          success: false,
          exists: true,
          status: 'active',
          message: 'A teacher account with this email already exists. Sign in instead or use a different Google or GitHub account.',
        }, { status: 409 })
      }

    `*[_type == "user" && email == $email][0]{
        success: false,
        exists: true,
      "enrollmentCount": count(*[_type == "enrollment" && references(^._id)])
        message: 'This teacher account already exists but is not available for sign in. Please contact support.',
      }, { status: 403 })
  )

    return NextResponse.json({ success: false, message: 'Account not found.' }, { status: 404 })
  }
        {
          success: false,
          exists: true,
          status: 'active',
          message: 'An account with this email already exists. Sign in instead or use a different Google or GitHub account to apply as a teacher.',
        },
      message: user.status === 'pending' ? 'Your application is already pending review.' : 'Account is already a teacher.',
    })
  }

  if (user.role === 'student') {
    if (user.enrollmentCount && user.enrollmentCount > 0) {
      return NextResponse.json(
        { success: false, message: 'This email already has a student account with active enrollments. Please use a different email to apply as a teacher.' },
        { status: 409 }
    return NextResponse.json({
      success: true,
      status: 'pending',
      message: 'Your application has been submitted and is now pending administrator approval. You will receive an email when your account is approved.',
    })
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
