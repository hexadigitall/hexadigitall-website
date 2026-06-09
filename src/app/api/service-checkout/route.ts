import { NextRequest, NextResponse } from 'next/server'

// Exchange rates from USD (same as in currency.ts)
// These should ideally be fetched from an API for accuracy
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  NGN: 1650,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.36,
  AUD: 1.53,
  ZAR: 18.5,
  KES: 129,
  GHS: 15.8,
  INR: 83.2,
}

// Convert any currency amount to NGN
function convertToNGN(amount: number, fromCurrency: string): number {
  const fromRate = EXCHANGE_RATES[fromCurrency.toUpperCase()] || 1
  const ngnRate = EXCHANGE_RATES.NGN
  
  // Convert to USD first, then to NGN
  // amount / fromRate = amount in USD
  // (amount / fromRate) * ngnRate = amount in NGN
  const amountInUSD = amount / fromRate
  const amountInNGN = amountInUSD * ngnRate
  
  return Math.round(amountInNGN)
}

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

    // Get the currency from the request
    const userCurrency = body.currency.toUpperCase()
    const totalAmount = body.total

    // Convert to NGN if not already in NGN (Paystack only accepts NGN)
    let amountInNGN: number
    if (userCurrency === 'NGN') {
      amountInNGN = Math.round(totalAmount)
    } else {
      amountInNGN = convertToNGN(totalAmount, userCurrency)
    }

    // Convert to kobo for Paystack (1 NGN = 100 kobo)
    const amountInKobo = amountInNGN * 100

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
      originalCurrency: userCurrency,
      originalAmount: totalAmount.toString(),
      convertedNGN: amountInNGN.toString(),
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
