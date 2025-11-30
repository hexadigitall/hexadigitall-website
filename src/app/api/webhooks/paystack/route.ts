import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Get the Paystack secret key
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
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
      return NextResponse.json(
        { message: 'Invalid signature' },
        { status: 401 }
      )
    }

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        // Payment was successful
        const paymentData = event.data
        
        console.log('Payment successful:', {
          reference: paymentData.reference,
          amount: paymentData.amount / 100, // Convert from kobo to naira
          customer: paymentData.customer.email,
          metadata: paymentData.metadata,
        })

        // TODO: Store order in your database
        // TODO: Send confirmation email to customer
        // TODO: Notify your team

        break

      case 'charge.failed':
        // Payment failed
        console.log('Payment failed:', event.data.reference)
        // TODO: Handle failed payment
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
