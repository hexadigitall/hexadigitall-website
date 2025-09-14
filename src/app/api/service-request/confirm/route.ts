// src/app/api/service-request/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { client } from '@/sanity/client'
import { emailService } from '@/lib/email'
import { ServiceInquiryData } from '@/lib/email-types'

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
    const stripe = getStripe()
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

    // Send service inquiry confirmation emails
    try {
      const serviceData: ServiceInquiryData = {
        clientName: `${serviceRequest.clientInfo.firstName} ${serviceRequest.clientInfo.lastName}`,
        clientEmail: serviceRequest.clientInfo.email,
        serviceName: session.metadata?.serviceCategory || 'Service',
        packageName: serviceRequest.selectedPackage?.name || 'Package',
        packagePrice: serviceRequest.selectedPackage?.price || 0,
        paymentPlan: 'Full Payment', // For now, assuming full payment
        inquiryId: requestId
      };

      const emailResult = await emailService.sendServiceInquiryEmails(serviceData);
      if (!emailResult.success) {
        console.error('Failed to send service inquiry emails:', emailResult.error);
        // Don't fail the confirmation, just log the error
      } else {
        console.log('Service inquiry emails sent successfully:', emailResult.message);
      }
    } catch (emailError) {
      console.error('Email service error:', emailError);
      // Continue with confirmation success even if email fails
    }

    return NextResponse.json({
      success: true,
      serviceRequest: updatedRequest,
      message: 'Payment confirmed and project initiated. Confirmation emails have been sent.'
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

interface SelectedPackage {
  tier: string;
}

function getEstimatedCompletionDate(selectedPackage: SelectedPackage): string {
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
