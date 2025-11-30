import { NextRequest, NextResponse } from 'next/server'

interface ServiceRequestBody {
  serviceId: string
  serviceName: string
  serviceType: 'tiered' | 'individual' | 'customizable'
  tier?: {
    _key: string
    name: string
    price: number
  }
  basePrice: number
  addOns?: Array<{ _key: string; name: string; price: number }>
  total: number
  customerInfo: {
    name: string
    email: string
    phone: string
    company?: string
    details?: string
  }
  currency: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ServiceRequestBody = await request.json()

    // Validate required fields
    if (!body.serviceId || !body.serviceName || !body.customerInfo.email) {
      return NextResponse.json(
        { message: 'Missing required fields: serviceId, serviceName, and email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.customerInfo.email)) {
      return NextResponse.json(
        { message: 'Invalid email address format' },
        { status: 400 }
      )
    }

    // Validate amount
    if (!body.total || body.total <= 0) {
      return NextResponse.json(
        { message: 'Invalid amount: must be greater than 0' },
        { status: 400 }
      )
    }

    // Accept all supported currencies
    const supportedCurrencies = ['USD', 'NGN', 'EUR', 'GBP', 'CAD', 'AUD', 'ZAR', 'KES', 'GHS', 'INR']
    if (!supportedCurrencies.includes(body.currency.toUpperCase())) {
      return NextResponse.json(
        { message: `Unsupported currency. Supported: ${supportedCurrencies.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate Paystack secret key
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      return NextResponse.json(
        { message: 'Payment provider not configured' },
        { status: 500 }
      )
    }

    // Use amount from frontend as-is (already converted by CurrencyContext)
    const totalAmount = body.total

    // Convert price to kobo for Paystack (Paystack uses lowest currency unit)
    // For NGN: 1 NGN = 100 kobo
    const amountInKobo = Math.round(totalAmount * 100)

    // Build metadata with service details
    const metadata = {
      serviceId: body.serviceId,
      serviceName: body.serviceName,
      serviceType: body.serviceType,
      tierName: body.tier?.name || 'N/A',
      tierKey: body.tier?._key || '',
      basePrice: body.basePrice.toString(),
      customerName: body.customerInfo.name,
      customerPhone: body.customerInfo.phone,
      customerCompany: body.customerInfo.company || '',
      customerDetails: body.customerInfo.details || '',
      addOns: body.addOns?.map(a => `${a.name} (${a.price})`).join(', ') || 'None',
      addOnCount: body.addOns?.length.toString() || '0',
      originalCurrency: body.currency.toUpperCase(),
    }

    // Get the origin for callback URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000'
    
    // Create Paystack transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.customerInfo.email,
        amount: amountInKobo,
        currency: 'NGN',
        callback_url: `${origin}/services/checkout-success`,
        metadata,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'], // All payment channels
      }),
    })

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json()
      console.error('Paystack error:', errorData)
      return NextResponse.json(
        { message: 'Failed to initialize payment', error: errorData },
        { status: 500 }
      )
    }

    const paystackData = await paystackResponse.json()

    if (!paystackData.status || !paystackData.data?.authorization_url) {
      return NextResponse.json(
        { message: 'Invalid response from payment provider' },
        { status: 500 }
      )
    }

    // Return the Paystack authorization URL
    return NextResponse.json({
      url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
      accessCode: paystackData.data.access_code,
    })
  } catch (error) {
    console.error('Service checkout error:', error)
    return NextResponse.json(
      { message: 'Internal server error', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
