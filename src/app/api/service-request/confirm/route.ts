import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/sanity/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, requestId } = body

    if (!sessionId || !requestId) {
      return NextResponse.json(
        { error: 'Missing session ID or request ID' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Find the service request by request ID
    const query = `*[_type == "serviceRequest" && requestId == $requestId][0]`
    const serviceRequest = await client.fetch(query, { requestId })

    if (!serviceRequest) {
      return NextResponse.json(
        { error: 'Service request not found' },
        { status: 404 }
      )
    }

    // Update the service request with payment confirmation
    const updatedRequest = await client
      .patch(serviceRequest._id)
      .set({
        status: 'payment_confirmed',
        'paymentInfo.paymentStatus': 'succeeded',
        'paymentInfo.stripePaymentIntentId': session.payment_intent,
        'paymentInfo.paidAt': new Date().toISOString(),
        'timeline.estimatedStartDate': getEstimatedStartDate(),
        'timeline.estimatedCompletionDate': getEstimatedCompletionDate(serviceRequest.selectedPackage)
      })
      .commit()

    // Add initial project update
    await client
      .patch(serviceRequest._id)
      .setIfMissing({ updates: [] })
      .insert('after', 'updates[-1]', [
        {
          _key: `update-${Date.now()}`,
          date: new Date().toISOString(),
          title: 'Payment Confirmed - Project Initiated',
          description: `We've received your payment and your project has been added to our queue. Our team will review your requirements and get in touch within 24 hours to discuss the next steps.`,
          author: 'Hexadigitall Team',
          clientVisible: true
        }
      ])
      .commit()

    return NextResponse.json({
      success: true,
      serviceRequest: updatedRequest,
      message: 'Payment confirmed and project initiated'
    })

  } catch (error) {
    console.error('Service request confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm service request' },
      { status: 500 }
    )
  }
}

function getEstimatedStartDate(): string {
  // Start date is typically 2-3 business days after payment
  const startDate = new Date()
  startDate.setDate(startDate.getDate() + 3)
  return startDate.toISOString().split('T')[0] // Return just the date part
}

function getEstimatedCompletionDate(selectedPackage: any): string {
  const completionDate = new Date()
  
  // Estimate completion time based on package tier
  let daysToAdd = 14 // Default 2 weeks
  
  switch (selectedPackage.tier) {
    case 'basic':
      daysToAdd = 7 // 1 week
      break
    case 'standard':
      daysToAdd = 14 // 2 weeks
      break
    case 'premium':
      daysToAdd = 21 // 3 weeks
      break
    case 'enterprise':
      daysToAdd = 30 // 1 month
      break
  }
  
  completionDate.setDate(completionDate.getDate() + daysToAdd)
  return completionDate.toISOString().split('T')[0]
}
