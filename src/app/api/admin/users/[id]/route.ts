import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { client, writeClient } from '@/sanity/client'
import { requireAdmin } from '@/lib/adminAuth'
import { emailService } from '@/lib/email'

const allowedRoles = new Set(['admin', 'teacher', 'student'])
const allowedStatuses = new Set(['active', 'suspended', 'pending'])

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
      '*[_type == "user" && _id == $id][0]{ _id, role, status, name, email }',
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

    // Notify teachers whenever admin approves (pending→active) or suspends their account.
    const effectiveRole = (role as string | undefined) ?? existing.role
    const isTeacherAccount = effectiveRole === 'teacher'
    const statusChanged = typeof status === 'string' && existing.status !== status
    if (
      isTeacherAccount &&
      statusChanged &&
      updatedUser?.email
    ) {
      const isApproved = status === 'active'
      const greetingName = updatedUser.name || updatedUser.username || 'there'

      const preferredFrom = process.env.FROM_EMAIL || (process.env.RESEND_API_KEY ? 'onboarding@resend.dev' : 'info@hexadigitall.com')
      const emailPayload = {
        to: updatedUser.email,
        from: preferredFrom,
        replyTo: process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'info@hexadigitall.com',
        subject: isApproved
          ? 'Your teacher account has been approved - Hexadigitall'
          : 'Your teacher account status was updated - Hexadigitall',
        html: isApproved
          ? `
            <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto;">
              <h2 style="color: #0A4D68; margin-bottom: 8px;">Your teacher account is approved</h2>
              <p style="color: #1f2937; font-size: 15px; line-height: 1.6;">
                Hello ${greetingName}, your teacher account has been approved by an administrator.
              </p>
              <p style="color: #1f2937; font-size: 15px; line-height: 1.6;">
                You can now sign in at <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.hexadigitall.com'}/teacher/login">Teacher Login</a>.
              </p>
            </div>
          `
          : `
            <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto;">
              <h2 style="color: #0A4D68; margin-bottom: 8px;">Teacher account status update</h2>
              <p style="color: #1f2937; font-size: 15px; line-height: 1.6;">
                Hello ${greetingName}, your teacher account is currently not active.
              </p>
              <p style="color: #1f2937; font-size: 15px; line-height: 1.6;">
                If you believe this is a mistake, please contact support.
              </p>
            </div>
          `,
      }

      let emailResult = await emailService.sendEmail(emailPayload)
      if (!emailResult.success && process.env.RESEND_API_KEY && preferredFrom !== 'onboarding@resend.dev') {
        emailResult = await emailService.sendEmail({
          ...emailPayload,
          from: 'onboarding@resend.dev',
        })
      }

      if (!emailResult.success) {
        console.error('Teacher status email failed:', emailResult.error)
      }
    }

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update user' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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
    const existing = await client.fetch(
      '*[_type == "user" && _id == $id][0]{ _id, username, role }',
      { id: userId }
    )

    if (!existing) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Prevent deleting yourself
    if (existing.username === auth.user.username) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    await writeClient.delete(userId)

    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to delete user' },
      { status: 500 }
    )
  }
}
