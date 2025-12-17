import { NextRequest, NextResponse } from 'next/server'
import { client, writeClient } from '@/sanity/client'

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  try {
    const token = authHeader.substring(7)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    
    const hoursSinceLogin = (Date.now() - decoded.timestamp) / (1000 * 60 * 60)
    if (hoursSinceLogin >= 24) {
      return null
    }

    // Verify user still exists and is active
    if (decoded.userId) {
      const user = await client.fetch(
        `*[_type == "user" && _id == $id][0]{_id, username, role, status}`,
        { id: decoded.userId }
      )
      if (!user || user.status === 'suspended') {
        return null
      }
      return user
    }

    return decoded
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    
    if (!user || (user.role !== 'student' && user.role !== 'admin')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { enrollmentId, amount, currency } = await request.json()

    if (!enrollmentId || !amount) {
      return NextResponse.json(
        { success: false, message: 'Enrollment ID and amount required' },
        { status: 400 }
      )
    }

    const userId = user._id || user.userId

    // Verify enrollment belongs to this student
    const enrollment = await client.fetch(
      `*[_type == "enrollment" && _id == $enrollmentId && studentId._ref == $userId][0]{
        _id,
        courseId->{title},
        monthlyAmount,
        status,
        courseType
      }`,
      { enrollmentId, userId }
    )

    if (!enrollment) {
      return NextResponse.json(
        { success: false, message: 'Enrollment not found or access denied' },
        { status: 404 }
      )
    }

    if (enrollment.courseType !== 'live') {
      return NextResponse.json(
        { success: false, message: 'Only live courses require monthly payments' },
        { status: 400 }
      )
    }

    // TODO: Integrate with Paystack or Flutterwave
    // For now, simulate payment initiation
    const reference = `PAY-${enrollmentId.substring(0, 8)}-${Date.now()}`
    const paystackUrl = process.env.PAYSTACK_PUBLIC_KEY 
      ? `https://checkout.paystack.com/${reference}` 
      : null

    // Return payment details
    return NextResponse.json({
      success: true,
      message: paystackUrl 
        ? 'Payment link generated. Redirecting to payment gateway...'
        : 'Payment integration pending. Contact admin to enable Paystack.',
      paymentUrl: paystackUrl || '#',
      reference,
      enrollment: {
        id: enrollment._id,
        course: enrollment.courseId?.title,
        amount: enrollment.monthlyAmount || amount,
        currency: currency || 'NGN',
      },
      // Instructions for completing integration
      integrationNote: !paystackUrl ? 'Add PAYSTACK_PUBLIC_KEY to environment variables' : undefined,
    })
  } catch (error) {
    console.error('Failed to initiate renewal:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
}
