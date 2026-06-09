import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { client, writeClient } from '@/sanity/client'

type VerificationUser = {
  _id: string
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')
  const loginUrl = new URL('/student/login', request.url)

  if (!token) {
    loginUrl.searchParams.set('verified', '0')
    return NextResponse.redirect(loginUrl)
  }

  try {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const nowIso = new Date().toISOString()

    const user = await client.fetch<VerificationUser | null>(
      `*[_type == "user" && emailVerificationTokenHash == $tokenHash && dateTime(emailVerificationExpiresAt) > dateTime($nowIso)][0]{ _id }`,
      { tokenHash, nowIso }
    )

    if (!user?._id) {
      loginUrl.searchParams.set('verified', '0')
      return NextResponse.redirect(loginUrl)
    }

    await writeClient
      .patch(user._id)
      .set({
        emailVerified: true,
        emailVerifiedAt: new Date().toISOString(),
      })
      .unset(['emailVerificationTokenHash', 'emailVerificationExpiresAt'])
      .commit()

    loginUrl.searchParams.set('verified', '1')
    return NextResponse.redirect(loginUrl)
  } catch (error) {
    console.error('Email verification error:', error)
    loginUrl.searchParams.set('verified', '0')
    return NextResponse.redirect(loginUrl)
  }
}
