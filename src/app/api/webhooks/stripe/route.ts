import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { writeClient } from '@/sanity/client'
import { groq } from 'next-sanity'
import Stripe from 'stripe'

const stripe = getStripe()
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

if (!webhookSecret) {
  console.warn('⚠️ Stripe webhook secret is not configured. Webhook verification will fail.')
}

interface WebhookBody {
  id: string
  object: string
  created: number
  data: {
    object: Stripe.Checkout.Session | Stripe.PaymentIntent
  }
  type: string
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('❌ Missing Stripe signature')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error) {
    console.error('❌ Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log(`🎉 Received Stripe webhook: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'checkout.session.async_payment_succeeded':
        await handleAsyncPaymentSucceeded(event.data.object as Stripe.Checkout.Session)
        break

      case 'checkout.session.async_payment_failed':
        await handleAsyncPaymentFailed(event.data.object as Stripe.Checkout.Session)
        break

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case 'invoice.payment_succeeded':
        // Handle subscription payments if you add them later
        console.log('📄 Invoice payment succeeded:', event.data.object)
        break

      case 'customer.created':
        // Handle new customer creation
        console.log('👤 New customer created:', event.data.object)
        break

      default:
        console.log(`⚪ Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(`💥 Error processing webhook ${event.type}:`, error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('✅ Checkout session completed:', session.id)

  if (session.payment_status === 'paid') {
    await processSuccessfulPayment(session)
  } else if (session.payment_status === 'unpaid') {
    // Handle async payment methods (bank transfers, etc.)
    console.log('⏳ Payment is pending for session:', session.id)
    await updatePaymentStatus(session.id, 'pending')
  }
}

async function handleAsyncPaymentSucceeded(session: Stripe.Checkout.Session) {
  console.log('✅ Async payment succeeded:', session.id)
  await processSuccessfulPayment(session)
}

async function handleAsyncPaymentFailed(session: Stripe.Checkout.Session) {
  console.log('❌ Async payment failed:', session.id)
  await updatePaymentStatus(session.id, 'failed')
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log('✅ Payment intent succeeded:', paymentIntent.id)
  
  // Find associated checkout session
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent.id,
    limit: 1,
  })

  if (sessions.data.length > 0) {
    await processSuccessfulPayment(sessions.data[0])
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log('❌ Payment intent failed:', paymentIntent.id)
  
  // Find associated checkout session and update status
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent.id,
    limit: 1,
  })

  if (sessions.data.length > 0) {
    await updatePaymentStatus(sessions.data[0].id, 'failed')
  }
}

async function processSuccessfulPayment(session: Stripe.Checkout.Session) {
  const { metadata } = session

  if (!metadata) {
    console.error('❌ No metadata found in session:', session.id)
    return
  }

  try {
    if (metadata.type === 'course_enrollment') {
      await processEnrollmentPayment(session)
    } else if (metadata.order_type === 'course_purchase') {
      await processCoursesPurchase(session)
    } else {
      console.warn('⚠️ Unknown payment type:', metadata)
    }
  } catch (error) {
    console.error('💥 Error processing successful payment:', error)
    // You might want to send this to an error tracking service
    throw error
  }
}

async function processEnrollmentPayment(session: Stripe.Checkout.Session) {
  const { 
    courseId, 
    studentEmail, 
    studentName, 
    studentPhone, 
    experience, 
    goals 
  } = session.metadata!

  console.log('🎓 Processing course enrollment for:', studentEmail)

  // Find and update pending enrollment
  const pendingEnrollment = await writeClient.fetch(
    groq`*[_type == "pendingEnrollment" && stripeSessionId == $sessionId][0]`,
    { sessionId: session.id }
  )

  if (!pendingEnrollment) {
    console.error('❌ Pending enrollment not found for session:', session.id)
    return
  }

  // Create confirmed enrollment
  const enrollment = await writeClient.create({
    _type: 'enrollment',
    courseId: {
      _type: 'reference',
      _ref: courseId,
    },
    studentName,
    studentEmail,
    studentPhone,
    experience: experience || undefined,
    goals: goals || undefined,
    enrolledAt: new Date().toISOString(),
    paymentStatus: 'completed',
    stripeSessionId: session.id,
    stripeCustomerId: session.customer as string,
    amount: session.amount_total,
    currency: session.currency,
  })

  // Delete pending enrollment
  await writeClient.delete(pendingEnrollment._id)

  console.log('✅ Enrollment created:', enrollment._id)

  // TODO: Send welcome email
  // TODO: Add to learning platform
  // TODO: Send course access details
}

async function processCoursesPurchase(session: Stripe.Checkout.Session) {
  const courseIds = session.metadata!.course_ids.split(',')
  console.log('🛒 Processing courses purchase:', courseIds)

  // Create purchase record
  const purchase = await writeClient.create({
    _type: 'purchase',
    courses: courseIds.map(id => ({
      _type: 'reference',
      _ref: id,
    })),
    customerEmail: session.customer_details?.email,
    customerName: session.customer_details?.name,
    stripeSessionId: session.id,
    stripeCustomerId: session.customer as string,
    amount: session.amount_total,
    currency: session.currency,
    purchasedAt: new Date().toISOString(),
    paymentStatus: 'completed',
  })

  console.log('✅ Purchase created:', purchase._id)

  // TODO: Send purchase confirmation email
  // TODO: Provide course access
}

async function updatePaymentStatus(sessionId: string, status: 'pending' | 'failed') {
  // Find pending enrollment or purchase and update status
  const pendingEnrollment = await writeClient.fetch(
    groq`*[_type == "pendingEnrollment" && stripeSessionId == $sessionId][0]`,
    { sessionId }
  )

  if (pendingEnrollment) {
    await writeClient.patch(pendingEnrollment._id).set({ status }).commit()
    console.log(`✅ Updated pending enrollment status to: ${status}`)
  }

  // You can also update purchase records similarly
}
