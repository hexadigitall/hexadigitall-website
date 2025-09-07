import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { client } from '@/sanity/client'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      serviceCategory,
      selectedPackage,
      selectedAddOns = [],
      clientInfo,
      projectDetails
    } = body

    // Validate required fields
    if (!serviceCategory || !selectedPackage || !clientInfo || !projectDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate total amount
    const packagePrice = selectedPackage.price || 0
    const addOnTotal = selectedAddOns.reduce((sum: number, addOn: any) => sum + (addOn.price || 0), 0)
    const totalAmount = packagePrice + addOnTotal

    // Generate unique request ID
    const requestId = `SR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Create service request in Sanity
    const serviceRequestDoc = {
      _type: 'serviceRequest',
      requestId,
      status: 'pending_payment',
      priority: 'medium',
      serviceCategory: {
        _type: 'reference',
        _ref: serviceCategory._id
      },
      selectedPackage,
      selectedAddOns,
      totalAmount,
      clientInfo,
      projectDetails,
      paymentInfo: {
        paymentStatus: 'pending'
      }
    }

    const createdRequest = await client.create(serviceRequestDoc)

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: selectedPackage.currency?.toLowerCase() || 'usd',
            product_data: {
              name: `${serviceCategory.title} - ${selectedPackage.name}`,
              description: projectDetails.description,
              metadata: {
                serviceType: 'service_request',
                requestId: requestId,
                serviceCategory: serviceCategory.title,
                package: selectedPackage.name
              }
            },
            unit_amount: Math.round(packagePrice * 100), // Convert to cents
          },
          quantity: 1,
        },
        // Add line items for add-ons
        ...selectedAddOns.map((addOn: any) => ({
          price_data: {
            currency: selectedPackage.currency?.toLowerCase() || 'usd',
            product_data: {
              name: `Add-on: ${addOn.name}`,
              description: addOn.description || '',
              metadata: {
                serviceType: 'service_addon',
                requestId: requestId,
                addonName: addOn.name
              }
            },
            unit_amount: Math.round((addOn.price || 0) * 100),
          },
          quantity: 1,
        }))
      ],
      metadata: {
        requestId: requestId,
        serviceRequestId: createdRequest._id,
        clientEmail: clientInfo.email,
        serviceCategory: serviceCategory.title,
        packageName: selectedPackage.name
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/request/success?session_id={CHECKOUT_SESSION_ID}&request_id=${requestId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/services/${serviceCategory.slug?.current}?cancelled=true`,
      customer_email: clientInfo.email,
      billing_address_collection: 'required',
    })

    // Update service request with checkout session ID
    await client
      .patch(createdRequest._id)
      .set({
        'paymentInfo.stripeCheckoutSessionId': checkoutSession.id
      })
      .commit()

    return NextResponse.json({
      success: true,
      requestId,
      checkoutUrl: checkoutSession.url,
      sessionId: checkoutSession.id
    })

  } catch (error) {
    console.error('Service request creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create service request' },
      { status: 500 }
    )
  }
}
