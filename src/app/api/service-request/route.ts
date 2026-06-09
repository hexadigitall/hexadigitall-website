// src/app/api/service-request/route.ts
import { NextRequest, NextResponse } from 'next/server'

// Exchange rates for currency conversion (same as src/lib/currency.ts)
// Paystack only accepts NGN, so we need to convert all currencies to NGN
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

// Convert any currency amount to NGN for Paystack
function convertToNGN(amount: number, fromCurrency: string): number {
  if (fromCurrency === 'NGN') {
    return amount
  }
  // Convert to USD first, then to NGN
  const usdRate = EXCHANGE_RATES[fromCurrency] || 1
  const amountInUSD = amount / usdRate
  return amountInUSD * EXCHANGE_RATES['NGN']
}

// Type definitions
interface AddOn {
  _key: string;
  name: string;
  price: number;
  description?: string;
}

// Type definitions - commented out unused interfaces to resolve linting warnings
// interface ServiceCategory {
//   _id: string;
//   title: string;
//   slug?: { current: string };
// }

// interface Package {
//   name: string;
//   price: number;
//   currency?: string;
//   tier: string;
// }

// interface ClientInfo {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone?: string;
//   company?: string;
//   address?: string;
// }

// interface ProjectDetails {
//   title: string;
//   description: string;
//   requirements?: string;
//   timeline?: string;
//   budget?: string;
// }

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
    if (!serviceCategory || !selectedPackage || !clientInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!clientInfo.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(clientInfo.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get currency from request
    const requestCurrency = body.currency || 'NGN'
    
    // Calculate total amount - use amount from frontend as-is (already converted by CurrencyContext)
    const totalAmount = body.totalAmount || 0

    // Convert to NGN for Paystack (Paystack only supports NGN)
    const amountInNGN = convertToNGN(totalAmount, requestCurrency.toUpperCase())

    // Generate unique request ID
    const requestId = `SR-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`

    // Note: Sanity document is created via webhook after successful payment confirmation
    // This ensures data consistency and proper transaction tracking

    // Validate Paystack secret key
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      return NextResponse.json(
        { error: 'Payment provider not configured' },
        { status: 500 }
      )
    }

    // Convert price to kobo for Paystack (Paystack uses lowest currency unit)
    // Amount is now in NGN, multiply by 100 to get kobo
    const amountInKobo = Math.round(amountInNGN * 100)

    // Validate amount is positive
    if (amountInKobo <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount: must be greater than 0' },
        { status: 400 }
      )
    }

    // Get the origin for callback URLs
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // Build metadata with service details
    const metadata = {
      requestId: requestId,
      serviceType: 'service_request',
      serviceCategory: serviceCategory.title || 'Service',
      serviceCategoryId: serviceCategory._id || 'unknown',
      packageName: selectedPackage.name,
      packageTier: selectedPackage.tier,
      packagePrice: selectedPackage.price?.toString() || totalAmount.toString(),
      addOnsCount: selectedAddOns.length.toString(),
      addOns: selectedAddOns.map((a: AddOn) => `${a.name} (${a.price})`).join(', ') || 'None',
      customerName: clientInfo.name || (clientInfo.firstName && clientInfo.lastName ? clientInfo.firstName + ' ' + clientInfo.lastName : 'Customer'),
      customerEmail: clientInfo.email,
      customerPhone: clientInfo.phone || '',
      customerCompany: clientInfo.company || '',
      projectDetails: projectDetails?.title || projectDetails?.description || projectDetails || 'Service Request',
      originalCurrency: requestCurrency,
      originalAmount: totalAmount.toString(),
      amountInNGN: amountInNGN.toFixed(2),
      currency: 'NGN',
      totalAmount: amountInNGN.toFixed(2),
    }

    // Create Paystack transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: clientInfo.email,
        amount: amountInKobo,
        currency: 'NGN', // Use NGN - Paystack's primary currency
        callback_url: `${origin}/services/checkout-success`,
        metadata,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      }),
    })

    if (!paystackResponse.ok) {
      const errorData = await paystackResponse.json().catch(() => ({ message: 'Could not parse error response' }))
      console.error('Paystack initialization failed:', {
        status: paystackResponse.status,
        error: errorData,
        requestBody: {
          email: clientInfo.email,
          amount: amountInKobo,
          currency: selectedPackage.currency?.toUpperCase() || 'NGN'
        }
      })
      return NextResponse.json(
        { error: `Failed to initialize payment with Paystack: ${errorData.message || 'Unknown error'}`, details: errorData },
        { status: 500 }
      )
    }

    const paystackData = await paystackResponse.json()

    if (!paystackData.status || !paystackData.data?.authorization_url) {
      return NextResponse.json(
        { error: 'Invalid response from payment provider' },
        { status: 500 }
      )
    }

    // Return both 'url' (for new components) and 'checkoutUrl' (for backwards compatibility)
    return NextResponse.json({
      success: true,
      requestId,
      url: paystackData.data.authorization_url,
      checkoutUrl: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
      accessCode: paystackData.data.access_code
    })

  } catch (error) {
    console.error('Service request creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create service request' },
      { status: 500 }
    )
  }
}
