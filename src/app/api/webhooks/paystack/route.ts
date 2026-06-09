import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import {
  createUser,
  getUserByEmail,
  createEnrollment,
  getEnrollmentByEmailAndCourse,
  updateEnrollmentRenewal,
} from '@/lib/sanity-server'
import {
  hashPassword,
  generateTemporaryPassword,
} from '@/lib/auth'
import { emailService } from '@/lib/email'

interface PaymentData {
  reference: string
  amount: number
  currency: string
  customer: {
    email: string
    customer_code: string
  }
  metadata?: {
    courseId: string
    courseType: string
    studentName: string
    studentPhone: string
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the Paystack secret key
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      console.error('PAYSTACK_SECRET_KEY not configured')
      return NextResponse.json(
        { message: 'Webhook not configured' },
        { status: 500 }
      )
    }

    // Read the request body once
    const body = await request.text()
    const event = JSON.parse(body)

    // Verify the webhook signature
    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(body)
      .digest('hex')

    const paystackSignature = request.headers.get('x-paystack-signature')

    if (hash !== paystackSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data)
        break

      case 'charge.failed':
        await handleChargeFailed(event.data)
        break

      default:
        console.log('Unhandled event type:', event.event)
    }

    // Return 200 OK to acknowledge receipt
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { message: 'Webhook handler failed', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

/**
 * Handle successful charge
 */
async function handleChargeSuccess(paymentData: PaymentData) {
  try {
    const reference = paymentData.reference
    const amount = paymentData.amount / 100 // Convert from kobo to naira
    const email = paymentData.customer.email
     const metadata = (paymentData.metadata || {}) as {
       courseId?: string
       courseType?: string
       studentName?: string
       studentPhone?: string
     }

    console.log('Processing charge.success:', {
      reference,
      amount,
      email,
      metadata,
    })

    // Extract metadata
    const courseId = metadata.courseId
    const courseType = metadata.courseType || 'self-paced'
    const studentName = metadata.studentName || paymentData.customer.customer_code
    const studentPhone = metadata.studentPhone || ''

    if (!courseId) {
      console.error('No courseId in metadata')
      return
    }

    // Check if user exists
    let user = await getUserByEmail(email)

    // If user doesn't exist, create one
    if (!user) {
      console.log(`Creating new user for ${email}`)
      const tempPassword = generateTemporaryPassword()
      const { hash, salt } = hashPassword(tempPassword)

      user = await createUser({
        email,
        name: studentName,
        passwordHash: hash,
        salt,
        role: 'student',
        username: email.split('@')[0],
      })

      // Send welcome email with credentials
      try {
        await emailService.sendEmail({
          to: email,
          subject: 'Welcome to HexaDigital - Your Login Credentials',
          html: `
            <h2>Welcome to HexaDigital!</h2>
            <p>Your account has been created. Use the following credentials to log in:</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
            <p>Please change your password after your first login.</p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/student/login">Log in here</a></p>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError)
        // Continue anyway, error is not critical
      }
    }

    // Check if enrollment already exists for this course
    const existingEnrollment = await getEnrollmentByEmailAndCourse(email, courseId)

    // Calculate expiry date (30 days from now for monthly plan)
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + 30)

    if (existingEnrollment) {
      // This is a renewal - update existing enrollment
      console.log(`Renewing enrollment for ${email}`)
      await updateEnrollmentRenewal(existingEnrollment._id, {
        expiryDate: expiryDate.toISOString(),
        paystackReference: reference,
        amount,
        paymentStatus: 'active',
      })
    } else {
      // This is a new enrollment - create it
      console.log(`Creating new enrollment for ${email}`)
      const enrollment = await createEnrollment({
        courseId,
        studentId: user._id,
        studentName,
        studentEmail: email,
        studentPhone,
        courseType: (courseType || 'self-paced') as 'self-paced' | 'live',
        amount,
        currency: paymentData.currency || 'NGN',
        paymentStatus: 'active',
        paystackReference: reference,
        expiryDate: expiryDate.toISOString(),
      })

      console.log('Enrollment created:', enrollment._id)
    }

    // Send payment confirmation email
    try {
      await emailService.sendEmail({
        to: email,
        subject: 'Payment Successful - Course Enrollment Confirmed',
        html: `
          <h2>Payment Confirmed!</h2>
          <p>Your payment of ₦${amount.toLocaleString()} has been received successfully.</p>
          <p>Your course access is now active and will expire on ${expiryDate.toLocaleDateString()}.</p>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/student/dashboard">View your dashboard</a></p>
        `,
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
    }
  } catch (error) {
    console.error('Error handling charge.success:', error)
    throw error
  }
}

/**
 * Handle failed charge
 */
async function handleChargeFailed(paymentData: PaymentData) {
  try {
    const reference = paymentData.reference
    const email = paymentData.customer?.email

    console.log('Payment failed:', {
      reference,
      email,
    })

    // Send failure notification email
    if (email) {
      try {
        await emailService.sendEmail({
          to: email,
          subject: 'Payment Failed - Please Try Again',
          html: `
            <h2>Payment Failed</h2>
            <p>We were unable to process your payment. Please try again.</p>
            <p>If you continue experiencing issues, please contact our support team.</p>
            <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}">Return to website</a></p>
          `,
        })
      } catch (emailError) {
        console.error('Failed to send failure email:', emailError)
      }
    }
  } catch (error) {
    console.error('Error handling charge.failed:', error)
  }
}
