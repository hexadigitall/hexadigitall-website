import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const {
      serviceTitle,
      packageName,
      packagePrice,
      paymentPlan,
      downPayment,
      installments,
      currency
    } = await request.json()

    // Validate required fields
    if (!serviceTitle || !packageName || !packagePrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In a real implementation, you'd create a Stripe session here
    // For now, we'll redirect to a success page to avoid the error
    
    // Simulate checkout session creation
    const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    // For development, redirect directly to success page
    // In production, this would be the Stripe checkout URL
    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/services/request/success?session_id=${sessionId}&service=${encodeURIComponent(serviceTitle)}&package=${encodeURIComponent(packageName)}`
    
    return NextResponse.json({
      id: sessionId,
      url: successUrl
    })
    
  } catch (error) {
    console.error('Checkout session creation failed:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}